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
    
        // 🛑 MOVE save OUTSIDE the loop
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
    
        return res.status(201).json(newProblem);
    
    } catch (error) {
        console.error(error);
        return res.status(500).json(new apiError(500, "Problem in creating code problems", error));
    }
    
}
export {createProblem};