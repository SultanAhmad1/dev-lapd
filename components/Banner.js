"use client";
import Image from "next/image";
import { BANNER_IMAGE, IMAGE_URL_Without_Storage } from "../global/Axios";
import { useContext, useEffect, useState } from "react";
import HomeContext from "@/contexts/HomeContext";

function Banner() {
  const { websiteModificationData } = useContext(HomeContext);
  const banners = [
    websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteHeaderUrl
      ? `${IMAGE_URL_Without_Storage}${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteHeaderUrl}`
      : BANNER_IMAGE,
    // // Add more images here if you want multiple slides
    // ,
    // "/gallery/banner1.jpg",
    // "/gallery/banner2.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);
  
  return (
    <div className="hidden md:block header-display">
      <div className="w-full">
    {websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteHeaderUrl ? (
      <Image
        className="w-full h-[180px] object-cover"
        src={`${IMAGE_URL_Without_Storage}${websiteModificationData.websiteModificationLive.json_log[0].websiteHeaderUrl}`}
        alt="Banner"
        loading="lazy"
        width={1920}
        height={219}
      />
    ) : (
      <Image
        className="w-full h-[180px] object-cover"
        src={BANNER_IMAGE}
        alt="Banner"
        loading="lazy"
        width={1920}
        height={219}
      />
    )}
  </div>



    {/* <div className="relative w-full overflow-hidden"> */}
  {/* Slides */}
  {/* <div
    className="flex transition-transform duration-700 ease-in-out"
    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
  >
    {banners.map((src, idx) => (
  
  <div key={idx} className="w-full flex-shrink-0">
  <Image
    src={src}
    alt={`Banner ${idx + 1}`}
    loading="lazy"
    width={1920}
    height={800}
    quality={100}
    className="
      w-full 
      h-[180px]    
      sm:h-[220px] 
      md:h-[300px] 
      lg:h-[400px] 
      xl:h-[500px] 
      object-contain
      sm:object-cover,
      md:object-cover,
      lg:object-cover,
      xl:object-cover,
    "
  />
</div>





    ))}
  </div> */}

  {/* Dots */}
  {/* <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
    {banners.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentIndex(idx)}
        className={`w-3 h-3 rounded-full ${
          currentIndex === idx ? "bg-white" : "bg-gray-400"
        }`}
      />
    ))}
  </div> */}

  {/* Arrows */}
  {/* <button
    onClick={() =>
      setCurrentIndex((prev) =>
        prev === 0 ? banners.length - 1 : prev - 1
      )
    }
    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white px-2 py-1 rounded-full hover:bg-opacity-50"
  >
    ❮
  </button>
  <button
    onClick={() =>
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white px-2 py-1 rounded-full hover:bg-opacity-50"
  >
    ❯
  </button>
</div> */}

  
    </div>
  );
}

export default Banner;
