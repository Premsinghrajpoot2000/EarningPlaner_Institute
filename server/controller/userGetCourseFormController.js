const { google } = require("googleapis");
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

const sheetId = process.env.Google_Sheets_ID_for_course_get_form; // Your Google Sheets ID

// Function to check if mobile number already exists in the sheet
const checkMobileExists = async (client, mobile) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetId,
      range: "Sheet1!B:B", // Assuming mobile numbers are in column C
    });
    const mobileColumn = response.data.values || [];
    const existingMobiles = mobileColumn.map(row => row[0]); // Mobile numbers in column C

    return existingMobiles.includes(mobile);
  } catch (error) {
    throw new Error("Error fetching data from Google Sheets: " + error.message);
  }
};

// Function to handle student form submission and add data to Google Sheets
const studentGetCourseForm = async (req, res) => {
  const { name, mobileNumber, courseName } = req.body;

  // Validate required fields
  if (!name || !mobileNumber || !courseName) {
    return res.status(400).json({ error: "Name, Mobile, and Course Name are required" });
  }

  try {
    const client = await auth.getClient();

    // Check if the mobile number already exists in the sheet
    const entryExists = await checkMobileExists(client, mobileNumber);

    if (!entryExists) {
      // Insert data into Google Sheets if mobile number does not exist
      await sheets.spreadsheets.values.append({
        auth: client,
        spreadsheetId: sheetId,
        range: "Sheet1!A:C", // Insert in columns A (name), B (mobile number), C (course name)
        valueInputOption: "RAW",
        resource: {
          values: [[name, mobileNumber, courseName]], // Add name, mobile, and course name
        },
      });

      // Send an email notification
      let msg = `
        <hr>
        <p><b>Student Name - </b>${name}</p>
        <hr>
        <p><b>Mobile Number - </b>${mobileNumber}</p>
        <hr>
        <p><b>Course Name - </b>${courseName}</p>
        <hr>
      `;

      sendMail(process.env.ADMIN_EMAIL_SEND, "New Course Enrollment", msg);

      // Respond with success
      return res.status(200).json({ success: true, message: "Student details added successfully!" });
    } else {
      // If mobile number already exists, return an error response
      return res.status(400).json({ error: "Mobile number already exists in the records." });
    }
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { studentGetCourseForm }; // Export the function
