const express = require("express");
const router = express.Router();
const {
    onCreateFavicon,
    onUpdateFavicon,
    onGetFaviconById,
    onDeleteFaviconById,
} = require("../../controllers/cms/favicon.js");
const auth = require("../../middleware/auth.js");
const { USER_TYPES } = require("../../models/User.js");

router
    .post('/', auth(USER_TYPES.Admin), onCreateFavicon)
    .put('/', auth(USER_TYPES.Admin), onUpdateFavicon)
    .get('/:id', onGetFaviconById)
    .delete('/:id', auth(USER_TYPES.Admin), onDeleteFaviconById)

module.exports = router;