require("dotenv").config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser') // Add body-parser
const PORT = process.env.PORT || 8000
const userForm_route = require('./routes/userForm_route')
const userCourse_route = require('./routes/userCourse_route')
const StudentReviews_route = require('./routes/StudentReviews_route')
const heroSection_route = require('./routes/heroSection_route')
const student_certificate_route = require("./routes/studentCertificate_route")
const userGetCourseForm_route = require("./routes/userGetCourseForm_route")
const userAuth_route = require("./routes/userAuth_route")
const cloudinary = require('cloudinary').v2;
const fileupload = require("express-fileupload")

app.use(cors()); 
app.use(express.json()) // This is already included in Express
app.use(bodyParser.json()) // For parsing JSON bodies
app.use(fileupload({
    useTempFiles: false,
}));


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function modelCalled() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('database connected successfully')
    } catch (error) {
        console.log(error)
    }
}

modelCalled()

app.use('/api', userForm_route)
app.use('/auth', userAuth_route)
app.use('/courses', userCourse_route)
app.use('/reviews', StudentReviews_route)
app.use('/hero', heroSection_route)
app.use('/certificate', student_certificate_route)
app.use('/userGetCourseForm_route', userGetCourseForm_route)

app.listen(PORT, () => {
    console.log(`server started on port - ${PORT}`)
})
