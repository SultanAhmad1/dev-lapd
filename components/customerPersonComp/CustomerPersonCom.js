'use client';

import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCheckAuthMutationHook, useLogoutMutationHook } from "../reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID } from "@/global/Axios";

export default function CustomerPersonCom() 
{
    
    const {booleanObj,handleBoolean,websiteModificationData} = useContext(HomeContext)
    
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
        <div id="wrapper" className="div-left-canva">
            <div className="left-canv-level-one-div">
                <aside className="left-canv-aside" ref={asideRef}>
                    <nav>
                        <div data-scene-meta='{"drawer_id":"menu"}' style={{ display: "contents" }}>
                            {
                                loginToken === null || loginToken === undefined ?
                                <div className="canva-auth-buttons">
                                    <div>
                                    <a 
                                        href='/register' 
                                        className="auth-sign" 
                                      
                                        style={{
                                            '--auth-border-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
                                            '--auth-background-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                            '--auth-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                            '--auth-hover-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor,
                                            '--auth-hover-color':  websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                        }}
                                    >
                                        Sign up
                                    </a>
                                    <a href='/login' className="auth-in">
                                        Log in
                                    </a>
                                    </div>
                                </div>
                            :
                                <>
                                    <div className="aside-div-one">
                                        <Image
                                            alt="User presentation"
                                            role="presentation"
                                            src={USER_IMAGE}
                                            className="canv-anchor-image-tags"
                                            width={100}
                                            height={100}
                                        />
                                        <div className="spacer _16"></div>
                                        <div>
                                            <div className="canva-user">{loginToken?.data?.customer?.first_name} {loginToken?.data?.customer?.last_name}</div>
                                            <a href="/account" className="canva-user-anchor">
                                                Manage account
                                            </a>
                                        </div>
                                    </div>
                
                                    <a className="canva-anchor-btn" href="/orders">
                                        <div className="canva-anchor-btn-div">
                                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="canva-anchor-svg">
                                                <path d="M4.5 2.833v18.333l4.583-2.5 2.917 2.5 2.917-2.5 4.583 2.5V2.833h-15zM16.167 9.5H7.833V7h8.334v2.5z" />
                                            </svg>
                                        </div>
                                        <div className="spacer _16"></div>
                                        <a href={`/order-history/${loginToken?.data?.customer?.customer_guid}`} className="canva-anchor-text">Order History</a>
                                    </a>
                
                                    <a className="canva-anchor-btn" href="/favorites?fav=true">
                                        <div className="canva-anchor-btn-div">
                                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="canva-anchor-svg">
                                                <path d="M17 3c-2.2 0-3.8 1.2-5 2.5C10.8 4.3 9.2 3 7 3 3.5 3 1 5.9 1 9.5c0 1.8.7 3.4 2 4.5l9 8.5 9-8.5c1.2-1.2 2-2.7 2-4.5C23 5.9 20.5 3 17 3z"></path>
                                            </svg>
                                        </div>
                                        <div className="spacer _16"></div>
                                        <div className="canva-anchor-text">Favorites</div>
                                    </a>
                                    
                                    {/* Logout button */}
                                    <button type="button" disabled={logoutLoading} className="auth-in" style={{marginTop: "50vh", padding: "0rem"}} onClick={handleLogout}>
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

