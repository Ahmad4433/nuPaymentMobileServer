const express = require("express");
const router = express.Router();
const {
    onCreatePage,
    onGetAllPages,
    onGetPageById,
    onDeletePageById,
    onUpdatePage,
    onDeletePageImageById,
    onDeletePageMultiImagesById
} = require("../../controllers/cms/page.js");
const auth = require("../../middleware/auth.js");
const { USER_TYPES } = require("../../models/User.js");

router
    .get('/', auth(USER_TYPES.Admin), onGetAllPages)
    .post('/', auth(USER_TYPES.Admin), onCreatePage)
    .put('/', auth(USER_TYPES.Admin), onUpdatePage)
    .get('/:id', onGetPageById)
    .delete('/:id', auth(USER_TYPES.Admin), onDeletePageById)
    .delete('/deleteImage/:id', auth(USER_TYPES.Admin), onDeletePageImageById)
    .delete('/deleteMultiImages/:id', auth(USER_TYPES.Admin), onDeletePageMultiImagesById)

module.exports = router;