//import and invoke router
const { Router } = require("express");

// import controllers
const authCtrl = require("../controllers/authCtrl");

//invoke router
const router = Router();

//login
router.get("/login", authCtrl.login_get);
router.post("/login", authCtrl.login_post);

//login
router.get("/logout", authCtrl.logout_get);

//signup
router.get("/signup", authCtrl.signup_get);
router.post("/signup", authCtrl.signup_post);

module.exports = router;
