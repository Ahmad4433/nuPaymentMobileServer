// models
const { Portfolio } = require("../models/Portfolio");

// To create a portfolio
const onCreatePortfolio = async (req, res) => {
    try {

        req.body["user"] = req.user._id;

        const portfolio = await Portfolio.createPortfolio({ portfolioParams: req.body, image: req.files?.image });
        return res.status(200).json({ success: true, portfolio });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a portfolio
const onUpdatePortfolio = async (req, res) => {
    try {

        const id = req.params.id;
        req.body["user"] = req.user._id;

        const portfolio = await Portfolio.updatePortfolio({ id: id, portfolioParams: req.body, image: req.files?.image });
        return res.status(200).json({ success: true, portfolio });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get user by ID
const onGetPortfoliosByUserId = async (req, res) => {
    try {
        const portfolios = await Portfolio.getPortfoliosByUserId(req.params.userId);
        return res.status(200).json({ success: true, portfolios: portfolios });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// To delete a portfolio 
const onDeletePortfolioById = async (req, res) => {
    try {
        const portfolio = await Portfolio.deletePortfolioById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${portfolio.deletedCount} portfolios.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreatePortfolio,
    onUpdatePortfolio,
    onGetPortfoliosByUserId,
    onDeletePortfolioById,
}