"use client";
import { useContext, useEffect } from "react";
import CheckoutDisplay from "./CheckoutDisplay";
import HomeContext from "@/contexts/HomeContext";
import { BLACK_COLOR } from "@/global/Axios";

export default function Cart() {
  
  const { websiteModificationData, setIsCartBtnClicked, setLoader, loader } = useContext(HomeContext)
  
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 3000);
  }, [loader]);
  
  return (
    <div className="fixed inset-0 z-40 flex h-full items-center justify-center bg-black/40">
      {/* Modal Overlay (optional, can be used for click-to-close in future) */}
      <div className="absolute inset-0"></div>

      {/* Modal Content */}
      <div className="relative bg-[#eaeaea]  w-full h-full max-w-none p-4 rounded-none shadow-lg overflow-y-auto">
        
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={() => setIsCartBtnClicked(false)} className="p-1">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z"
                fill={websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR}
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <CheckoutDisplay />
      </div>
    </div>
  );
}
