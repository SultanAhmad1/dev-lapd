'use client'
import { useWebsite } from "@/app/providers/context/WebsiteContext";

export default function SubscriptionComponent() 
{
    const {layoutWebsiteModification} = useWebsite()

    return(
      <>
        {/* <div className={`w-full flex items-center justify-center text-center ${layoutWebsiteModification?.allergens ? "" : "h-[40vh]"}`}> */}
        <div className={`w-full flex flex-col items-center justify-center text-center h-[40vh]`}>
          {/* {
            layoutWebsiteModification?.allergens === null ?
            <h1 className="font-bold text-lg">
              Allergens Text...,
            </h1>
            :
              <div dangerouslySetInnerHTML={{ __html: layoutWebsiteModification?.allergens?.allergens }} />
          } */}

          <h1 className="text-4xl font-bold mb-4">
            Our unsubscribing portal is not working right now.
          </h1>
          <p className="text-base">
            Please can you send us a message at <strong>hi@dunkedfood.co.uk</strong> with the contact details you would like us to remove from our marketing
          </p>

        </div>
      </>
    )
}
