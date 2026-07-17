"use client"
import { useWebsite } from "@/app/providers/context/WebsiteContext";
import HomeContext from "@/contexts/HomeContext";
import { useContext, useEffect } from "react";

export default function TermsConditionComponent() 
{
    const {layoutWebsiteModification} = useWebsite()
    const {setLoader} = useContext(HomeContext)

    useEffect(() => {
        setLoader(false)
    }, [])

    return(
        <>
            <div className={`w-full flex items-center justify-center ${layoutWebsiteModification?.terms ? "" : "h-[40vh]"}`}>
                {
                    layoutWebsiteModification?.terms === null ?
                        <h1 className="font-bold text-lg">
                            Terms Text...,
                        </h1>
                    :
                        <div className="w-full max-w-1xl mx-auto mt-6 mb-12 px-4 sm:px-5 text-left leading-relaxed prose prose-base">
                            <div dangerouslySetInnerHTML={{ __html: layoutWebsiteModification?.terms?.terms }} />
                        </div>
                }
            </div>
        </>
    )
}
