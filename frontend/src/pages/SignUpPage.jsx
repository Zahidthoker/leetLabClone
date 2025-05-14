import React, {useState} from "react";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { Link } from "react-router-dom";
import {z as zod} from 'zod';
import {
    Code, Eye, EyeOff,
    Mail, User, Loader2, Lock
} from "lucide-react";

const signUpSchema = zod.object({
    email: zod.string().email("Please enter a valid email address"),
    password: zod.string().min(6,"Password must be at least 6 characters"),
    username: zod.string().min(3,"Username must be at least 3 characters"),
});

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const{register, handleSubmit, formState:{errors}} = useForm({
        resolver: zodResolver(signUpSchema)
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="h-screen grid lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-6 sm:-p-12">
                <div className="w-full max-w-sm space-y-8">
                    {/*  Logo here */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-x1 bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                            <Code className="w-6 h-6 text-primary" />

                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Sign Up to your account</p>

                        </div>

                    </div>
                    {/* Form here  */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Code className="w-5 h-5 text-base-content/40" />                                   
                                </div>
                                <input type="text" {...register("username")} placeholder="Username" className={`input input-bordered w-full pl-10 ${errors.name?"input-error":""}`}/>

                            </div>
                            {errors.name && ( <p className="text-red-500 text-sm mt-1">{errors.name.message}</p> )}
                            
                        </div>

                        {/* email */}
                        <div className="form-control">
                            <label className="label" >
                                <span className="label-text-alt font-medium ">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Code className="w-5 h-5 text-base-content/40"></Code>
                                </div>
                                <input type="text" {...register("email")} placeholder="Email" className="input input-bordered w-full pl-10" />
                            </div>
                        </div>

                        {/* password */}

                        <div className="form-control">
                            <label className="label"> Password</label>
                            <div className="relative ">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Code className="w-5 h-5 text-base-content/40"></Code>
                                </div>
                                <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="password" className={`input input-bordered w-full pl-10 ${errors.password? "input-error":""}` } />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40" onClick={()=>setShowPassword(!showPassword)}>
                                {showPassword? (<EyeOff className="w-5 h-5"/>):(<Eye className="w-5 h-5"/>)}</button>
                            </div>
                            {errors.password && ( <p className="text-red-500 text-sm mt-1">{errors.password.message}</p> )}
                        </div>

                                    {/* Submit Button */}
                        <button
                        type="submit"
                        className="btn btn-primary w-full"
                        // disabled={isSigninUp}
                        >Signup
                        {/* {isSigninUp ? (
                            <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading...
                            </>
                        ) : (
                            "Sign in"
                        )} */}
                        </button>
                    </form>
                    {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

       {/* Right Side - Image/Pattern */}
      
    </div>
  );
};


export default SignUpPage;