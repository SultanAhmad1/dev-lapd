'use client';

import React, { useContext, useEffect, useState } from "react";
import { useLoginMutationHook } from "../reactquery/useQueryHook";
import { BRAND_GUID, BRAND_SIMPLE_GUID } from "@/global/Axios";
import { passwordMessageData, setLocalStorage, validatePassword } from "@/global/Store";
import HomeContext from "@/contexts/HomeContext";

export default function ConfirmPassword() 
{
    const { handleBoolean } = useContext(HomeContext)

    const [confirmObj, setConfirmObj] = useState({
        password: "",
        confirmPassword: "",
        errormessage: "",
        passwordMessage: passwordMessageData,
        passwordNotMatched: "",
    });
    

    /**
     * Handle Inputs
     */

    const handleInputs = (event) => {
        const { value, name } = event.target

        switch (name) {
            case 'password':
                setConfirmObj((prevData) => ({...prevData, [name]: value}))
                break;
            default:
                setConfirmObj((prevData) => ({...prevData, [name]: value}))
                if(confirmObj?.password !== value)
                {
                    setConfirmObj((prevData) => ({...prevData, errormessage: "Password not matched."}))
                    return
                }
                setConfirmObj((prevData) => ({...prevData, errormessage: ""}))
                break;
        }
        // setConfirmObj((prevData) => ({...prevData, [name]: value}))
    }
    /**
     * handle Mutation data
     */

    const handleConfirmPassword = (event) => {

        event.preventDefault()
        
        if (! validatePassword(confirmObj?.password)) 
        {
            setConfirmObj((prevData) => ({...prevData, errormessage: passwordNotMatched}))
            return;
        }

        const customer = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`))

        const confirmData = {
            brand: BRAND_GUID,
            phone: customer?.phone,
            customerId: customer?.id
        }

        updatePasswordMutation(confirmData)
    }

    const onSuccess = (data) => {
        setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, data?.data)
        handleBoolean(true,'isCustomerVerified')
        window.location.href = "/"
        return
    }

    const onError = (error) => {
        setConfirmObj((prevData) => ({...prevData, errormessage: "There is something went wrong!. Please refresh and try again."}))
    }

    const {mutate: updatePasswordMutation, reset, isSuccess, isLoading} = useLoginMutationHook('confirm-password', '/confirm-password', onSuccess, onError)

    useEffect(() => {
        if(isSuccess)
        {
            reset()
            return
        }
    }, [isSuccess]);
    
    return(
        <div className="form-container">
            <form className="register-form" onSubmit={handleConfirmPassword}>
                
                {
                    confirmObj.errormessage !== "" &&
                    <div className="alert-message">
                        {confirmObj?.errormessage}
                    </div>
                }

                
                <div className="form-group">
                    <label className="form-label">&nbsp; Password:</label>
                    <input type="password" className="form-input" name="password" value={confirmObj?.password} onChange={handleInputs} placeholder="Enter password..." required/>
                </div>

                <p style={{margin: "1vh"}}>
                    {confirmObj?.passwordMessage}
                </p>

                {
                    confirmObj?.passwordNotMatched !== "" &&
                    <div className="alert-message" style={{margin: "1vh"}}>
                        {confirmObj?.passwordNotMatched}
                    </div>

                }
                <div className="form-group">
                    <label className="form-label">&nbsp; Confirm Password:</label>
                    <input type="password" className="form-input" name="confirmPassword" value={confirmObj?.confirmPassword} onChange={handleInputs} placeholder="Enter password..." required/>
                </div>

                <div className="form-group">
                    <button type="submit" className="register-button" disabled={isLoading}>Sign in</button>
                </div>
            </form>
        </div>
    )
}
