import jwt from "jsonwebtoken";

//Import files
import User from "../models/Users.js";
import { maxAge, auth as authEnums } from "../enums/enums.js";
import handleErrors from "../helpers/handleErrors.js";

// Token functions
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

// GET signup page
export const signup_get = (req, res) => {
    res.render("signup");
};

// GET login page
export const login_get = (req, res) => {
    res.render("login");
};

// GET logout and clear cookie
export const logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
};

// POST signup data
export const signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({
            email,
            password,
        });
        const token = createToken(user._id);

        // Set cookie and send response
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json(errors);
    }
};

// POST login data
export const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        // Set cookie and send response
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json(errors);
    }
};
