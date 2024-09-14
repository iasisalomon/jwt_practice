const jwt = require("jsonwebtoken");

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

module.exports = { requireAuth };
