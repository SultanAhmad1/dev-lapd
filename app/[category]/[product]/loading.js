import { brandLogoPath } from "@/global/Axios";
import React from "react";

const loading = () => {
    return(
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="relative w-28 h-28">
                    
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>

                    {/* Inner Ring (optional for better look) */}
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 animate-spin"></div>

                    {/* Logo */}
                    <img
                    src={brandLogoPath}
                    alt="logo"
                    className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
                    />
                </div>
            </div>
        </>
    )
};

export default loading;
