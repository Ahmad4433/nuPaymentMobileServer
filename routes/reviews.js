const express = require("express");
const router = express.Router();
const {
    onCreateReview,
    onUpdateReview,
    onGetReviewsByUserId,
    onDeleteReviewById,
} = require("../controllers/review.js");
const auth = require("../middleware/auth.js");
const { USER_TYPES } = require("../models/User.js");

router
    .post('/', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Admin]), onCreateReview)
    .put('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Admin]), onUpdateReview)
    .get('/:userId', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Admin]), onGetReviewsByUserId)
    .delete('/:id', auth([USER_TYPES.ServiceProvider, USER_TYPES.Shopper, USER_TYPES.Admin]), onDeleteReviewById)

module.exports = router;