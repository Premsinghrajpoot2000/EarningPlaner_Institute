const mongoose = require('mongoose')

const userAuthSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
 
const userAuthModel = mongoose.model('userAuthModel', userAuthSchema)

module.exports = userAuthModel