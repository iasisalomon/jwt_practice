// Import and invoke router
import { Router } from "express";

// Import controllers
import * as authCtrl from "../controllers/authCtrl.js";

// Invoke router
const router = Router();

// Login routes
router.get("/login", authCtrl.login_get);
router.post("/login", authCtrl.login_post);

// Logout route
router.get("/logout", authCtrl.logout_get);

// Signup routes
router.get("/signup", authCtrl.signup_get);
router.post("/signup", authCtrl.signup_post);

export default router;
