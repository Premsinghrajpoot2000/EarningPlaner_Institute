const mongoose = require('mongoose')

const heroSectionSchema = new mongoose.Schema({
    typingText: { type: String, required: true },
    images: { type: String, required: true },
});

const heroSectionModel = mongoose.model('heroSectionSchema', heroSectionSchema)

module.exports = heroSectionModel