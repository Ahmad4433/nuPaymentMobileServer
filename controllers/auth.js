const { User } = require("../models/User");
const Moralis = require("moralis/node");

// To login by User
const onLogIn = async (req, res) => {
    try {

        const user = await User.login(req.body);
        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

// To check if user exist
const onCheckUserExist = async (req, res) => {
    try {

        const resIfUserExist = await User.isUserExist(req.body);
        return res.status(200).json({ success: true, ...resIfUserExist });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

// To check if user exist
const onCreateUserOrSetPassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const resCreateOrSetPassword = await User.createUserOrSetPassword(userId, req.body);
        return res.status(200).json({ success: true, ...resCreateOrSetPassword });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

// To login by Admin
const onAdminLogIn = async (req, res) => {
    try {

        const user = await User.loginAdmin(req.body);
        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

module.exports = {
    onLogIn,
    onAdminLogIn,
    onCheckUserExist,
    onCreateUserOrSetPassword
}