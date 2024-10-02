"use client"
import Banner from "@/components/Banner";
import HomeContext from "@/contexts/HomeContext";
import React, { useContext } from "react";

export default function page() 
{
  const { websiteModificationData, brandlogo } = useContext(HomeContext);
  return(
    <>
      {/* Display Banner */}
      <Banner 
        {
          ...{
            websiteModificationData
          }
        }
      />

      {/* Display Brand Contact details */}
      <div className="brand-contact-flex">
        <div className="brand-contact-details">
          <img src="/gallery/stars.png" alt="Display stars"/>
          <h2>Order Now</h2>
          <a href={`tel:${websiteModificationData?.brand?.telephone}`}>{websiteModificationData?.brand?.telephone}</a>
        </div>

        <div className="brand-contact-details">
          <img src="/gallery/stars.png" alt="Display stars"/>
          <h2>Careers</h2>
          <a href="/">Apply Now</a>
        </div>

        <div className="brand-contact-details">
          <img src="/gallery/stars.png" alt="Display stars"/>
          <h2>Email Us</h2>
          {/* <a href="mailto:info@lapdfood.co.uk">info@lapdfood.co.uk</a> */}
          <a href={`mailto:${websiteModificationData?.brand?.email}`}>{websiteModificationData?.brand?.email}</a>
        </div>
      </div>
    </>
  );
}
