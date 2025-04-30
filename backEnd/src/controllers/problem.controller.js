import { db } from "../libs/db.js";
import { getJudge0LanguageId } from "../libs/judge0.lib.js";
import apiError from "../utils/apiError.js";
import { submitBatch, pollBatchResults } from "../libs/judge0.lib.js";



const createProblem = async(req, res)=>{
    
    const {title, description, difficulty, tags, examples, constraints, testCases, codeSnippets, refrenceSolution}= req.body;
    
    try {
        for(const [language, solutionCode] of Object.entries(refrenceSolution)) {
            const languageId = getJudge0LanguageId(language);
    
            if(!languageId){
                return res.status(400).json(new apiError(400,`Language ${language} is not supported`));
            }
    
            const submissions = testCases.map(({ input, expectedOutput }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: expectedOutput,
            }));
    
            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for(let i = 0; i < results.length; i++) {
                const result = results[i];
                if(result.status.id !== 3) {
                    return res.status(400).json(new apiError(400,`Test case ${i+1} failed for language ${language}`));
                }
            }
        }
    
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testCases,
                codeSnippets,
                refrenceSolution,
                userId: req.user.id,
            }
        });
    
        return res.status(201).json({
            success: true,
            message:"Problem created successfully",
            data: newProblem
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json(new apiError(500, "Problem in creating code problems", error));
    }
    
}

const getAllProblems = async (req, res) => {
   try {
     const problems = await db.problem.findMany();
     if(!problems){
         return res.status(404).json(new apiError(404, "No problems found"));
     }
     return res.status(200).json({
         success: true,
         data: problems
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json(new apiError(500, "Problem in getting problems", error));
    
   }
};

const getProblemById = async (req, res) => {
try {
        const {id} = req.params;
    
        if(!id){
            return res.status(400).json(new apiError(400, "Problem id is required"));
        }
    
        const problem = await db.problem.findunique({
            where:{
                id
            }
        });
    
        if(!problem){
            return res.status(404).json(new apiError(404, "Problem not found"));
        }
    
        return res.status(200).json({
            success: true,
            data: problem
        });
} catch (error) {
    console.error(error);
    return res.status(500).json(new apiError(500, "Problem in getting problem", error));
}
};

const updateProblem = async (req, res) => {
    const {title, description, difficulty, tags, examples, constraints, testCases, codeSnippets, refrenceSolution}= req.body;

    const {id} = req.params;
    if(!id){
        return res.status(400).json(new apiError(400, "Problem id is required"));
    }

    try {
       for (const [language, solutionCode] of Object.entries(refrenceSolution)){
        const languageId = getJudge0LanguageId(language);
        if(!languageId){
            return res.status(400).json(new apiError(400,`Language ${language} is not supported`));
        }

        const submissiosn = testCases.map(({input,expectedOutput}) =>({
            source_code:solutionCode,
            language_id:languageId,
            stdin:input,
            expected_output:expectedOutput,

        }));

        const submissionResults =await submitBatch(submissiosn);
        
        const tokens = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(tokens);
        for(let i = 0; i < results.length; i++){
            const result = results[i];;
            if(result.status.id !== 3){
                return res.status(400).json(new apiError(400,`Test case ${i+1} failed for language ${language}`));
            }
        }

       }
       
       const updateProblem = await db.problem.update({
        where:{
            id
        }
       });

       return res.status(200).json({
           success: true,
           message: "Problem updated successfully",
           data: updatedProblem
       });

    } catch (error) {
        console.error(error);
        return res.status(500).json(new apiError(500, "Problem in updating problem", error));   
        
    }
};

const deleteProblem = async (req, res) => {
try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json(new apiError(400, "Problem id is required"));
        }
    
        const problem = await db.problem.findunique({
            where:{
                id
            }
        });
    
        if(!problem){
            return res.status(404).json(new apiError(404, "Problem not found"));
        };
    
        if(problem.userId !== req.user.id){
            return res.status(403).json(new apiError(403, "You are not authorized to delete this problem"));
        };
    
        await db.problem.delete({
            where:{
                id
            }
        });
    
        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully"
        });
} catch (error) {
    console.error(error);
    return res.status(500).json(new apiError(500, "Problem in deleting problem", error));
    
}
};

const getAllProblemsSolvedByUser = async (req, res) => {};


export {createProblem, getAllProblems, getProblemById, updateProblem, deleteProblem, getAllProblemsSolvedByUser};