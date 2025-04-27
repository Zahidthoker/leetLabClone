import express from "express";
import dotenv from "dotenv"
import cookiepaser from 'cookie-parser';
import authRoute from "./routes/auth.route.js"
import problemRoutes from "./routes/problem.routes.js";

dotenv.config({
    path:'./.env',
})
const port = parseInt(process.env.PORT) || 8000;
// Note: always use parseInt() because .env variables are imported as string;
const app = express();

app.use(express.json());
app.use(cookiepaser());

app.use("/api/v1/user", authRoute) 
app.use("/api/v1/problems", problemRoutes)

app.get('/',(req,res)=>{
    res.send("hello Sir!")
    console.log("hello")
})



app.listen(port, (req, res)=>{
    console.log(`server is running on port: ${port}`)
})
