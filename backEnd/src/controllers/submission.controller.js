import { db } from "../libs/db.js";
import apiError from "../utils/apiError.js";

export const getAllSubmissions = async (req, res)=>{
    const userId = req.user.id;
    try {
        const submission = await db.submission.findMany({
            where:{
                userId
            }
        })
        return res.status(200).json({
            success:true,
            message:"Retreived all submissions successfully",
            submission
        })
    } catch (error) {
        res.status(501).json(new apiError(501,"Error in getting the submissions", error))
    }
}

export const getSubmissionsForProblem = async (req, res)=>{
    const userId = req.user.id;
    const problemId = req.params.problemId;

    try {
        const submission = await db.submission.findMany({
            where:{
                userId,
                problemId,
            }
        })
        return res.status(200).json({
            success:true,
            message:"Retreived all problem submissions successfully",
            submission
        })

    } catch (error) {
        res.status(501).json(new apiError(501,"Error in getting the submissions", error));
    }
}

export const getAllSubmissionCount = async (req, res)=>{
    const problemId = req.user.problemId

    try {
        const submissionCount = await db.submission.count({
            where:{
                problemId
            }
        })
        return res.status(200).json({
            success:true,
            message:"Submission count done",
            count:submissionCount
        })

    } catch (error) {
        res.status(501).json(new apiError(501,"Error in getting the submissions", error));  
    }
}



