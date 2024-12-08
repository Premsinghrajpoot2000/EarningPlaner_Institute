const express = require('express')
const route = express()
const { studentGetCourseForm } = require("../controller/userGetCourseFormController")

route.post("/studentGetCourseForm", studentGetCourseForm);

module.exports = route