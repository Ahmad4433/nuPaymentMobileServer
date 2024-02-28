const Joi = require("joi");
const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;
const slug = require('mongoose-slug-generator');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//Initialize slug plugin
mongoose.plugin(slug);

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        ratings: {
            type: Number,
            require: true
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "reviews",
    }

);

reviewSchema.plugin(aggregatePaginate);

// To validate review create request
const validateCreate = (review) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        reviewer: Joi.string().required(),
        ratings: Joi.number().max(5).min(0).required(),
        description: Joi.string().allow("").optional(),
    });
    return schema.validate(review);
};

// To validate review update request
const validateUpdate = (review) => {
    const schema = Joi.object({
        ratings: Joi.number().max(5).min(0).required(),
        description: Joi.string().allow("").optional(),
    });
    return schema.validate(review);
};


// To create review
reviewSchema.statics.createReview = async function ({ reviewParams, image }) {
    try {
        const { error } = validateCreate(reviewParams);

        if (error)
            throw (error.details[0].message);

        //Create review
        const review = await this.create(reviewParams);
        return review;
    } catch (error) {
        throw error;
    }
}

// To update review
reviewSchema.statics.updateReview = async function ({ id, reviewParams }) {
    try {
        const { error } = validateUpdate(reviewParams);

        if (error)
            throw (error.details[0].message);

        let review = await this.findById(id)
        if (!review) {
            throw ("Review not found");
        }

        //Create review
        review = await this.findByIdAndUpdate(id, reviewParams);
        return review;
    } catch (error) {
        throw error;
    }
}

// To delete review by id
reviewSchema.statics.deleteReviewById = async function (id) {
    try {
        const review = await this.findById(id);

        if (!review) {
            throw ("Review not found");
        }

        //Delete review
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To get review by id
reviewSchema.statics.getReviewsByUserId = async function (id, params) {
    try {

        const { error } = validateGetReviews(params);
        if (error)
            throw (error.details[0].message);

        const { page, perPage } = params;

        const options = {
            page: parseInt(page) + 1,
            limit: perPage,
            sort: { createdAt: "desc" },
        };

        const aggregate = this.aggregate([
            {
                $match: { user: ObjectId(id) }
            },
            { $lookup: { from: 'users', localField: 'reviewer', foreignField: '_id', as: 'reviewer' } },
            {
                $unwind: '$reviewer'
            }
        ]);

        const res = await this.aggregatePaginate(aggregate, options);

        return {
            reviews: res.docs,
            rowCount: res.totalDocs,
        };

    } catch (error) {
        throw error;
    }
}

const validateGetReviews = (pageParams) => {
    const schema = Joi.object({
        page: Joi.number().min(0).required(),
        perPage: Joi.number().min(1).required(),
    });

    return schema.validate(pageParams);
};

const Review = mongoose.model("review", reviewSchema);

module.exports = {
    Review
}
