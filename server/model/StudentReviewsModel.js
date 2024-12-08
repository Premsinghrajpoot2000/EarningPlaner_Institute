const mongoose = require('mongoose')

const studentReviewsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: String, required: true },
    course: { type: String, required: true },
});
 
const studentReviewsModel = mongoose.model('studentReviewsModel', studentReviewsSchema)

module.exports = studentReviewsModel