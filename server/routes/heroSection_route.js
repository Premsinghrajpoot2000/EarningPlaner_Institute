const express = require('express');
const route = express.Router(); // Use Router() for route definition
const { heroEdit, heroGet, heroDelete } = require("../controller/heroSectionController");

route.get("/heroGet", heroGet)

route.delete("/heroDelete", heroDelete)

route.patch("/heroEdit", heroEdit);

module.exports = route;
