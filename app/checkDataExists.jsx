"use client";

import HomeContext from "@/contexts/HomeContext";
import Image from "next/image";
import React, { useContext, useEffect } from "react";

export default function CheckDataExists()
{
    const{
        setHeaderSearchBarDisplay,
        setHeaderPostcodeBtnDisplay,
        setHeaderCartBtnDisplay,
        setHeaderUserBtnDisplay,
    } = useContext(HomeContext)

    useEffect(() => {
        setHeaderSearchBarDisplay(false)
        setHeaderPostcodeBtnDisplay(false)
        setHeaderCartBtnDisplay(false)
        setHeaderUserBtnDisplay(false)
    }, [])
    
  return (
    
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md text-center space-y-4">
            {/* Image */}
            <div>
            <Image
                alt="Error illustration"
                role="presentation"
                src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/f601b8be1064c30a.svg"
                width={100}
                height={100}
                className="mx-auto"
            />
            </div>

            {/* Main message */}
            <div className="text-lg font-semibold text-gray-800">
                Something went wrong.
            </div>

            {/* Sub message */}
            <div className="text-sm text-gray-600">
                Please refresh and try again!
            </div>
        </div>
    </div>
  )
};
