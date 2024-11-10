// Chaining Method
// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required");

// Scema Validation
import { checkSchema } from "express-validator";
export default checkSchema({
    email: {
        errorMessage: "Email is always Required for login",
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: "Email should be a valid email",
        },
    },
    password: {
        errorMessage: "Password is Required for login",
        notEmpty: true,
    },
});
