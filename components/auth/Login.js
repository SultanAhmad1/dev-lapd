"use client";
import HomeContext from "@/contexts/HomeContext";
import { setLocalStorage, validatePhoneNumber } from "@/global/Store";
import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";


import { useLoginMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_GUID, BRAND_SIMPLE_GUID, IMAGE_URL_Without_Storage} from "@/global/Axios";
import ForgetPassword from "../forgetpassword/ForgetPassword";
import { ContextCheckApi } from "@/app/layout";

export default function Login() 
{
    const { brandLogo , handleBoolean, websiteModificationData} = useContext(HomeContext);

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
    
    const { setMetaDataToDisplay} = useContext(ContextCheckApi)

    useEffect(() => {
        if(websiteModificationData)
        {
            const metaHeadingData = {
                title: websiteModificationData?.brand?.name,
                contentData: websiteModificationData?.brand?.name,
                iconImage: IMAGE_URL_Without_Storage+"/"+websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon,
                singleItemsDetails: {
                title: "",
                description: "",
                itemImage: "",
                keywords: "",
                url: ""
            }
        }
        setMetaDataToDisplay(metaHeadingData)
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
                const {countryCode, localNumber} = validPhoneNumber(userPhone)
    
                sendUserDetails = `0${localNumber}`
            }
        }

        const storeDetails = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
            
        const loginData = {
            brand: BRAND_GUID,
            location: storeDetails?.display_id,
            userEmail: userEmail,
            userPhone: userPhone,
            userPassword: userPassword,
        }

        loginMutation(loginData)
    }

    const onLoginSuccess = (data) => {
        setLocalStorage(`${BRAND_SIMPLE_GUID}tempcustomer`, data?.data?.data?.customer)
    
        setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, data?.data)
        handleBoolean(true,'isCustomerVerified')
        window.location.href = "/"
        return
    }

    const onLoginError = (error) => {
        setLoginObj((prevData) => ({...prevData, isAnyError: true}) )

    }

    const {mutate: loginMutation, isSuccess, isLoading, isError, reset} = useLoginMutationHook('website-login', '/website-login', onLoginSuccess, onLoginError)

    useEffect(() => {
      const confirmedPassword = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}confirmedcode`))

      if(confirmedPassword !== null && confirmedPassword !== undefined)
      {
        if(confirmedPassword)
        {
            setLoginObj((prevData) => ({...prevData, isForgetPasswordClicked: true}))
            return
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
                                <input type="email" className="form-input" name="userEmail" value={loginObj?.userEmail} onChange={handleInput} required/>
                            </>
                        :
                            <>
                                <label className="form-label">&nbsp;Enter Phone Number:</label>
                                <input type="number" className="form-input" name="userPhone" value={loginObj?.userPhone} onChange={handleInput} required/>
                            </>
                    }
                    </div>

                    <div className="form-group">
                        <label className="form-label">&nbsp; Password:</label>
                        <input type="password" className="form-input" name="userPassword" value={loginObj?.userPassword} onChange={handleInput} required/>
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
                            Login my data
                        </button>
                    </div>
                    <a href='/registeration' className="register-account">Register Account!.</a>
                </form>
        }
        </Fragment>
    )
}
