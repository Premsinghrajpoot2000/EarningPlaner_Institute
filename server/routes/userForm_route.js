const express = require('express')
const route = express()
const { handleAddToSheet } = require("../controller/userFormController")

route.post("/add_to_sheet", handleAddToSheet);

module.exports = route