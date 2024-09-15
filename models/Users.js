// Packages
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Helpers
import { isEmailValid } from "../helpers/emailValidator.js";
import { auth as authEnums } from "../enums/enums.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [isEmailValid, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [3, "Password is too short"],
    },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error(authEnums.passwordError);
    }
    throw new Error(authEnums.emailError);
};

const User = mongoose.model("User", userSchema);

export default User;
