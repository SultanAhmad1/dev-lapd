"use client"
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID } from "@/global/Axios";
import { useContext, useEffect, useState } from "react";

export default function page() 
{
  const { websiteModificationData, brandLogo } = useContext(HomeContext);

  const [storeDetails, setStoreDetails] = useState({
    telephone: "",
    email: "",
  });
  
  useEffect(() => {
    const selectedStoreData = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`);
    if(selectedStoreData){ 
      const storeData = JSON.parse(selectedStoreData);
      setStoreDetails({  
        telephone: storeData?.telephone || "",
        email: storeData?.email || "",
      });
    } 

  });
  
  return(
    <>
      <Header />
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
          <img loading="lazy" src="/gallery/stars.png" alt="Display stars"/>
          <h2>Order Now</h2>
          <a href={`tel:${storeDetails?.telephone}`}>{storeDetails?.telephone}</a>
        </div>

        <div className="brand-contact-details">
          <img loading="lazy" src="/gallery/stars.png" alt="Display stars"/>
          <h2>Careers</h2>
          <a href="/">Apply Now</a>
        </div>

        <div className="brand-contact-details">
          <img loading="lazy" src="/gallery/stars.png" alt="Display stars"/>
          <h2>Email Us</h2>
          {/* <a href="mailto:info@lapdfood.co.uk">info@lapdfood.co.uk</a> */}
          <a href={`mailto:${storeDetails?.email}`}>{storeDetails?.email}</a>
        </div>
      </div>

      <Footer />
    </>
  );
}
