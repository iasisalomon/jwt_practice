import { auth } from "../enums/enums.js";

const handleErrors = (err) => {
    const errors = [];

    // Email not in DB
    if (err.message === auth.emailError) {
        errors.push(auth.emailError);
    }

    // Password error
    if (err.message === auth.passwordError) {
        errors.push(auth.passwordError);
    }

    // Validation error
    if (err.name === "ValidationError") {
        Object.values(err.errors).forEach((val) => errors.push(val.message));
    }

    // Duplicate error (code 11000)
    if (err.code === 11000) {
        errors.push("Email is already in use");
    }

    return { errors };
};

export default handleErrors;
