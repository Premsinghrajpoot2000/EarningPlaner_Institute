const express = require('express');
const route = express.Router(); 
const { admin_login_get } = require("../controller/userAuthController");

route.get("/admin_login_get", admin_login_get);

module.exports = route;
