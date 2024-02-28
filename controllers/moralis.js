// models
const { User, USER_TYPES, validateCreate } = require('../models/User.js');

// To login by User via moralis
const onMoralisLogin = async (req, res) => {
    try {

        const sessionToken = req?.body?.user?.sessionToken
        const userObjectId = req?.body?.user?.objectId;
        const address = req?.body?.user?.ethAddress;
        if (sessionToken && userObjectId && address) {
            const res = await User.createUpdateMoralisUser(userObjectId, sessionToken, address);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

// To login by User
const onServerLogin = async (req, res) => {
    try {

        const user = await User.serverLogin(req.body);
        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

module.exports = {
    onMoralisLogin,
    onServerLogin
}