import express from "express";
import { Router } from "express";
import { registerUser, loginUser, logoutUser, checkUser} from "../controllers/auth.controller.js";
import {userRegisterationValidator, userLoginValidator}  from "../validator/validator.index.js"
import {validate} from "../middleware/validator.middleware.js"
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(userRegisterationValidator(),validate,registerUser)

router.route('/login').post(userLoginValidator(), validate, loginUser)

router.route('/logout').get(logoutUser)

router.route('/check').get(isLoggedIn, checkUser)


export default router;