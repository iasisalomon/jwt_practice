const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const { maxAge } = require("../enums/enums");

//handle errors
const handleErrors = (err) => {
    const errors = [];

    // checking validation
    if (err.name === "ValidationError") {
        Object.values(err.errors).map((val) => errors.push(val.message));
    }

    //duplicate with code
    if (err.code === 11000) {
        errors.push("email is already in use");
    }

    return { errors: errors };
};

//token fxs
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

module.exports.signup_get = (req, res) => {
    res.render("signup");
};

module.exports.login_get = (req, res) => {
    res.render("login");
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({
            email: email,
            password: password,
        });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json(errors);
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        res.status(200).json({ user: user._id });
    } catch (error) {
        res.status(400).json({});
    }
};
