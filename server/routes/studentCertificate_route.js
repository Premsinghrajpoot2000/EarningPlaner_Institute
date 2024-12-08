const express = require('express');
const route = express();
const { student_certificate_info_get, student_certificate_get_all, student_certificate_info_post, student_certificate_info_delete, student_certificate_info_patch } = require("../controller/studentCertificateController");

route.get("/student_certificate_get_all", student_certificate_get_all);
route.get("/student_certificate_info_get", student_certificate_info_get);

route.post("/student_certificate_info_post", student_certificate_info_post);

route.delete("/student_certificate_info_delete", student_certificate_info_delete);

route.patch("/student_certificate_info_patch", student_certificate_info_patch);

module.exports = route;
