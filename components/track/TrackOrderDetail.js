"use client";
import { BRAND_GUID, IMAGE_URL_Without_Storage} from "@/global/Axios";

import React, { useContext, useEffect, useState } from "react";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import { useGetQueryAutoUpdate, usePostMutationHook } from "../reactquery/useQueryHook";
import MyOrders from "./children/MyOrders";
import Total from "./children/Total";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";

export default function TrackOrderDetail({orderId}) 
{
    const { websiteModificationData, setSelectedStoreDetails } = useContext(HomeContext)
    const { setMetaDataToDisplay, metaDataToDisplay} = useContext(ContextCheckApi)

    const [isHover, setIsHover] = useState(false);
    
    useEffect(() => {
        if (websiteModificationData) {
        setMetaDataToDisplay((prevData) => ({
            ...prevData,
            title: `Track Order - ${websiteModificationData?.brand?.name}`,
            contentData: "",
        }));
        }
    }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);
    
    // 0740225786
    const [getTrackOrderData, setGetTrackOrderData] = useState(null);
    
    const [isDeliveryFree, setIsDeliveryFree] = useState(false);
    const [couponTotal, setCouponTotal] = useState(0);
    
    
    const [orderHash, setOrderHash] = useState("")
   
    
    const onGetError = (error) => {
        window.alert("There is something went wrong!. Please refresh and try again 9.", error)
    }

    const onGetSuccess = (data) => {

        const { trackOrder } = data?.data

        const {location} = trackOrder

        const selectedStoreDetail = {
            address: location?.address,
            display_id: location?.location_guid,
            email: null,
            store: location?.name,
            telephone: location?.telephone
        }

        setSelectedStoreDetails(selectedStoreDetail)
        setGetTrackOrderData(data)
        setOrderHash(data?.data?.trackOrder?.external_order_number)

        
        let minusAmount = 0

        for(let orderCoupon of data?.data?.trackOrder?.order_coupons)
        {
            if(orderCoupon?.coupon?.free_delivery === 1)
            {
                setIsDeliveryFree(true)
            }
            else
            {
                setIsDeliveryFree(false)
            }
            minusAmount = parseFloat(minusAmount) + parseFloat(orderCoupon?.coupon_discount_applied)
        }

        
        setCouponTotal(minusAmount)
    }

    const {isLoading: getTrackLoading, isError: getTrackError} = useGetQueryAutoUpdate("track-order", `/website-track-order/${orderId}`, onGetSuccess, onGetError, orderId ? true : false)

    const handleOrderHashTypeByUser = (event) =>
    {
        const {value, name} = event.target
        setOrderHash(value)

    }

    // const getTrakcOrderDetailByOrderCode = async () =>
    // {
    //     try 
    //     {
    //         const data = {
    //             orderHash: orderHash,
    //             brandGUID: BRAND_GUID
    //         }   
    //         const response = await axiosPrivate.post(`/track-order-by-hash-order`,data)
    //         setBrand(response?.data?.data?.trackOrder?.brand)
    //         setLocation(response?.data?.data?.trackOrder?.location)
    //         setAddress(response?.data?.data?.trackOrder?.address)
    //         setOrderHash(response?.data?.data?.trackOrder?.order_hash)
    //         setTrackorders(response?.data?.data?.trackOrder)

    //         setDiscountamount((response?.data?.data?.trackOrder?.order_amount_discounts === null) ? 0 : response?.data?.data?.trackOrder?.order_amount_discounts?.amount_discount_applied)
        
    //     } 
    //     catch (error) 
    //     {
    //     }
    // }

    const handleSearchOrderCode = (e) =>
    {
        e.preventDefault()
        
        const hashData = {
            orderHash: orderHash,
            brandGUID: BRAND_GUID
        } 

        hashMutate(hashData)
    }

    const onHashError = (error) => {
    }

    const onHashSuccess = (data) => {
        setGetTrackOrderData(data?.data)
        setOrderHash(data?.data?.data?.trackOrder?.order_hash)

        const newUrl = `/track-order/${data.data.data.trackOrder.external_order_id}`;
        window.history.replaceState(router, '', newUrl);
    }

    const { mutate: hashMutate, isLoading,isSuccess, reset, isError } = usePostMutationHook('track-by-hash', '/track-order-by-hash-order', onHashSuccess, onHashError)

    if(isSuccess)
    {
        reset()
        return
    }

     const BLACK_COLOR = '#000';
    const WHITE_COLOR = '#fff';
    const LIGHT_BLACK_COLOR = '#444';

    const buttonStyle = {
        '--track-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
        '--track-btn-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
        '--track-btn-hover-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR,
        '--track-btn-hover-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR,
        '--track-btn-border-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
        '--track-btn-hover-border-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
    };

    const orderSteps = ['created', 'live', 'out_for_delivery', 'complete'];
    
    const currentStatus = getTrackOrderData?.data?.trackOrder?.status;
    const currentStep = orderSteps.findIndex((step) =>
        step.toLowerCase().includes(currentStatus)
    );

    const activeColor = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR;
    const activeButtonColor = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
    
    if(!getTrackOrderData)
    {
        return(
            <div className={`${getTrackOrderData ? "" : "h-[60vh]"} flex flex-col items-center justify-center bg-gray-100 px-1 py-3`}>
                <div className="w-full max-w-7xl">
                    <div className="bg-white p-4 rounded-md mb-6 text-center">
                        <h2 className="text-lg font-semibold text-black mb-5">Order has been expired.</h2>
                        <a 
                            href="/" 
                            className="px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center"
                            onMouseLeave={() => setIsHover(false)}
                            onMouseEnter={() => setIsHover(true)}
                            style={{
                            backgroundColor: isHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,

                            color: isHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,

                            border: isHover
                                ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`
                                : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                            }}
                        >Continue to menu</a>
                    </div>
                </div>
            </div>
        )
    }
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-1 py-8">
            <div className="w-full max-w-7xl">
                <div className="mb-6 bg-white rounded-lg shadow-xl  p-8">
                    <h1 className="text-2xl font-semibold mb-4">Track Order</h1>
                    <hr className="border-gray-300" />
                    
                    <form
                        onSubmit={handleSearchOrderCode}
                        className="flex w-full mt-4"
                        >
                        <div className="flex w-full flex-nowrap rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-cyan-500">
                            <input
                                type="text"
                                name="orderHash"
                                placeholder="Enter your order code"
                                value={orderHash}
                                onChange={handleOrderHashTypeByUser}
                                className="flex-1 px-4 py-2 focus:outline-none border-r border-gray-300 w-3/4"
                                style={{
                                    backgroundColor: 'white',
                                }}
                            />
                            <button
                            type="submit"
                            disabled={isLoading}
                            className="shrink-0 bg-black text-white px-6 py-2 font-medium transition duration-200 hover:bg-gray-900 disabled:opacity-50"
                            style={{
                                backgroundColor:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor || 'black',
                                color:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonColor || 'white',
                            }}
                            >
                            Search
                            </button>
                        </div>
                    </form>

`

                </div>
            
                {getTrackOrderData?.data?.isExpired && (
                    <div className="bg-white p-4 rounded-md mb-6 text-center">
                        <h1 className="text-lg font-semibold text-black mb-5">Order has been expired.</h1>
                        <a 
                            href="/" 
                            className="px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center"
                            onMouseLeave={() => setIsHover(false)}
                            onMouseEnter={() => setIsHover(true)}
                            style={{
                            backgroundColor: isHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,

                            color: isHover
                                ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor
                                : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,

                            border: isHover
                                ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`
                                : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                            }}
                        >Continue to menu</a>
                    </div>
                )}

                <div className="w-full bg-white rounded-lg shadow-xl  p-8 mb-4">
                    <div className="relative flex items-center justify-between">
                        {/* Line Behind Circles */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2 z-0" />

                        {/* Line Fill */}
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-gray-500 z-10 transition-all duration-700 ease-in-out"
                            style={{
                                width: `${(currentStep / (orderSteps.length - 1)) * 100}%`,
                                transform: 'translateY(-50%)',
                                backgroundColor: websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                ?.buttonBackgroundColor ?? "#E5E7EB", // gray-200
                                    borderColor: websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                ?.buttonBackgroundColor ?? "#D1D5DB",     // gray-300
                                    color: websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                ?.buttonColor ?? "#9CA3AF"              // white or gray-400
                            }}
                        />

                        {/* 
                            Steps 
                            1.-) created => Order Received
                            2.-) live => Order in Kitchen
                            3.-) out_for_delivery => Out For Delivery
                            4.-) complete => Delivered
                        */}

                        {orderSteps.map((label, idx) => {
                            let updateLabel = "";

                            if (label === "created") {
                                updateLabel = "Order Received";
                            } else if (label === "live") {
                                updateLabel = "In The Kitchen";
                            } else if (label === "out_for_delivery") {
                                updateLabel = "Out For Delivery";
                            } else if (label === "complete") {
                                updateLabel = "Delivered";
                            } else {
                                updateLabel = label;
                            }

                            const isActive = idx <= currentStep;
                            const isCurrent = idx === currentStep;
                            const isCompleted = currentStatus === "complete";

                            return (
                                <div
                                    key={label}
                                    className="relative z-20 flex flex-col items-center text-center w-1/4"
                                >
                                    {/* <div
                                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 shadow-md
                                        ${isActive
                                            ? "bg-black border border-black text-white"
                                            : "bg-gray-200 border border-gray-300 text-gray-400"
                                        }
                                        `}
                                    > */}
                                    <div
                                        className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 shadow-md"
                                        style={{
                                            backgroundColor: isActive ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonBackgroundColor : "#E5E7EB", // gray-200
                                            borderColor: isActive ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonBackgroundColor : "#D1D5DB",     // gray-300
                                            color: isActive ? websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                        ?.buttonColor : "#9CA3AF"              // white or gray-400
                                        }}
                                    >
                                        {/* Tick if completed OR current step is complete */}
                                        {(idx < currentStep || (isCurrent && isCompleted)) && (
                                        <svg
                                            className="w-5 h-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                            clipRule="evenodd"
                                            />
                                        </svg>
                                        )}

                                        {/* Loader if current step and NOT complete */}
                                        {isCurrent && !isCompleted && (
                                        <svg
                                            className="w-5 h-5 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            />
                                            <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>
                                        )}
                                    </div>

                                    <span
                                        className={`mt-2 text-xs text-center ${
                                        isActive ? "text-black font-bold" : "text-gray-400"
                                        }`}
                                    >
                                        {updateLabel}
                                    </span>
                                </div>


                            );
                        })}

                    </div>
                </div>

                {/* <DeliveryProgress currentStep={2} /> */}
                
                <div className="flex flex-col md:flex-row md:gap-10">
                    <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-6 mb-6 md:mb-0">
                        <h3 className="text-xl font-semibold mb-4">My Order</h3>
                        <div className="space-y-4">
                        {getTrackOrderData?.data?.trackOrder?.order_lines?.map((orderLine) => (
                            <MyOrders key={orderLine?.id} orderLine={orderLine} />
                        ))}

                        {getTrackOrderData?.data?.trackOrder?.order_coupons?.map((record, index) => (
                            <div key={index} className="pt-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                {record?.coupon?.name}: {record?.coupon?.value}
                                {record?.coupon?.discount_type === 'P' ? '%' : '£'}
                                </span>
                                <span className="text-sm text-gray-500">
                                (&pound;{getAmountConvertToFloatWithFixed(record?.coupon_discount_applied, 2)})
                                </span>
                            </div>
                            </div>
                        ))}
                        </div>

                        <div className="mt-6">
                        <Total
                            subtotal={getTrackOrderData?.data?.trackOrder?.order_subtotal}
                            deliveryCharge={
                            isDeliveryFree
                                ? parseFloat(0).toFixed(2)
                                : getTrackOrderData?.data?.trackOrder?.delivery_charge
                            }
                            serviceCharge={getTrackOrderData?.data?.trackOrder?.service_charge}
                            discountAmount={parseFloat(
                            couponTotal ||
                                getTrackOrderData?.data.trackOrder?.order_amount_discounts?.amount_discount_applied ||
                                0
                            ).toFixed(2)}
                        />
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6 h-[400px] overflow-y-auto">

                        <h3 className="text-xl font-semibold mb-4">Order Details</h3>

                        <div className="space-y-4">
                        <div>
                            <p className="font-medium text-gray-700 flex">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 64 64" 
                                    width="24" 
                                    height="24"
                                    >
                                    <g data-name="Building Store">
                                        <path 
                                        d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z" 
                                        style={{ fill: "#232328" }} 
                                        />
                                        <path 
                                        style={{ fill: "#232328" }} 
                                        d="M29.87 10h4.45l1.2-3h-6.08l.43 3z" 
                                        />
                                        <path 
                                        d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z" 
                                        style={{ fill: "#232328" }} 
                                        />
                                        <path 
                                        d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z" 
                                        style={{ fill: "#232328" }} 
                                        />
                                    </g>
                                </svg>

                                <span className="text-lg font-bold">Store</span>
                            </p>
                            <p className="text-gray-600">
                            {getTrackOrderData?.data?.trackOrder?.location?.name}
                            </p>
                        </div>

                        <div>
                            <p className="flex font-medium text-gray-700">
                                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24">
                                    <g clipPath="url(#clip0)">
                                        <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0">
                                            <path transform="translate(2 2)" d="M0 0h20v20H0z"></path>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span className="text-lg font-bold">Address</span>
                            </p>
                            <p className="text-gray-600">
                            {`${getTrackOrderData?.data?.trackOrder?.address?.house_no_name} ${getTrackOrderData?.data?.trackOrder?.address?.street1}, ${getTrackOrderData?.data?.trackOrder?.address?.street2}`}
                            </p>
                        </div>

                        <div>
                            <p className="flex ont-medium text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                                    <path d="M6.108 20H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2h-2.108c-.247-2.774-1.071-7.61-3.826-9 2.564-1.423 3.453-4.81 3.764-7H20a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2h2.17c.311 2.19 1.2 5.577 3.764 7-2.755 1.39-3.579 6.226-3.826 9zM9 16.6c0-1.2 3-3.6 3-3.6s3 2.4 3 3.6V20H9z" />
                                </svg>
                                <span className="text-lg font-bold">Estimated Delivery Time</span>
                            </p>
                            <p className="text-gray-600">
                            {moment(getTrackOrderData?.data?.trackOrder?.estimated_delivery_time).format("HH:mm A")}
                            </p>
                        </div>

                        <div>
                            <p className="flex font-medium text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0ZM12,8a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,8Z" /></svg>
                                
                                <span className="text-lg font-bold">Driver Instructions</span>
                            </p>
                            <p className="text-gray-600">
                            {getTrackOrderData?.data?.trackOrder?.address?.driver_instructions || 'No instruction provided'}
                            </p>
                        </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
