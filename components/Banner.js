"use client";

import Image from "next/image";
import {
  BANNER_IMAGE,
  JOINUS_BANNER_IMAGE,
} from "../global/Axios";
import BannerCarousel from "./BannerCarousel";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import HomeContext from "@/contexts/HomeContext";
import moment from "moment-timezone";

function Banner() {

  const {dealBanners, storeName, selectedStoreDetails, setAtFirstLoad} = useContext(HomeContext)

  const [bannerImages, setBannerImages] = useState([])

  const pathName = usePathname();

  const segments = pathName.split("/").filter(Boolean);

  
  const firstSegment = segments[0];
  // let isJoinUsPage = firstSegment === "join-us";
  let isTermsCondition = firstSegment === "terms-conditions";
  let isTrackOrder = firstSegment === "track-order";
  let isThankYou = firstSegment === "thank-you";
  let isMarketing = firstSegment === "marketingpreferences";
  let isPrivacy = firstSegment === "privacy-policy";

  // console.log("firstSegment", firstSegment);
  
  const allowedPages = [
    "terms-conditions",
    "track-order",
    "thank-you",
    "marketingpreferences",
    "privacy-policy",
    // "join-us"
  ];

  // ✅ Allow home OR allowed pages
  const isHome = segments.length === 0;
  const showBanner = isHome || allowedPages.includes(firstSegment);
  
  useEffect(() => {
    if(dealBanners?.length > 0)
    {
      let websiteDealBanners = []
      for(let category of dealBanners)
      {
        if(parseInt(category?.items?.length) > 0)
        {
          for(let item of category?.items)
          {
            const isItemSuspend =
            item?.suspension_info !== null &&
            moment().format("YYYY-MM-DD") <=
              moment
                .unix(item?.suspension_info?.suspend_untill)
                .format("YYYY-MM-DD");
  
              if (isItemSuspend) return null;
      
              // check the category promotion available, or item
              let isPromotionActive = false
              const dayNameAndTime = moment.tz("HH:mm", "Europe/London").format("HH:mm:ss");
      
              if(parseInt(category?.is_promotion) === parseInt(1))
              {
                const currentDay = moment().format("dddd")
                const findDay = category.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
                if(findDay)
                {
                  if(dayNameAndTime >= moment(category.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(category.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
                  {
                    isPromotionActive = true
                  }
                }
              }
              else if(parseInt(item?.is_promotion) === parseInt(1))
              {
                const currentDay = moment().format("dddd")
                const findDay = item?.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
                if(findDay)
                {
                  if(dayNameAndTime >= moment(item?.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(item?.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
                  {
                    isPromotionActive = true
                  }
                }
              }

              if(isPromotionActive)
              {
                websiteDealBanners.push({
                  banner: item.image_url,
                  // url: `/${storeName?.replace(/ /g, "-")?.toLowerCase()}/${category?.slug}/${item?.slug}`
                  url: `${category?.slug}/${item?.slug}`
                })
              }
  
          }
        }
      }

      setBannerImages(websiteDealBanners)
    }
  }, [dealBanners, selectedStoreDetails])
  
  if (!showBanner) return null;

  return (
    <>
      {
        // isJoinUsPage ? 
        // <div className="hidden md:block header-display mb-3">
        //   <Image
        //     className="w-full"
        //     src={JOINUS_BANNER_IMAGE}
        //     alt="Banner"
        //     loading="lazy"
        //     width={1920}
        //     height={600}
        //     style={{ maxHeight: "100%" }}
        //   />
        // </div>
        // :
          isTrackOrder ?
          <div className="hidden md:block header-display mb-0">
            <Image
              className="w-full"
              src={BANNER_IMAGE}
              alt="Banner"
              loading="lazy"
              width={1920}
              height={600}
              style={{ maxHeight: "100%" }}
            />
          </div>
        : isThankYou ?
          <div className="hidden md:block header-display mb-0">
            <Image
              className="w-full"
              src={BANNER_IMAGE}
              alt="Banner"
              loading="lazy"
              width={1920}
              height={600}
              style={{ maxHeight: "100%" }}
            />
          </div>
        : isTermsCondition ?
          <div className="hidden md:block header-display mb-0">
            <Image
              className="w-full"
              src={BANNER_IMAGE}
              alt="Banner"
              loading="lazy"
              width={1920}
              height={600}
              style={{ maxHeight: "100%" }}
            />
          </div>
        : isMarketing ?
          <div className="hidden md:block header-display mb-0">
            <Image
              className="w-full"
              src={BANNER_IMAGE}
              alt="Banner"
              loading="lazy"
              width={1920}
              height={600}
              style={{ maxHeight: "100%" }}
            />
          </div>
        : isPrivacy ?
          <div className="hidden md:block header-display mb-0">
            <Image
              className="w-full"
              src={BANNER_IMAGE}
              alt="Banner"
              loading="lazy"
              width={1920}
              height={600}
              style={{ maxHeight: "100%" }}
            />
          </div>
        :
        bannerImages?.length === 0 ? (
        <div className="hidden md:block header-display mb-0">
          <Image
            className="w-full"
            src={BANNER_IMAGE}
            alt="Banner"
            loading="lazy"
            width={1920}
            height={600}
            style={{ maxHeight: "100%" }}
          />
        </div>
      ) : (
        <BannerCarousel {...{images: bannerImages, selectedStoreDetails, setAtFirstLoad}} />
      )
      }
    </>
  );
}

export default Banner;