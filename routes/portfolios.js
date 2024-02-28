const express = require("express");
const router = express.Router();
const {
    onCreatePortfolio,
    onUpdatePortfolio,
    onGetPortfoliosByUserId,
    onDeletePortfolioById,
} = require("../controllers/portfolio.js");
const auth = require("../middleware/auth.js");
const { USER_TYPES } = require("../models/User.js");

router
    .post('/', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onCreatePortfolio)
    .put('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onUpdatePortfolio)
    .get('/:userId', onGetPortfoliosByUserId)
    .delete('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper]), onDeletePortfolioById)

module.exports = router;