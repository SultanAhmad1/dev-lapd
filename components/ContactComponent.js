"use client"
import { useContext, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Banner from "./Banner";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";

export default function ContactComponent() 
{
    const {
        websiteModificationData,
        selectedStoreDetails,
    } = useContext(HomeContext);

    const {
        setMetaDataToDisplay, metaDataToDisplay
    } = useContext(ContextCheckApi)

    useEffect(() => {
        if (websiteModificationData) {
        setMetaDataToDisplay((prevData) => ({
            ...prevData,
            title: `Contact Us - ${websiteModificationData?.brand?.name}`,
            contentData: "",
        }));
        }
    }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);

    return(
        <>
            <Header />
            <Banner />
            {/* Display Brand Contact details */}
            <div className="mt-10 mb-10 w-full flex flex-col md:flex-row items-center justify-center gap-6 text-center px-4">
                {/* Order Now */}
                <div className="flex justify-center items-center w-full">
                    <div className="w-full max-w-sm p-6 border-4 border-dotted rounded-lg bg-white text-center space-y-4" 
                        style={{
                            borderColor: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                        }}
                    >
                        
                        {/* Stars Image */}

                        <div
                            className="mx-auto w-40 h-10"
                            style={{
                                WebkitMaskImage: "url(/gallery/stars.png)",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskSize: "contain",
                                backgroundColor:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor || "orange",
                            }}
                        ></div>


                        {/* Title */}
                        <h2 className="text-xl font-medium text-gray-800">Order Now</h2>

                        {/* Phone Number */}
                        <a
                            href={`tel:${selectedStoreDetails?.telephone?.replace(/^\d/, '+44')}`}
                            className="inline-block text-lg font-semibold text-black hover:text-green-800 underline"
                        >
                            {selectedStoreDetails?.telephone?.replace(/^\d/, '+44')}
                        </a>
                    </div>
                </div>


                {/* Careers */}
                <div className="flex justify-center items-center w-full">
                    <div className="w-full max-w-sm p-6 border-4 border-dotted rounded-lg bg-white text-center space-y-4"
                        style={{
                            borderColor: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                        }}  
                    >
                        
                        {/* Stars Image */}
                        <div
                            className="mx-auto w-40 h-10"
                            style={{
                                WebkitMaskImage: "url(/gallery/stars.png)",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskSize: "contain",
                                backgroundColor:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor || "orange",
                            }}
                        ></div>

                        {/* Title */}
                        <h2 className="text-xl font-medium text-gray-800">Careers</h2>

                        <a
                            href="/"
                            className="inline-block text-lg font-semibold text-black hover:text-green-800 underline"
                        >
                            Apply Now
                        </a>
                    </div>
                </div>

                {/* Email Us */}
                <div className="flex justify-center items-center w-full">
                    <div className="w-full max-w-sm p-6 border-4 border-dotted rounded-lg bg-white text-center space-y-4"
                        style={{
                            borderColor: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                        }}
                    >
                        
                        {/* Stars Image */}
                        <div
                            className="mx-auto w-40 h-10"
                            style={{
                                WebkitMaskImage: "url(/gallery/stars.png)",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskSize: "contain",
                                backgroundColor:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                    ?.buttonBackgroundColor || "orange",
                            }}
                        ></div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800">Email Us</h2>

                        <a
                            href={`mailto:${selectedStoreDetails?.email}`}
                            className="inline-block text-lg font-semibold text-black hover:text-green-800 underline"
                        >
                            {selectedStoreDetails?.email}
                        </a>
                    </div>
                </div>
            </div>


            <Footer />
        </>
    );
}
