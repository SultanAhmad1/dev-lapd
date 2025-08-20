'use client';

import Image from "next/image";
import React, { useContext, useEffect, useRef } from "react";
import { useCheckAuthMutationHook, useLogoutMutationHook } from "../reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID, USER_IMAGE } from "@/global/Axios";

export default function CustomerPersonCom() 
{
    
    const {handleBoolean,websiteModificationData} = useContext(HomeContext)
    
    const asideRef = useRef(null);

    const loginToken = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`));
      
    // Function to close the canvas if clicked outside the aside
    const handleClickOutside = (event) => {
        if (asideRef.current && !asideRef.current.contains(event.target)) {
          handleBoolean(false, "isCustomerCanvasOpen"); // This will close the canvas when clicked outside
        }
    };
    
    // Adding event listener when the component mounts
    useEffect(() => {
        const customer = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`))
        
        if(customer === undefined && customer === null)
        {
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}tempCustomer`);
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}websiteToken`);
            return
        }
        
        authMutation({
            userEmail: customer?.email,
            userPhone: customer?.phone,
        })

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            // Cleanup the event listener on unmount
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    /**
     * Check the customer website token exists or not.
     */
    
    const onAuthError = (error) => {
        const{ response } = error

        if(response?.status === 401)
        {
            setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, null)
            setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, null)
            return
        }
    }
    
    const onAuthSuccess = (data) => {}
    
    const {mutate: authMutation, isLoading: authLoading, isError: authError, isSuccess: authSuccess, reset: authReset } = useCheckAuthMutationHook('check-authentication', '/check-authentication', onAuthSuccess, onAuthError)
    
    if(authSuccess)
    {
        authReset()
        return
    }
    
    const handleLogout = () => {
        logoutMutation()
    }
    
    const onLogoutSuccess = (data) => {
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}websiteToken`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}tempCustomer`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}isOTPHas`)

        handleBoolean(false,'isCustomerVerified')

        window.location.href = "/"
    }
    const onLogoutError = (error) => {}
    
    const {mutate: logoutMutation, isLoading: logoutLoading, isError: logoutError, isSuccess: logoutSuccess,reset: logoutReset} = useLogoutMutationHook('website-logout', '/website-logout', onLogoutSuccess, onLogoutError)

    if(logoutSuccess)
    {
        logoutReset()
        return
    }

    return(
        <div id="wrapper" className="fixed inset-0 z-40 bg-black/50">
            <div className="flex h-full">
                {/* Aside */}
                <aside
                    ref={asideRef}
                    className="w-72 sm:w-80 bg-white shadow-xl h-full flex flex-col p-4 overflow-y-auto"
                >
                    <nav className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-4">
                        {loginToken === null || loginToken === undefined ? 
                            <div className="flex flex-col gap-2">
                                <a
                                    href="/register"
                                    className="border rounded-lg px-4 py-3 rounded text-center font-medium transition-colors"
                                    style={{
                                    borderColor:
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonBackgroundColor || 'black',
                                    backgroundColor:
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonBackgroundColor || 'black',
                                    color:
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonColor || 'white',
                                    }}
                                >
                                    Sign up
                                </a>
                                <a
                                    href="/login"
                                    className="border rounded-lg px-4 py-3 text-center text-gray-800 hover:underline"
                                >
                                    Log in
                                </a>
                            </div>
                        : 
                            <>
                                {/* User Section */}
                                <div className="flex flex-col items-center gap-2">
                                    <Image
                                        src={USER_IMAGE}
                                        alt="User"
                                        width={200}
                                        height={200}
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                    <div className="text-center">
                                        <div className="font-semibold">
                                            {loginToken?.data?.customer?.first_name}{' '}
                                            {loginToken?.data?.customer?.last_name}
                                        </div>
                                        <a
                                            href="/account"
                                            className="rounded-lg text-blue-600 hover:underline"
                                        >
                                            Manage account
                                        </a>
                                    </div>
                                </div>

                                {/* Links */}
                                <a
                                    href={`/order-history/${loginToken?.data?.customer?.customer_guid}`}
                                    className="flex rounded-lg items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded transition-colors"
                                >
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 text-gray-500"
                                    >
                                        <path d="M4.5 2.833v18.333l4.583-2.5 2.917 2.5 2.917-2.5 4.583 2.5V2.833h-15zM16.167 9.5H7.833V7h8.334v2.5z" />
                                    </svg>
                                    <span>Order History</span>
                                </a>

                                <a
                                    href="/favorites?fav=true"
                                    className="flex rounded-lg items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded transition-colors"
                                >
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 text-gray-500"
                                    >
                                        <path d="M17 3c-2.2 0-3.8 1.2-5 2.5C10.8 4.3 9.2 3 7 3 3.5 3 1 5.9 1 9.5c0 1.8.7 3.4 2 4.5l9 8.5 9-8.5c1.2-1.2 2-2.7 2-4.5C23 5.9 20.5 3 17 3z"></path>
                                    </svg>
                                    <span>Favorites</span>
                                </a>

                                {/* Logout */}
                                <button
                                    type="button"
                                    disabled={logoutLoading}
                                    onClick={handleLogout}
                                    className="mt-auto text-red-600 text-sm hover:underline"
                                >
                                    Log out
                                </button>
                            </>
                        }
                        </div>
                    </nav>
                </aside>
            </div>
        </div>
    )
}

