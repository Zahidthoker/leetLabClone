import {db} from "../libs/db.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userRole } from "../generated/prisma/index.js"
import dotenv from "dotenv"
dotenv.config()

const registerUser = async(req, res)=>{
    console.log("Inside registerUser controller")
    try {
        const {name, email, password} = req.body;
    
        const existingUser = await db.user.findUnique({
            where:{email:email}
        })
    
        if(existingUser){
            return res.status(400).json(new apiError(400,"User is already registered with this email address"))
        }
    
        const hashedPassword = await bcrypt.hash(password,10)
    
        const user = await db.user.create({
            data:{
            name,
            email,
            password:hashedPassword,
            role:userRole.USER
            }
        })
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'7d'})
    
        const cookieOptions={
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:1000*60*60*24*7
    
        }
    
        res.cookie('jwt',token, cookieOptions);

        res.status(200).json(new apiResponse(
            200,
            {id:user.id, name:user.name, email:user.email, role:user.role},
            "User Registration successful"
        ))
    } catch (error) {
        res.status(400).json(new apiError(400, "Error in registeration"), error, error.stack)

        
    }

}

const loginUser = async(req, res)=>{
    console.log("Inside loginUser controller")
    try {
        const {email, password} = req.body;
        const user = await db.user.findUnique({
            where:{email:email}
        })
        if(!user){
            return res.status(401).json(new apiError(401, "Invalid Email or password"))
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json(new apiError(401, "Invalid Email or password"))
        }

        const token = jwt.sign({id:user.id, name:user.name, role:user.role}, process.env.JWT_SECRET, {expiresIn:'7d'})

        const cookieOptions ={
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:1000*60*60*24*7
        }
        res.cookie('jwt',token, cookieOptions)

        res.status(200).json(new apiResponse(200,{id:user.id, name:user.name},"Login successful"))

   } catch (error) {
        return res.status(401).json(new apiError(401, "Something went wrong in LoginUser"), error, error.stack)
        
    }
}

const logoutUser = async(req, res)=>{
    console.log("Inside logoutUser controller")
    try {
        const cookieOptions={
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:1000*60*60*24*7
        }
        res.clearCookie('jwt',"", cookieOptions)

        res.status(200).json(new apiResponse(200, "User LogOut successful"))


    } catch (error) {
        return res.status(401).json(new apiError(401, "Something went wrong in Logout"), error, error.stack)
    }
}

const checkUser = async(req, res)=>{
    console.log("Inside checkUser controller")
    try {
        const id= req.user.id;
        const user = await db.user.findUnique({
            where:{id:id}
        })

        if(!user){
            return res.status(401).json(new apiError(401, "User not found")) 
        }
        
        res.status(200).json(new apiResponse(200, {
            Name:user.name,
            Email:user.email,
            Role:user.role
        }))
    } catch (error) {
        return res.status(401).json(new apiError(401, "Something went wrong in Logout"), error, error.stack)
    }
}



export {registerUser, loginUser, logoutUser, checkUser}