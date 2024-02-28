const Joi = require("joi");
const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');

const { uploadImage, deleteFile } = require("../helpers/tools/fileUploader.js")

//Initialize slug plugin
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
    {
        categoryTitle: {
            type: String,
            require: true
        },
        description: {
            type: String,
        },
        image: {
            type: String
        },
        slug: {
            type: String
        },
        skillTags: {
            type: String,
        },
        metaTagTitle: {
            type: String,
        },
        metaTagDescription: {
            type: String,
        },
        //Define the slug parameters
        slug: { type: String, slug: "categoryTitle", unique: true }
    },
    {
        timestamps: true,
        collection: "categories",
    }

);

// To validate category create request
const validateCreate = (category) => {
    const schema = Joi.object({
        categoryTitle: Joi.string().required(),
        description: Joi.string().allow("").optional(),
        metaTagTitle: Joi.string().allow("").optional(),
        metaTagDescription: Joi.string().allow("").optional(),
        skillTags: Joi.string().allow("").optional(),
    });
    return schema.validate(category);
};

// To validate category update request
const validateUpdate = (category) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        categoryTitle: Joi.string().required(),
        description: Joi.string().allow("").optional(),
        metaTagTitle: Joi.string().allow("").optional(),
        metaTagDescription: Joi.string().allow("").optional(),
        skillTags: Joi.string().allow("").optional(),
    });
    return schema.validate(category);
};


// To create category
categorySchema.statics.createCategory = async function ({ categoryParams, image }) {
    try {
        const { error } = validateCreate(categoryParams);

        if (error)
            throw (error.details[0].message);

        // Check if image is provided
        if (image) {
            const file = image[0];

            const categoryImage = await uploadImage({
                file: file,
                path: "category/",
            });

            categoryParams["image"] = categoryImage
        }

        //Create category
        const category = await this.create(categoryParams);
        return category;
    } catch (error) {
        throw error;
    }
}

// To update category
categorySchema.statics.updateCategory = async function ({ categoryParams, image }) {
    try {
        const { error } = validateUpdate(categoryParams);

        if (error)
            throw (error.details[0].message);

        let category = await this.findById(categoryParams._id)
        if (!category) {
            throw ("Category not found");
        }

        // Check if image is provided
        if (image) {
            const file = image[0];

            const categoryImage = await uploadImage({
                file: file,
                path: "category/",
                existingImage: category.image
            });

            categoryParams["image"] = categoryImage
        }

        //Create category
        category = await this.findByIdAndUpdate(categoryParams._id, categoryParams, { new: true });
        return category;
    } catch (error) {
        throw error;
    }
}

// To delete category by id
categorySchema.statics.deleteCategoryById = async function (id) {
    try {
        const category = await this.findById(id);

        if (!category) {
            throw ("Category not found");
        }

        // Check if image is provided
        if (category.image) {
            deleteFile(category.image);
        }

        //Delete category
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get category by id
categorySchema.statics.getCategoryById = async function (id) {
    try {

        let category = await this.findById(id);

        if (!category) {
            throw ("Category not found");
        }

        return category;

    } catch (error) {
        throw error;
    }
}

// To get category by slug
categorySchema.statics.getCategoryBySlug = async function (slug) {
    try {

        let category = await this.findOne({ slug: slug });

        if (!category) {
            throw ("Category not found");
        }

        return category;

    } catch (error) {
        throw error;
    }
}

// To get categories
categorySchema.statics.getAllCategories = async function () {
    try {

        let categories = await this.find();

        return categories;

    } catch (error) {
        throw error;
    }
}

// To get n category
categorySchema.statics.getCategories = async function (n) {
    try {

        let categories = await this.aggregate([
            { $sample: { size: n } }
        ]);

        return categories;

    } catch (error) {
        throw error;
    }
}

const Category = mongoose.model("category", categorySchema);

module.exports = {
    Category
}
