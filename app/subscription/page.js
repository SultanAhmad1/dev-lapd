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
    </>
  );
}
