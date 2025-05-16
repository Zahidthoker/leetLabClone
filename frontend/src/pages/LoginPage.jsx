import React ,{useState} from "react";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import  HomePage  from "../pages/HomePage"
import AuthImagePattern from "../components/AuthImagePattern";
import {z as zod} from 'zod';
import{
    Code, Eye, EyeOff,
    Mail, User, Loader2, Lock,
    Home
} from "lucide-react";

const signInSchema = zod.object({
    email: zod.string().email("please enter a valid email address"),
    password:zod.string()
})



const LoginPage = ({setAuthUser}) => {
    const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: zodResolver(signInSchema)
    });
    const [showPassword, setShowPassword] = useState(false);  

    const Navigate = useNavigate();

    const onSubmit = async (data) =>{
        try {
            const response = await axios.post("http://localhost:8080/api/v1/user/login", 
                data,{
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }) ;
            if(response.data.statusCode === 200){
                console.log(response.data)
                setAuthUser(true)
                Navigate("/")
            }else{
                console.log("Login failed")
                setAuthUser(false)
            }

            } catch (error) {
                console.error("Error logging in: ", error)
            
        }
    }
    return (

        <div className="h-screen grid lg:grid-cols-2">
            {/* Left side Login Form */}
            <div className="flex flex-col items-center justify-center p-6 sm:-p-12">
               <div className="w-full max-w-sm space-y-8">
                 {/* Login Form title */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center justify-center gap-2 group">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                        <Code className="h-6 w-6 text-primary"/>
                        </div>
                        <h1 className="text-3xl font-bold ">Welcome!</h1>
                        <p className="text-sm text-gray-500"> Login with your email and password</p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)}className= "space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm font-medium ">Email</span>
                        </label>
                        <div className="relative ">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-base-content/40" />
                            </div>
                            <input type="text" {...register("email")} className={`input input-bordered w-full pr-4 pl-10 ${errors.email?"input-error":""}`}placeholder="Enter your email" />
                        </div>

                        {errors.email && <span className="label-text-alt text-error">{errors.email.message}</span>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm font-medium ">Password</span>
                        </label>
                        <div className="relative ">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-base-content/40" />
                            </div>
                            <input type={showPassword?"text":"password"} {...register("password")} className="input input-bordered w-full pr-4 pl-10 "placeholder="Password" />
                            <button type="button" onClick = {()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40">{showPassword? (<EyeOff className="w-5 h-5"/>):(<Eye className="w-5 h-5"/>)}</button>
                        </div>

                        {errors.email && <span className="label-text-alt text-error">{errors.email.message}</span>}
                    </div>
                            {/* Login button */}
                            <button type="submit" className="btn btn-primary w-full">Login</button>
                </form>

               
               </div>
            </div>

            {/* Right side Auth Image Pattern */}

            <AuthImagePattern
        
            title={"Welcome to our platform!"}
            subtitle={
            "Sign in to access your account and start using our services."}
        
       />

        </div>
        
    );
};

export default LoginPage;