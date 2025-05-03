import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }
    return languageMap[language] || 63;
}


//axios = easier way to make API calls in JavaScript. More features, better error handling than fetch. unlike fetch, axios automatically converts reponse data to JSON. AND automatically handles headers and cookies.
export const submitBatch = async(submissions)=>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {submissions})
    
    return data;

}


export const pollBatchResults = async (token) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:token.join(","),
                base64_encoded:false,
            }
        })

        
        const results = data.submissions;
        const isAllDone = results.every((results)=>results.status.id!== 1 && results.status.id!==2);

        if(isAllDone){
            return results;
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
    }
    
}

