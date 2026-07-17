"use client";

import { useWebsite } from "@/app/providers/context/WebsiteContext";
import { brandLogoPath } from "@/global/Axios";

function Loader() {
  const {layoutWebsiteModification} = useWebsite()
  const loaderColor = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || "#000";
  const loaderBackgroundColor = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || "#ffffff";
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      
      {/* Loader container only (NO background overlay) */}
      <div className="relative w-28 h-28" style={{backgroundColor: loaderBackgroundColor, borderRadius: "150px"}}>

        {/* Rotating Ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-200 animate-spin"
          style={{ borderTopColor: loaderColor }}
        />

        {/* Inner Ring */}
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
          style={{ borderBottomColor: loaderColor }}
        />

        {/* Logo */}
        <img
          src={brandLogoPath}
          alt="logo"
          className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>
    </div>
  );
}

export default Loader;
