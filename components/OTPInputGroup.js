import React, { useRef, useState } from "react";

//Our parent component
const OTPInputGroup = ({ autoSubmit = false }) => {
    //state to store all input boxes    
    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
        // Add more input values here
    });

    //this function updates the value of the state inputValues
    const handleInputChange = (inputId, value) => {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [inputId]: value,
        }));
    };

    //this function processes form submission
    const handleSubmit = (e) => {
        // ... Your submit logic here
        e?.preventDefault()
        // declare
        const otpCode = `OTPCode is: ${Object.values(inputValues).join('')}`
        //return
        return alert(otpCode)
    };

    //use refs for inputs
    const input1 = useRef()
    const input2 = useRef()
    const input3 = useRef()
    const input4 = useRef()
    const input5 = useRef()
    const input6 = useRef()
    //.....create more refs and assign them to more inputs

    //return child component
    return (
        <>
            <div id='OTPInputGroup' className="digitGroup">
                <OTPInput
                    id="input1"
                    className="digitGroup"
                    ref={input1}
                    value={inputValues.input1}
                    onValueChange={handleInputChange}
                    previousRef={null}
                    handleSubmit={handleSubmit}
                    autoSubmit={autoSubmit}
                    nextRef={input2}
                />
                <OTPInput
                    id="input2"
                    className="digitGroup"
                    ref={input2}
                    value={inputValues.input2}
                    onValueChange={handleInputChange}
                    previousRef={input1}
                    handleSubmit={handleSubmit}
                    autoSubmit={autoSubmit}
                    nextRef={input3}
                />
                <OTPInput
                    id="input3"
                    className="digitGroup"
                    ref={input3}
                    value={inputValues.input3}
                    onValueChange={handleInputChange}
                    previousRef={input2}
                    handleSubmit={handleSubmit}
                    autoSubmit={autoSubmit}
                    nextRef={input4}
                />
                {/* Seperator */}
                <span className="seperator">&ndash;</span>
                {/* End of Seperator */}
                <OTPInput
                    id="input4"
                    className="digitGroup"
                    ref={input4}
                    value={inputValues.input4}
                    onValueChange={handleInputChange}
                    previousRef={input3}
                    handleSubmit={handleSubmit}
                    autoSubmit={autoSubmit}
                    nextRef={input5}
                />
                <OTPInput
                    id="input5"
                    className="digitGroup"
                    ref={input5}
                    value={inputValues.input5}
                    onValueChange={handleInputChange}
                    previousRef={input4}
                    handleSubmit={handleSubmit}
                    autoSubmit={autoSubmit}
                    nextRef={input6}
                />
                <OTPInput
                    id="input6"
                    className="digitGroup"
                    ref={input6}
                    value={inputValues.input6}
                    onValueChange={handleInputChange}
                    previousRef={input5}
                    handleSubmit={handleSubmit}
                    autoSubmit={autoSubmit}
                    nextRef={null}
                />
            </div>
            <div className="btnGroup" onClick={handleSubmit}>
                <button className="button">Complete action</button>
            </div>
        </>
    );
}

//Our child component
const OTPInput = ({ id, previousId, nextId, value, onValueChange, handleSubmit }) => {
    //This callback function only runs when a key is released
    const handleKeyUp = (e) => {
        //check if key is backspace or arrowleft
        if (e.keyCode === 8 || e.keyCode === 37) {
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

export default OTPInputGroup;