"use client";
import { BANNER_IMAGE, IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BannerCarousel({
  websiteModificationData,
}) {
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const [index, setIndex] = useState(0);

  const images =
    websiteModificationData?.websiteModificationLive?.json_log?.[0]
      ?.websiteHeaderUrl
      ? Array(4).fill(
          `${IMAGE_URL_Without_Storage}${websiteModificationData?.websiteModificationLive?.json_log[0]?.websiteHeaderUrl}`
        )
      : [BANNER_IMAGE];

  const slideTo = (i) => {
    setIndex(i);
    sliderRef.current.scrollTo({
      left: sliderRef.current.clientWidth * i,
      behavior: "smooth",
    });
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      slideTo((index + 1) % images.length);
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (images.length > 1) startAutoPlay();
    return stopAutoPlay;
  }, [index, images.length]);

  return (
    <div
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      className="relative"
    >
      {/* Slides */}
      <div
        ref={sliderRef}
        className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="    relative min-w-full
    h-[120px] sm:h-[140px] md:h-[180px]
    bg-black
    snap-center
    flex items-center justify-center"
          >
            <Image
              src={src}
              alt="Banner"
              fill
              className="w-full md:w-1/2 lg:w-1/3 h-auto"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              slideTo((index - 1 + images.length) % images.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
          >
            ‹
          </button>

          <button
            onClick={() =>
              slideTo((index + 1) % images.length)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => slideTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              i === index
                ? "bg-white"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
