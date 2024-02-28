const express = require("express");
const router = express.Router();
const {
    onCreateLogo,
    onUpdateLogo,
    onGetLogoById,
    onDeleteLogoById,
} = require("../../controllers/cms/logo.js");
const auth = require("../../middleware/auth.js");
const { USER_TYPES } = require("../../models/User.js");

router
    .post('/', auth(USER_TYPES.Admin), onCreateLogo)
    .put('/', auth(USER_TYPES.Admin), onUpdateLogo)
    .get('/:id', onGetLogoById)
    .delete('/:id', auth(USER_TYPES.Admin), onDeleteLogoById)

module.exports = router;