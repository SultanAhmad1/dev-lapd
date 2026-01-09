"use client";
import Image from "next/image";
import { BANNER_IMAGE, IMAGE_URL_Without_Storage } from "../global/Axios";
import { useContext } from "react";
import HomeContext from "@/contexts/HomeContext";

function Banner() {
  const { websiteModificationData } = useContext(HomeContext);
  
  return (
    <div className="hidden md:block header-display">
      <div className="w-full">
        {websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteHeaderUrl ? (
          <Image
            className="w-full h-[180px] object-cover"
            src={`${IMAGE_URL_Without_Storage}${websiteModificationData.websiteModificationLive.json_log[0].websiteHeaderUrl}`}
            alt="Banner"
            loading="lazy"
            width={1920}
            height={219}
          />
        ) : (
          <Image
            className="w-full h-[180px] object-cover"
            src={BANNER_IMAGE}
            alt="Banner"
            loading="lazy"
            width={1920}
            height={219}
          />
        )}
      </div>
    </div>
  );
}

export default Banner;
