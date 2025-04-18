// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { protect } = require("../middleware/auth"); // Import the middleware

// Get available (unscanned) tickets by zone
router.get("/available/:zone", protect, async (req, res) => {
  try {
    const count = await Ticket.countDocuments({
      zone: req.params.zone,
      scanStatus: "Unscanned",
    });
    res.status(200).json({ availableCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get total tickets per zone
router.get("/total-tickets", protect, async (req, res) => {
  try {
    const zones = ["B", "C", "D"];
    const totals = {};

    for (const zone of zones) {
      const count = await Ticket.countDocuments({ zone });
      totals[zone] = count;
    }

    res.status(200).json(totals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sell a ticket
router.post("/sell", protect, async (req, res) => {
  try {
    const { zone, customerName } = req.body;

    // Find an unsold ticket in the specified zone
    const ticket = await Ticket.findOne({ zone, status: "Unsold" });

    if (!ticket) {
      return res
        .status(404)
        .json({ message: `No tickets available in Zone ${zone}` });
    }

    // Update ticket status
    ticket.status = "Sold";
    ticket.customerName = customerName;
    ticket.purchaseDate = new Date();
    await ticket.save();

    // Generate QR code
    const qrData = JSON.stringify({
      ticketId: ticket.ticketId,
      zone: ticket.zone,
      price: ticket.price,
    });

    const qrCodePath = path.join(__dirname, `../temp/${ticket.ticketId}.png`);
    await QRCode.toFile(qrCodePath, qrData);

    // Create PDF with zone background
    const pdfPath = path.join(__dirname, `../temp/${ticket.ticketId}.pdf`);
    const zoneBgPath = path.join(
      __dirname,
      `../assets/zone-${zone.toLowerCase()}.jpg`
    );

    const doc = new PDFDocument({ size: "A4" });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Add background image if exists
    if (fs.existsSync(zoneBgPath)) {
      doc.image(zoneBgPath, 0, 0, { width: 595 }); // A4 width
    }

    // Add ticket details
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("CONCERT TICKET", { align: "center" });

    doc.moveDown();
    doc.fontSize(16).text(`Zone: ${ticket.zone} - ${ticket.price} Rupees`, {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(14).text(`Ticket ID: ${ticket.ticketId}`, { align: "center" });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Customer: ${ticket.customerName}`, { align: "center" });

    // Add QR code
    doc.image(qrCodePath, 200, 300, { width: 200 });

    doc.end();

    // Wait for the PDF to be created
    stream.on("finish", () => {
      // Return PDF as download
      res.download(pdfPath, `Ticket-${ticket.ticketId}.pdf`, (err) => {
        if (err) {
          console.error(err);
        }
        // Clean up temporary files
        fs.unlinkSync(qrCodePath);
        fs.unlinkSync(pdfPath);
      });
    });

    // Update Excel file
    updateExcelDatabase();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate ticket
router.post("/validate", protect, async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return res
        .status(404)
        .json({ valid: false, message: "Invalid ticket ID" });
    }

    if (ticket.status === "Unsold") {
      return res
        .status(400)
        .json({ valid: false, message: "Ticket was never sold" });
    }

    if (ticket.scanStatus === "Scanned") {
      return res.status(400).json({
        valid: false,
        message: "Ticket already used",
        scannedAt: ticket.scanTimestamp,
      });
    }

    // Mark ticket as scanned
    ticket.scanStatus = "Scanned";
    ticket.scanTimestamp = new Date();
    await ticket.save();

    // Update Excel file
    updateExcelDatabase();

    res.status(200).json({
      valid: true,
      message: "Ticket validated successfully",
      ticketDetails: {
        zone: ticket.zone,
        customerName: ticket.customerName,
        scannedAt: ticket.scanTimestamp,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export all ticket data to Excel
router.get("/export", protect, async (req, res) => {
  try {
    await updateExcelDatabase();
    const excelPath = path.join(__dirname, "../temp/tickets.xlsx");

    res.download(excelPath, "tickets.xlsx", (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Failed to download Excel file" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update Excel database
async function updateExcelDatabase() {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");

    // Add headers
    worksheet.columns = [
      { header: "Ticket ID", key: "ticketId", width: 15 },
      { header: "Zone", key: "zone", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "Customer Name", key: "customerName", width: 20 },
      { header: "Purchase Date", key: "purchaseDate", width: 20 },
      { header: "Scan Status", key: "scanStatus", width: 15 },
      { header: "Scan Timestamp", key: "scanTimestamp", width: 20 },
    ];

    // Get all tickets from database
    const tickets = await Ticket.find();

    // Add ticket data to worksheet
    tickets.forEach((ticket) => {
      worksheet.addRow({
        ticketId: ticket.ticketId,
        zone: ticket.zone,
        price: ticket.price,
        status: ticket.status,
        customerName: ticket.customerName,
        purchaseDate: ticket.purchaseDate,
        scanStatus: ticket.scanStatus,
        scanTimestamp: ticket.scanTimestamp,
      });
    });

    // Save the Excel file
    const excelPath = path.join(__dirname, "../temp/tickets.xlsx");
    await workbook.xlsx.writeFile(excelPath);

    return excelPath;
  } catch (error) {
    console.error("Error updating Excel database:", error);
    throw error;
  }
}

router.post("/bulk-generate-all", protect, async (req, res) => {
  try {
    const zones = ["B", "C", "D"];
    const ticketsPerZone = 1; // Set to 300 for actual use
    const imagePaths = {
      B: path.join(__dirname, "../assets/ticket_b.jpg"),
      C: path.join(__dirname, "../assets/ticket_c.jpg"),
      D: path.join(__dirname, "../assets/ticket_d.jpg"),
    };
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="AllTickets.pdf"'
    );
    doc.pipe(res);
    const gap = 3; // ~0.1 cm gap between tickets (1cm ≈ 28.35 pts)
    const rawTicketHeight = 842 / 4;
    const ticketHeight = rawTicketHeight - gap;
    const pageWidth = 595;
    let ticketCount = 0;
    for (const zone of zones) {
      const backgroundImage = imagePaths[zone];
      for (let i = 1; i <= ticketsPerZone; i++) {
        const ticketNumber = `${zone}-${i.toString().padStart(3, "0")}`;
        const customerName = `Guest-${ticketNumber}`;
        const ticketId = `TKT-${zone}-${Date.now()}-${i}`;
        const price = zone === "B" ? 350 : zone === "C" ? 200 : 100;
        // Save to DB
        const newTicket = new Ticket({
          ticketId,
          zone,
          ticketNumber,
          customerName,
          price,
          isSold: true,
          soldAt: new Date(),
        });
        await newTicket.save();
        // QR Code generation
        const qrData = JSON.stringify({
          ticketId,
          ticketNumber,
          zone,
          customerName,
          price,
        });
        const qrCodeDataURL = await QRCode.toDataURL(qrData);
        const qrImage = qrCodeDataURL.split(",")[1];
        const ticketIndexOnPage = ticketCount % 4;
        const y = ticketIndexOnPage * (ticketHeight + gap);
        if (ticketIndexOnPage === 0 && ticketCount > 0) {
          doc.addPage();
        }
        // Draw background image
        doc.image(backgroundImage, 0, y, {
          width: pageWidth,
          height: ticketHeight,
        });
        
        // Place QR image - UPDATED: even larger size and adjusted position
        const qrSize = 75; // Increased from 65 to 75
        const qrX = pageWidth - 80;
        const qrY = y + ticketHeight - 95; // Moved down slightly from -95 to -90
        doc.image(Buffer.from(qrImage, "base64"), qrX, qrY, {
          width: qrSize,
        });
        
        // Ticket ID above QR - UPDATED: moved more to the right
        doc
          .fillColor("white")
          .fontSize(7)
          .text(`ID: ${ticketId}`, qrX - 10, qrY - 23, { // Shifted more to the right
            width: 90,
            align: "center",
            lineGap: 0,
          });
        ticketCount++;
      }
    }
    doc.end();
  } catch (error) {
    console.error("Error in bulk generation:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Failed to generate tickets", error: error.message });
    }
  }
});

// routes/ticketRoutes.js
router.get("/stats/:zone", protect, async (req, res) => {
  try {
    const { zone } = req.params;
    const total = 300; // Hardcoded for your case
    const sold = await Ticket.countDocuments({ zone, status: "Sold" });
    const scanned = await Ticket.countDocuments({
      zone,
      status: "Sold",
      scanStatus: "Scanned",
    });

    res.json({ total, sold, scanned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
