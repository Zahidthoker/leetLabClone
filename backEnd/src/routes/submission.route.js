import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { getAllSubmissionCount, getAllSubmissions, getSubmissionsForProblem } from "../controllers/submission.controller.js";

const submissionRoute = express.Router();

submissionRoute.route("/get-all-submissions").get(isLoggedIn, getAllSubmissions)
submissionRoute.route("/get-all-submissions/:problemId").get(isLoggedIn, getSubmissionsForProblem)
submissionRoute.route("/get-total-submissions").get(isLoggedIn, getAllSubmissionCount)


export default submissionRoute;