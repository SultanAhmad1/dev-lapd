"use client";
import Image from 'next/image'

import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { BLACK_COLOR, BRAND_SIMPLE_GUID, brandLogoPath,DELIVERY_ID,IMAGE_URL_Without_Storage, LIGHT_BLACK_COLOR, WHITE_COLOR } from '../global/Axios'
import moment from 'moment';
import FilterLocationTime from './FilterLocationTime';
import { usePathname } from 'next/navigation';

export default function Header() 
{
    const{
        customDoorNumberName,
        street1,
        street2,
        brandLogo,
        headerUserBtnDisplay, 
        handleBoolean,
        websiteModificationData,
        storeName,
        storeToDayOpeningTime,
        storeToDayClosingTime,
        setAtFirstLoad
    } = useContext(HomeContext)
    
    const [isHeaderSandwichHover, setIsHeaderSandwichHover] = useState(false);
    
    const handleIsDeliveryBtnClicked = () =>
    {
        handleBoolean(true,"isChangePostcodeButtonClicked")
        setAtFirstLoad(true)
    }

    const pathName = usePathname()

    const splitToArray = pathName.split("/").filter(segment => segment)
    
    return (
        <header className="lg:flex md:block justify-between items-center px-4 py-2">
            {/* Logo & Sandwich */}
            <div className="flex items-center gap-x-16 px-4 sm:px-6 lg:px-8">
                {headerUserBtnDisplay && (
                    <button
                        type="button"
                        // onClick={() =>
                        //     handleBoolean(!booleanObj?.isCustomerCanvasOpen, "isCustomerCanvasOpen")
                        // }
                        className="p-2 rounded hover:bg-gray-200 transition-all duration-200"
                    >
                        <svg
                            viewBox="0 0 20 20"
                            className="w-6 h-6"
                            style={{
                            color:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                ?.buttonBackgroundColor,
                            }}
                        >
                            <path d="M19.167 3.333H.833v2.5h18.334v-2.5zm0 5.834H.833v2.5h18.334v-2.5zM.833 15h18.334v2.5H.833V15z" />
                        </svg>
                    </button>
                )}

                <a href="/" className="shrink-0">
                    {brandLogo !== null ? (
                    <Image
                        src={`${IMAGE_URL_Without_Storage}${brandLogo}`}
                        width={100}
                        height={100}
                        alt="Brand Name"
                        className="w-[80px] sm:w-[90px] md:w-[100px] h-auto object-contain"
                    />
                    ) : (
                    <Image
                        src={brandLogoPath}
                        width={100}
                        height={100}
                        alt="Brand Name"
                        className="w-[80px] sm:w-[90px] md:w-[100px] h-auto object-contain"
                    />
                    )}
                </a>
            </div>


            {/* Location & Cart */}
            <div className="block items-center gap-4">
                {!["thank-you","track-order", "place-order", "payment", "contact-us", "about-us", "allergens", "privacy-policy", "terms-conditions", 'subscription'].some((term) =>
                    splitToArray?.[0]?.includes(term)
                ) && (
                    <>
                        
                        {/* FilterLocationTime */}
                        
                        <FilterLocationTime isDisplayFromModal={false} />
                        
                        {/* Edit Delivery Button */}
                        <button
                            type="button"
                            onClick={handleIsDeliveryBtnClicked}
                            onMouseEnter={() => setIsHeaderSandwichHover(true)}
                            onMouseLeave={() => setIsHeaderSandwichHover(false)}
                            className={`px-2 py-1 mt-1 border rounded text-sm flex items-center gap-1 w-full`}
                            style={{
                            background: isHeaderSandwichHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.activeButtonBackgroundColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor,
                            color: isHeaderSandwichHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.activeButtonFontColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonColor,
                            borderColor: isHeaderSandwichHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.activeButtonBackgroundColor,
                            }}
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
                           {customDoorNumberName ?? ""} {street1} {street2}
                        </button>

                        {/* Store Details */}
                        <div className="w-full flex flex-row gap-1 sm:flex-row sm:items-center mt-1">


                            {/* Store or Customer Address */}
                            <div
                                className={`
                                    flex flex-col items-center gap-2 px-2 py-1 rounded border text-sm font-medium
                                    transition-colors duration-150 w-1/2
                                `}
                                style={{
                                    background: isHeaderSandwichHover
                                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.activeButtonBackgroundColor || WHITE_COLOR
                                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                    color: isHeaderSandwichHover
                                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.activeButtonFontColor || BLACK_COLOR
                                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonColor || WHITE_COLOR,
                                    border: isHeaderSandwichHover
                                    ? `1px solid ${
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                            ?.buttonBackgroundColor || LIGHT_BLACK_COLOR
                                        }`
                                    : `1px solid ${
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                            ?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                                        }`,
                                }}
                                onMouseEnter={() => setIsHeaderSandwichHover(true)}
                                onMouseLeave={() => setIsHeaderSandwichHover(false)}
                            >
                                <p>Store:</p>
                                <p className="uppercase break-words">{storeName}</p>
                            </div>


                            {/* Store Opening and Closing Time */}

                            <div
                                className={`
                                    flex flex-col items-center gap-2 px-2 py-1 rounded border text-sm font-medium
                                    transition-colors duration-150 w-1/2
                                `}
                                style={{
                                    background: isHeaderSandwichHover
                                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.activeButtonBackgroundColor || WHITE_COLOR
                                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                    color: isHeaderSandwichHover
                                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.activeButtonFontColor || BLACK_COLOR
                                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonColor || WHITE_COLOR,
                                    border: isHeaderSandwichHover
                                    ? `1px solid ${
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                            ?.buttonBackgroundColor || LIGHT_BLACK_COLOR
                                        }`
                                    : `1px solid ${
                                        websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                            ?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                                        }`,
                                }}
                                >
                                <span>Opening Time:</span>
                                <span className="whitespace-nowrap">
                                    {moment(storeToDayOpeningTime, 'HH:mm').format('HH:mm A')} –{' '}
                                    {moment(storeToDayClosingTime, 'HH:mm').format('HH:mm A')}
                                </span>
                            </div>

                        </div>

                    </>
                )}
            </div>
        </header>
    )
}