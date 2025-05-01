import express from "express"
import { isAdmin } from "../middleware/auth.middleware.js";
import { createProblem, getAllProblems,getProblemById,updateProblem, deleteProblem, getAllProblemsSolvedByUser } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.route('/create-problem').post(isAdmin,createProblem)

problemRoutes.route('/get-all-problems').get(getAllProblems)

problemRoutes.route('/get-problem/:id').get(getProblemById)

problemRoutes.route('/update-problem/:id').put(isAdmin, updateProblem)

problemRoutes.route('/delete-problem/:id').delete(isAdmin, deleteProblem)

problemRoutes.route('/get-all-problems-solved-by-user').get(getAllProblemsSolvedByUser)
export default problemRoutes  