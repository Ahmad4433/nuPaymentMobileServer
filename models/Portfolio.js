const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile } = require("../helpers/tools/fileUploader.js")

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    portfolioTitle: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },
});

// To validate portfolio create request
const validateCreate = (portfolio) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        portfolioTitle: Joi.string().required(),
        description: Joi.string().optional(),
    });
    return schema.validate(portfolio);
};

// To create portfolio
portfolioSchema.statics.createPortfolio = async function ({ portfolioParams, image }) {
    try {
        const { error } = validateCreate(portfolioParams);

        if (error)
            throw (error.details[0].message);

        // Check if image is provided
        if (image) {
            const file = image[0];

            const portfolioImage = await uploadImage({
                file: file,
                path: "portfolio/",
            });

            portfolioParams["image"] = portfolioImage
        }

        //Create portfolio
        const portfolio = await this.create(portfolioParams);
        return portfolio;
    } catch (error) {
        throw error;
    }
}

// To validate portfolio create request
const validateUpdate = (portfolio) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        portfolioTitle: Joi.string().required(),
        description: Joi.string().optional(),
    });
    return schema.validate(portfolio);
};

// To update portfolio
portfolioSchema.statics.updatePortfolio = async function ({ id, portfolioParams, image }) {
    try {
        const { error } = validateUpdate(portfolioParams);

        if (error)
            throw (error.details[0].message);

        let portfolio = await this.findById(id)
        if (!portfolio) {
            throw ("Portfolio not found");
        }

        // Check if image is provided
        if (image) {
            const file = image[0];

            const portfolioImage = await uploadImage({
                file: file,
                path: "portfolio/",
                existingImage: portfolio.image
            });

            portfolioParams["image"] = portfolioImage
        }

        //Create portfolio
        portfolio = await this.findByIdAndUpdate(id, portfolioParams);
        return portfolio;
    } catch (error) {
        throw error;
    }
}

// To delete portfolio by id
portfolioSchema.statics.deletePortfolioById = async function (id) {
    try {
        const portfolio = await this.findById(id);

        if (!portfolio) {
            throw ("Portfolio not found");
        }

        // Check if image is provided
        if (portfolio.image) {
            deleteFile(portfolio.image);
        }

        //Delete portfolio
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get portfolios by user id
portfolioSchema.statics.getPortfoliosByUserId = async function (user) {
    try {

        let portfolio = await this.find({ user: user });

        if (!portfolio) {
            throw ("Portfolio not found");
        }

        return portfolio;

    } catch (error) {
        throw error;
    }
}

const Portfolio = mongoose.model("portfolio", portfolioSchema);

module.exports = {
    Portfolio
}