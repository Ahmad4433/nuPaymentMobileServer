// models
const { FAQ } = require("../../models/cms/FAQ");

// To create a faq
const onCreateFAQ = async (req, res) => {
    try {

        const faq = await FAQ.createFAQ({ faqParams: req.body });
        return res.status(200).json({ success: true, faq });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a faq
const onUpdateFAQ = async (req, res) => {
    try {

        const faq = await FAQ.updateFAQ({ id: req.params.id, faqParams: req.body });
        return res.status(200).json({ success: true, faq });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get all faqs
const onGetAllFAQs = async (req, res) => {
    try {

        const faqs = await FAQ.getFAQs();
        return res.status(200).json({ success: true, faqs });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// Get faq by ID
const onGetFAQById = async (req, res) => {
    try {
        const faq = await FAQ.getFAQById(req.params.id);
        return res.status(200).json({ success: true, faq });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a faq 
const onDeleteFAQById = async (req, res) => {
    try {
        const faq = await FAQ.deleteFAQById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${faq.deletedCount} faqs.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateFAQ,
    onUpdateFAQ,
    onGetAllFAQs,
    onGetFAQById,
    onDeleteFAQById,
}