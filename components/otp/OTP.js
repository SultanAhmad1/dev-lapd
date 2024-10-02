
"use client";

import HomeContext from "@/contexts/HomeContext";
import { useContext, useEffect, useState } from "react";
import { usePostMutationHook, useVerifyOTP } from "../reactquery/useQueryHook";
import { BRAND_GUID, BRANDSIMPLEGUID } from "@/global/Axios";
import { setLocalStorage } from "@/global/Store";

export default function OTP({handleBack}) 
{

    const { handleBoolean } = useContext(HomeContext)

    const [errormessage, setErrormessage] = useState("");
    
    const [counter, setCounter] = useState(60); // Initial value set to 60 seconds
    const [canResend, setCanResend] = useState(false);
    const [customer, setCustomer] = useState(null);
    
    const [inputValues, setInputValues] = useState({
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
      input6: '',
      // Add more input values here
    });

    const [maskedPhoneNumber, setMaskedPhoneNumber] = useState("");

    /**
     * Handle all inputs requests and other methods.
     */

    const handleInputChange = (inputId, value) => {
        setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [inputId]: value,
        }));
    };


    /**
     * 
     * Here all POST, GET, PUT, DELETE Requests
     */
    const handleSubmit = (e) => {
        // ... Your submit logic here
        e?.preventDefault()
        // declare

        if(counter === 0)
        {
            setErrormessage("OTP code has been expired.")
            return
        }

        const otpCode = Object.values(inputValues).join('')
        
        const customerData = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

        const otpData = {
            customerId: customerData?.id,
            otpCode: otpCode
        }
        //return  
        OTPMutation(otpData)
    };

    const onOTPError = (error) => {
        const { response } = error

        setErrormessage(response?.data?.message)
    }

    const url = new URL(window.location.href);
    var pathnameArray = url.pathname.split("/").filter(segment => segment);
    
    const onOTPSuccess = (data) => {
        
        setLocalStorage(`${BRANDSIMPLEGUID}websiteToken`, data?.data)
        handleBoolean(true,'isCustomerVerified')
        if(pathnameArray.includes('registeration'))
        {
            window.location.href = "/account"
            return
        }
        else if(pathnameArray.includes('login'))
        {
            setLocalStorage(`${BRANDSIMPLEGUID}confirmedcode`, true)
            window.location.href = '/login'
            return
        }
    }

    const {mutate: OTPMutation, isLoading: OTPLoading, isError: OTPError, isSuccess: OTPSuccess, reset: OTPReset} = useVerifyOTP('matchOTPCode', '/verify-otp-code', onOTPSuccess, onOTPError)

    /**
     * resend the OTP code to end user.
    */
    const handleResend = () => {
        // Resend logic here
        setCounter(60); // Reset the time to 0 to allow immediate resend
        setCanResend(false);
        setErrormessage("")

        const customerData = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

        const resendData = {
            brand: BRAND_GUID,
            customerId: customerData?.id,
        }

        resendMutation(resendData)
    };

    const onResendSuccess = (data) => {}

    const onResendError = (error) => {}

    const {mutate: resendMutation, isLoading:resendLoading, isError: resendError, isSuccess: resendSuccess, reset: resendReset} = usePostMutationHook('resend','/website-resend-otp-code', onResendSuccess, onResendError)

    /**
     * useEffect will be performed here
     */

    useEffect(() => {
        const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))
        
        
        
        if(customer !== null && customer !== undefined)
        {
            setCustomer(customer)
            if (customer?.phone.length > 4) {
                const masked = '*'.repeat(customer?.phone.length - 4) + customer?.phone.slice(-4);
                setMaskedPhoneNumber(masked);
            }
        }

        const otpExpired = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}otpexpired`))
        
        if((otpExpired !== null && otpExpired !== undefined) && otpExpired)
        {
            setCounter(60)
            setCanResend(true);
            setErrormessage("")
            setLocalStorage(`${BRANDSIMPLEGUID}otpexpired`, false)
            setInputValues((prevData) => ({
                ...prevData,
                input1: '',
                input2: '',
                input3: '',
                input4: '',
                input5: '',
                input6: '',
            }))
            return
        }

    }, []);
    
    useEffect(() => {
        // if(
        //   parseInt(inputValues?.input1.length) === parseInt(0) ||
        //   parseInt(inputValues?.input2.length) === parseInt(0) ||
        //   parseInt(inputValues?.input3.length) === parseInt(0) ||
        //   parseInt(inputValues?.input4.length) === parseInt(0) ||
        //   parseInt(inputValues?.input5.length) === parseInt(0) ||
        //   parseInt(inputValues?.input6.length) === parseInt(0)
        // )
        // {
          if (counter === 0) {
            setCanResend(true);
            setLocalStorage(`${BRANDSIMPLEGUID}otpexpired`, true)
            setErrormessage("OTP code has been expired.")
            return;
          }
      
          const timer = setInterval(() => {
            setCounter((prev) => prev - 1);
          }, 1000);
          return () => clearInterval(timer);
        // }
    
      }, [counter]);

    return(
        <div className="otp-container">
            <h1 className="otp-title">Welcome, {customer?.first_name} {customer?.last_name}</h1>
            <p className="otp-notification">
                Enter the 6-digit code sent to you at:<br></br>
                {maskedPhoneNumber}
            </p>

            <form>
                {
                    errormessage !== "" &&
                    <div className="alert-message" style={{marginBottom: "20px"}}>
                        {errormessage}
                    </div>
                }
                <div id='OTPInputGroup' className="digitGroup" data-autosubmit="true">
                    <OTPInput
                        id="input1"
                        value={inputValues.input1}
                        onValueChange={handleInputChange}
                        previousId={null}
                        handleSubmit={handleSubmit}
                        nextId="input2"
                    />
                    <OTPInput
                        id="input2"
                        value={inputValues.input2}
                        onValueChange={handleInputChange}
                        previousId="input1"
                        handleSubmit={handleSubmit}
                        nextId="input3"
                    />
                    <OTPInput
                        id="input3"
                        value={inputValues.input3}
                        onValueChange={handleInputChange}
                        previousId="input2"
                        handleSubmit={handleSubmit}
                        nextId="input4"
                    />
                    {/* Seperator */}

                    <span className="splitter">&ndash;</span>
                    <OTPInput
                        id="input4"
                        value={inputValues.input4}
                        onValueChange={handleInputChange}
                        previousId="input3"
                        handleSubmit={handleSubmit}
                        nextId="input5"
                    />
                    <OTPInput
                        id="input5"
                        value={inputValues.input5}
                        onValueChange={handleInputChange}
                        previousId="input4"
                        handleSubmit={handleSubmit}
                        nextId="input6"
                    />
                    <OTPInput
                        id="input6"
                        value={inputValues.input6}
                        onValueChange={handleInputChange}
                        previousId="input5"
                        handleSubmit={handleSubmit}
                    />
                </div>

                {/* <button type="button" className="resend-btn-com" disabled={counter > 0} onClick={handleResend}>
                    Resend            
                </button> */}
            </form>
            
            <span> OTP code will be expire within ({counter}) seconds</span>

            <div className="back-next-button">
                <button type="button" className="back-btn" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{display: "block"}}>
                        <title>Arrow left</title>
                        <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3Z" fill="currentColor"></path>
                    </svg>
                </button>
                
                <button type="button" className="resend-btn-com" disabled={counter > 0} onClick={handleResend}>
                    Resend            
                </button>

                {/* <button type="button" className="next-btn">
                    <div>Next</div>
                    <div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{paddingLeft: "5px", display: "block"}}><title>Arrow right</title><path d="m22.2 12-6.5 9h-3.5l5.5-7.5H2v-3h15.7L12.2 3h3.5l6.5 9Z" fill="currentColor"></path></svg>
                    </div>
                </button> */}
            </div>

        </div>      
    )
}

const OTPInput = ({ id, previousId, nextId, value, onValueChange, handleSubmit }) => {
  //This callback function only runs when a key is released
  const handleKeyUp = (e) => {
    //check if key is backspace or arrowleft
    if (e.keyCode === 8 || e.keyCode === 37) 
    {
      //find the previous element
      const prev = document.getElementById(previousId);
      if (prev) {
        //select the previous element
        prev.select();
      }
    } else if (
      (e.keyCode >= 48 && e.keyCode <= 57) || //check if key is numeric keys 0 to 9
      (e.keyCode >= 65 && e.keyCode <= 90) || //check if key is alphabetical keys A to Z
      (e.keyCode >= 96 && e.keyCode <= 105) || //check if key is numeric keypad keys 0 to 9
      e.keyCode === 39 //check if key is right arrow key
    ) {
        //find the next element
        const next = document.getElementById(nextId);
        if (next) {
            //select the next element
            next.select();
        } else {
          //check if inputGroup has autoSubmit enabled
          const inputGroup = document.getElementById('OTPInputGroup');
          if (inputGroup && inputGroup.dataset['autosubmit']) {
            //submit the form
            handleSubmit();
          }
        }
    }
  }
  return (
      <input
          id={id}
          name={id}
          type="text"
          className="DigitInput"
          value={value}
          maxLength="1"
          onChange={(e) => onValueChange(id, e.target.value)}
          onKeyUp={handleKeyUp}
      />
  );
};
