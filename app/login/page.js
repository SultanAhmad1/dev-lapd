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

const validPhoneNumber = (phone) => {
    if (phone.startsWith('+44')) {
        return {
          countryCode: +44,
          localNumber: phone.substring(3), // Remove the first 3 characters (+44)
        };
    }
    else if(phone.startsWith('0'))
    {
        return{
            countryCode: 0,
            localNumber: phone.substring(3)
        }
    }
    else if(!phone.startsWith('0') || phone.startsWith('+44'))
    {
        return{
            countryCode: 0,
            localNumber: phone.substring(3)
        }
    }
}
