import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import apiError from "../utils/apiError.js";

export const executeCode = async (req, res) => {

    const {sourceCode, languageId, stdin, expectedOutput,problemId} = req.body;
    const {userId} = req.user;

    try {
       //validate the stdin 
        
       if(
        !Array.isArray(stdin) || 
        stdin.length ===0 || 
        !Array.isArray(expectedOutput) ||
        expectedOutput.length !==stdin.length
       ){
        return res.status(400).json(new apiError(400,"Bad request: stdin and expectedOutput should be arrays of equal length",error))
        }
       const submissions = stdin.map((input)=> ({
        source_code: sourceCode,
        language_id: languageId,
        stdin:input,
       }))
       const submissionResults = await submitBatch(submissions);
       const token = submissionResults.map((res) => res.token);
       const results = await pollBatchResults(token);

       res.status(200).json({
        success:true,
        message:"Code executed successfully",
    })
    } catch (error) {
        console.error("Error executing codee:", error);
        return res.status(500).json(new apiError(500, "Internal server error", error.message));
        
    }

}