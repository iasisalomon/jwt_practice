const User = require("../models/Users");

//handle errors
const handleErrors = (err) => {
    const errors = [];
    // checking validation
    if (err.name === "ValidationError") {
        Object.values(err.errors).map((val) => errors.push(val.message));
    }
    return { errors: errors };
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
        res.status(201).json(user);
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json(errors);
    }
};

module.exports.login_post = async (req, res) => {
    res.send("user login");
};
