import { getJudge0LanguageId, getJudge0Language, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import apiError from "../utils/apiError.js";
import {db} from "../libs/db.js"

export const executeCode = async (req, res) => {

    const {sourceCode, languageId, stdin, expectedOutput,problemId} = req.body;
    const {id:userId} = req.user;
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
            stdin,
            expected:expected_output,
            stderr:result.stderr || null,
            compile_output: result.compile_output || null,
            status:result.status.description,
            memory: parseInt(result.memory) || 0,
            time:parseFloat(result.time) ||0
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
        user: {
            connect: { id: userId } 
            },
        problem:{
            connect:{id: problemId}
        },
        sourceCode,
        language:getJudge0Language(languageId),
        stdin:stdin.join("\n"),
        stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
        stderr:detailedResults.map((r)=>r.stderr)?JSON.stringify(detailedResults.map((r)=>r.stderr)):null,
        compiledOutput:detailedResults.map((r)=>r.compile_output)?JSON.stringify(detailedResults.map((r)=>r.compile_output)):null,
        status:allPassed?"Accepted":"Wrong answer",
        memoryUsed: Math.max(...detailedResults.map((r) => parseInt(r.memory) || 0)), // Parse memory as integer
        timeTaken: Math.max(...detailedResults.map((r) => parseFloat(r.time) || 0)), // Parse time as float

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


       const testCaseResults = detailedResults.map((result)=>({
        submissionId: submission.id,
        testCaseIndex:result.testCase,
        passed:result.passed,
        input:JSON.stringify(result.stdin),
        actualOutput:result.stdout,
        expectedOutput: result.expected,
        stderr: result.stderr,
        compiledOutput: result.compile_output,
        status:result.status,
        memoryUsed: result.memory,
        timeTaken:result.time,

       }))

       await db.testCaseResult.createMany({
        data:testCaseResults
       })


       const  submissionWithTestCase = await db.submission.findUnique({
        where:{
            id:submission.id
        },
        include:{
            testcases:true
        }
       })
       res.status(200).json({
        success:true,
        message:"Code executed successfully",
        submission:submissionWithTestCase
    })
    } catch (error) {
        console.error("Error executing codee:", error);
        return res.status(500).json(new apiError(500, "Internal server error", error.message));
        
    }

}