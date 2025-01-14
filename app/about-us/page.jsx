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
          websiteModificationData?.about === null ?
          <div className="company-pages">
            <h1>
              About Us Text...,
            </h1>
          </div>
          :
          <div className="company-pages" dangerouslySetInnerHTML={{ __html: websiteModificationData?.about?.about }} />
        }
      </div>
    </>
  );
}
