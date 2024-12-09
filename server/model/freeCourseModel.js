const mongoose = require('mongoose')

const freeCourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    playlist_id: { type: String, required: true },
})

const freeCourseModel = mongoose.model('freeCourseSchema', freeCourseSchema)

module.exports = freeCourseModel