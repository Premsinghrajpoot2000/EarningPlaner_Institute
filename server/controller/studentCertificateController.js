const student_certificate_info_Model = require("../model/student_certificate_infoModel");
// Function to generate a unique registration number
const generateRegistrationNumber = () => {
    const year = new Date().getFullYear(); // Get current year
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number

    // Generate random 2 uppercase letters
    const randomLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                          String.fromCharCode(65 + Math.floor(Math.random() * 26));
    
    // Return the formatted registration number with random 2 uppercase letters in place of 'EP'
    return `RAJ-${year}-JPR-${randomLetters}-${randomNumber}`; 
};


const student_certificate_info_get = async (req, res) => {
    try {
        // Get studentId from the query parameters
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        // Search for the student in the database
        const studentDetails = await student_certificate_info_Model.findOne({ registrationNumber: studentId });

        if (!studentDetails) {
            return res.status(404).json({ error: "No student found" });
        }

        // If student is found, return the student details
        return res.status(200).json(studentDetails);
    } catch (error) {
        // Catch any errors that occur during the process
        console.error("Error fetching student details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const student_certificate_get_all = async (req, res) => {
    try {
        const studentDetails = await student_certificate_info_Model.find();

        if (!studentDetails) {
            return res.status(404).json({ error: "No student found" });
        }

        // If student is found, return the student details
        return res.status(200).json(studentDetails);
    } catch (error) {
        // Catch any errors that occur during the process
        console.error("Error fetching student details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const student_certificate_info_post = async (req, res) => {
    try {
        const { name, courseName, courseDuration, grade, courseCompleteDate } = req.body;

        // Validate the data (check if required fields are provided)
        if (!name || !courseName || !courseDuration || !grade || !courseCompleteDate) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Generate a unique registration number
        const registrationNumber = generateRegistrationNumber();

        // Create a new student certificate
        const newCertificate = new student_certificate_info_Model({
            registrationNumber,
            name,
            courseName,
            courseDuration,
            grade,
            course_completed_date: courseCompleteDate,
        });

        // Save the new certificate to the database
        await newCertificate.save();

        // Send a success response
        res.status(201).json({
            message: 'Student certificate added successfully',
            certificate: newCertificate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
}

const student_certificate_info_delete = async (req, res) => {
    try {
        // 1. Get the certificate ID from the query parameter or request body
        const certificateDBId = req.query.certificate_DB_id; // Assuming the ID is sent as a query parameter, e.g., /delete?certificate_DB_id=123

        if (!certificateDBId) {
            return res.status(400).json({ message: 'Certificate ID is required' }); // If no ID is provided, return an error
        }

        // 2. Find the certificate in the database using the certificate_DB_id
        const certificate = await student_certificate_info_Model.findByIdAndDelete(certificateDBId);

        return res.status(200).json({ message: 'Certificate deleted successfully' });

    } catch (error) {
        console.error('Error deleting certificate:', error);
        // 5. Handle errors (e.g., DB issues, unexpected errors)
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const student_certificate_info_patch = async (req, res) => {
    try {
        // Extract updated certificate data from the request body
        const { id, name, courseName, courseDuration, grade, course_completed_date } = req.body;

        // Find the certificate by ID in the database
        const certificate = await student_certificate_info_Model.findById(id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Update the certificate fields with the new values from the request body
        certificate.name = name || certificate.name;
        certificate.courseName = courseName || certificate.courseName;
        certificate.courseDuration = courseDuration || certificate.courseDuration;
        certificate.grade = grade || certificate.grade;
        certificate.course_completed_date = course_completed_date || certificate.course_completed_date;

        // Save the updated certificate back to the database
        const updatedCertificate = await certificate.save();

        // Return success response with the updated certificate data
        return res.status(200).json({
            message: 'Certificate updated successfully',
            updatedCertificate,
        });
    } catch (error) {
        console.error('Error updating certificate:', error);
        return res.status(500).json({
            message: 'Error updating certificate. Please try again later.',
            error: error.message,
        });
    }
};


module.exports = {
    student_certificate_info_get,
    student_certificate_get_all,
    student_certificate_info_post,
    student_certificate_info_delete,
    student_certificate_info_patch
};
