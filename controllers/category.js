// models
const { Category } = require("../models/Category");

// To create a category
const onCreateCategory = async (req, res) => {
    try {

        const category = await Category.createCategory({ categoryParams: req.body, image: req.files.image });
        return res.status(200).json({ success: true, category });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a category
const onUpdateCategory = async (req, res) => {
    try {
        const category = await Category.updateCategory({ categoryParams: req.body, image: req.files.image });
        return res.status(200).json({ success: true, category });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get user by ID
const onGetCategoryById = async (req, res) => {
    try {
        const category = await Category.getCategoryById(req.params.id);
        return res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get user by slug
const onGetCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.getCategoryBySlug(req.params.slug);
        return res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get all categories
const onGetAllCategories = async (req, res) => {
    try {

        const categories = await Category.getAllCategories();
        return res.status(200).json({ success: true, categories });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// Get n categories
const onGetCategories = async (req, res) => {
    try {

        const categories = await Category.getCategories(parseInt(req.params.n));
        return res.status(200).json({ success: true, categories });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// To delete a category 
const onDeleteCategoryById = async (req, res) => {
    try {
        const category = await Category.deleteCategoryById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${category.deletedCount} categories.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateCategory,
    onUpdateCategory,
    onGetCategoryById,
    onGetCategoryBySlug,
    onGetAllCategories,
    onGetCategories,
    onDeleteCategoryById,
}