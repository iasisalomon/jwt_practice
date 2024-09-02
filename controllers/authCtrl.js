const User = require("../models/Users");

module.exports.signup_get = (req, res) => {
    res.render("signup");
};

module.exports.login_get = (req, res) => {
    res.render("login");
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = User.create({
            email: email,
            password: password,
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
};

module.exports.login_post = async (req, res) => {
    res.send("user login");
};
