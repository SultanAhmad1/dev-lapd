"use client";
import { useContext, useEffect, useState } from "react";
import { useGetQueryAutoUpdate } from "../reactquery/useQueryHook";
import { usePathname } from "next/navigation";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function ThankYouDetail() 
{
    const { websiteModificationData, setSelectedStoreDetails, setAtFirstLoad} = useContext(HomeContext)
    const { metaDataToDisplay, setMetaDataToDisplay } = useContext(ContextCheckApi)

    const router = usePathname()
    const stringToArray = router?.split('/').filter(segment => segment)

    const [getTrackOrderData, setGetTrackOrderData] = useState(null);
    const [isHover, setIsHover] = useState(false);
    
    useEffect(() => {
        
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    useEffect(() => {
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
        setAtFirstLoad(false)
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
    }
    
    const {isLoading: getTrackLoading, isError: getTrackError} = useGetQueryAutoUpdate("track-order", `/website-track-order/${stringToArray?.[1]}`, onGetSuccess, onGetError, stringToArray?.[1] ? true : false)

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
