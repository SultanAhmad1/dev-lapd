
"use client";

import { useContext, useEffect, useState } from "react";
import { useTimer } from "./utils/userTimer";
import { usePostMutationHook, useVerifyOTP } from "./reactquery/useQueryHook";
import { BRAND_GUID, BRAND_SIMPLE_GUID } from "@/global/Axios";
import { setLocalStorage } from "@/global/Store";
import HomeContext from "@/contexts/HomeContext";

export default function OtpVerifyModal({setIsOTP}) 
{

  const { handleBoolean } = useContext(HomeContext)
  
  const styles = {
    title: {
      textAlign: 'center',
      margin: '0 0 1.4rem 0',
      fontSize: '1.3rem',
      fontWeight: '500',
    },

    notification: {
      margin: '20px 0',
      padding: '20px',
      backgroundColor: '#eff5fb',
      color: '#296fa8',
      fontWeight: '500'
    },

    resendBtn: {
      textDecoration: 'underline',
      color: "blue"
    },

    resendBtn: {
      textDecoration: 'underline',
      color: "blue"
    }
  }

  const [resendTime, setResendTime] = useTimer({
    multiplier: 60,
  });

  const [errormessage, setErrormessage] = useState("");
  
  const [counter, setCounter] = useState(60); // Initial value set to 60 seconds
  const [canResend, setCanResend] = useState(false);

  const handleResend = () => {

    setCounter(60); // Reset the time to 0 to allow immediate resend
    setCanResend(false);
    setErrormessage("")

    const customerData = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempcustomer`))

    const resendData = {
        brand: BRAND_GUID,
        customerId: customerData?.id,
    }

    resendMutation(resendData)
  };

  const onResendSuccess = (data) => {}

  const onResendError = (error) => {
    const { response } = error
    setErrormessage(response?.data?.message)
  }

  const {mutate: resendMutation, isLoading:resendLoading, isError: resendError, isSuccess: resendSuccess, reset: resendReset} = usePostMutationHook('resend','/website-resend-otp-code', onResendSuccess, onResendError)
  

    const [inputValues, setInputValues] = useState({
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
      input6: '',
      // Add more input values here
    });
    
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
          setLocalStorage(`${BRAND_SIMPLE_GUID}otpexpired`, true)
          setErrormessage("OTP code has been expired.")

          setInputValues((prevData) => ({...prevData, 

            input1: '',
            input2: '',
            input3: '',
            input4: '',
            input5: '',
            input6: '',

          }))
          return;
        }
    
        const timer = setInterval(() => {
          setCounter((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      // }
  
    }, [counter]);

  //this function updates the value of the state inputValues
  const handleInputChange = (inputId, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [inputId]: value,
    }));
  };
 
  const handleSubmit = (e) => {
    // ... Your submit logic here
    e?.preventDefault()
    // declare
    const otpCode = Object.values(inputValues).join('')
    
    const customerData = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempcustomer`))

    const otpData = {
      customerId: customerData?.id,
      otpCode: otpCode
    }
    //return  
    OTPMutation(otpData)
    // return alert(otpCode)
  };

  const onOTPError = (error) => {
    const { response } = error
    setErrormessage(response?.data?.message)
  }

  const onOTPSuccess = (data) => {
    setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, data?.data)
    handleBoolean(true,'isCustomerVerified')
    setIsOTP(false)
  }

  const {mutate: OTPMutation, isLoading: OTPLoading, isError: OTPError, isSuccess: OTPSuccess, reset: OTPReset} = useVerifyOTP('matchOTPCode', '/verify-otp-code', onOTPSuccess, onOTPError)

  return(
    <div className="modal-delivery-details">
      <div className="modal-delivery-details-level-one-div">

        <div className="modal-delivery-details-level-one-div-dialog">
            
          <div className="modal-delivery-details">
            <div className="modal-delivery-details-level-one-div">
              <div className="modal-delivery-details-level-one-div-height"></div>
              
                <div className="modal-delivery-details-level-one-div-dialog">
                  <div className="deliver-to-body-content">
                    <h2 style={styles.title}>Enter verification code</h2>
                    <p style={styles.notification}>Check your phone for a verification code and enter it below</p>
                    <div className="deliver-to-body-content-nested-div-level-one">
                      {
                        errormessage !== "" &&

                        <div className="alert-message">
                          {
                            errormessage
                          }
                        </div>
                      }
                      <form>
                        <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label" >
                          When autocomplete results are available, use up and down arrows
                          to review and enter to select. Touch device users, explore by
                          touch or with swipe gestures.
                        </label>

                        <div className="deliver-to-body-content-nested-div-level-one-nested">

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

                          <div className="spacer _8"></div>
                        </div>

                        <div className="availabe_stores"></div>
                        {/* {
                          postcodeerror !== "" && 
                          <p style={{color: "red",background: "#eda7a7",textAlign: "center",marginTop: "10px", padding: "10px",}}>
                            {postcodeerror}
                          </p>
                        } */}

                        <button type="button" className="resend-btn" disabled={counter > 0} onClick={handleResend}>
                          Resend OTP
                        </button>
                        <span> in ({counter}) seconds</span>
                        {/* <button type="button" className="deliver-to-done-button">
                          Cancel
                        </button> */}
                        
                      </form>

                    </div>
                  </div>
                </div>

              <div className="modal-delivery-details-level-one-div-height"></div>
            </div>
          </div>

        </div>
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
