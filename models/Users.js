//packages
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//helpers
const isEmailValid = require("../helpers/emailValidator");
const { auth: authEnums } = require("../enums/enums");

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
        required: [true, "password is required"],
        minlength: [3, "password is too short"],
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error(authEnums.passwordError);
    }
    throw Error(authEnums.emailError);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
