'use client'
import React, { useContext, useEffect } from "react";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";

export default function AllergensComponent() 
{
   const {
        websiteModificationData,
    } = useContext(HomeContext);

    const {
        setMetaDataToDisplay, metaDataToDisplay
    } = useContext(ContextCheckApi)

    useEffect(() => {
        if (websiteModificationData) {
        setMetaDataToDisplay((prevData) => ({
            ...prevData,
            title: `Allergens - ${websiteModificationData?.brand?.name}`,
            contentData: "",
        }));
        }
    }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);

    return(
        <>
            <Header />
            <Banner />

            <div className={`w-full flex items-center justify-center text-center ${websiteModificationData?.allergens ? "" : "h-[40vh]"}`}>
                {
                    websiteModificationData?.allergens === null ?
                        <h1 className="font-bold text-lg">
                            Allergens Text...,
                        </h1>
                    :
                        <div dangerouslySetInnerHTML={{ __html: websiteModificationData?.allergens?.allergens }} />
                }
            </div>
            <Footer />
        </>
    )
}
