const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile } = require("../../helpers/tools/fileUploader.js")

const faviconSchema = new mongoose.Schema({
    faviconTitle: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
});

// To validate favicon create request
const validateCreate = (favicon) => {
    const schema = Joi.object({
        faviconTitle: Joi.string().required(),
    });
    return schema.validate(favicon);
};

// To validate favicon create request
const validateUpdate = (favicon) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        faviconTitle: Joi.string().required(),
    });
    return schema.validate(favicon);
};

// To create favicon
faviconSchema.statics.createFavicon = async function ({ faviconParams, image }) {
    try {
        const { error } = validateCreate(faviconParams);

        if (error)
            throw (error.details[0].message);

        // Check if image is provided
        if (image) {
            const file = image[0];

            const faviconImage = await uploadImage({
                file: file,
                path: "favicon/",
            });

            faviconParams["image"] = faviconImage
        }

        //Create favicon
        const favicon = await this.create(faviconParams);
        return favicon;
    } catch (error) {
        throw error;
    }
}

// To update favicon
faviconSchema.statics.updateFavicon = async function ({ faviconParams, image }) {
    try {
        const { error } = validateUpdate(faviconParams);

        if (error)
            throw (error.details[0].message);

        let favicon = await this.findById(faviconParams._id)
        if (!favicon) {
            throw ("Favicon not found");
        }

        // Check if image is provided
        if (image) {
            const file = image[0];

            const faviconImage = await uploadImage({
                file: file,
                path: "favicon/",
                existingImage: favicon.image
            });

            faviconParams["image"] = faviconImage
        }

        //Create favicon
        favicon = await this.findByIdAndUpdate(faviconParams._id, faviconParams);
        return favicon;
    } catch (error) {
        throw error;
    }
}

// To delete favicon by id
faviconSchema.statics.deleteFaviconById = async function (id) {
    try {
        const favicon = await this.findById(id);

        if (!favicon) {
            throw ("Favicon not found");
        }

        // Check if image is provided
        if (favicon.image) {
            deleteFile(favicon.image);
        }

        //Delete favicon
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get favicon by id
faviconSchema.statics.getFaviconById = async function (id) {
    try {

        let favicon = await this.findById(id);

        if (!favicon) {
            throw ("Favicon not found");
        }

        return favicon;

    } catch (error) {
        throw error;
    }
}

const Favicon = mongoose.model("favicon", faviconSchema);

module.exports = {
    Favicon
}
