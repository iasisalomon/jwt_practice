//import base
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//import routes
const authRoutes = require("./routes/authRoutes");

//express init
const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set("view engine", "ejs");

//database connection
const dbURI = "mongodb://root:example@localhost:27017/records?authSource=admin";

mongoose
    .connect(dbURI)
    .then((result) => {
        app.listen(3000);
        console.log("server started successfully");
    })
    .catch((err) => {
        console.log(err);
    });

//routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/drinks", (req, res) => {
    res.render("drinks");
});
//routes
app.use(authRoutes);
