const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile } = require("../../helpers/tools/fileUploader.js")

const contactSchema = new mongoose.Schema({
    contactTitle: {
        type: String,
        require: true
    },
    contactAddress: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    openingHours: {
        type: String,
    },
    mapIframe: {
        type: String
    },
});

// To validate contact create request
const validateCreate = (contact) => {
    const schema = Joi.object({
        contactTitle: Joi.string().required(),
        contactAddress: Joi.string().allow("").optional(),
        contactEmail: Joi.string().allow("").optional(),
        contactNumber: Joi.string().allow("").optional(),
        openingHours: Joi.string().allow("").optional(),
        mapIframe: Joi.string().allow("").optional(),
    });
    return schema.validate(contact);
};

// To validate contact update request
const validateUpdate = (contact) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        contactTitle: Joi.string().required(),
        contactAddress: Joi.string().allow("").optional(),
        contactEmail: Joi.string().allow("").optional(),
        contactNumber: Joi.string().allow("").optional(),
        openingHours: Joi.string().allow("").optional(),
        mapIframe: Joi.string().allow("").optional(),
    });
    return schema.validate(contact);
};

// To create contact
contactSchema.statics.createContact = async function ({ contactParams }) {
    try {
        const { error } = validateCreate(contactParams);

        if (error)
            throw (error.details[0].message);

        //Create contact
        const contact = await this.create(contactParams);
        return contact;
    } catch (error) {
        throw error;
    }
}

// To update contact
contactSchema.statics.updateContact = async function ({ contactParams, image, multipleImages }) {
    try {
        const { error } = validateUpdate(contactParams);

        if (error)
            throw (error.details[0].message);

        let contact = await this.findById(contactParams._id)
        if (!contact) {
            throw ("Contact not found");
        }

        //Create contact
        contact = await this.findByIdAndUpdate(contactParams._id, contactParams);
        return contact;
    } catch (error) {
        throw error;
    }
}

// To delete contact by id
contactSchema.statics.deleteContactById = async function (id) {
    try {

        const contact = await this.findById(id);

        if (!contact) {
            throw ("Contact not found");
        }

        //Delete contact
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get contact by id
contactSchema.statics.getContactById = async function (id) {
    try {

        let contact = await this.findById(id);

        if (!contact) {
            throw ("Contact not found");
        }

        return contact;

    } catch (error) {
        throw error;
    }
}

// To get contact by id
contactSchema.statics.getContacts = async function (id) {
    try {

        let contacts = await this.find();

        return contacts;

    } catch (error) {
        throw error;
    }
}

const Contact = mongoose.model("contact", contactSchema);

module.exports = {
    Contact
}
