import { getJudge0LanguageId, getJudge0Language, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
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


       let allPassed = true;

       const detailedResults = results.map((result, i)=>{
        const stdout = result.stdout?.trim();
        const expected_output = expectedOutput[i]?.trim();
        const passed = stdout === expected_output;

        if(!passed) allPassed = false;

        return {
            testCase:i+1,
            passed,
            stdout,
            expected:expected_output,
            stderr:result.stderr || null,
            compile_output: result.compile_output || null,
            status:result.status.description,
            memory: result.memory ? `${result.memory} KB`:undefined,
            time:result.time? `${result.time} sec`:undefined
        }
        // console.log(`Testcase #${i+1}`)
        // console.log(`Input ${stdin[i]}`)
        // console.log(`Expected_output for testcase ${expected_output}`)
        // console.log(`Actual output ${stdout}`)
        // console.log(`Matched: ${passed}`)
       })

       // store this submission result in db:

       const submission = await db.submission.create({
        data:{
            userId,
        problemId,
        sourceCode,
        language:getJudge0Language(languageId),
        stdin:stdin.join("\n"),
        stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
        stderr:detailedResults.som((r)=>r.stderr)?JSON.stringify(detailedResults.map((r)=>r.stderr)):null,
        compiledOutput:detailedResults.som((r)=>r.compile_output)?JSON.stringify(detailedResults.map((r)=>r.compile_output)):null,
        status:allPassed?"Accepted":"Wrong answer",
        memory: detailedResults.som((r)=>r.memory)?JSON.stringify(detailedResults.map((r)=>r.memory)):null,
        time:detailedResults.som((r)=>r.time)?JSON.stringify(detailedResults.map((r)=>r.time)):null,
        },

       });

       // if all passed == ture mark the problem as solved 

       if(allPassed){
        await db.problemSolved.upsert({
            where:{
                userId_problemId:{
                    userId, problemId
                }
            },
            update:{},
            create:{
                userId, problemId
            }
        })
       }

       

       res.status(200).json({
        success:true,
        message:"Code executed successfully",
    })
    } catch (error) {
        console.error("Error executing codee:", error);
        return res.status(500).json(new apiError(500, "Internal server error", error.message));
        
    }

}