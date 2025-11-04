"use client";
import React, { useContext, useEffect, useRef } from "react";
import HomeContext from "../contexts/HomeContext";
import Banner from "./Banner";

import ViewCartMobileBtn from "./ViewCartMobileBtn";
import { IMAGE_URL_Without_Storage, itemHoverBackgroundColor, itemHoverColor } from "../global/Axios";
import moment from "moment-timezone";
import Header from "./Header";
import Footer from "./Footer";
import MobileTopBar from "./MobileTopBar";
import { ContextCheckApi } from "@/app/layout";
import CheckoutDisplay from "./CheckoutDisplay";
import Image from "next/image";
import Link from "next/link";


export default function Products() {

  const { setMetaDataToDisplay } = useContext(ContextCheckApi)

  const {
    loader,
    setLoader,
    websiteModificationData,
    storeName,
    navigationCategories,
    navMobileIndex,
    setSelectedCategoryId,
    setSelectedItemId,
    setNavMobileIndex,
    dayOpeningClosingTime,
  } = useContext(HomeContext);
  
  const scrollContainerRef = useRef(null);

  const handleProductSelect = (categoryId, itemId) => {
    setLoader(true);
    setSelectedCategoryId(categoryId);
    setSelectedItemId(itemId);
  };
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };

  useEffect(() => {
   if(loader)
    {
      setTimeout(() => {
        setLoader(false)
      }, 3000);
    }
  }, [loader,setLoader]);
 
  console.log("website color schema:", websiteModificationData);
  
  return (
    <>
      <Header/>
      <MobileTopBar/>
      <Banner/>

      <div className="w-full px-4 md:px-6 lg:px-10 my-6" style={{
        backgroundColor: "#fcfce4"
        // backgroundImage: `url(${IMAGE_URL_Without_Storage}${websiteModificationData?.websiteModificationLive.json_log[0].websiteHeaderUrl})`,
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
      }}>
        <div className="flex justify-center w-full py-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl">
            
            {/* Left Section */}
            <div className="w-full">
              <ul className="space-y-6">
                {navigationCategories?.map(
                  (category, index) =>
                    category?.items?.length > 0 && (
                      <li key={category.id}>
                        <section id={`section_${index}`}>
                          <h4
                            className="text-xl sm:text-2xl font-semibold"
                            style={{
                              color:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                  ?.categoryFontColor,
                            }}
                          >
                            {category.title}
                          </h4>
                        </section>

                        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {category.items.map((item, itemIndex) => {
                            const { title, price, description, image_url, is_promotion, promotion_text, promotion_bg_color, promotion_text_color, days, start_time,end_time} = item;

                            // Skip suspended items
                            const isItemSuspend =
                              item?.suspension_info !== null &&
                              moment().format("YYYY-MM-DD") <=
                                moment
                                  .unix(item?.suspension_info?.suspend_untill)
                                  .format("YYYY-MM-DD");

                            if (isItemSuspend) return null;

                            // check the category promotion available, or item
                            let isPromotionActive = false
                            let promotionText = category.promotion_text
                            let promotionBgColor = category.promotion_bg_color
                            let promotionTextColor = category.promotion_text_color

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
                            else if(parseInt(is_promotion) === parseInt(1))
                            {
                              const currentDay = moment().format("dddd")
                              const findDay = days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
                              if(findDay)
                              {
                                if(dayNameAndTime >= moment(start_time, "HH:mm:ss").format("HH:mm:ss") && moment(end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
                                {
                                  isPromotionActive = true
                                  promotionText = promotion_text
                                  promotionBgColor = promotion_bg_color
                                  promotionTextColor = promotion_text_color
                                }
                              }
                            }
                            return (
                              <li
                                key={itemIndex}
                                onClick={() => handleProductSelect(category?.id, item?.id)}
                                style={{
                                  "--item-hover-background":
                                    websiteModificationData?.websiteModificationLive
                                      ?.json_log?.[0]?.itemHoverBackgroundColor,
                                  "--item-hover-font-color":
                                    websiteModificationData?.websiteModificationLive
                                      ?.json_log?.[0]?.itemHoverFontColor,
                                  "--font-color":
                                    websiteModificationData?.websiteModificationLive
                                      ?.json_log?.[0]?.itemFontColor,
                                }}
                                className="relative bg-white rounded-lg shadow-lg p-3 cursor-pointer transition-colors duration-300 text-[var(--font-color)] hover:bg-[var(--item-hover-background)] hover:text-[var(--item-hover-font-color)]"
                              >
                                {/* 🔥 Hot Deal Badge */}
                                {
                                  isPromotionActive &&
                                  <span
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md"
                                    style={{ backgroundColor: promotionBgColor, color: promotionTextColor }}
                                  >
                                    {promotionText}
                                  </span>
                                }
                                <Link
                                  href={`/${storeName
                                    ?.replace(/ /g, "-")
                                    ?.toLowerCase()}/${category?.slug}/${item?.slug}`}
                                  className="flex flex-row justify-between items-start gap-3"
                                >
                                  {/* Text */}
                                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="text-base font-semibold break-words whitespace-normal">
                                      {title}
                                    </p>


                                    <hr className="my-3 border-gray-300" />

                                    <p className="text-sm leading-snug line-clamp-2">
                                      {description}
                                    </p>
                                    <span className="text-base font-medium text-right block">
                                      &pound;{parseFloat(price).toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Image */}
                                  
                                    {image_url ? 
                                        <Image
                                          src={
                                            isValidHttpsUrl(image_url)
                                              ? image_url
                                              : `${IMAGE_URL_Without_Storage}${image_url}`
                                          }
                                          className="object-contain w-[100px] h-[120px]"
                                          alt={title}
                                          width={200}
                                          height={200}
                                        />
                                      :
                                        <div className="object-contain w-[100px] h-[120px]"></div>
                                    }
                                    
                                    
                                           {/* <Image
                                  src={
                                    isValidHttpsUrl(image_url)
                                      ? image_url
                                      : `${IMAGE_URL_Without_Storage}${image_url}`
                                  }
                                  alt={title}
                                  width={200}
                                  height={200}
                                  className="
                                    transition-transform duration-500 ease-in-out transform scale-100 
                                    outline outline-[1px] outline-black/5 
                                    h-[180px] sm:h-[200px] md:h-[220px] lg:h-[158px] 
                                    w-full sm:w-[100px] md:w-[120px] lg:w-[140px] 
                                    object-contain opacity-100 shrink-0
                                  "
                                /> */}
                                       

                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* Right Panel */}
            <div className="hidden lg:block max-w-[30vw] min-w-[28vw] bg-[#eaeaea] sticky top-[15vh] right-0 mt-[50px] rounded-[15px] block max-h-[80vh] overflow-y-auto overflow-y-auto border border-gray-300 p-[20px]">
              <CheckoutDisplay />
            </div>

          </div>
        </div>
      </div>
          
      <div className="block lg:hidden">
        <ViewCartMobileBtn />
      </div>

      <hr className="my-6 border-gray-300" />

      <Footer />
    </>
  );
}
