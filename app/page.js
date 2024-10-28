"use client";
import Layout from "@/components/Layout";
import NothingFound from "@/components/NothingFound";
import Products from "@/components/Products";
import HomeContext from "@/contexts/HomeContext";
import { useContext, useEffect } from "react";
import { ContextCheckApi } from "./layout";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function Home() {
  const { setmetaDataToDipslay} = useContext(ContextCheckApi)

  const { ismenuavailable, websiteModificationData } = useContext(HomeContext);

  useEffect(() => {
    if(websiteModificationData)
    {
      const metaHeadingData = {
        title: websiteModificationData?.brand?.name,
        contentData: websiteModificationData?.brand?.name,
        iconImage: IMAGE_URL_Without_Storage+"/"+websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon,
        singleItemsDetails: {
          title: "",
          description: "",
          itemImage: "",
          keywords: "",
          url: ""
        }
      }
      setmetaDataToDipslay(metaHeadingData)
    }
  }, [websiteModificationData]);
  
  
  // Fetch Menu From Database.
  /**
   * There if the nothing is available then i can show Noting found.
   */

  return <Layout>{ismenuavailable ? <Products /> : <NothingFound />}</Layout>;
}
