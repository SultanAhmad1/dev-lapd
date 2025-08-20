"use client";

import Layout from "@/components/Layout";
import Products from "@/components/Products";
import HomeContext from "@/contexts/HomeContext";
import { useContext, useEffect } from "react";
import { ContextCheckApi } from "./layout";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function Home() {
  const { setMetaDataToDisplay } = useContext(ContextCheckApi);
  const { isMenuAvailable, websiteModificationData } = useContext(HomeContext);

  useEffect(() => {
    if (websiteModificationData) {
      setMetaDataToDisplay((prevData) => ({
        ...prevData,
        iconImage: `${IMAGE_URL_Without_Storage}${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon}`,
      }));
    }
  }, [websiteModificationData, setMetaDataToDisplay]);

  // ✅ Handle "no menu" without creating not-found.html
  if (!isMenuAvailable) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Menu Unavailable</h2>
          <p className="text-gray-600">
            Our menu is currently not available. Please check back later.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Products />
    </Layout>
  );
}
