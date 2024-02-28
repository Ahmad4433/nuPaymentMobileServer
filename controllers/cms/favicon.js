// models
const { Favicon } = require("../../models/cms/Favicon");

// To create a favicon
const onCreateFavicon = async (req, res) => {
    try {

        const favicon = await Favicon.createFavicon({ faviconParams: req.body, image: req.files?.image });
        return res.status(200).json({ success: true, favicon });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a favicon
const onUpdateFavicon = async (req, res) => {
    try {
        const favicon = await Favicon.updateFavicon({ faviconParams: req.body, image: req.files?.image });
        return res.status(200).json({ success: true, favicon });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get user by ID
const onGetFaviconById = async (req, res) => {
    try {
        const favicon = await Favicon.getFaviconById(req.params.id);
        return res.status(200).json({ success: true, favicon });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a favicon 
const onDeleteFaviconById = async (req, res) => {
    try {
        const favicon = await Favicon.deleteFaviconById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${favicon.deletedCount} favicons.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateFavicon,
    onUpdateFavicon,
    onGetFaviconById,
    onDeleteFaviconById,
}