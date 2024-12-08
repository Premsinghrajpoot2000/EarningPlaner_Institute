const express = require('express');
const route = express.Router(); // Use Router for modular routes
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const multerStorageCloudinary = require('multer-storage-cloudinary').CloudinaryStorage;
const { userCourseSearch, userCoursesGet, userAllCoursesGet, userDeleteCourse, userCoursePost, userCourseEditPatch, userCourseImagesEditUploder, userPaidOneCourseGet } = require("../controller/userCourseController");

route.get("/userCourseSearch", userCourseSearch);
route.get("/userCoursesGet/:id", userCoursesGet);
route.get("/userAllCoursesGet", userAllCoursesGet);
route.get("/userPaidOneCourseGet", userPaidOneCourseGet);

// // Setup Cloudinary storage for multer
// const storage = new multerStorageCloudinary({
//     cloudinary: cloudinary,
//     folder: 'courses',
//     allowedFormats: ['jpg', 'png', 'jpeg', 'gif'], // Add 'gif' to allowed formats
// });

// // Setup multer to handle multiple fields
// const upload = multer({ storage: storage });

// Route for posting a course with image and GIF uploads
// route.post("/userCoursePost", upload.fields([{ name: 'image' }, { name: 'gifImage' }]), userCoursePost);
route.post("/userCoursePost", userCoursePost);

route.patch("/userCourseEditPatch/:courseId", userCourseEditPatch);
// route.patch("/userCourseImagesEditUploder", upload.fields([{ name: 'image' }, { name: 'gifImage' }]), userCourseImagesEditUploder);
route.patch("/userCourseImagesEditUploder", userCourseImagesEditUploder);

route.delete("/userDeleteCourse/:courseId", userDeleteCourse);

module.exports = route;
