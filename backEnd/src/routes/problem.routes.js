import express from "express"
import { isAdmin } from "../middleware/auth.middleware.js";
import { createProblem } from "../controllers/problem.controller.js";
const problemRoutes = express.Router();

problemRoutes.route('/create-problem').post(isAdmin,createProblem)


export default problemRoutes