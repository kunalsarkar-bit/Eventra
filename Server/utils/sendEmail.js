const nodemailer = require('nodemailer');

/**
 * Eventra Email Service
 * Professional email delivery for the Eventra ticket validation platform
 * In collaboration with Auction X
 */
const sendEmail = async (to, subject, content, ticketDetails = null) => {
  // Set up the email transporter with credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Create HTML email with professional branding
  const htmlContent = generateEmailTemplate(subject, content, ticketDetails);

  // Configure email options
  const mailOptions = {
    from: `"Eventra Events" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${subject} | Eventra`,
    html: htmlContent,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Generates a professional HTML email template with Eventra branding
 */
const generateEmailTemplate = (subject, content, ticketDetails) => {
  // Format ticket details if provided
  let ticketSection = '';
  if (ticketDetails) {
    ticketSection = `
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Ticket Details</h3>
        <p><strong>Event:</strong> ${ticketDetails.eventName}</p>
        <p><strong>Date:</strong> ${ticketDetails.eventDate}</p>
        <p><strong>Venue:</strong> ${ticketDetails.venue}</p>
        <p><strong>Ticket ID:</strong> ${ticketDetails.ticketId}</p>
        <p><strong>Section:</strong> ${ticketDetails.section} | <strong>Row:</strong> ${ticketDetails.row} | <strong>Seat:</strong> ${ticketDetails.seat}</p>
      </div>
    `;
  }

  // Return complete HTML email template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header with logo -->
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #6a11cb; padding-bottom: 20px;">
          <h1 style="color: #6a11cb; margin: 0; font-size: 28px;">Eventra</h1>
          <p style="color: #666; margin: 5px 0 0;">Your digital passport to unforgettable events</p>
        </div>
        
        <!-- Main content -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="color: #444; font-size: 16px;">
            ${content}
          </div>
          
          ${ticketSection}
          
          <!-- QR code placeholder message -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">Scan your digital ticket for quick entry</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
          <p>© ${new Date().getFullYear()} Eventra | In collaboration with Auction X</p>
          <p>This is an automated message. Please do not reply to this email.</p>
          <div style="margin-top: 15px;">
            <a href="#" style="color: #6a11cb; text-decoration: none; margin: 0 10px;">Help Center</a>
            <a href="#" style="color: #6a11cb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
            <a href="#" style="color: #6a11cb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = sendEmail;
