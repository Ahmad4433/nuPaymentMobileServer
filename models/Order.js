const Joi = require("joi");
const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;
const { uploadImage, deleteFile, uploadFile } = require("../helpers/tools/fileUploader.js");
const PLAN_TYPES = require("../helpers/consts/PlanTypes");
const ORDER_STATUS = require("../helpers/consts/OrderStatus.js");
const OrderStatus = require("../helpers/consts/OrderStatus.js");
const { OrderTransaction } = require("./OrderTransaction.js");

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        orderTitle: {
            type: String,
            require: true
        },
        planType: {
            type: String,
        },
        latestAmount: {
            type: String,
        },
        orderDescription: {
            type: String,
            require: true
        },
        description: {
            type: String,
        },
        days: {
            type: Number,
            default: 1,
        },
        files: {
            type: [String]
        },
        orderStatus: {
            type: String,
            default: ORDER_STATUS.Create
        }
    },
    {
        timestamps: true,
        collection: "orders",
    }
);

// To validate order create request
const validateCreate = (order) => {
    const schema = Joi.object({
        seller: Joi.string().required(),
        buyer: Joi.string().required(),
        orderTitle: Joi.string().required(),
        orderDescription: Joi.string().required(),
        days: Joi.number().optional(),
        planType: Joi.string().valid(PLAN_TYPES.Base, PLAN_TYPES.Special, PLAN_TYPES.Plus).required(),
        latestAmount: Joi.number().required(),
        latestAmount: Joi.number().optional(),
        orderStatus: Joi.string().valid(
            OrderStatus.NewOrder,
            OrderStatus.SpecialRequest,
        ).required(),
    });
    return schema.validate(order);
};

// To create order
orderSchema.statics.createOrder = async function ({ orderParams, files }) {
    try {
        const { error } = validateCreate(orderParams);

        if (error)
            throw (error.details[0].message);

        // Check if multiple files is provided
        const fileUrls = [];

        if (files) {

            await Promise.all(files.map(async (file) => {

                const fileUrl = await uploadFile({
                    file: file,
                    path: "orderFiles/",
                });

                if (fileUrl != false) {
                    fileUrls.push(fileUrl)
                }
            }));

            orderParams["files"] = fileUrls
        }

        //Create order
        const order = await this.create(orderParams);

        const orderTransaction = await OrderTransaction.createOrderTransaction({
            order: order._id.toString(),
            transactionType: order.orderStatus,
            latestAmount: order.latestAmount,
            description: order.orderDescription,
            files: fileUrls
        })

        return { ...order._doc, transactionId: orderTransaction._id };
    } catch (error) {
        throw error;
    }
}

// To validate order create request
const validateUpdate = (order) => {
    const schema = Joi.object({
        orderTitle: Joi.string().optional(),
        orderDescription: Joi.string().optional(),
        days: Joi.number().optional(),
        planType: Joi.string().valid(PLAN_TYPES.Base, PLAN_TYPES.Special, PLAN_TYPES.Plus).optional(),
        latestAmount: Joi.number().optional(),
        orderStatus: Joi.string().allow("").valid(
            OrderStatus.SpecialRequest,
            OrderStatus.Offer,
            OrderStatus.NewOrder,
            OrderStatus.OfferDeny,
            OrderStatus.UnderReview,
            OrderStatus.Revise,
            OrderStatus.Complete,
        ).optional(),
    });
    return schema.validate(order);
};

// To update order
orderSchema.statics.updateOrder = async function ({ id, orderParams, files }) {
    try {
        const { error } = validateUpdate(orderParams);

        if (error)
            throw (error.details[0].message);

        let order = await this.findById(id)
        if (!order) {
            throw ("Order not found");
        }

        // Check if image is provided
        // Check if multiple files is provided
        let fileUrls = [];

        if (files) {

            await Promise.all(files.map(async (file) => {

                const fileUrl = await uploadFile({
                    file: file,
                    path: "orderFiles/",
                });

                if (fileUrl != false) {
                    fileUrls.push(fileUrl)
                }
            }));

            orderParams["files"] = []
            let allFiles = fileUrls
            if (order.files) {
                allFiles = order.files.concat(allFiles)
            }
            orderParams["files"] = allFiles
        }

        //Udpdate order
        order = await this.findByIdAndUpdate(id, { ...orderParams }, { new: true });

        const orderTransaction = await OrderTransaction.createOrderTransaction({
            order: order._id.toString(),
            transactionType: order.orderStatus,
            latestAmount: order.latestAmount,
            description: order.orderDescription,
            files: fileUrls
        })

        return { ...order._doc, transactionId: orderTransaction._id };
    } catch (error) {
        throw error;
    }
}

// To delete order by id
orderSchema.statics.deleteOrderById = async function (id) {
    try {
        const order = await this.findById(id);

        if (!order) {
            throw ("Order not found");
        }

        // Check if multiple files are provided
        if (order.files) {
            order.files.map((file) => {
                deleteFile(file);
            });
        }

        //Delete order
        const result = await this.deleteOne({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// To delete orders by user id
orderSchema.statics.deleteOrderByUserId = async function (id) {
    try {
        const orders = await this.find({ $or: [{ buyer: ObjectId(id) }, { seller: ObjectId(id) }] });

        if (!orders) {
            throw ("Order not found");
        }

        await Promise.all(orders.map(async (order) => {

            // Check if multiple files are provided
            if (order.files) {
                order.files.map((file) => {
                    deleteFile(file);
                });
            }

            //Delete order
            await this.deleteOne({ _id: order.id });
        }));

        return { deletedCount: orders.length };
    } catch (error) {
        throw error;
    }
}

// To get orders by user id
orderSchema.statics.getOrdersByUserId = async function (user) {
    try {
        let orders = await this.aggregate([
            {
                $match: {
                    $or: [{ buyer: ObjectId(user) }, { seller: ObjectId(user) }],
                    orderStatus: {
                        $nin: [ORDER_STATUS.OfferDeny, ORDER_STATUS.Offer, ORDER_STATUS.SpecialRequest]
                    },
                },
            },
            { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer' } },
            { $lookup: { from: 'users', localField: 'seller', foreignField: '_id', as: 'seller' } },
            {
                $unwind: '$buyer'
            },
            {
                $unwind: '$seller'
            }
        ]);

        if (!orders) {
            throw ("Order not found");
        }

        return {
            buyers: orders.filter((order) => order.seller._id == user),
            sellers: orders.filter((order) => order.buyer._id == user),
        };

    } catch (error) {
        throw error;
    }
}

// To get orders by user id
orderSchema.statics.getOrderTransactionById = async function (id) {
    try {

        const transaction = await OrderTransaction.getOrderTransactionById(id);

        const order = await this.findById(transaction.order)

        if (!order) {
            throw ("Order not found");
        }

        return { ...order._doc, ...transaction._doc };
        // return transaction;

    } catch (error) {
        throw error;
    }
}

const Order = mongoose.model("order", orderSchema);

module.exports = {
    Order
}