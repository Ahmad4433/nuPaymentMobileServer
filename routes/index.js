import express from 'express';
import auth from '../middleware/auth';
// middlewares

const router = express.Router();

router
    .post('/login/:userId', auth(Role.Student), (req, res, next) => {
        return res
            .status(200)
            .json({
                success: true,
                authorization: req.authToken,
            });
    });

export default router;