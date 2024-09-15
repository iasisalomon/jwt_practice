import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if JWT exists and is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log("Error:", err.message);
                res.redirect("/login");
            } else {
                console.log("Decoded Token:", decodedToken);
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

// Check current user
export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("Error:", err.message);
                res.redirect("/login");
            } else {
                console.log("Decoded Token:", decodedToken);
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};
