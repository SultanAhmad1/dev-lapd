"use client";
import HomeContext from "@/contexts/HomeContext";
import { brandLogoPath, IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import React, { useContext } from "react";

export default function AuthHeader() 
{
    const { brandLogo } = useContext(HomeContext)

    return(
        <a className="logo" href="/">
            {
                brandLogo !== null ?
                    <Image  src={IMAGE_URL_Without_Storage+''+brandLogo} width={10} height={10} className="register-brand-header" alt='Brand Name'/>
                :
                    <Image  src={brandLogoPath} width={10} height={10} className="register-brand-header" alt='Brand Name'/>
            }
        </a>
    )
}
