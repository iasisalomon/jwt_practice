// Import base packages
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/authRoutes.js";

// Import middleware
import { requireAuth, checkUser } from "./middleware/authMiddleware.js";

// Configure environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Set view engine
app.set("view engine", "ejs");

// Database connection
const dbURI = "mongodb://root:example@localhost:27017/records?authSource=admin";

const startServer = async () => {
    try {
        await mongoose.connect(dbURI);
        app.listen(process.env.PORT, () => {
            console.log(
                "Server started successfully on port " + process.env.PORT,
            );
        });
    } catch (error) {
        console.log("Error starting server:", error);
    }
};

// Start the server
startServer();

// Routes
app.get("*", checkUser);
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/drinks", requireAuth, (req, res) => {
    res.render("drinks");
});

// Auth routes
app.use(authRoutes);

export default app;
