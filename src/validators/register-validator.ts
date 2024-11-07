// Chaining Method

import { checkSchema } from "express-validator";

// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required");

// Scema Validation

export default checkSchema({
    firstName: {
        errorMessage: "First Name is Required",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "Last Name is Required",
        notEmpty: true,
        trim: true,
    },
    email: {
        errorMessage: "Email is always Required",
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: "Password is Required",
        notEmpty: true,
    },
});
