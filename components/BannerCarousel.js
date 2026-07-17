"use client";

import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";

export default function BannerCarousel({
  images,
  selectedStoreDetails,
  setAtFirstLoad,
}) {
  if (!images || images.length === 0) return null;

  const clonedImages = [
    images[images.length - 1],
    ...images,
    images[0],
  ];

  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  const intervalRef = useRef(null);

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startAutoPlay = () => {
    stopAutoPlay();

    if (images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, []);

  const handleTransitionEnd = () => {
    if (index === clonedImages.length - 1) {
      setEnableTransition(false);
      setIndex(1);
    }

    if (index === 0) {
      setEnableTransition(false);
      setIndex(images.length);
    }
  };

  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
    }
  }, [enableTransition]);

  const nextSlide = () => {
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIndex((prev) => prev - 1);
  };

  const goToSlide = (i) => {
    setIndex(i + 1);
  };

  const activeDot =
    index === 0
      ? images.length - 1
      : index === clonedImages.length - 1
      ? 0
      : index - 1;

  return (
    <div
      className="relative overflow-hidden w-full"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div
        className={`flex ${
          enableTransition ? "transition-transform duration-500 ease-in-out" : ""
        }`}
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {clonedImages.map((src, i) => (
          <Fragment key={i}>
            {selectedStoreDetails === null ? (
              <button
                type="button"
                onClick={() => setAtFirstLoad(true)}
                className="relative w-full flex-shrink-0 bg-white"
              >
                <Image
                  src={`${IMAGE_URL_Without_Storage}${src.banner}`}
                  alt="Banner"
                  width={1920}
                  height={600}
                  priority={i === 1}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <Link
                href={src.url ?? "#"}
                className="relative w-full flex-shrink-0 bg-white"
              >
                <Image
                  src={`${IMAGE_URL_Without_Storage}${src.banner}`}
                  alt="Banner"
                  width={1920}
                  height={600}
                  priority={i === 1}
                  className="w-full h-full object-cover"
                />
              </Link>
            )}
          </Fragment>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center"
          >
            ‹
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeDot === i
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}