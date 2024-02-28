// models
const { Logo } = require("../../models/cms/Logo");

// To create a logo
const onCreateLogo = async (req, res) => {
    try {

        const logo = await Logo.createLogo({ logoParams: req.body, image: req.files?.image });
        return res.status(200).json({ success: true, logo });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a logo
const onUpdateLogo = async (req, res) => {
    try {
        const logo = await Logo.updateLogo({ logoParams: req.body, image: req.files?.image });
        return res.status(200).json({ success: true, logo });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get user by ID
const onGetLogoById = async (req, res) => {
    try {
        const logo = await Logo.getLogoById(req.params.id);
        return res.status(200).json({ success: true, logo });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a logo 
const onDeleteLogoById = async (req, res) => {
    try {
        const logo = await Logo.deleteLogoById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${logo.deletedCount} logos.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateLogo,
    onUpdateLogo,
    onGetLogoById,
    onDeleteLogoById,
}