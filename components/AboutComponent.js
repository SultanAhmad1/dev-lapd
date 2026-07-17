'use client'
import Banner from "./Banner";
import { useWebsite } from "@/app/providers/context/WebsiteContext";

export default function AboutComponent()
{
  const {layoutWebsiteModification} = useWebsite()

  return(
    <>
      <div className={`w-full flex items-center justify-center ${layoutWebsiteModification?.about ? "" : "h-[40vh]"}`}>
        {
          layoutWebsiteModification?.about === null ?
          
            <h1 className="font-bold text-lg">
              About Us Text...,
            </h1>
          :
          <div className="w-full max-w-1xl mx-auto mt-6 mb-12 px-4 sm:px-5 text-left leading-relaxed prose prose-base">
            <div dangerouslySetInnerHTML={{ __html: layoutWebsiteModification?.about?.about }} />
          </div>
        }
      </div>
    </>
  )
}
