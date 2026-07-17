"use client";
import Image from 'next/image'

import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { BLACK_COLOR, BRAND_SIMPLE_GUID, brandLogoPath,IMAGE_URL_Without_Storage, LIGHT_BLACK_COLOR, WHITE_COLOR } from '../global/Axios'
import moment from 'moment';
import FilterLocationTime from './FilterLocationTime';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useWebsite } from '@/app/providers/context/WebsiteContext';
export default function Header() 
{
    // let isJoinUsPage = firstSegment === "join-us";
    const {layoutWebsiteModification} = useWebsite()

    const{
        customDoorNumberName,
        street1,
        street2,
        handleBoolean,
        storeName,
        storeToDayOpeningTime,
        storeToDayClosingTime,
        setAtFirstLoad,
        selectedFilter,
        selectedStoreDetails,
    } = useContext(HomeContext)
    
    const [isHeaderSandwichHover, setIsHeaderSandwichHover] = useState(false);
    
    const handleIsDeliveryBtnClicked = () =>
    {
        handleBoolean(true,"isChangePostcodeButtonClicked")
        setAtFirstLoad(true)
    }

    const pathName = usePathname()

    const splitToArray = pathName.split("/").filter(segment => segment)

    const segments = pathName.split("/").filter(Boolean);
    const firstSegment = segments[0];
    let isJoinUsPage = firstSegment === "join-us";

    const [checkUserValidPostcodeAdded, setCheckUserValidPostcodeAdded] = useState(null)

    useEffect(() => {
        if(selectedFilter)
        {
            setCheckUserValidPostcodeAdded(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`)))
        }
    }, [selectedFilter])
    
    const iconColor = isHeaderSandwichHover? (layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR): (layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR);
    if(isJoinUsPage)
    {
        return 
    }

    return (
        //  style={{backgroundColor: "#fcfce4"}} set this color for dunked
        <>
            <header className="lg:flex md:block justify-between items-center px-4 py-2">
                {/* Logo & Sandwich */}
                <div className="hidden lg:block px-4 sm:px-6 lg:px-8 mobile_view">
                    <Link href="/" className="shrink-0">
                        {brandLogoPath ? (
                            <Image
                                src={brandLogoPath}
                                width={100}
                                height={100}
                                alt="Brand Name"
                                className="w-[80px] sm:w-[90px] md:w-[100px] h-auto object-contain"
                            />
                        ) : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl ? (
                            <Image
                                src={`${IMAGE_URL_Without_Storage}${layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl}`}
                                width={100}
                                height={100}
                                alt="Brand Name"
                                className="w-[80px] sm:w-[90px] md:w-[100px] h-auto object-contain"
                            />
                        ) :   
                            <Image
                                src={brandLogoPath}
                                width={100}
                                height={100}
                                alt="Brand Name"
                                className="w-[80px] sm:w-[90px] md:w-[100px] h-auto object-contain"
                            />
                        }
                        </Link>
                </div>

                {/* show information when customer added the postcode */}
                <div className="block lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* {headerUserBtnDisplay && (
                        <button
                            type="button"
                            onClick={() =>
                                handleBoolean(!booleanObj?.isCustomerCanvasOpen, "isCustomerCanvasOpen")
                            }
                            className="p-2 rounded hover:bg-gray-200 transition-all duration-200 mobile_button"
                        >
                            <svg
                                viewBox="0 0 20 20"
                                className="w-6 h-6"
                                style={{
                                color:
                                    layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor,
                                }}
                            >
                                <path d="M19.167 3.333H.833v2.5h18.334v-2.5zm0 5.834H.833v2.5h18.334v-2.5zM.833 15h18.334v2.5H.833V15z" />
                            </svg>
                        </button>
                    )} */}

                    <Link href="/" className="flex justify-center sm:justify-start">
                        {layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl !== null ? (
                        <Image
                            src={`${IMAGE_URL_Without_Storage}${layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl}`}
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
                    </Link>
                </div>
                {
                    checkUserValidPostcodeAdded ?
                        <>
                            {/* Location & Cart */}
                            <div className="block items-center gap-4">
                                {!["marketingpreferences","review","thank-you","track-order", "place-order", "payment", "contact-us", "about-us", "allergens", "privacy-policy", "terms-conditions", 'subscription'].some((term) =>
                                    splitToArray?.[0]?.includes(term)
                                ) && (
                                    <>
                                        {/* FilterLocationTime */}
                                        <FilterLocationTime isDisplayFromModal={false} />
                                        
                                        {/* Edit Delivery Button */}
                                        <button
                                            type="button"
                                            onClick={handleIsDeliveryBtnClicked}
                                            className={`px-2 py-1 mt-1 border rounded text-sm flex items-center gap-1 w-full transition-all duration-200 hover:scale-105`}
                                            style={{
                                            background: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                            color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                            borderColor: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor,
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 64 64"
                                                className="w-8 h-8"
                                            >
                                                {/* Pin */}
                                                <path
                                                    d="M32 4C21 4 12 13 12 24c0 14 20 36 20 36s20-22 20-36C52 13 43 4 32 4zm0 28a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                                                    fill={iconColor}
                                                />

                                                {/* Curved base */}
                                                <path
                                                    d="M16 52c4 6 12 8 16 8s12-2 16-8"
                                                    fill="none"
                                                    stroke={iconColor}
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            {customDoorNumberName ?? ""} {street1} {street2}
                                        </button>

                                        {/* Store Details */}
                                        <div className="w-full flex flex-row gap-1 sm:flex-row sm:items-center mt-1">
                                            {/* Store or Customer Address */}
                                            <div
                                                className={`
                                                    flex flex-col items-center gap-0 px-2 py-0 rounded-lg border text-sm font-medium
                                                    w-1/2 transition-all duration-200 hover:scale-105 whitespace-nowrap
                                                `}
                                                style={{
                                                    background: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                        ?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                                    color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                        ?.buttonColor || WHITE_COLOR,
                                                    border: `1px solid ${
                                                        layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                            ?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                                                        }`,
                                                }}
                                            >
                                                <p>Store:</p>
                                                <p className="break-words">{storeName}</p>
                                            </div>

                                            {/* Store Opening and Closing Time */}
                                            <div
                                                className={`
                                                    flex flex-col items-center gap-0 px-2 py-0 rounded-lg text-sm font-medium
                                                    w-1/2 transition-all duration-200 hover:scale-105 whitespace-nowrap
                                                `}
                                                style={{
                                                    background: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                        ?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                                    color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                        ?.buttonColor || WHITE_COLOR,
                                                    border: `1px solid ${
                                                        layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                            ?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                                                        }`,
                                                }}
                                            >
                                                <span>Opening Hours:</span>
                                                <span className="whitespace-nowrap">
                                                    {moment(storeToDayOpeningTime, 'HH:mm').format('h:mm A')} –{' '}
                                                    {moment(storeToDayClosingTime, 'HH:mm').format('h:mm A')}
                                                </span>
                                            </div>
                                        </div>

                                    </>
                                )}
                            </div>
                        </>
                    :
                        <div className="flex justify-center">
                            {![
                                "marketingpreferences","review","thank-you","track-order",
                                "place-order","payment","contact-us","about-us",
                                "allergens","privacy-policy","terms-conditions","subscription"
                            ].some((term) => splitToArray?.[0]?.includes(term)) && (

                                <div className="w-full max-w-md flex flex-row gap-2 mt-3">

                                    {/* 🔘 Order Now */}
                                    <button
                                        onClick={() => setAtFirstLoad(true)}
                                        type="button"
                                        className="
                                            w-full
                                            text-center px-4 py-3
                                            rounded-lg border text-md font-bold uppercase
                                            transition-all duration-200 hover:scale-105
                                        "
                                        style={{
                                        background: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.activeButtonFontColor || WHITE_COLOR,
                                        color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || WHITE_COLOR,
                                        border: `1px solid ${
                                                layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                                            }`,
                                        }}
                                    >
                                        Order Now
                                    </button>

                                    {/* 🕒 Opening Hours */}
                                    <div
                                        className="
                                            w-full
                                            flex flex-col items-center justify-center
                                            px-3 py-2
                                            rounded-lg text-sm font-medium
                                            transition-all duration-200 hover:scale-105
                                        "
                                        style={{
                                        background: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                                        color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                                        border: `1px solid ${
                                                layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                                            }`,
                                        }}
                                    >
                                        <span className="text-xs">Opening Hours</span>
                                        <span className="whitespace-nowrap font-semibold">
                                        {moment(storeToDayOpeningTime, "HH:mm").format("h:mm A")} –{" "}
                                        {moment(storeToDayClosingTime, "HH:mm").format("h:mm A")}
                                        </span>
                                    </div>

                                </div>
                            )}
                        </div>

                }
            </header>
            
            {
                selectedStoreDetails === null &&
                <div
                    className="sticky top-0 z-40 shadow-lg transition-all duration-200"
                    style={{
                        background: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor ||BLACK_COLOR,

                        color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || LIGHT_BLACK_COLOR,

                        border: `1px solid ${layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR 
                        }`,
                    }}
                >
                    <div className="flex items-center justify-between gap-4 lg:px-[103px] sm:px-[10px] px-4 py-3">
                        {/* Left Side */}
                        <div className="flex items-center gap-3">

                            {/* Icon */}
                            <svg viewBox="0 0 64 64" className="w-8 h-8 shrink-0">
                            {/* Pin */}
                            <path
                                d="M32 4C21 4 12 13 12 24c0 14 20 36 20 36s20-22 20-36C52 13 43 4 32 4zm0 28a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                                fill={layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor}
                            />

                            {/* Curved base */}
                            <path
                                d="M16 52c4 6 12 8 16 8s12-2 16-8"
                                fill="none"
                                stroke={layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            </svg>

                            {/* Text */}
                            <p className="text-sm md:text-[13px] leading-snug font-medium">
                                Please select your <span className="font-semibold uppercase">{layoutWebsiteModification?.brand?.name}</span> to see the relevant menu and offers.
                            </p>

                        </div>

                        {/* Button */}
                        <button
                            onClick={() => setAtFirstLoad(true)}
                            type="button"
                            className="uppercase shrink-0 px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg
                                    transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                            style={{
                            color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                            border: `1px solid ${
                                layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
                            }`,
                            }}
                        >
                            Select
                        </button>
                    </div>
                </div>
            }
        </>
    )
}