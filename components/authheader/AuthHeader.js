"use client";
import HomeContext from "@/contexts/HomeContext";
import { BrandLogoPath, IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import React, { useContext } from "react";

export default function AuthHeader() 
{
    const { brandlogo } = useContext(HomeContext)

    return(
        <a className="logo" href="/">
            {
                brandlogo !== null ?
                <Image  src={IMAGE_URL_Without_Storage+''+brandlogo} width={10} height={10} className="register-brand-header" alt='Brand Name'/>
                :
                <Image  src={BrandLogoPath} width={10} height={10} className="register-brand-header" alt='Brand Name'/>
            }
        </a>
    )
}
