const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile, uploadFile } = require("../helpers/tools/fileUploader.js");
const PLAN_TYPES = require("../helpers/consts/PlanTypes");
const ORDER_STATUS = require("../helpers/consts/OrderStatus");
const OrderStatus = require("../helpers/consts/OrderStatus");

const orderTransactionSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order'
        },
        latestAmount: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        files: {
            type: [String]
        },
        transactionType: {
            type: String,
            default: ORDER_STATUS.NewOrder
        }
    },
    {
        timestamps: true,
        collection: "orderTransactions",
    }
);

// To validate orderTransaction create request
const validateCreate = (orderTransaction) => {
    const schema = Joi.object({
        order: Joi.string().required(),
        transactionType: Joi.string().valid(
            OrderStatus.Complete,
            OrderStatus.NewOrder,
            OrderStatus.Offer,
            OrderStatus.OfferDeny,
            OrderStatus.Revise,
            OrderStatus.SpecialRequest,
            OrderStatus.UnderReview,
        ).required(),
        latestAmount: Joi.number().optional(),
        description: Joi.string().optional(),
        files: Joi.array().optional(),
    });
    return schema.validate(orderTransaction);
};

// To create orderTransaction
orderTransactionSchema.statics.createOrderTransaction = async function (orderTransactionParams) {
    try {
        const { error } = validateCreate(orderTransactionParams);

        if (error)
            throw (error.details[0].message);

        //Create orderTransaction
        const orderTransaction = await this.create(orderTransactionParams);
        return orderTransaction;
    } catch (error) {
        throw error;
    }
}

// To get orderTransactions by user id
orderTransactionSchema.statics.getOrderTransactionById = async function (id) {
    try {

        let orderTransaction = await this.findById(id);

        if (!orderTransaction) {
            throw ("Transaction not found");
        }

        return orderTransaction;

    } catch (error) {
        throw error;
    }
}

const OrderTransaction = mongoose.model("orderTransaction", orderTransactionSchema);

module.exports = {
    OrderTransaction
}