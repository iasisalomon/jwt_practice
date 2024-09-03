const mongoose = require("mongoose");
const isEmailValid = require("../helpers/emailValidator");
const bcrypt = require("bcrypt");

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

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
