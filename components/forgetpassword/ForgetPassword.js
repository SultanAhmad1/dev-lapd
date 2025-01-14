'use client';

import React, { Fragment, useEffect, useState } from "react";
import { useLoginMutationHook } from "../reactquery/useQueryHook";
import OTP from "../otp/OTP";
import { BRAND_GUID, BRAND_SIMPLE_GUID } from "@/global/Axios";
import { setLocalStorage } from "@/global/Store";
import ConfirmPassword from "../confirmpassword/ConfirmPassword";

export default function ForgetPassword() 
{
    const [phone, setPhone] = useState("");
    
    const [forgetObj, setForgetObj] = useState({
        phone: "",
        errormessage: "",
        isOTPReady: false,
        isConfirmTrue: false,
    });
    
    const handleBack = () => {
        setForgetObj((prevData) => ({...prevData, isOTPReady: false}))
    }

    const handlePhone = (event) => {
        const { value, name } = event.target
        // input = `0${input}`;

        let input = value.replace(/\D/g, '');

        // Add '0' at the start of the number if it's not already present
        if (input.length > 0 && input[0] !== '0') {
          input = '0' + input;
        }

        setPhone(input)
        setForgetObj((prevData) => ({...prevData, [name]: value}))
    }

    const handleSend = (event) => {
        event.preventDefault()

        const forgetData = {
            brand: BRAND_GUID,
            phone: phone,
        }

        forgetMutation(forgetData)
    }

    const onForgetSuccess = (data) => {
        setLocalStorage(`${BRAND_SIMPLE_GUID}tempcustomer`, data?.data?.data?.customer)
        setForgetObj((prevData) => ({...prevData, isOTPReady: true, errormessage: ""}))
    }

    const onForgetError = (error) => {
        const { response } = error

        setForgetObj((prevData) => ({...prevData, isOTPReady: false, errormessage: response?.data?.message}))
    }

    const { mutate: forgetMutation, isLoading, isSuccess, reset} = useLoginMutationHook('forget-password', '/forget-password',onForgetSuccess, onForgetError)

    useEffect(() => {
      const confirmedCode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}confirmedcode`))

      if(confirmedCode !== null && confirmedCode !== undefined)
      {
        if(confirmedCode)
        {
            setForgetObj((prevData) => ({...prevData, isOTPReady: true ,isConfirmTrue: true}))
            return
        }
      }
    }, []);
    
    useEffect(() => {
      if(isSuccess)
      {
        reset()
        return
      }
    }, [isSuccess]);
    
    return (
        <Fragment>

            {
                forgetObj?.isOTPReady ?
                    forgetObj?.isConfirmTrue ?
                    <ConfirmPassword />
                    :
                    <OTP {...{handleBack}}/>
                :
                    <form className="login-form" onSubmit={handleSend}>
                        {
                            forgetObj?.errormessage !== "" &&
                            <div className="form-group">
                                <p className="alert-message">
                                    {forgetObj?.errormessage}
                                </p>
                            </div>
                        }       
                        
                        <div className="form-group">
                            <label className="form-label">&nbsp;Enter Phone Number:</label>
                            <input type="number" className="form-input" name="phone" value={phone} onChange={handlePhone} required/>
                        </div>

                        {/* <button type="button" className="optional-button" onClick={handleOptionalBtnClicked}>Verify with {loginObj?.optionalText}?.</button>
                        <br></br> */}

                        <div className="form-group">
                            <button type="submit" className="login-button" disabled={isLoading}>Send OTP</button>
                        </div>
                        <a href='/registeration' className="register-account">Register Account!.</a>
                    </form>
            }
            
        </Fragment>
    )
}
