"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useGetQueryAutoUpdate } from "../reactquery/useQueryHook";
import { usePathname } from "next/navigation";

export default function ThankYouDetail() 
{
    const router = usePathname()
    const stringToArray = router?.split('/').filter(segment => segment)

    const [getTrackOrderData, setGetTrackOrderData] = useState(null);

    const onGetError = (error) => {
        // window.alert("There is something went wrong!. Please refresh and try again.")
    }

    const onGetSuccess = (data) => {
        setGetTrackOrderData(data)
    }
    
    const {isLoading: getTrackLoading, isError: getTrackError} = useGetQueryAutoUpdate("track-order", `/website-track-order/${stringToArray?.[1]}`, onGetSuccess, onGetError, stringToArray?.[1] ? true : false)

    return(
        <div className='e5ald0m1m2amc5trackorder-desk'>

            <div className="m3m4m5gim6trackorder-desk">
                <div className="hmg1trackorder-desk">
                    <div className="hmg1mhb0trackorder-desk">
                        {
                            getTrackOrderData?.data?.isExpired ?
                                <div className="m3m4m5gim6trackorder-desk">
                                    <div className="hmg1trackorder-desk">
                                        <div className="hmg1mhb0trackorder-desk">

                                            <div className='mimjepmkmlmmtrackorder-desk'>
                                                <div className='d1g1trackorder-desk'>
                                                
                                                    <h1 className="invalid-order-code">Order has been expired.</h1>
                                                    
                                                    <Link className="continue-to-menu-btn" href="/">Continue to menu</Link>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div></div>
                                </div>
                            :
                                <div className='mimjepmkmlmmtrackorder-desk'>
                                    <div className='d1g1trackorder-desk'>
                                    
                                        <h1 className="invalid-order-code">Thank You.</h1>
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: "500",
                                                textAlign: "center",
                                                margin: "10px"
                                            }}
                                        >
                                            Your order has been received
                                        </p>

                                        <p
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: "500",
                                                textAlign: "center",
                                                margin: "10px"
                                            }}
                                        >
                                            You’ll get an email confirmation shortly, and we’ll send you a text message as soon as your order is ready for collection.
                                        </p>
                                        
                                        <Link className="continue-to-menu-btn" href="/">Continue to menu</Link>
                                    </div>
                                </div>
                        }
                    </div>

                </div>
                <div></div>
            </div>
                   
        </div>
    )
}
