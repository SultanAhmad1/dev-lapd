"use client"
import { useWebsite } from "@/app/providers/context/WebsiteContext";
import HomeContext from "@/contexts/HomeContext";
import { useContext, useEffect } from "react";

export default function PrivacyComponent() 
{
    const {layoutWebsiteModification} = useWebsite()
    const {setLoader } = useContext(HomeContext)

    useEffect(() => {
        setLoader(false)
    }, [])

    return(
        <>
            <div className={`w-full flex items-center justify-center ${layoutWebsiteModification?.privacy ? "" : "h-[40vh]"}`}>
                {
                    layoutWebsiteModification?.privacy === null ?
                        <h1 className="font-bold text-lg">
                            Privacy policy Text...,
                        </h1>
                    :
                    <div className="w-full max-w-1xl mx-auto mt-6 mb-12 px-4 sm:px-5 text-left leading-relaxed prose prose-base">
                        <div dangerouslySetInnerHTML={{ __html: layoutWebsiteModification?.privacy?.privacy_policy }} />
                    </div>

                }
            </div>
        </>
    )
}
