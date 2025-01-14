'use client';

import AuthHeader from "@/components/authheader/AuthHeader";
import CustomerRegisteration from "@/components/registeration/CustomerRegisteration";

export default function page() 
{

    return(
        <div className="form-container">
            <div className="register-header">
                <AuthHeader />
                <div className="others"></div>
            </div>
            
           <CustomerRegisteration />
        </div>
    )
}

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
};

const formatPhoneNumber = (number) => {
    // Ensure the number is treated as a string
    const numStr = number.toString();

    // Check if the first character is '0', if not, prepend '0'
    if (numStr[0] !== '0') {
      return '0' + numStr;
    }
    return numStr;
  };

