// Chaining Method
// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required");

// Scema Validation
import { checkSchema } from "express-validator";
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
    role: {
        errorMessage: "Role is required!",
        notEmpty: true,
        trim: true,
    },
});
