"use client";
import Image from 'next/image'

import React, { Fragment, useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { BLACK_COLOR, BRAND_SIMPLE_GUID, brandLogoPath,IMAGE_URL_Without_Storage, LIGHT_BLACK_COLOR, WHITE_COLOR } from '../global/Axios'
import moment from 'moment';
import FilterLocationTime from './FilterLocationTime';
import { usePathname } from 'next/navigation';

export default function Header(props) 
{
    const{
        street1,
        street2,
        cartData,
        postcode,
        brandLogo,
        isReviewPage,
        setIsCartBtnClicked, 
        headerUserBtnDisplay, 
        headerCartBtnDisplay, 
        headerSearchBarDisplay, 
        setIsDeliveryBtnClicked,
        headerPostcodeBtnDisplay,
        booleanObj,
        handleBoolean,
        websiteModificationData,
        deliveryMatrix,
        storeName,
        storeToDayOpeningTime,
        storeToDayClosingTime,
        setAtFirstLoad
    } = useContext(HomeContext)
    
    const [isHover, setIsHover] = useState(false);
    const [isHeaderSandwichHover, setIsHeaderSandwichHover] = useState(false);
    
    const handleIsDeliveryBtnClicked = () =>
    {
        if(! isReviewPage)
        {
            // setIsDeliveryBtnClicked(true)
            setAtFirstLoad(true)
            return
        }
        setAtFirstLoad(false)
        // setIsDeliveryBtnClicked(false)
    }

    const pathName = usePathname()

    const splitToArray = pathName.split("/").filter(segment => segment)
    
    const [storeAddressDetail, setStoreAddressDetail] = useState("");
    
    useEffect(() => {
      const addressStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`);

      if(addressStore)
      {
        const storeData = JSON.parse(addressStore);
        setStoreAddressDetail(storeData?.address || "");
      }
    }, [street1, street2]);
    
    
    return (
        <header className="header" style={{
            marginTop: "10px"
        }}>
            <div className="header-div">
                
                <div className='logo-sandwich'>
                    {
                        headerUserBtnDisplay &&
                        <button type='button' className="hamburger-button" onClick={() => handleBoolean(! booleanObj?.isCustomerCanvasOpen, "isCustomerCanvasOpen")}>
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="hamburger-svg" style={{color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,}}>
                                <path d="M19.167 3.333H.833v2.5h18.334v-2.5zm0 5.834H.833v2.5h18.334v-2.5zM.833 15h18.334v2.5H.833V15z"></path>
                            </svg>
                        </button>
                    }
                    <a href="/">
                        {
                            brandLogo !== null ?
                                <Image src={IMAGE_URL_Without_Storage+''+brandLogo} width={200} height={200} className="brand-logo" alt='Brand Name'/>
                            :
                                <Image src={brandLogoPath} width={200} height={200} className="brand-logo" alt='Brand Name'/>
                        }
                    </a>
                </div>

                <div className='logo-location-cart' style={{display: "block",}}>
                    
                    {
                        (!["track-order", "place-order", "payment", 'contact-us'].some(term => splitToArray?.[0]?.includes(term)))
                        
                        &&

                        <>
                            <div 
                                className='header-order-type'
                           >

                                <FilterLocationTime 
                                    {
                                        ...{
                                            isDisplayFromModal: false
                                        }
                                    }
                                />
                            </div>
                            <div className="" style={{display: "block"}}>

                                <button
                                    type='button' 
                                    className="edit-delivery-location-button" 
                                    onClick={handleIsDeliveryBtnClicked}

                                    style={{
                                        background: isHeaderSandwichHover ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || WHITE_COLOR

                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR
                                        ,
                                        color: isHeaderSandwichHover ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonFontColor || BLACK_COLOR
                                        :
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
                                        ,
                                        border: isHeaderSandwichHover ? 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR}` 
                                        : 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR}`
                                        ,
                                    }} 
                                    onMouseEnter={() => setIsHeaderSandwichHover(true)} 
                                    onMouseLeave={() => setIsHeaderSandwichHover(false)} 
                                >
                                    <svg 
                                        width="15px" 
                                        height="15px" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        aria-label="Deliver to" 
                                        role="img" 
                                        focusable="false"
                                    >
                                        <path 
                                            d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z" 
                                            fill={`${isHeaderSandwichHover ? (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR) : (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}`}
                                        ></path>
                                    </svg>

                                        {/* {street1} {street2} */}
                                        {storeAddressDetail}
                                </button>
                                
                                <div className='store-detail-display'>
                                    <div 
                                        className="store-information"
                                        style={{
                                            background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                            color:websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                                            display: "flex"
                                        }} 
                                    >
                                        <div className="kgmytrackorder-desk">
                                            <svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                                                <g data-name="Building Store">
                                                    <path 
                                                        d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z" 
                                                        style={{ fill: (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR) }}
                                                    />
                                                        
                                                    <path style={{ fill: "#232328" }} d="M29.87 10h4.45l1.2-3h-6.08l.43 3z" /><path d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z"
                                                        style={{ fill: (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR) }}
                                                    />
                                                    <path 
                                                        d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z"
                                                        style={{ fill: (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR) }}
                                                    />
                                                </g>
                                            </svg>
                                        </div>
                                        <span className='selected_location_name'>{storeName.toUpperCase()}</span>
                                    </div>
                                    <div 
                                        className="store-information"
                                        style={{
                                            background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                            color:websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                                            display: "flex",
                                        }} 
                                    >
                                        <div className="kgmytrackorder-desk">
                                            <svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                                <path 
                                                    fillRule="evenodd" 
                                                    clipRule="evenodd" 
                                                    d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7 3V8.41421L10.2929 11.7071L11.7071 10.2929L9 7.58579V3H7Z" 
                                                    fill={(websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}
                                                />
                                            </svg>
                                        </div>
                                        <span className='selected_location_name'>{moment(storeToDayOpeningTime, "HH:mm").format("h:mm A")} - {moment(storeToDayClosingTime, "HH:mm").format("h:mm A")}</span>
                                    </div>

                                </div>

                            </div>
                        </>
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
                                        onClick={() => setIsCartBtnClicked(true)}
                                    >
                                        <svg 
                                            aria-hidden="true" 
                                            focusable="false" 
                                            viewBox="0 0 16 16" 
                                            className="cart-svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M3.666 11.333h10.333l1.334-8h-11l-.267-2h-3.4v2h1.667l1.333 8zm1.333 3.334A1.333 1.333 0 105 12a1.333 1.333 0 000 2.667zm9.334-1.334a1.333 1.333 0 11-2.667 0 1.333 1.333 0 012.667 0z"></path>
                                        </svg>
                                        <div className="spacer _8"></div>&nbsp; {parseInt(cartData?.length)} <span className="cart-text">&nbsp;carts</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    }
                    </div>
                </div>

                
            </div>
        </header>
    )
}