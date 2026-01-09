"use client";
import HomeContext from "@/contexts/HomeContext";
// import { setLocalStorage } from "@/global/Store";
import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";

import { useLoginMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_GUID, BRAND_SIMPLE_GUID, IMAGE_URL_Without_Storage} from "@/global/Axios";
import ForgetPassword from "../forgetpassword/ForgetPassword";
import { ContextCheckApi } from "@/app/layout";


function validatePhoneNumber(phoneNumber) {
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');

    // Add '0' if the number doesn't start with it and isn't already prefixed with '+44'
    if (!phoneNumber.startsWith('0') && !phoneNumber.startsWith('+44')) {
        formattedPhone = '0' + phoneNumber;
    } else if (phoneNumber.startsWith('+44')) {
        // Convert '+44' to '0'
        formattedPhone = '0' + phoneNumber.slice(3);
    }

    // Return the formatted phone number
    return formattedPhone;
}


export default function Login() 
{
    const homeContext = useContext(HomeContext) || {};
    const { brandLogo , handleBoolean, websiteModificationData} = homeContext

    const [isHover, setIsHover] = useState(false);
    
    const [loginObj, setLoginObj] = useState({
        userEmail: "",
        userPhone: "",
        userPassword: "",
        optionalText: "Phone number",
        isAnyError: false,
        isBtnClickAble: true,
        isLoginOptionClicked: true,
        isForgetPasswordClicked: false,
    });
    
    
    const contextApi = useContext(ContextCheckApi) || {};
    const { setMetaDataToDisplay } = contextApi;

    
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

    useEffect(() => {
        if(websiteModificationData)
        {
            setMetaDataToDisplay((prevData) => ({
                ...prevData,
                title: `Login - ${websiteModificationData?.brand?.name}`,
                contentData: "",
            }))
        }
    }, [websiteModificationData]);

    const handleInput = useCallback((event) => {
        const { value, name } = event.target
        setLoginObj((prevData) => ({...prevData, [name]: value, isBtnClickAble: false}))
    },[])

    const handleOptionalBtnClicked = () => {
        setLoginObj((prevData) => ({...prevData, isLoginOptionClicked: !prevData.isLoginOptionClicked, optionalText: !prevData.isLoginOptionClicked === false ? "Email": "Phone number"}))
    }

    const handleForgetPasswordClicked = () => {
        setLoginObj((prevData) => ({...prevData, isForgetPasswordClicked: !loginObj?.isForgetPasswordClicked}))
    }

    const handleLogin = (event) => {
        event.preventDefault()

        const { userEmail, userPhone, userPassword } = loginObj

        if(loginObj?.isLoginOptionClicked)
        {
            if(! userEmail || ! userPassword)
            {
                setLoginObj((prevData) => ({...prevData, isAnyError: true, isBtnClickAble: true}))
                return
            }
        }
        else    
        {
            if(! userPhone || ! userPassword)
            {
                setLoginObj((prevData) => ({...prevData, isAnyError: true, isBtnClickAble: true}))
                return
            }

            if(validatePhoneNumber(userPhone) !== undefined)
            {
                // const {countryCode, localNumber} = validPhoneNumber(userPhone)
    
                // let sendUserDetails = `0${localNumber}`
            }
        }

        if(typeof window !== "undefined")
        {
            const storeDetails = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
            
            if(storeDetails)
            {
                const loginData = {
                    brand: BRAND_GUID,
                    location: storeDetails?.display_id,
                    userEmail: userEmail,
                    userPhone: userPhone,
                    userPassword: userPassword,
                }
        
                loginMutation(loginData)
                return
            }
            window.location.href = "/"
            return
        }
    }

    const onLoginSuccess = (data) => {
        if (typeof window !== "undefined") 
        {
            // setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, data?.data?.data?.customer)
        
            // setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, data?.data)

            window.localStorage.setItem(`${BRAND_SIMPLE_GUID}tempCustomer`, data?.data?.data?.customer)
            window.localStorage.setItem(`${BRAND_SIMPLE_GUID}websiteToken`, data?.data)

            handleBoolean(true,'isCustomerVerified')
            window.location.href = "/"
            return
        }
    }

    const onLoginError = (error) => {
        setLoginObj((prevData) => ({...prevData, isAnyError: true}) )

    }

    const {mutate: loginMutation, isSuccess, isLoading, isError, reset} = useLoginMutationHook('website-login', '/website-login', onLoginSuccess, onLoginError)

    useEffect(() => {
        if (typeof window !== "undefined") 
        {
            const confirmedPassword = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}confirmedcode`))
    
            if(confirmedPassword !== null && confirmedPassword !== undefined)
            {
                if(confirmedPassword)
                {
                    setLoginObj((prevData) => ({...prevData, isForgetPasswordClicked: true}))
                    return
                }
            }
        }
    }, []);

    return(
        <Fragment>
        {
            loginObj?.isForgetPasswordClicked ?
                <ForgetPassword />
            :
                <form className="login-form" onSubmit={handleLogin}>
                    
                    {
                        loginObj.isAnyError &&
                        <div className="form-group">
                            <p className="alert-message">
                                Email or password need to be filled.
                            </p>
                        </div>
                    }
                    
                    <div className="form-group">

                    {
                        loginObj?.isLoginOptionClicked ?
                            <>
                                <label className="form-label">&nbsp; Enter Email Address:</label>
                                <input type="email" className="text-[16px] form-input" name="userEmail" value={loginObj?.userEmail} onChange={handleInput} required/>
                            </>
                        :
                            <>
                                <label className="form-label">&nbsp;Enter Phone Number:</label>
                                <input type="number" className="text-[16px] form-input" name="userPhone" value={loginObj?.userPhone} onChange={handleInput} required/>
                            </>
                    }
                    </div>

                    <div className="form-group">
                        <label className="form-label">&nbsp; Password:</label>
                        <input type="password" className="text-[16px] form-input" name="userPassword" value={loginObj?.userPassword} onChange={handleInput} required/>
                    </div>

                    <button type="button" className="forget-password" onClick={handleForgetPasswordClicked}>Forget Password?.</button>
                    <br></br>
                    <button type="button" className="optional-button" onClick={handleOptionalBtnClicked}>Login with {loginObj?.optionalText}?.</button>
                    <br></br>

                    <div className="form-group">
                        <button 
                                type="submit" 
                                className="login-button" 
                                style={{
                                    background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                    color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                    border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                                }} 
                                onMouseEnter={() => setIsHover(true)} 
                                onMouseLeave={() => setIsHover(false)} 
                            >
                            Login
                        </button>
                    </div>
                    <a href='/register' className="register-account">Register Account!.</a>
                </form>
        }
        </Fragment>
    )
}
