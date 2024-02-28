const express = require("express");
const router = express.Router();
const {
    onCreateOrder,
    onUpdateOrder,
    onAcceptOrder,
    onDenyOrder,
    onGetOrdersByUserId,
    onGetMyOrders,
    onDeleteOrderById,
    onGetOrderTransactionById,
    onDeleteOrderByUserId,
} = require("../controllers/order.js");
const auth = require("../middleware/auth.js");
const { USER_TYPES } = require("../models/User.js");

router
    .post('/', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onCreateOrder)
    .put('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onUpdateOrder)
    .put('/acceptOrder/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onAcceptOrder)
    .put('/denyOrder/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onDenyOrder)
    .get('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Shopper, USER_TYPES.Admin]), onGetOrdersByUserId)
    .delete('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Shopper]), onDeleteOrderById)
    .delete('/allOrderOfUser/:id', auth([USER_TYPES.Admin]), onDeleteOrderByUserId)
    .get('/', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onGetMyOrders)
    .get('/:id', auth(USER_TYPES.Admin), onGetOrdersByUserId)
    .get('/getTransactionDetails/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Admin]), onGetOrderTransactionById)

module.exports = router;