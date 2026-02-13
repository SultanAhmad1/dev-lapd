import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID, DELIVERY_ID } from "@/global/Axios";
import React, { useCallback, useContext, useEffect } from "react";

export default function OrderPlacedSuccessfully() {

    const {
        booleanObj,
        setBooleanObj,
    } = useContext(HomeContext);


      const handleOkClick = useCallback(() => {
        
        const getFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`));


        // check if order is delivery type then redirect to track-order page or thank-you page.
        if(DELIVERY_ID === getFilter?.delivery_id)
        {
            window.location.href = `/track-order/${booleanObj.orderGuid}`;
            return
        }
        
            window.location.href = `/thank-you/${booleanObj.orderGuid}`;
        
    },[setBooleanObj, booleanObj.orderGuid]);

    useEffect(() => {
        if(booleanObj.isUnableToSendSms) {  
            setTimeout(() => {
                handleOkClick();
            }, 3000);
        }
    }, [booleanObj.isUnableToSendSms, handleOkClick, setBooleanObj]);

    return(
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black">
            <div className="max-w-sm rounded-lg border border-green-300 bg-green-50 p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <svg
                        className="mt-0.5 h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>


                    <div className="flex-1 text-sm text-green-800">
                        <p className="font-medium">Order placed successfully.</p>
                    </div>

                    <button
                        className="text-green-600 hover:text-green-800"
                        onClick={handleOkClick}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    )
}
