const mongoose = require("mongoose");
const isEmailValid = require("../helpers/emailValidator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        validate: [isEmailValid, "please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "email is required"],
        minlength: [3, "password is too short"],
    },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
