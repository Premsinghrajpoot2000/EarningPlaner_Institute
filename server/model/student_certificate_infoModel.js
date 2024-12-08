const mongoose = require('mongoose')

const student_certificate_info_Schema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    courseName: { type: String, required: true },
    courseDuration: { type: String, required: true },
    grade: { type: String, required: true },
    course_completed_date: { type: String, required: true },
});

const student_certificate_info_Model = mongoose.model('student_certificate_info_Schema', student_certificate_info_Schema)

module.exports = student_certificate_info_Model