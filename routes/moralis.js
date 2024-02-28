const express = require("express");
const { onMoralisLogin, onServerLogin } = require("../controllers/moralis");
const router = express.Router();

router
    .post('/', onMoralisLogin)
    .post('/login', onServerLogin)

module.exports = router;
