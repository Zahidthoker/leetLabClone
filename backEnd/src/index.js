import express from "express";
import dotenv from "dotenv"
import cookiepaser from 'cookie-parser';
import authRoute from "./routes/auth.route.js"
import problemRoutes from "./routes/problem.routes.js";
import executeRouter from "./routes/execute.route.js";
import submissionRoute from "./routes/submission.route.js";
import playlistRoute from "./routes/playlist.route.js";
import cors from 'cors'

dotenv.config({
    path:'./.env',
})
const port = parseInt(process.env.PORT) || 8000;
// Note: always use parseInt() because .env variables are imported as string;
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json()); 
app.use(cookiepaser());

app.use("/api/v1/user", authRoute) 
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute",executeRouter)
app.use("/api/v1/submission", submissionRoute)
app.use("/api/v1/playlist",playlistRoute)

app.get('/',(req,res)=>{
    res.send("hello Sir!")
    console.log("hello")
})



app.listen(port, (req, res)=>{
    console.log(`server is running on port: ${port}`)
})
