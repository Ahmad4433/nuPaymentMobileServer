const express = require("express");
const { onAdminLogIn, onLogIn, onCheckUserExist, onCreateUserOrSetPassword } = require("../controllers/auth");
const router = express.Router();

router
    .post('/', onLogIn)
    .post('/checkUserExist', onCheckUserExist)
    .post('/createUserOrSetPassword/:id', onCreateUserOrSetPassword)
    .post('/createUserOrSetPassword', onCreateUserOrSetPassword)
    .post('/adminLogin', onAdminLogIn);

module.exports = router;
