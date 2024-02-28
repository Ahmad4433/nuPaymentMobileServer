const jwt = require("jsonwebtoken");
const jwtFunction = require('express-jwt');

module.exports = auth;

function auth(roles = []) {

    // roles param can be a single role string (e.g. USER_TYPES.User or 'User') 
    // or an array of roles (e.g. [USER_TYPES.Admin, USER_TYPES.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    const secret = process.env.JWTPRIVATEKEY;

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwtFunction({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        (req, res, next) => {

            try {
                let token = req.header("Authorization");

                if (!token) return res.status(401).send("Access denied.");

                if (roles.length && !roles.includes(req.user.role)) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                const bearer = token.split(' ');
                const bearerToken = bearer[1];
                token = bearerToken;

                const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
                req.user = decoded;
                next();
            } catch (error) {
                console.log(error);
                res.status(401).send("Invalid token");
            }
        }
    ]

}