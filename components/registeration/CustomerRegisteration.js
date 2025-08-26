"use client";
import React, { useContext, useEffect, useState } from "react";
import OTP from "../otp/OTP";
import { useLoginMutationHook } from "../reactquery/useQueryHook";
import { BLACK_COLOR, BRAND_GUID, BRAND_SIMPLE_GUID, HOVER_COLOR, IMAGE_URL_Without_Storage, WHITE_COLOR } from "@/global/Axios";
import { formatPhoneNumber, passwordMessageData, setLocalStorage, validatePassword } from "@/global/Store";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";

export default function CustomerRegisteration() 
{

    const {websiteModificationData} = useContext(HomeContext)

       
    const { setMetaDataToDisplay} = useContext(ContextCheckApi)
    useEffect(() => {
        if(websiteModificationData)
        {
            setMetaDataToDisplay((prevData) => ({
                ...prevData,
                title: `Registeration - ${websiteModificationData?.brand?.name}`,
                contentData: "",
            }))
        }
    }, [websiteModificationData, setMetaDataToDisplay]);

    const [isHover, setIsHover] = useState(false);
    
    const [errorsObj, setErrorsObj] = useState({
        errormessage:"",
        passwordMessage: "",
        confirmMessage: "",
    });

    const [registerationBoolean, setRegisterationBoolean] = useState({
        isOTPReady: false,
    });

    const [registerationObj, setRegisterationObj] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    });
    
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const handleBack = () => {
        setRegisterationBoolean((prevData) => ({...prevData, isOTPReady: !registerationBoolean.isOTPReady}))
    }

    const handleInputs = (event) => {
        const { value, name } = event.target

        // setRegisterationObj((prevData) => ({...prevData, [name]: value}))
        switch (name) {
            case 'password':
                setRegisterationObj((prevData) => ({...prevData, [name]: value}))
                break;
            case 'phone':
                let input = value;
                // input = `0${input}`;

                input = input.replace(/\D/g, '');

                // Add '0' at the start of the number if it's not already present
                if (input.length > 0 && input[0] !== '0') {
                  input = '0' + input;
                }
                
                setRegisterationObj((prevData) => ({...prevData, [name]: input}))
                break;
            default:
                setRegisterationObj((prevData) => ({...prevData, [name]: value}))
                break;
        }
        
    }

    const handleConfirmPassword = (event) => 
    {
        const { value } = event.target
        setConfirmPassword(value)
        if(registerationObj?.password !== value)
        {
            setErrorsObj((prevData) => ({...prevData, confirmMessage: "Password not matched!."}))
            return
        }

        setErrorsObj((prevData) => ({...prevData, confirmMessage: ""}))
    }
    
    const handleRegisteration = (e) => {
        e.preventDefault();

        const { firstName, lastName, email, phone, password} = registerationObj

        if(! firstName || ! lastName || ! email || ! phone || ! password || ! confirmPassword)
        {
            setErrorsObj((prevData) => ({...prevData, errormessage: 'Some fields need to filled.'}))
            return
        }
        
        // Check if password is valid
        
        if (! validatePassword(registerationObj?.password)) 
        {
            setErrorsObj((prevData) => ({...prevData, passwordMessage: passwordMessageData}))
            return;
        }

        if(registerationObj.password !== confirmPassword)
        {
            setErrorsObj((prevData) => ({...prevData, confirmMessage: "Password does not matched"}))
        }
        // If validation passes, proceed with submission
            
        setErrorsObj((prevData) => ({...prevData, passwordMessage: "", confirmMessage: "", errormessage: ""}))

        const selectedRegistered = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))

        const customerAddress = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`))

        // check the first index is zero or not.

        const formattedNumber = formatPhoneNumber(phone);

        const registerData = {
            brand: BRAND_GUID,
            location: selectedRegistered?.display_id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: formattedNumber,
            password: password,
            postcode: customerAddress?.ukpostcode?.postcode,
        }

        registerMutation(registerData)
    };

    const onSuccess = (data) => {
        setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, data?.data?.data?.customer)
        setLocalStorage(`${BRAND_SIMPLE_GUID}isOTPHas`, true)
        setRegisterationBoolean((prevData) => ({...prevData, isOTPReady: !registerationBoolean.isOTPReady}))
    }
    
    const onError = (error) => {
        const { response } = error
        setErrorsObj((prevData) => ({...prevData, errormessage: response?.data?.message}))
    }

    const {mutate: registerMutation, isSuccess, isLoading, isError, reset} = useLoginMutationHook('website-register','/website-register',onSuccess, onError)

    /** Verify OTP Code. */

    /**
     * Perform all useEffect here
     */

    useEffect(() => {
        const isReadyOTP = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}isOTPHas`))

        if(isReadyOTP !== null && isReadyOTP !== undefined)
        {
            setRegisterationBoolean((prevData) => ({...prevData, isOTPReady: true}))
            return
        }
    }, []);

    useEffect(() => {
      if(isSuccess)
      {
        reset()
      }
    }, [isSuccess,reset]);

    return(
        <>
            {
                registerationBoolean?.isOTPReady ?

                    <div className="otp-div">
                        <OTP {...{handleBack}}/>
                    </div>
                :
                    <>
                        <form className="register-form" onSubmit={handleRegisteration}>
                            
                            {
                                errorsObj?.errormessage !== "" &&
                                <div className="alert-message">
                                    {errorsObj?.errormessage}
                                </div>
                            }

                            <div className="form-group">
                                <label className="form-label">&nbsp; First Name:</label>
                                <input type="text" className="form-input" name="firstName" value={registerationObj?.firstName} onChange={handleInputs} placeholder="Enter first name..."/>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">&nbsp; Last Name:</label>
                                <input type="text" className="form-input" name="lastName" value={registerationObj?.lastName} onChange={handleInputs} placeholder="Enter last name..."/>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">&nbsp; Email:</label>
                                <input type="email" className="form-input" name="email" value={registerationObj?.email} onChange={handleInputs} placeholder="Enter email address.." required/>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">&nbsp; Phone:</label>
                                <input type="number" className="form-input" name="phone" value={registerationObj?.phone} placeholder="Enter phone number..." onChange={handleInputs} required/>
                            </div>

                            {
                                errorsObj.passwordMessage !== "" &&
                                <div className="alert-message">
                                    {errorsObj.passwordMessage}
                                </div>
                            }

                            <div className="form-group">
                                <label className="form-label">&nbsp; Password:</label>
                                <input type="password" className="form-input" name="password" value={registerationObj?.password} onChange={handleInputs} placeholder="Enter password..."/>
                            </div>

                            <p style={{margin: "1vh"}}>
                                {passwordMessageData}
                            </p>

                            {
                                errorsObj.confirmMessage !== "" &&
                                <div className="alert-message">
                                    Password not matched.
                                </div>
                            }
                            <div className="form-group">
                                <label className="form-label">&nbsp; Confirm Password:</label>
                                <input type="password" className="form-input" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPassword} placeholder="Enter password..."/>
                            </div>

                            {
                                errorsObj?.errormessage !== "" &&
                                <div className="alert-message">
                                    {errorsObj?.errormessage}
                                </div>
                            }

                            <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="register-button"
                                    style={{
                                        background: isHover ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || HOVER_COLOR
                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR
                                        ,
                                        color: isHover ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || WHITE_COLOR
                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
                                        ,
                                        border: isHover ? 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR}` 
                                        : 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || BLACK_COLOR}`
                                        ,
                                    }} 
                                    onMouseEnter={() => setIsHover(true)} 
                                    onMouseLeave={() => setIsHover(false)} 
                                >
                                    Sign Up
                                </button>
                            </div>

                    
                            <div className="already-have-account" style={{height: "20vh", margin: "10px"}}>
                                <p>
                                    Already have account?. &nbsp;
                                </p>
                                <a href="/login" className="sign-in-account">Sign In</a>
                            </div>
                        </form>
                    </>
            }
        </>
    )
}
