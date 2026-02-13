import HomeContext from "@/contexts/HomeContext";
import React, { useCallback, useContext, useEffect } from "react";

export default function SmsAlertOrderFailedModal() {

    const {
        booleanObj,
        setBooleanObj,
    } = useContext(HomeContext);


      const handleOkClick = useCallback(() => {
        // check if order is delivery type then redirect to track-order page or thank-you page.
        if(parseInt(booleanObj.isDeliveryOrder) === parseInt(1))
        {
            window.location.href = `/track-order/${booleanObj.orderGuid}`;
            return
        }
        
        window.location.href = `/thank-you/${booleanObj.orderGuid}`;
    },[setBooleanObj, booleanObj.orderGuid]);

    useEffect(() => {
        if(parseInt(booleanObj.isUnableToSendSms) === parseInt(2)) {  
            setTimeout(() => {
                handleOkClick();
            }, 5000);
        }
    }, [booleanObj.isUnableToSendSms, handleOkClick, setBooleanObj]);

    return(
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black">
            <div className="max-w-sm rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-lg">
                <div className="flex items-start gap-3">
                <svg
                    className="mt-0.5 h-5 w-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.516 11.59c.75 1.334-.213 2.986-1.742 2.986H3.483c-1.53 0-2.492-1.652-1.742-2.986L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-.993.883L9 8v3a1 1 0 001.993.117L11 11V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                    />
                </svg>

                <div className="flex-1 text-sm text-yellow-800">
                    <p className="font-medium">Order placed successfully.</p>
                    <p className="mt-1">
                    SMS delivery failed due to an invalid phone number.
                    </p>
                </div>

                <button
                    className="text-yellow-600 hover:text-yellow-800"
                    onClick={handleOkClick}
                >
                    ✕
                </button>
                </div>
            </div>
        </div>
    )
}
