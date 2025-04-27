import {validationResult} from "express-validator"
import apiError from "../utils/apiError.js"

export const validate =(req, res, next)=>{
    const errors = validationResult(req)

    if(errors.isEmpty()){
        return next()
    }

    const extractedErrors = [];
    errors.array().map((e=>{
        extractedErrors.push({[e.path]:e.message})
    }),
);
throw new apiError(400, "Something wrong before going to controller")
}