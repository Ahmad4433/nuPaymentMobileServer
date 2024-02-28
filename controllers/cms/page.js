// models
const { Page } = require("../../models/cms/Page");

// To create a page
const onCreatePage = async (req, res) => {
    try {

        const page = await Page.createPage({ pageParams: req.body, image: req.files.image, multipleImages: req.files.multipleImages });
        return res.status(200).json({ success: true, page });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a page
const onUpdatePage = async (req, res) => {
    try {
        const page = await Page.updatePage({ pageParams: req.body, image: req.files.image, multipleImages: req.files.multipleImages });
        return res.status(200).json({ success: true, page });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get user by ID
const onGetPageById = async (req, res) => {
    try {
        const page = await Page.getPageById(req.params.id);
        return res.status(200).json({ success: true, page });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get all users
const onGetAllPages = async (req, res) => {
    try {

        const pages = await Page.getPages();
        return res.status(200).json({ success: true, pages });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// To delete a page 
const onDeletePageById = async (req, res) => {
    try {
        const page = await Page.deletePageById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${page.deletedCount} pages.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a page image 
const onDeletePageImageById = async (req, res) => {
    try {
        await Page.deletePageImageById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Image removed`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a page multiple image 
const onDeletePageMultiImagesById = async (req, res) => {
    try {
        await Page.deletePageMultiImagesById(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: `Images removed`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreatePage,
    onUpdatePage,
    onGetPageById,
    onGetAllPages,
    onDeletePageById,
    onDeletePageImageById,
    onDeletePageMultiImagesById
}