'use client'
import { useWebsite } from "@/app/providers/context/WebsiteContext";

export default function AllergensComponent() 
{
    const {layoutWebsiteModification} = useWebsite()

    return(
        <div className={`w-full flex items-center justify-center text-center ${layoutWebsiteModification?.allergens ? "" : "h-[40vh]"}`}>
            {
                layoutWebsiteModification?.allergens === null ?
                    <h1 className="font-bold text-lg">
                        Allergens Text...,
                    </h1>
                :
                    <div dangerouslySetInnerHTML={{ __html: layoutWebsiteModification?.allergens?.allergens }} />
            }
        </div>
    )
}
