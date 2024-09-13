const enums = require("../enums/enums");

module.exports = handleErrors = (err) => {
    const errors = [];
    //email not in DB
    if (err.message) {
        if (err.message === enums.auth.emailError) {
            errors.push(enums.auth.emailError);
        }
    }
    if (err.message) {
        if (err.message === enums.auth.passwordError) {
            errors.push(enums.auth.passwordError);
        }
    }
    if (err.message)
        if (err.name === "ValidationError") {
            //login error
            // checking validation
            Object.values(err.errors).map((val) => errors.push(val.message));
        }
    //duplicate with code
    if (err.code === 11000) {
        errors.push("email is already in use");
    }

    return { errors: errors };
};
