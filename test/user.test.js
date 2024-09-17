//libraries
import { expect } from "chai";
import axios from "axios";
import dotenv from "dotenv";

//app and models
import app from "../app.js"; // Your Express app entry point
import User from "../models/Users.js";

// Configure environment variables
dotenv.config();

//Test variables
let server;
let jwtToken;

// Start the server before running the tests
before(async () => {
    server = app.listen(process.env.TEST_PORT, () => {
        console.log("Test server running on port " + process.env.TEST_PORT);
    });

    try {
        await User.create({
            email: "testuser@example.com",
            password: "testpassword",
        });
        return;
    } catch (error) {
        throw new Error("Setup failed, skipping the test suite");
    }
});

// Close the server after the tests are done
after(async () => {
    try {
        // Find and delete the test user
        const testUser = await User.findOne({ email: "testuser@example.com" });
        if (testUser) {
            await User.deleteOne({ email: "testuser@example.com" });
            console.log("Test user deleted");
        }
    } catch (error) {
        console.error("Error cleaning up test user:", error);
    }
    server.close(() => {
        console.log("Test server closed");
    });
});

describe("User Authentication and Routes", () => {
    // Test the signup functionality
    it("should sign up a new user", async () => {
        const res = await axios.post(
            `http://localhost:${process.env.TEST_PORT}/signup`,
            {
                email: Math.round(Math.random() * 9999) + "@example.com",
                password: "newpassword",
            },
        );
        // Check if signup was successful and status is 201
        expect(res.status).to.equal(201);
        expect(res.data).to.have.property("user"); // The response should include the user ID
    });

    // Test the login functionality with valid credentials
    it("should log in with correct credentials", async () => {
        const res = await axios.post(
            `http://localhost:${process.env.TEST_PORT}/login`,
            {
                email: "testuser@example.com",
                password: "testpassword",
            },
        );

        // Check if login was successful and status is 200
        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("user"); // The response should include the user ID

        // Extract JWT token from the cookies
        const cookies = res.headers["set-cookie"];
        jwtToken = cookies
            .find((cookie) => cookie.startsWith("jwt="))
            .split(";")[0]
            .split("=")[1];
    });

    // Test the login functionality with incorrect credentials
    it("should not log in with incorrect credentials", async () => {
        try {
            await axios.post(
                `http://localhost:${process.env.TEST_PORT}/login`,
                {
                    email: "testuser@example.com",
                    password: "wrongpassword",
                },
            );
        } catch (err) {
            // Check if login failed with status 400
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.include("Incorrect password"); // Assuming the error message returned is 'Incorrect password'
        }
    });

    // Test access to a protected route (drinks)
    it("should access the protected drinks route with JWT token", async () => {
        const res = await axios.get(
            `http://localhost:${process.env.TEST_PORT}/drinks`,
            {
                headers: {
                    Cookie: `jwt=${jwtToken}`, // Send the JWT token in the Cookie header
                },
            },
        );

        // Check if access to the protected route was successful
        expect(res.status).to.equal(200);
        expect(res.data).to.include("Drinks"); // Replace 'Drinks' with actual content of the protected page
    });

    // Test logout functionality
    it("should log out the user", async () => {
        const res = await axios.get(
            `http://localhost:${process.env.TEST_PORT}/logout`,
        );

        // Check if logout was successful and user is redirected
        expect(res.status).to.equal(200);
    });

    // Test that protected route is inaccessible after logout
    it("should not access the protected drinks route after logout", async () => {
        try {
            await axios.get(`http://localhost:${process.env.TEST_PORT}/drinks`);
        } catch (err) {
            // Expect redirection or failure due to lack of authentication
            expect(err.response.status).to.equal(401); // Assuming you return 401 for unauthorized requests
        }
    });
});
