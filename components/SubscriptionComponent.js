'use client'
import React, { useContext, useEffect } from "react";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function SubscriptionComponent() 
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
        title: `Subscription - ${websiteModificationData?.brand?.name}`,
        contentData: "",
      }));
    }
  }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);

    return(
      <>
        <Header />
        <Banner />

        {/* <div className={`w-full flex items-center justify-center text-center ${websiteModificationData?.allergens ? "" : "h-[40vh]"}`}> */}
        <div className={`w-full flex flex-col items-center justify-center text-center h-[40vh]`}>
            {/* {
                websiteModificationData?.allergens === null ?
                    <h1 className="font-bold text-lg">
                        Allergens Text...,
                    </h1>
                :
                    <div dangerouslySetInnerHTML={{ __html: websiteModificationData?.allergens?.allergens }} />
            } */}

            <h1 className="text-4xl font-bold mb-4">
              Our unsubscribing portal is not working right now.
            </h1>
            <p className="text-base">
              Please can you send us a message at <strong>hi@lapdfood.co.uk</strong> with the contact details you would like us to remove from our marketing
            </p>

        </div>
        <Footer />
      </>
    )
}
