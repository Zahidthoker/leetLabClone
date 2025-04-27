import {body} from "express-validator"

const userRegisterationValidator=()=>{
    return[
        body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({min:5}).withMessage("Name must be greater than 4 characters")
        .isLength({max:30}).withMessage("Name must be smaller than 30 characters"),

        body("email")
        .trim()
        .isEmail().withMessage("Please enter a valid email address")
        .notEmpty().withMessage("Email is required"),

        body("password")
        .notEmpty().withMessage("password is required")
        .isLength({min:8}).withMessage("Password cann't be less than 8 characters")

        
    ]

}

const userLoginValidator =()=>{
    return [
        body('email')
        .notEmpty().withMessage("Please enter your email address")
        .isEmail().withMessage("Not a valid email address"),

        body("password")
        .notEmpty().withMessage("please enter your password")
    ]
}

export {userLoginValidator, userRegisterationValidator}