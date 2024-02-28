const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile } = require("../../helpers/tools/fileUploader.js")

const logoSchema = new mongoose.Schema({
    logoTitle: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
});

// To validate logo create request
const validateCreate = (logo) => {
    const schema = Joi.object({
        logoTitle: Joi.string().required(),
    });
    return schema.validate(logo);
};

// To validate logo create request
const validateUpdate = (logo) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        logoTitle: Joi.string().required(),
    });
    return schema.validate(logo);
};

// To create logo
logoSchema.statics.createLogo = async function ({ logoParams, image }) {
    try {
        const { error } = validateCreate(logoParams);

        if (error)
            throw (error.details[0].message);

        // Check if image is provided
        if (image) {
            const file = image[0];

            const logoImage = await uploadImage({
                file: file,
                path: "logo/",
            });

            logoParams["image"] = logoImage
        }

        //Create logo
        const logo = await this.create(logoParams);
        return logo;
    } catch (error) {
        throw error;
    }
}

// To update logo
logoSchema.statics.updateLogo = async function ({ logoParams, image }) {
    try {
        const { error } = validateUpdate(logoParams);

        if (error)
            throw (error.details[0].message);

        let logo = await this.findById(logoParams._id)
        if (!logo) {
            throw ("Logo not found");
        }

        // Check if image is provided
        if (image) {
            const file = image[0];

            const logoImage = await uploadImage({
                file: file,
                path: "logo/",
                existingImage: logo.image
            });

            logoParams["image"] = logoImage
        }

        //Create logo
        logo = await this.findByIdAndUpdate(logoParams._id, logoParams);
        return logo;
    } catch (error) {
        throw error;
    }
}

// To delete logo by id
logoSchema.statics.deleteLogoById = async function (id) {
    try {
        const logo = await this.findById(id);

        if (!logo) {
            throw ("Logo not found");
        }

        // Check if image is provided
        if (logo.image) {
            deleteFile(logo.image);
        }

        //Delete logo
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get logo by id
logoSchema.statics.getLogoById = async function (id) {
    try {

        let logo = await this.findById(id);

        if (!logo) {
            throw ("Logo not found");
        }

        return logo;

    } catch (error) {
        throw error;
    }
}

const Logo = mongoose.model("logo", logoSchema);

module.exports = {
    Logo
}
