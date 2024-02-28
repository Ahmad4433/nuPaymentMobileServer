// models
const { Review } = require("../models/Review");

// To create a review
const onCreateReview = async (req, res) => {
    try {

        req.body["reviewer"] = req.user._id;

        const review = await Review.createReview({ reviewParams: req.body });
        return res.status(200).json({ success: true, review });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a review
const onUpdateReview = async (req, res) => {
    try {

        const id = req.params.id;

        const review = await Review.updateReview({ id: id, reviewParams: req.body });
        return res.status(200).json({ success: true, review });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get user by ID
const onGetReviewsByUserId = async (req, res) => {
    try {
        const reviews = await Review.getReviewsByUserId(req.params.userId, req.query);
        return res.status(200).json({ success: true, ...reviews });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a review 
const onDeleteReviewById = async (req, res) => {
    try {
        const review = await Review.deleteReviewById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${review.deletedCount} reviews.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateReview,
    onUpdateReview,
    onGetReviewsByUserId,
    onDeleteReviewById,
}