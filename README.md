# EVENTRA - SMART EVENT TICKETING SYSTEM

_Revolutionizing Event Check-Ins With QR-Based Ticketing & Real-Time Scanning_

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)

## Built with the rocks and technologies:

## Frontend Technologies:  

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![React DOM](https://img.shields.io/badge/Rendering-React%20DOM-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/Routing-React%20Router-CA4245?logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-PostCSS-DD3A0A?logo=postcss&logoColor=white)
![Axios](https://img.shields.io/badge/API-Axios-5A29E4?logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Icons-Lucide%20React-6B7280?logo=react&logoColor=white)
![HTML5 QRCode](https://img.shields.io/badge/QR%20Scanner-HTML5%20QRCode-E34F26?logo=html5&logoColor=white)
![jsQR](https://img.shields.io/badge/QR%20Parser-jsQR-F7DF1E?logo=javascript&logoColor=000)
![js-cookie](https://img.shields.io/badge/Cookies-js--cookie-4B0082?logo=javascript&logoColor=white)
![React Toastify](https://img.shields.io/badge/Notifications-React%20Toastify-3B82F6?logo=react&logoColor=white)

## Backend Technologies:  

![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Bcryptjs](https://img.shields.io/badge/Security-Bcryptjs-F97316?logo=javascript&logoColor=white)
![Cookie Parser](https://img.shields.io/badge/Security-Cookie%20Parser-FBBF24?logo=javascript&logoColor=white)
![CORS](https://img.shields.io/badge/Security-CORS-10B981?logo=javascript&logoColor=white)
![Dotenv](https://img.shields.io/badge/Config-Dotenv-4ADE80?logo=dotenv&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-F97316?logo=nodemailer&logoColor=white)
![QRCode](https://img.shields.io/badge/Generator-QRCode-0088CC?logo=qr&logoColor=white)
![PDFKit](https://img.shields.io/badge/Export-PDFKit-4ADE80?logo=javascript&logoColor=white)
![ExcelJS](https://img.shields.io/badge/Export-ExcelJS-217346?logo=microsoft-excel&logoColor=white)
![UUID](https://img.shields.io/badge/ID%20Gen-UUID-764ABC?logo=javascript&logoColor=white)
![Crypto](https://img.shields.io/badge/Security-Crypto-FF6B6B?logo=node.js&logoColor=white)
![Nodemon](https://img.shields.io/badge/Dev-Nodemon-76D04B?logo=nodemon&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Overview

**EVENTRA** is a cutting-edge QR-based event ticketing platform that revolutionizes the check-in process for events of all sizes. By leveraging smart e-ticket generation and seamless online/offline QR scanning capabilities, Eventra reduces manual check-in time by **60%**, making event management faster, more secure, and incredibly efficient.

Unlike traditional ticket booking platforms, Eventra focuses on **ticket generation, validation, and scanning** — empowering event organizers with real-time attendance tracking, automated e-ticket delivery, and robust security through JWT authentication.

### Why EVENTRA?

This project streamlines event management with:

✓ **QR-Based E-Tickets**: Generate unique QR codes for each ticket with secure UUID identifiers  
✓ **Online/Offline Scanning**: Scan tickets using HTML5 QR scanner even without internet connectivity  
✓ **Instant Ticket Validation**: Real-time verification prevents duplicate entries and fraud  
✓ **Automated Email Delivery**: Send e-tickets directly to attendees via Nodemailer integration  
✓ **PDF & Excel Export**: Download attendee lists and tickets in multiple formats for record-keeping  
✓ **JWT Authentication**: Secure user sessions with token-based authentication and encrypted cookies  
✓ **Fast Check-In Process**: Reduce manual check-in time by 60% with instant QR validation  
✓ **Event Analytics**: Track attendance, scan history, and real-time event statistics  
✓ **Responsive Design**: Mobile-first UI built with Tailwind CSS for seamless cross-device experience  
✓ **Scalable Architecture**: MongoDB backend ensures efficient data handling for events of any size  

---

## Key Features

### 🎫 Smart Ticket Generation
- Generate unique QR-coded e-tickets for each attendee
- Automatic ticket ID generation using UUID
- Customizable ticket templates with event details
- Bulk ticket generation for multiple attendees

### 📱 Powerful QR Scanning
- HTML5-based QR scanner works on all modern browsers
- Online and offline scanning capabilities
- Instant ticket validation with visual/audio feedback
- Prevents duplicate scanning and unauthorized entry

### 🔐 Secure Authentication
- JWT-based authentication system
- Encrypted password storage with bcryptjs
- Secure cookie management
- Role-based access control for organizers and attendees

### 📧 Automated Communication
- Automated e-ticket delivery via email
- Event reminder notifications
- Ticket confirmation messages
- Custom email templates

### 📊 Export & Reporting
- Export attendee data to Excel (ExcelJS)
- Generate PDF reports (PDFKit)
- Real-time attendance tracking
- Comprehensive event analytics dashboard

### 🎨 Modern UI/UX
- Sleek, responsive interface built with Tailwind CSS
- Lucide React icons for intuitive navigation
- Toast notifications for user feedback
- Mobile-optimized scanning interface

---

## Getting Started

### Prerequisites

This project requires the following dependencies installed on your system:

- **Programming Language**: JavaScript (Node.js for backend & React for frontend)  
- **Package Manager**: NPM (for managing Node.js dependencies)  
- **Database**: MongoDB (for storing users, events, tickets, and scan history)  
- **Node.js Version**: 14.x or higher recommended  

---

## Installation

Build EVENTRA from the source and install dependencies:

### 1. Clone the repository:

```bash
git clone https://github.com/kunalsarkar-bit/Eventra.git
```

### 2. Go to project folder
```bash
cd Eventra
```

### 3. FOR THE FRONTEND PART :------------------------------------------------------------------------

  **A. Go to "Client" folder for accessing frontend**
  ```bash
  cd Client
  ```
  
  **B. Create a .env file inside "Client" folder**
  ```bash
  # Step 1: Create a new .env file
  touch .env

  # Step 2: Open the .env file in your code editor (VS Code example)
  code .env

  # Step 3: Add your environment variable inside the file
  # Example:
  # VITE_API_URL=http://localhost:5000
  ```

  **C. Install dependencies along with node modules**
  ```bash
  npm install
  ```

  **D. Start the Client side**
  ```bash
  npm run dev
  ```

### 4. FOR THE BACKEND PART :------------------------------------------------------------------------

  **A. Go to "Server" folder for accessing backend**
  ```bash
  cd Server
  ```
  
  **B. Create a .env file inside "Server" folder**
  ```bash
  # Step 1: Create a new .env file
  touch .env

  # Step 2: Open the .env file in your code editor (VS Code example)
  code .env

  # Step 3: Add your environment variables inside the file
  # Example:
  MONGO_URI=mongodb+srv://<your-username>:<password>@cluster0.tolhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  NODE_ENV=development
  PORT=5000
  JWT_SECRET=your-secret-key-here
  EMAIL_USER=your-email@example.com
  EMAIL_PASS=your-email-password-here
  BASE_URL=http://localhost:5000
  CLIENT_URL=http://localhost:3000
  ```

  **C. Install dependencies along with node modules**
  ```bash
  npm install
  ```

  **D. Start the Server side**
  ```bash
  npm start
  ```

---

## Usage

To run the project locally, follow these steps:

### For Backend (Server)
```bash
cd Server
npm install
npm start
```
This starts the backend Server using Express on the configured port (default: **http://localhost:5000**).

### For Frontend (Client)
```bash
cd Client
npm install
npm run dev
```
This runs the React frontend with Vite on **http://localhost:3000**.

### Access the App

Once both Servers are running, open your browser and go to:
```
http://localhost:3000
```

You can now:

• **Register/Login** as an event organizer or attendee  
• **Create Events** and generate unique QR-coded e-tickets  
• **Send E-Tickets** automatically via email to attendees  
• **Scan QR Codes** at event check-in using your device camera  
• **Validate Tickets** instantly with real-time verification  
• **Track Attendance** with comprehensive analytics dashboard  
• **Export Data** to PDF or Excel for record-keeping  

---

## Testing

### Steps:

**1. Start backend and frontend**
```bash
# Terminal 1 - Backend
cd Server
npm start

# Terminal 2 - Frontend
cd Client
npm run dev
```

✓ Backend runs on **http://localhost:5000**  
✓ Frontend runs on **http://localhost:3000**  

**2. Open your browser → go to http://localhost:3000**

**3. Create a test account or log in**

**4. Try out the main features:**

• **Create an Event** — Add event details, date, venue, and capacity  
• **Generate Tickets** — Create QR-coded e-tickets for attendees  
• **Send E-Tickets** — Automatically email tickets to attendee addresses  
• **Scan QR Codes** — Use the built-in scanner to validate tickets at check-in  
• **Verify Offline** — Test offline scanning capability (QR validation works without internet)  
• **Check Analytics** — View real-time attendance stats and scan history  
• **Export Data** — Download attendee lists as Excel or PDF files  
• **Test Duplicate Prevention** — Try scanning the same ticket twice (should be rejected)  

**5. Review MongoDB (optional) to confirm data integrity:**

• Verify events, tickets, users, and scan logs are saved correctly  
• Check ticket status updates after scanning  
• Confirm email delivery logs  

**6. Experience the Speed:**

• Time the manual check-in vs. QR scanning  
• Notice the **60% reduction in check-in time**  
• Test with multiple simultaneous scans for stress testing  

That's all for manual testing — the goal is to verify that ticket generation, QR scanning, validation, and reporting all work seamlessly with maximum security and efficiency.

---

## Project Structure

```
Eventra/
├── Client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── Server/           # Backend Node.js application
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth & validation
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   └── package.json         # Backend dependencies
│
└── README.md                # Project documentation
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please reach out via:
- GitHub: [kunalsarkar-bit](https://github.com/kunalsarkar-bit)
- Repository: [Eventra](https://github.com/kunalsarkar-bit/Eventra)

---

**Made with ❤️ by the Eventra Team** | Transforming Event Check-Ins, One Scan at a Time
