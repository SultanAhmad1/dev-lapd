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
    navigationcategories,
    navmobileindex,
    setSelectedcategoryid,
    setSelecteditemid,
    setNavmobileindex,
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
          websiteModificationData?.terms === null ?
          <div className="company-pages">
            <h1>
              Terms and conditions defining...,
            </h1>
          </div>
          :
          <div className="company-pages" dangerouslySetInnerHTML={{ __html: websiteModificationData?.terms?.terms }} />
        }
      </div>
    </>
  );
}
