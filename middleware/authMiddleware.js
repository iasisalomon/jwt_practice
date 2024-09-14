const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check jwt exists & verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log("error.message", error.message);
                res.redirect("/login");
            } else {
                console.log("decodedToken", decodedToken);
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

//check current User
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("error.message", error.message);

                res.redirect("/login");
            } else {
                console.log("decodedToken", decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };
