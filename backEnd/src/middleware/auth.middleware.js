import jwt from "jsonwebtoken"
import apiError from "../utils/apiError.js"
import dotenv from "dotenv"
dotenv.config();

const isLoggedIn =async (req, res, next)=>{

    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(404).json(new apiError(404,"Please login first to check your profile"))
        }
    
        const isMatch = jwt.verify(token,process.env.JWT_SECRET);
        req.user = isMatch;
        next();
    } catch (error) {
        return res.status(404).json(new apiError(404),"something went wrong in middleware isloggedIn")       
    }
}

export {isLoggedIn}