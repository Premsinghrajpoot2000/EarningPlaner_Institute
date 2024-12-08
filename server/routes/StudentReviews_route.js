const express = require('express');
const route = express();
const { studentReviewsGet, studentReviewsPost, studentReviewsDelete, studentReviewsPatch } = require("../controller/studentReviewsController");

route.get("/studentReviewsGet", studentReviewsGet);

route.post('/studentReviewsPost', studentReviewsPost);

route.delete('/studentReviewsDelete', studentReviewsDelete);

route.patch('/studentReviewsPatch', studentReviewsPatch);

module.exports = route;
