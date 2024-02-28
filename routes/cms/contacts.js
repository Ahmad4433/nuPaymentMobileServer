const express = require("express");
const router = express.Router();
const {
    onCreateContact,
    onGetAllContacts,
    onGetContactById,
    onDeleteContactById,
    onUpdateContact
} = require("../../controllers/cms/contact.js");
const auth = require("../../middleware/auth.js");
const { USER_TYPES } = require("../../models/User.js");

router
    .get('/', auth(USER_TYPES.Admin), onGetAllContacts)
    .post('/', auth(USER_TYPES.Admin), onCreateContact)
    .put('/', auth(USER_TYPES.Admin), onUpdateContact)
    .get('/:id', onGetContactById)
    .delete('/:id', auth(USER_TYPES.Admin), onDeleteContactById)

module.exports = router;