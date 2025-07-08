'use client';

import Login from "@/components/auth/Login";
import AuthHeader from "@/components/authheader/AuthHeader";

export default function page() 
{
    
    return(
        <div className="form-container">
            <div className="login-header">
                <AuthHeader />
                <div className="others"></div>
            </div>
            <Login />
        </div>
    )
}

