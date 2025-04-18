// models/Ticket.js
const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    zone: {
      type: String,
      enum: ["B", "C", "D"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Unsold", "Sold"],
      default: "Sold",
    },
    customerName: {
      type: String,
      default: "",
    },
    purchaseDate: {
      type: Date,
    },
    scanStatus: {
      type: String,
      enum: ["Unscanned", "Scanned"],
      default: "Unscanned",
    },
    scanTimestamp: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
