const express = require("express");
const router = express.Router();
const {
    onCreateFAQ,
    onGetAllFAQs,
    onGetFAQById,
    onDeleteFAQById,
    onUpdateFAQ
} = require("../../controllers/cms/faq.js");
const auth = require("../../middleware/auth.js");
const { USER_TYPES } = require("../../models/User.js");

router
    .get('/', onGetAllFAQs)
    .post('/', auth(USER_TYPES.Admin), onCreateFAQ)
    .put('/', auth(USER_TYPES.Admin), onUpdateFAQ)
    .get('/:id', auth(USER_TYPES.Admin), onGetFAQById)
    .delete('/:id', auth(USER_TYPES.Admin), onDeleteFAQById)

module.exports = router;