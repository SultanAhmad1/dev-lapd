"use client";
import { axiosPrivate, BLACK_COLOR, BRAND_GUID, IMAGE_URL_Without_Storage, LIGHT_BLACK_COLOR, WHITE_COLOR } from "@/global/Axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import notOrderRecieved from "/public/gallery/trackorder/track-icon-1.svg"
import orderRecieved from "/public/gallery/trackorder/track-icon-hover-1.svg"

import notInTheKitchen from "/public/gallery/trackorder/track-icon-2.svg"
import inTheKitchen from "/public/gallery/trackorder/track-icon-hover-2.svg"

import notOutForDelivery from "/public/gallery/trackorder/track-icon-3.svg"
import outForDelivery from "/public/gallery/trackorder/track-icon-hover-3.svg"

import notCompleted from "/public/gallery/trackorder/track-icon-4.svg"
import Completed from "/public/gallery/trackorder/track-icon-hover-4.svg"
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import { useGetQueryAutoUpdate, usePostMutationHook } from "../reactquery/useQueryHook";
import MyOrders from "./children/MyOrders";
import Total from "./children/Total";
import Image from "next/image";
import OrderStatusImage from "./children/OrderStatusImage";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";

export default function TrackOrderDetail() 
{
    const { websiteModificationData } = useContext(HomeContext)
    const { setMetaDataToDisplay} = useContext(ContextCheckApi)

    useEffect(() => {
        if(websiteModificationData)
        {
            const metaHeadingData = {
                title: websiteModificationData?.brand?.name,
                contentData: websiteModificationData?.brand?.name,
                iconImage: IMAGE_URL_Without_Storage+"/"+websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon,
                singleItemsDetails: {
                    title: "",
                    description: "",
                    itemImage: "",
                    keywords: "",
                    url: ""
                }
            }
            setMetaDataToDisplay(metaHeadingData)
        }
    }, [websiteModificationData]);

    const router = usePathname()
    const stringToArray = router?.split('/').filter(segment => segment)
    
    const [getTrackOrderData, setGetTrackOrderData] = useState(null);
    
    const [isDeliveryFree, setIsDeliveryFree] = useState(false);
    const [couponTotal, setCouponTotal] = useState(0);
    
    
    const [orderhash, setOrderhash] = useState("")
   
    // useEffect(() => 
    // {
    //     const getTrackOrderDetails = async () =>
    //     {
    //         try 
    //         {
    //             const data = {
    //                 guid: stringToArray?.[1],
    //             }   
    //             const response = await axiosPrivate.post(`/website-track-order`,data)
                
                
    //             setBrand(response?.data?.data?.trackOrder?.brand)
    //             setLocation(response?.data?.data?.trackOrder?.location)
    //             setAddress(response?.data?.data?.trackOrder?.address)
    //             setOrderhash(response?.data?.data?.trackOrder?.order_hash)
    //             setTrackorders(response?.data?.data?.trackOrder)
    
    //             setDiscountamount((response?.data?.data?.trackOrder?.order_amount_discounts === null) ? 0 : response?.data?.data?.trackOrder?.order_amount_discounts?.amount_discount_applied)
    //             setTimeout(() => {
    //                 setLoader(!loader)
    //             }, 3000);
    //         } 
    //         catch (error) 
    //         {
    //             setTimeout(() => {
    //                 setLoader(!loader)
    //             }, 3000);
    //         }
    //     }
    //     getTrackOrderDetails()
    // }, [])
    
    const onGetError = (error) => {
        // window.alert("There is something went wrong!. Please refresh and try again.")
    }

    const onGetSuccess = (data) => {
        setGetTrackOrderData(data)
        setOrderhash(data?.data?.trackOrder?.order_hash)

        
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

    const {isLoading: getTrackLoading, isError: getTrackError} = useGetQueryAutoUpdate("track-order", `/website-track-order/${stringToArray?.[1]}`, onGetSuccess, onGetError, stringToArray?.[1] ? true : false)

    const handleOrderHashTypeByUser = (event) =>
    {
        const {value, name} = event.target
        setOrderhash(value)

    }

    // const getTrakcOrderDetailByOrderCode = async () =>
    // {
    //     try 
    //     {
    //         const data = {
    //             orderhash: orderhash,
    //             brandGUID: BRAND_GUID
    //         }   
    //         const response = await axiosPrivate.post(`/track-order-by-hash-order`,data)
    //         setBrand(response?.data?.data?.trackOrder?.brand)
    //         setLocation(response?.data?.data?.trackOrder?.location)
    //         setAddress(response?.data?.data?.trackOrder?.address)
    //         setOrderhash(response?.data?.data?.trackOrder?.order_hash)
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
            orderhash: orderhash,
            brandGUID: BRAND_GUID
        } 

        hashMutate(hashData)
    }

    const onHashError = (error) => {
    }

    const onHashSuccess = (data) => {
        setGetTrackOrderData(data?.data)
        setOrderhash(data?.data?.data?.trackOrder?.order_hash)

        const newUrl = `/track-order/${data.data.data.trackOrder.external_order_id}`;
        window.history.replaceState(router, '', newUrl);
    }

    const { mutate: hashMutate, isLoading,isSuccess, reset, isError } = usePostMutationHook('track-by-hash', '/track-order-by-hash-order', onHashSuccess, onHashError)

    if(isSuccess)
    {
        reset()
        return
    }
    
    return(
        <div className='e5ald0m1m2amc5trackorder-desk'>
            <div className="m3m4m5gim6trackorder-desk">
                <div className="hmg1trackorder-desk">
                    <div className="hmg1mhb0trackorder-desk">
                        <div className='mimjepmkmlmmtrackorder-desk'>
                            <h3 className="eik5ekk6trackorder-desk">
                                <span className="d1trackorder-desk-span">Track Order</span>
                            </h3>
                        </div>

                        <hr className='edfhmthttrackorder-desk'></hr>

                        <div className='mimjepmkmlmmtrackorder-desk'>
                            <div className='d1g1trackorder-desk'>
                                <div className="allzc5trackorder-desk">
                                    <div className="alamd1g1trackorder-desk">
                                        <span className="chd2cjd3b1trackorder-desk">Enter your order code: </span>
                                    </div>
                                </div>

                                <form className="btautrackorder-window" onSubmit={handleSearchOrderCode}>
                                    <input 
                                        type="text"     
                                        style={{border: `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR}`,}}
                                        placeholder="Enter your order code" 
                                        name="orderhash" 
                                        value={orderhash} 
                                        className="track_order" 
                                        onChange={handleOrderHashTypeByUser}
                                    />
                                    <button 
                                        type="submit" 
                                        className='trackorder_btn' 
                                        disabled={isLoading}

                                        style={{
                                            '--track-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                                            '--track-btn-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
                                            '--track-btn-hover-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR,
                                            '--track-btn-hover-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR,
                                            '--track-btn-border-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
                                            '--track-btn-hover-border-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
                                        }} 

                                    >
                                        Search
                                    </button>
                                </form>

                                <div className="altrackorder-desk">
                                    <div className="spacer _40"></div>
                                    <div className="edhtb9d1trackorder-desk"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div></div>
            </div>

                <>  
                    {
                        getTrackOrderData?.data?.isExpired &&
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
                    }

                    <div className="d1g1trackordericon-desk">
                        <div className='gmgngoalamgptrackordericon-desk'>
                            <div className="eeb0trackordericon-desk">
                                <div className='b5grektrackorder-desk'>
                                    
                                    <OrderStatusImage status={false} imageSrc={(getTrackOrderData?.data?.trackOrder?.status === 'created') ? orderRecieved.src : notOrderRecieved.src} />
                                    <OrderStatusImage status={false} imageSrc={(getTrackOrderData?.data?.trackOrder?.status === 'live') ? inTheKitchen.src : notInTheKitchen.src} />
                                    <OrderStatusImage status={false} imageSrc={(getTrackOrderData?.data?.trackOrder?.status === 'out_for_delivery') ? outForDelivery.src : notOutForDelivery.src} />
                                    <OrderStatusImage status={true} imageSrc={(getTrackOrderData?.data?.trackOrder?.status === 'complete') ? Completed.src : notCompleted.src} />

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="m3m4m5gim6mytrackorder-desk">

                        <div className="hmg1mytrackorder-desk">
                            <div className="hmg1mhb0mytrackorder-desk">
                                <div className='mimjepmkmlmmchemytrackorder-desk'>
                                    <h3 className="eik5ekk6mytrackorder-desk">
                                        <span className="d1mytrackorder-desk-span">My Order</span>
                                    </h3>

                                    <div className="afCart">
                                        <div className="">
                                            <div className="dtCx-Cy-Cz-D-0-d1-Checkout">

                                                <div className="dze0checkout"></div>

                                                <div className="alame1e2checkout">
                                                    <div className="b7avfpfqcheckout-details">
                                                        {/* li start from here */}
                                                        {
                                                            getTrackOrderData?.data?.trackOrder?.order_lines?.map((orderLine, index) => 
                                                            {
                                                                return(
                                                                    <MyOrders key={orderLine?.id} {...{orderLine}} />
                                                                )
                                                            })
                                                        }


                                                        {
                                                            parseInt(getTrackOrderData?.data?.trackOrder?.order_coupons?.length) > parseInt(0) &&

                                                            getTrackOrderData?.data?.trackOrder?.order_coupons?.map((record,index) => {
                                                                return(
                                                                    <div className="es-et-checkout" key={index}>
                                                                        <div className="al-d5-eg-bh-dd-et-eu-d1-checkout-edit-item d1">
                                                                            <div className="bodgdfcheckout-qty">
                                                                                
                                                                            </div>
                                                                            <div className="al-am-cj-ew-checkout">
                                                                                <span className="bo-bp-df-cv-checkout-item-header">{record?.coupon?.name}: {record?.coupon?.value}{record?.coupon?.discount_type === "P" ? "%" : "£"}</span>
                                                                                
                                                                            </div>
                                                                            <div className="f1-al-am-checkout-item-qty">
                                                                                <span className="gy-e2-gz-checkout-item-qty-span">(&pound;{getAmountConvertToFloatWithFixed(record?.coupon_discount_applied,2)})</span>
                                                                            </div>
                                                                        </div>

                                                                        <hr style={{marginBottom: "10px", marginTop: "10px"}}/>
                                                                    </div>
                                                                )
                                                            }) 
                                                        }

                                                    </div>
                                                </div>

                                                <div className="dxc6checkout"></div>
                                                {
                                                    parseInt(getTrackOrderData?.data?.trackOrder?.order_coupons?.length) > parseInt(0) ?
                                                        
                                                        <Total 
                                                            subtotal={getTrackOrderData?.data?.trackOrder?.order_subtotal}
                                                            deliveryCharge={isDeliveryFree ? parseFloat(0).toFixed(2) : getTrackOrderData?.data?.trackOrder?.delivery_charge}
                                                            serviceCharge={getTrackOrderData?.data?.trackOrder?.service_charge}
                                                            discountAmount={parseFloat(couponTotal).toFixed(2)}
                                                        />   
                                                    :
                                                        <Total 
                                                            subtotal={getTrackOrderData?.data?.trackOrder?.order_subtotal}
                                                            deliveryCharge={getTrackOrderData?.data?.trackOrder?.delivery_charge}
                                                            serviceCharge={getTrackOrderData?.data?.trackOrder?.service_charge}
                                                            discountAmount={((getTrackOrderData?.data.trackOrder?.order_amount_discounts === null) ? 0 : getTrackOrderData?.data.trackOrder?.order_amount_discounts?.amount_discount_applied)}
                                                        />
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div></div>
                        </div>

                        <div className="d1g1mytrackorder-desk">
                            <div className='gmgngoalamgpmytrackorder-desk'>
                                <div className="eeb0trackorder-desk">
                                    <div className='b5grekmytrackorder-desk'>

                                        <div className='mimjepmkmlmmchemytrackorderdetail-desk'>

                                            <h3 className="eik5ekk6mytrackorder-desk">
                                                <span className="d1mytrackorder-desk-span">Order Details</span>
                                            </h3>

                                            <div>
                                                <div className='d1g1mytrackorder-desk'>
                                                    <div className="allzc5mytrackorder-desk" >
                                                        <div className="kgmytrackorder-desk">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                                                                <g data-name="Building Store">
                                                                    <path d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z" style={{ fill: "#232328" }} /><path style={{ fill: "#232328" }} d="M29.87 10h4.45l1.2-3h-6.08l.43 3z" /><path d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z" style={{ fill: "#232328" }} /><path d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z" style={{ fill: "#232328" }} />
                                                                </g>
                                                            </svg>
                                                        </div>

                                                        <div className="alamd1g1mytrackorder-desk">
                                                            <span className="chd2cjd3b1mytrackorder-desk">Store</span>
                                                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                    {/* {(brand !== null) && brand?.name} {(location !== null) && location?.name} */}
                                                                    {getTrackOrderData?.data?.trackOrder?.location?.name}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="almytrackorder-desk">
                                                        <div className="spacer _40"></div>
                                                        <div className="edhtb9d1mytrackorder-desk"></div>
                                                    </div>
                                                </div>

                                                <div className='d1g1mytrackorder-desk'>
                                                    <div className="allzc5mytrackorder-desk" >
                                                        <div className="kgmytrackorder-desk">
                                                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdmytrackorder">
                                                                <g clipPath="url(#clip0)">
                                                                    <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0">
                                                                        <path transform="translate(2 2)" d="M0 0h20v20H0z"></path>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </div>

                                                        <div className="alamd1g1mytrackorder-desk">
                                                            <span className="chd2cjd3b1mytrackorder-desk">{getTrackOrderData?.data?.trackOrder?.address?.postcode}</span>
                                                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                    {
                                                                        `${getTrackOrderData?.data?.trackOrder?.address?.house_no_name} ${getTrackOrderData?.data?.trackOrder?.address?.street1}, ${getTrackOrderData?.data?.trackOrder?.address?.street2}`
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="almytrackorder-desk">
                                                        <div className="spacer _40"></div>
                                                        <div className="edhtb9d1mytrackorder-desk"></div>
                                                    </div>
                                                </div>

                                                <div className='d1g1mytrackorder-desk'>
                                                    <div className="allzc5mytrackorder-desk" >
                                                        <div className="kgmytrackorder-desk">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.108 20H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2h-2.108c-.247-2.774-1.071-7.61-3.826-9 2.564-1.423 3.453-4.81 3.764-7H20a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2h2.17c.311 2.19 1.2 5.577 3.764 7-2.755 1.39-3.579 6.226-3.826 9zM9 16.6c0-1.2 3-3.6 3-3.6s3 2.4 3 3.6V20H9z" /></svg>
                                                        </div>

                                                        <div className="alamd1g1mytrackorder-desk">
                                                            <span className="chd2cjd3b1mytrackorder-desk">Estimated Delivery Time</span>
                                                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                    {
                                                                        moment(getTrackOrderData?.data?.trackOrder?.estimated_delivery_time).format("HH:mm A")
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="almytrackorder-desk">
                                                        <div className="spacer _40"></div>
                                                        <div className="edhtb9d1mytrackorder-desk"></div>
                                                    </div>
                                                </div>

                                                <div className='d1g1mytrackorder-desk'>
                                                    <div className="allzc5mytrackorder-desk" >
                                                        <div className="kgmytrackorder-desk">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0ZM12,8a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,8Z" /></svg>
                                                        </div>

                                                        <div className="alamd1g1mytrackorder-desk">
                                                            <span className="chd2cjd3b1mytrackorder-desk">Driver Instructions</span>
                                                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                    {
                                                                        getTrackOrderData?.data?.trackOrder?.address?.driver_instructions === null
                                                                        ?
                                                                        "No instruction provided"
                                                                        :
                                                                        getTrackOrderData?.data?.trackOrder?.address?.driver_instructions

                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="almytrackorder-desk">
                                                        <div className="spacer _40"></div>
                                                        <div className="edhtb9d1mytrackorder-desk"></div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="gqtrackorder-desk"></div>
                            </div>
                        </div>

                    </div>
                </>
            
        </div>
    )
}
