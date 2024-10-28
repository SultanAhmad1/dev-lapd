"use client";
import Image from 'next/image'

import React, { useContext, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { BrandLogoPath,IMAGE_URL_Without_Storage } from '../global/Axios'
import moment from 'moment';

export default function Header(props) 
{
    const{
        street1,
        street2,
        cartdata,
        postcode,
        brandlogo,
        isReviewPage,
        setIscartbtnclicked, 
        headerUserBtnDisplay, 
        headerCartBtnDisplay, 
        headerSearchBarDisplay, 
        setIsdeliverybtnclicked,
        headerPostcodeBtnDisplay,
        booleanObj,
        handleBoolean,
        websiteModificationData,
        deliverymatrix,
        storeName,
        storetodayopeningtime,
        storetodayclosingtime,
        setAtfirstload
    } = useContext(HomeContext)

    const [isHover, setIsHover] = useState(false);
    const [isHeaderSandwichHover, setIsHeaderSandwichHover] = useState(false);
    
    const handleIsDeliveryBtnClicked = () =>
    {
        if(! isReviewPage)
        {
            // setIsdeliverybtnclicked(true)
            setAtfirstload(true)
            return
        }
        setAtfirstload(false)
        // setIsdeliverybtnclicked(false)
    }

    return (
        <header>
            <div className="header">
                <div className="header-div">
                    
                    <div className='logo-sandwich'>
                        {
                            headerUserBtnDisplay &&
                            <button type='button' className="hamburger-button" onClick={() => handleBoolean(! booleanObj?.isCustomerCanvaOpen, "isCustomerCanvaOpen")}>
                                <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="hamburger-svg" style={{color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,}}>
                                    <path d="M19.167 3.333H.833v2.5h18.334v-2.5zm0 5.834H.833v2.5h18.334v-2.5zM.833 15h18.334v2.5H.833V15z"></path>
                                </svg>
                            </button>
                        }
                        <a href="/">
                            {
                                brandlogo !== null ?
                                    <img loading="lazy" src={IMAGE_URL_Without_Storage+''+brandlogo} width={200} height={200} className="brand-logo" alt='Brand Name'/>
                                :
                                    <img loading="lazy" src={BrandLogoPath} width={200} height={200} className="brand-logo" alt='Brand Name'/>
                            }
                        </a>
                    </div>

                    <div className='logo-location-cart'>
                      
                        {
                            headerPostcodeBtnDisplay &&

                            <div>
                                <button
                                    type='button' 
                                    className="edit-delivery-location-button" 
                                    onClick={handleIsDeliveryBtnClicked}

                                    style={{
                                        background: isHeaderSandwichHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                        color: isHeaderSandwichHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                        border: isHeaderSandwichHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                                    }} 
                                    onMouseEnter={() => setIsHeaderSandwichHover(true)} 
                                    onMouseLeave={() => setIsHeaderSandwichHover(false)} 
                                >
                                    <svg 
                                        width="30px" 
                                        height="30px" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        aria-label="Deliver to" 
                                        role="img" 
                                        focusable="false"
                                    >
                                        <path 
                                            d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z" 
                                            fill={`${isHeaderSandwichHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`}
                                        ></path>
                                    </svg>

                                        {street1} {street2} {postcode?.toUpperCase()}
                                </button>
                                
                                {/* Store Detail */}
                                <div className='store-detail-display'>
                                    <div 
                                        className="store-information"
                                        style={{
                                            background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                            color:websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                        }} 
                                    >
                                        Store: <span className='selected_location_name'>{storeName}</span>
                                    </div>
                                    <div 
                                        className="store-timing"
                                        style={{
                                            background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                            color:websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                        }} 
                                    >
                                        OPENING TIME: <span className='store_opening_closing_time'>{moment(storetodayopeningtime,'HH:mm A').format('HH:mm A')} - {moment(storetodayclosingtime,'HH:mm A').format('HH:mm A')}</span>
                                    </div>

                                </div>
                            </div>
                        }
                    
                        <div className="cart-outer-level-one-div">
                        {
                            headerCartBtnDisplay &&
                            <>
                                <div className="cart-btn-level-one-div">
                                    <div className="cart-btn-level-two-div">
                                        <button 
                                            className="add-to-cart-btn" 
                                            style={{
                                                background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                                color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                                border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                                            }} 
                                            onMouseEnter={() => setIsHover(true)} 
                                            onMouseLeave={() => setIsHover(false)} 
                                            onClick={() => setIscartbtnclicked(true)}
                                        >
                                            <svg 
                                                aria-hidden="true" 
                                                focusable="false" 
                                                viewBox="0 0 16 16" 
                                                className="cart-svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M3.666 11.333h10.333l1.334-8h-11l-.267-2h-3.4v2h1.667l1.333 8zm1.333 3.334A1.333 1.333 0 105 12a1.333 1.333 0 000 2.667zm9.334-1.334a1.333 1.333 0 11-2.667 0 1.333 1.333 0 012.667 0z"></path>
                                            </svg>
                                            <div className="spacer _8"></div>&nbsp; {parseInt(cartdata?.length)} <span className="cart-text">&nbsp;carts</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}