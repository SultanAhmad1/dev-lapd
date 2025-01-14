"use client"
import Banner from "@/components/Banner";
import HomeContext from "@/contexts/HomeContext";
import React, { useContext } from "react";

export default function page() 
{
    const {
        setLoader,
        websiteModificationData,
        storeName,
        navigationCategories,
        navMobileIndex,
        setSelectedCategoryId,
        setSelectedItemId,
        setNavMobileIndex,
        dayOpeningClosingTime,
    } = useContext(HomeContext);
    
    return(
        <>
          <Banner 
            {
              ...{
                websiteModificationData
              }
            }
          />
    
          <div>
            {
              websiteModificationData?.privacy === null ?
              <div className="company-pages">
                <h1>
                  Privacy Policy Text...,
                </h1>
              </div>
              :
              <div className="company-pages" dangerouslySetInnerHTML={{ __html: websiteModificationData?.privacy?.privacy_policy }} />
            }
          </div>
        </>
    );
}
