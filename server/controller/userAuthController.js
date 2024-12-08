const userAuthModel = require("../model/userAuthModel");

const admin_login_get = async (req, res) => {
    try {
        const { email_id, password } = req.query;

        // Check if email and password are provided in the request query
        if (!email_id || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Search for the user with the given email
        const user = await userAuthModel.findOne({ email: email_id });

        if (!user) {
            // If user is not found, send error
            return res.status(404).json({ message: "User not found." });
        }

        // Compare the provided password with the stored plain text password
        if (user.password !== password) {
            // If passwords don't match, send error
            return res.status(401).json({ message: "Invalid password." });
        }

        // If email and password match, send success message
        return res.status(200).json({ message: "Login successful." });
    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        return res.status(500).json({ message: "An error occurred during login." });
    }
};

module.exports = { 
    admin_login_get 
};
