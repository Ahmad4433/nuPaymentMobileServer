var nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: "jackevans121998@gmail.com",
        pass: "jackevans@1234",
    },
    secure: true,
});
