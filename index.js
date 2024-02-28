require("dotenv").config();
// Main routes
const users = require("./routes/users.js");
const portfolios = require("./routes/portfolios.js");
const orders = require("./routes/orders.js");
const chat = require("./routes/chat.js");
const reviews = require("./routes/reviews.js");
const categories = require("./routes/categories.js");
const auth = require("./routes/auth.js");
const moralisR = require("./routes/moralis.js");

// CMS routes
const pages = require("./routes/cms/pages.js");
const logos = require("./routes/cms/logos.js");
const favicons = require("./routes/cms/favicons.js");
const contacts = require("./routes/cms/contacts.js");
const faqs = require("./routes/cms/faqs.js");

const connection = require("./db.js");
const moralis = require("./moralis");
const express = require("express");
const path = require("path");
var cors = require("cors");

var multer = require("multer");
var upload = multer();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors());

connection();

// moralis();

// Serve webpages statically
app.use("/", express.static("dist"));

/**
 * To parse form data
 */
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

// We have multiple lables for files
app.use(
  upload.fields([
    { name: "files" },
    { name: "image" },
    { name: "multipleImages" },
  ])
); // for parsing multipart/form-data

//Statics
app.use("/undefinedProfilePictures", express.static(path.join(__dirname, "undefinedProfilePictures")));

// Routes
app.use("/api/users", users);
app.use("/api/portfolios", portfolios);
app.use("/api/orders", orders);
app.use("/api/chat", chat);
app.use("/api/reviews", reviews);
app.use("/api/categories", categories);
app.use("/api/auth", auth);
app.use("/api/moralis", moralisR);

// CMS
app.use("/api/cms/pages", pages);
app.use("/api/cms/logos", logos);
app.use("/api/cms/favicons", favicons);
app.use("/api/cms/contacts", contacts);
app.use("/api/cms/faqs", faqs);

// Setup server
app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
