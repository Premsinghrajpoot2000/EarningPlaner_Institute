const { google } = require("googleapis");
const path = require("path");
const sendMail = require("../helper/mailer");
require('dotenv').config(); // Load environment variables from .env

// Load credentials from environment variables
const sheets = google.sheets("v4");

// Authenticate with Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace \n with actual new line
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheetId = process.env.Google_Sheets_ID; // Your Google Sheets ID

// Helper function to process email
const processEmail = (email) => {
  // Convert email to lowercase and remove dots
  return email.toLowerCase().replace(/\./g, '');
};

// Function to check if email or mobile number already exists in the sheet
const checkEmailOrMobileExists = async (client, email, mobile) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetId,
      range: "Sheet1!B:C", // Assuming emails are in column B and mobile numbers in column C
    });

    const emailColumn = response.data.values || [];
    const processedEmails = emailColumn.map(row => processEmail(row[0])); // Email in column B
    const processedMobiles = emailColumn.map(row => row[1]); // Mobile in column C

    return processedEmails.includes(processEmail(email)) || processedMobiles.includes(mobile);
  } catch (error) {
    throw new Error("Error fetching data from Google Sheets: " + error.message);
  }
};

// Function to handle adding data to Google Sheets and sending email
const handleAddToSheet = async (req, res) => {
  const { name, email, mobile, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message || !mobile) {
    return res.status(400).json({ error: "Name, Email, Subject, and Message are required" });
  }

  const processedEmail = processEmail(email);

  try {
    const client = await auth.getClient();

    // Check if the email or mobile number already exists in the sheet
    const entryExists = await checkEmailOrMobileExists(client, processedEmail, mobile);

    if (!entryExists) {
      await sheets.spreadsheets.values.append({
        auth: client,
        spreadsheetId: sheetId,
        range: "Sheet1!A:E", // Adjust if necessary to include subject and mobile
        valueInputOption: "RAW",
        resource: {
          values: [[name, email, mobile]], // Include subject, message, and mobile
        },
      });
    }
    
    let msg = `
    <hr>
    <p><b>User Email ID - </b></p>${email}
    <hr>
    <p><b>User Name - </b></p>${name}
    <hr>
    <p><b>Subject - </b></p>${subject}
    <hr>
    <p><b>Message - </b></p>${message}
    <hr>
    <p><b>Mobile Number - </b></p>${mobile}
    <hr>
  `;
  sendMail(process.env.ADMIN_EMAIL_SEND, "From Earning Planer Ins", msg);
  res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { handleAddToSheet }; // Export the controller function
