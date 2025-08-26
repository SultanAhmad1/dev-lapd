"use client"
import { ContextCheckApi } from "@/app/layout";
import HomeContext from "@/contexts/HomeContext";
import React, { useContext, useEffect } from "react";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function PrivacyComponent() 
{
    const {
        websiteModificationData,
        selectedStoreDetails,
    } = useContext(HomeContext);

    const {
        setMetaDataToDisplay, metaDataToDisplay
    } = useContext(ContextCheckApi)

    useEffect(() => {
        if (websiteModificationData) {
        setMetaDataToDisplay((prevData) => ({
            ...prevData,
            title: `Privacy Policy - ${websiteModificationData?.brand?.name}`,
            contentData: "",
        }));
        }
    }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);
    
    return(
        <>
            <Header />
            <Banner />

            <div className={`w-full flex items-center justify-center ${websiteModificationData?.privacy ? "" : "h-[40vh]"}`}>
                {
                    websiteModificationData?.privacy === null ?
                        <h1 className="font-bold text-lg">
                            Privacy policy Text...,
                        </h1>
                    :
                    <div className="w-full max-w-1xl mx-auto mt-6 mb-12 px-4 sm:px-5 text-left leading-relaxed prose prose-base">
                        <div dangerouslySetInnerHTML={{ __html: websiteModificationData?.privacy?.privacy_policy }} />
                    </div>

                }
            </div>
            <Footer />
        </>
    )
}
