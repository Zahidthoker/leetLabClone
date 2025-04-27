import { db } from "../libs/db.js";
import { getJudge0LanguageId } from "../libs/judge0.lib.js";
import apiError from "../utils/apiError.js";

const createProblem = async(req, res)=>{
    const {title, description, difficulty, tags, examples, constraints, testCases, codeSnippets, refrenceSolution}= req.body;

    try {
        for(const[language, solutionCode] of Object.entries(refrenceSolution)){
            const languageId = getJudge0LanguageId(language);

            if(!languageId){
                return res.status(400).json(new apiError(400,`Language ${language} is not supported`))
            }
        }



    } catch (error) {
        return res.status(405).json(new apiError(405,"Problem in creating code problems"))
    }


}


export {createProblem};