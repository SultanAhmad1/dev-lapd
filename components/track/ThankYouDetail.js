"use client";
import { useContext, useEffect, useState } from "react";
import { useGetQueryAutoUpdate } from "../reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";
import { setLocalStorage } from "@/global/Store";
import { BRAND_SIMPLE_GUID } from "@/global/Axios";

export default function ThankYouDetail({orderId}) 
{
    const { websiteModificationData, setSelectedStoreDetails, setAtFirstLoad, setOrderGuid} = useContext(HomeContext)
    const { metaDataToDisplay, setMetaDataToDisplay } = useContext(ContextCheckApi)
    
    const [getTrackOrderData, setGetTrackOrderData] = useState(null);
    const [isHover, setIsHover] = useState(false);
    

    useEffect(() => {
          setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        setOrderGuid(null)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    useEffect(() => {

          setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        setOrderGuid(null)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        
        if (websiteModificationData) {
            setMetaDataToDisplay((prevData) => ({
                ...prevData,
                title: `Thank You - ${websiteModificationData?.brand?.name}`,
                contentData: "",
            }));
        }
    }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);

    const onGetError = (error) => {
        // window.alert("There is something went wrong!. Please refresh and try again.")
        setAtFirstLoad(false)
    }

    const onGetSuccess = (data) => {
        const { trackOrder } = data?.data

        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        setOrderGuid(null)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)

        setAtFirstLoad(false)
        if(trackOrder !== null && trackOrder !== undefined)
        {
            const {location} = trackOrder
    
            const selectedStoreDetail = {
                address: location?.address,
                display_id: location?.location_guid,
                email: null,
                store: location?.name,
                telephone: location?.telephone
            }
    
            setSelectedStoreDetails(selectedStoreDetail)
        }

        setGetTrackOrderData(data)
    }
    
    const {isLoading: getTrackLoading, isError: getTrackError, refetch: websiteTrackOrderRefetch} = useGetQueryAutoUpdate("track-order", `/website-track-order/${orderId?.[0]}`, onGetSuccess, onGetError, false)
    
    useEffect(() => {
        if(orderId?.[0] && parseInt(orderId?.[0]?.length) > parseInt(0))
        {
            websiteTrackOrderRefetch();
        }
    }, [orderId]);
    
    return(
        <div className="h-[60vh] flex justify-center items-center px-4 bg-gray-300">
            <div className="max-w-xl w-full text-center bg-white rounded-lg p-10">
                {getTrackOrderData?.data?.isExpired ? (
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-red-600">Order has been expired.</h1>
                    <a href="/" className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                        Continue to menu
                    </a>
                </div>
                ) : (
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Thank You.</h1>
                    <p className="text-base font-medium">
                        Your order has been received. You’ll get an email confirmation shortly.
                    </p>
                    {/* <p className="text-base font-medium">
                    You’ll get an email confirmation shortly, and we’ll send you a text message as soon as your order is ready for collection.
                    </p> */}
                    <a
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        href="/" 
                        className="px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center block"
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
                    >
                        Continue to menu
                    </a>
                </div>
                )}
            </div>
        </div>
    )
}
