const express = require("express");
const { onUploadFile } = require("../controllers/chat");
const auth = require("../middleware/auth");
const { USER_TYPES } = require("../models/User");
const router = express.Router();

router.post("/", auth([USER_TYPES.Admin, USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onUploadFile)

module.exports = router;