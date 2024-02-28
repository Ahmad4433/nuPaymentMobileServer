const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile } = require("../../helpers/tools/fileUploader.js")

const pageSchema = new mongoose.Schema({

    pageParentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'page'
    },
    pageTitle: {
        type: String,
        require: true
    },
    pageSubTitle: {
        type: String
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },
    multipleImages: {
        type: [String]
    },
    metaTagTitle: {
        type: String,
    },
    metaTagDescription: {
        type: String,
    },
    recordListingID: {
        type: Number,
        default: 1
    },
});

// To validate page create request
const validateCreate = (page) => {
    const schema = Joi.object({
        pageParentID: Joi.string().optional(),
        pageTitle: Joi.string().required(),
        pageSubTitle: Joi.string().allow("").optional(),
        description: Joi.string().allow("").optional(),
        metaTagTitle: Joi.string().allow("").optional(),
        metaTagDescription: Joi.string().allow("").optional()
    });
    return schema.validate(page);
};

// To validate page update request
const validateUpdate = (page) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        pageParentID: Joi.string().optional(),
        pageTitle: Joi.string().required(),
        pageSubTitle: Joi.string().allow("").optional(),
        description: Joi.string().allow("").optional(),
        metaTagTitle: Joi.string().allow("").optional(),
        metaTagDescription: Joi.string().allow("").optional()
    });
    return schema.validate(page);
};

// To validate page multiple images delete update request
const validateMutliImageDelete = (page) => {
    const schema = Joi.object({
        imageIndexArray: Joi.array().items(Joi.number()).required()
    });
    return schema.validate(page);
};

// To create page
pageSchema.statics.createPage = async function ({ pageParams, image, multipleImages }) {
    try {
        const { error } = validateCreate(pageParams);

        if (error)
            throw (error.details[0].message);

        // Check if image is provided
        if (image) {
            const file = image[0];

            const pageImage = await uploadImage({
                file: file,
                path: "page/",
            });

            pageParams["image"] = pageImage
        }

        // Check if multiple images is provided
        if (multipleImages) {
            const pageMultipleImages = [];

            await Promise.all(multipleImages.map(async (image) => {
                const file = image;

                const pageImage = await uploadImage({
                    file: file,
                    path: "pageF/",
                });

                pageMultipleImages.push(pageImage)
            }));

            pageParams["multipleImages"] = pageMultipleImages
        }

        //Create page
        const page = await this.create(pageParams);
        return page;
    } catch (error) {
        throw error;
    }
}

// To update page
pageSchema.statics.updatePage = async function ({ pageParams, image, multipleImages }) {
    try {
        const { error } = validateUpdate(pageParams);

        if (error)
            throw (error.details[0].message);

        let page = await this.findById(pageParams._id)
        if (!page) {
            throw ("Page not found");
        }

        // Check if image is provided
        if (image) {
            console.log(image);
            const file = image[0];

            const pageImage = await uploadImage({
                file: file,
                path: "page/",
                existingImage: page.image
            });

            pageParams["image"] = pageImage
        }

        // Check if multiple images is provided
        if (multipleImages) {
            const pageMultipleImages = page.multipleImages;

            await Promise.all(multipleImages.map(async (image) => {
                const file = image;

                const pageImage = await uploadImage({
                    file: file,
                    path: "pageF/",
                });

                pageMultipleImages.push(pageImage)
            }));

            pageParams["multipleImages"] = pageMultipleImages
        }

        //Create page
        page = await this.findByIdAndUpdate(pageParams._id, pageParams);
        return page;
    } catch (error) {
        throw error;
    }
}

// To delete page by id
pageSchema.statics.deletePageById = async function (id) {
    try {
        const children = await this.findOne({ pageParentID: id });
        if (children)
            throw ("Please delete children pages of this page");

        const page = await this.findById(id);

        if (!page) {
            throw ("Page not found");
        }

        // Check if image is provided
        if (page.image) {
            deleteFile(page.image);
        }

        // Check if multiple images is provided
        if (page.multipleImages) {
            page.multipleImages.map((image) => {
                deleteFile(image);
            });
        }

        //Delete page
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To delete page image by id
pageSchema.statics.deletePageImageById = async function (id) {
    try {

        let page = await this.findById(id);

        if (!page) {
            throw ("Page not found");
        }

        // Check if image is provided
        if (page.image) {
            deleteFile(page.image);
        }

        page.image = undefined

        //Update page
        const result = await page.save();
        return result;
    } catch (error) {
        throw error;
    }
}

// To delete page multiple images by id
pageSchema.statics.deletePageMultiImagesById = async function (id, pageParams) {
    try {
        const { error } = validateMutliImageDelete(pageParams);

        if (error)
            throw (error.details[0].message);

        let page = await this.findById(id);

        if (!page) {
            throw ("Page not found");
        }

        // Check if multiple images is provided
        if (page.multipleImages) {

            // remove images on indexes provide and filer all remaining images
            let multipleImages = page.multipleImages.filter((image, index) => {
                if (pageParams.imageIndexArray.includes(index.toString())) {
                    deleteFile(image);
                    return false;
                } else {
                    return true;
                }
            });

            page.multipleImages = multipleImages
        }

        //Update page
        const result = await page.save();
        return result;

    } catch (error) {
        throw error;
    }
}

// To get page by id
pageSchema.statics.getPageById = async function (id) {
    try {

        let page = await this.findById(id);

        if (!page) {
            throw ("Page not found");
        }

        return page;

    } catch (error) {
        throw error;
    }
}

// To get page by id
pageSchema.statics.getPages = async function (id) {
    try {

        let pages = await this.find();

        return pages;

    } catch (error) {
        throw error;
    }
}

const Page = mongoose.model("page", pageSchema);

module.exports = {
    Page
}
