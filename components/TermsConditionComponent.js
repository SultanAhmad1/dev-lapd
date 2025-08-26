"use client"
import { ContextCheckApi } from "@/app/layout";
import HomeContext from "@/contexts/HomeContext";
import React, { useContext, useEffect } from "react";
import Banner from "./Banner";
import Header from "./Header";
import Footer from "./Footer";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function TermsConditionComponent() 
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
            title: `Terms and Conditions - ${websiteModificationData?.brand?.name}`,
            contentData: "",
        }));
        }
    }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);

    return(
        <>
            <Header />
            <Banner />

            <div className={`w-full flex items-center justify-center ${websiteModificationData?.terms ? "" : "h-[40vh]"}`}>
                {
                    websiteModificationData?.terms === null ?
                        <h1 className="font-bold text-lg">
                            Terms Text...,
                        </h1>
                    :
                        <div className="w-full max-w-1xl mx-auto mt-6 mb-12 px-4 sm:px-5 text-left leading-relaxed prose prose-base">
                            <div dangerouslySetInnerHTML={{ __html: websiteModificationData?.terms?.terms }} />
                        </div>
                }
            </div>
            <Footer />
        </>
    )
}
