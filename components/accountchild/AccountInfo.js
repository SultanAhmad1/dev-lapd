'use client';

import { BRANDSIMPLEGUID, USERIMAGE } from "@/global/Axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePatchMutationHook, usePostMutationHook } from "../reactquery/useQueryHook";
import { setLocalStorage } from "@/global/Store";

export default function AccountInfo() 
{
    const [accountInfoObj, setAccountInfoObj] = useState({
        userGUID: "",
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPhone: "",

        firstNameError: "",
        lastNameError: "",
        emailError: "",
        phoneError: "",
    });

    const handleInputs = (event) => {
        const { name, value } = event.target
        setAccountInfoObj((prevData) => ({...prevData, [name]: value}))
    }

    const handleAccountUpdate = (event) => {
        event.preventDefault()

        const { userFirstName, userLastName, userEmail, userPhone } = accountInfoObj

        if(!userFirstName)
        {
            setAccountInfoObj((prevData) => ({...prevData, firstNameError: "First name required!."}))
            return
        }
        else if(! userLastName){
            setAccountInfoObj((prevData) => ({...prevData, lastNameError: "Last name required!."}))
            return
        }
        else if(! userEmail){
            setAccountInfoObj((prevData) => ({...prevData, emailError: "Eamil address required!."}))
            return
        }
        else if(! userPhone){
            setAccountInfoObj((prevData) => ({...prevData, phoneError: "Phone number required!."}))
            return
        }

        const accountData = {
            first_name: userFirstName,
            last_name: userLastName,
            email: userEmail,
            phone: userPhone
        }

        patchMutation(accountData)
    }

    const onError = (error) => {
        const { response } = error
        setAccountInfoObj((prevData) => ({...prevData, 
            firstNameError: "First name required!.",
            lastNameError: "Last name required!.",
            emailError: "Eamil address required!.",
            phoneError: "Phone number required!.",
        }))    
    }

    const onSuccess = (data) => {
        const { customer } = data?.data?.data
        setAccountInfoObj((prevData) => ({...prevData, 
            userFirstName: customer?.first_name,
            userLastName: customer?.last_name,
            userEmail: customer?.email,
            userPhone: customer?.phone,
        }))

        setLocalStorage(`${BRANDSIMPLEGUID}tempcustomer`, customer)
    }

    const {mutate: patchMutation, isLoading, isSuccess, reset} = usePatchMutationHook("customer-update", `/customer-update/${accountInfoObj?.userGUID}`, onSuccess, onError)

    if(isSuccess)
    {
        setTimeout(() => {
            reset()
        }, 3000);
    }

    useEffect(() => {
      const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

        setAccountInfoObj((prevData) => ({
            ...prevData,
            userGUID: customer?.customer_guid,
            userFirstName: customer?.first_name,
            userLastName: customer?.last_name,
            userEmail: customer?.email,
            userPhone: customer?.phone
        }))
        
    }, []);
    
    return(
        <div className="account-component">
            <form onSubmit={handleAccountUpdate}>
                <div className="title-with-button">
                    <h1>Account Info</h1>
                    <button type="submit" disabled={isLoading} className="register-button">Update</button>
                </div>

                <div className="update-img">
                    <Image
                        alt=""
                        role="presentation"
                        src={USERIMAGE}
                        className="canv-anchor-image-tags"
                        width={100}
                        height={100}
                    />

                    <h2>Basic Info</h2>
                </div>

            

                <div className="form-group">
                    <label className="form-label">&nbsp; First Name:</label>
                        <input type="text" className="form-input" name="userFirstName" value={accountInfoObj?.userFirstName} onChange={handleInputs} placeholder="Enter first name..." required/>
                </div>

                <div className="form-group">
                    <label className="form-label">&nbsp; Last Name:</label>
                    <input type="text" className="form-input" name="userLastName" value={accountInfoObj.userLastName} onChange={handleInputs} placeholder="Enter last name..." required/>
                </div>

                <div className="form-group">
                    <label className="form-label">&nbsp; Email:</label>
                    <input type="email" className="form-input" name="userEmail" value={accountInfoObj.userEmail} onChange={handleInputs} placeholder="Enter email address..." required/>
                </div>

                <div className="form-group">
                    <label className="form-label">&nbsp; Phone:</label>
                    <input type="number" className="form-input" name="userPhone" value={accountInfoObj.userPhone} onChange={handleInputs} placeholder="Enter phone number..." required/>
                </div>

                {/* <div className="form-group">
                    <label className="form-label">&nbsp; Password:</label>
                    <input type="password" className="form-input" name="firstName" placeholder="Enter first name..." required/>
                </div> */}
            </form>
        </div>
    )
}
