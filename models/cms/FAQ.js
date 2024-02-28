const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile } = require("../../helpers/tools/fileUploader.js")

const faqSchema = new mongoose.Schema({
    faqTitle: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    recordListingID: {
        type: Number,
        default: 1
    },
});

// To validate FAQ request
const validate = (faq) => {
    const schema = Joi.object({
        faqTitle: Joi.string().required(),
        description: Joi.string().required(),
    });
    return schema.validate(faq);
};

// To create faq
faqSchema.statics.createFAQ = async function ({ faqParams }) {
    try {
        const { error } = validate(faqParams);

        if (error)
            throw (error.details[0].message);

        //Create faq
        const faq = await this.create(faqParams);
        return faq;
    } catch (error) {
        throw error;
    }
}

// To update faq
faqSchema.statics.updateFAQ = async function ({ id, faqParams }) {
    try {
        const { error } = validate(faqParams);

        if (error)
            throw (error.details[0].message);

        let faq = await this.findById(id)
        if (!faq) {
            throw ("FAQ not found");
        }

        //Create faq
        faq = await this.findByIdAndUpdate(id, faqParams);
        return faq;
    } catch (error) {
        throw error;
    }
}

// To delete faq by id
faqSchema.statics.deleteFAQById = async function (id) {
    try {

        const faq = await this.findById(id);

        if (!faq) {
            throw ("FAQ not found");
        }

        //Delete faq
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get faq by id
faqSchema.statics.getFAQById = async function (id) {
    try {

        let faq = await this.findById(id);

        if (!faq) {
            throw ("FAQ not found");
        }

        return faq;

    } catch (error) {
        throw error;
    }
}

// To get all faqs
faqSchema.statics.getFAQs = async function () {
    try {

        let faqs = await this.find().sort({ recordListingID: 1 });

        return faqs;

    } catch (error) {
        throw error;
    }
}

const FAQ = mongoose.model("faq", faqSchema);

module.exports = {
    FAQ
}