import { BRAND_GUID, BRANDSIMPLEGUID } from "@/global/Axios";
import React, { Fragment, useEffect, useState } from "react";
import { useCheckAuthMutationHook, usePostAfterAuthMutationHook } from "../reactquery/useQueryHook";
import AccountInfo from "../accountchild/AccountInfo";
import Security from "../accountchild/Security";
import AccountOTP from "../otp/AccountOTP";
import ConfirmPassword from "../confirmpassword/ConfirmPassword";
import AddressInfo from "../accountchild/AddressInfo";

export default function Account() 
{
  const [booleanObj, setBooleanObj] = useState({
    addressInfoClicked: true,
    accountInfoClicked: false,
    securityClicked: false,
    privacyDataClicked: false,
    isPasswordUpdateClicked: false,
    isOTPSend: false,
  });
  
  const handleBooleanObj = (fieldName, isChecked) => {
    setBooleanObj((prevData) => {
      // Set all fields to false, except the one being updated
      const resetData = Object.keys(prevData).reduce((acc, key) => {
        acc[key] = key === fieldName ? isChecked : false;
        return acc;
      }, {});
  
      return resetData;
    });
  } 

  const handlePasswordUpdate = (isPasswordClicked) => {
    setBooleanObj((prevData) => ({...prevData, isPasswordUpdateClicked: isPasswordClicked, securityClicked: true, isOTPSend: true,}))

    const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

    forgetMutation({
      brand: BRAND_GUID,
      phone: customer?.phone
    })
  }
  const onForgetSuccess = (data) => {
    setLocalStorage(`${BRANDSIMPLEGUID}tempcustomer`, data?.data?.data?.customer)
  } 

  const onForgetError = (error) => {
  }

  const { mutate: forgetMutation, isLoading, isSuccess, reset} = usePostAfterAuthMutationHook('forget-password', '/forget-password',onForgetSuccess, onForgetError)

  const handleBack = (isPasswordClicked) => {
    setBooleanObj((prevData) => ({...prevData, isPasswordUpdateClicked: isPasswordClicked, securityClicked: true, isOTPSend: false}))
  }

  useEffect(() => {
    const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))
    
    if(customer === undefined && customer === null)
    {
      window.localStorage.removeItem(`${BRANDSIMPLEGUID}tempcustomer`);
      window.localStorage.removeItem(`${BRANDSIMPLEGUID}websiteToken`);
      window.location.href = '/'
      return
    }

    authMutation({
      userEmail: customer?.email,
      userPhone: customer?.phone,
    })
  }, []);
  
  const onAuthSuccess = (data) => {
  }

  const onAuthError = (error) => {
    const { response } = error

    if(response?.status === 401)
    {
      window.location.href = '/'
      return
    }
  }

  const {mutate: authMutation, isLoading: authLoading, isError: authError, isSuccess: authSuccess, reset: authReset, error, failureReason} = useCheckAuthMutationHook('check-authentication', '/check-authentication', onAuthSuccess, onAuthError)

  return(
    
    <div className="account-content">
      <div className="account-left-bar">
        <ul>
          <li><a className={`${booleanObj?.addressInfoClicked && "account-active"}`} onClick={() => handleBooleanObj("addressInfoClicked", !booleanObj?.addressInfoClicked)}>Address Info</a></li>
          <li><a className={`${booleanObj?.accountInfoClicked && "account-active"}`} onClick={() => handleBooleanObj("accountInfoClicked", !booleanObj?.accountInfoClicked)}>Account Info</a></li>
          <li><a className={`${booleanObj?.securityClicked && "account-active"}`} onClick={() => handleBooleanObj("securityClicked", !booleanObj?.securityClicked)}>Security</a></li>
          <li><a className={`${booleanObj?.privacyDataClicked && "account-active"}`} onClick={() => handleBooleanObj("privacyDataClicked", !booleanObj?.privacyDataClicked)}>Privacy & Data</a></li>
        </ul>
      </div>
      <div className="account-right-bar">
        {
          booleanObj?.addressInfoClicked &&
          <AddressInfo />
        }
        {
          booleanObj?.accountInfoClicked &&
          <AccountInfo />
        }

        {
          booleanObj.securityClicked && !booleanObj?.isPasswordUpdateClicked ?
            <Security {...{handlePasswordUpdate}}/>
          :
            booleanObj.securityClicked && booleanObj?.isPasswordUpdateClicked &&
            <Fragment>
              {
                booleanObj?.isOTPSend ?

                <AccountOTP {...{handleBack}}/>
                :
                <>
                  <div className="confirm-back-button" onClick={() => handlePasswordUpdate(!booleanObj.isPasswordUpdateClicked)}>
                    <svg 
                      fill="#000000" 
                      width="100px" 
                      height="50px" 
                      viewBox="0 0 52 52" 
                      data-name="Layer 1" 
                      id="Layer_1" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M50,24H6.83L27.41,3.41a2,2,0,0,0,0-2.82,2,2,0,0,0-2.82,0l-24,24a1.79,1.79,0,0,0-.25.31A1.19,1.19,0,0,0,.25,25c0,.07-.07.13-.1.2l-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l24,24a2,2,0,1,0,2.82-2.82L6.83,28H50a2,2,0,0,0,0-4Z"/>
                    </svg>
                  </div>
                  <ConfirmPassword />
                </>
              }
            </Fragment>
        }

        {
          booleanObj?.privacyDataClicked &&
          <div className="account-component">
            <h1>Privacy data</h1>
          </div>
        }
      </div>
  </div>
  )
}
