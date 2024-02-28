const express = require("express");
const router = express.Router();
const {
    onCreateCategory,
    onGetAllCategories,
    onGetCategoryById,
    onDeleteCategoryById,
    onUpdateCategory,
    onGetCategories,
    onGetCategoryBySlug,
} = require("../controllers/category.js");
const auth = require("../middleware/auth.js");
const { USER_TYPES } = require("../models/User.js");

router
    .get('/', onGetAllCategories)
    .get('/getRandomCategories/:n', onGetCategories)
    .post('/', auth(USER_TYPES.Admin), onCreateCategory)
    .put('/', auth(USER_TYPES.Admin), onUpdateCategory)
    .get('/:id', auth(USER_TYPES.Admin), onGetCategoryById)
    .get('/searchBySlug/:slug', onGetCategoryBySlug)
    .delete('/:id', auth(USER_TYPES.Admin), onDeleteCategoryById)

module.exports = router;