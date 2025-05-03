import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executeRouter = express.Router();

executeRouter.route("/execute-code").post(isLoggedIn, executeCode);


export default executeRouter;