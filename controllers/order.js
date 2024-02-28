// models
const { Order } = require("../models/Order");

// To create a order
const onCreateOrder = async (req, res) => {
    try {

        req.body["buyer"] = req.user._id;

        const order = await Order.createOrder({ orderParams: req.body, files: req.files?.files });
        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update an order
const onUpdateOrder = async (req, res) => {
    try {

        const id = req.params.id;

        const order = await Order.updateOrder({ id: id, orderParams: req.body, files: req.files?.files });
        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To accept an order
const onAcceptOrder = async (req, res) => {
    try {

        const id = req.params.id;
        req.body["user"] = req.user._id;

        const order = await Order.acceptOrder({ id: id, orderParams: req.body });
        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To deny an order
const onDenyOrder = async (req, res) => {
    try {

        const id = req.params.id;
        req.body["user"] = req.user._id;

        const order = await Order.denyOrder({ id: id, orderParams: req.body });
        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get my orders
const onGetMyOrders = async (req, res) => {
    try {
        const orders = await Order.getOrdersByUserId(req.user._id);
        return res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get user by ID
const onGetOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.getOrdersByUserId(req.params.id);
        return res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get user by ID
const onGetOrderTransactionById = async (req, res) => {
    try {
        const orders = await Order.getOrderTransactionById(req.params.id);
        return res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a order 
const onDeleteOrderById = async (req, res) => {
    try {
        const order = await Order.deleteOrderById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${order.deletedCount} orders.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete orders of a user 
const onDeleteOrderByUserId = async (req, res) => {
    try {
        const order = await Order.deleteOrderByUserId(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${order.deletedCount} orders.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateOrder,
    onUpdateOrder,
    onAcceptOrder,
    onDenyOrder,
    onGetMyOrders,
    onGetOrdersByUserId,
    onDeleteOrderById,
    onDeleteOrderByUserId,
    onGetOrderTransactionById
}