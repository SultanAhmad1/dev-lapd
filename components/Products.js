"use client";
import React, { useContext, useEffect } from "react";
import HomeContext from "../contexts/HomeContext";
import Banner from "./Banner";

import ViewCartMobileBtn from "./ViewCartMobileBtn";
import { IMAGE_URL_Without_Storage, } from "../global/Axios";
import moment from "moment-timezone";
import Header from "./Header";
import Footer from "./Footer";
import MobileTopBar from "./MobileTopBar";
import CheckoutDisplay from "./CheckoutDisplay";
import Image from "next/image";
import Link from "next/link";


export default function Products() {

  const {
    loader,
    setLoader,
    websiteModificationData,
    storeName,
    navigationCategories,
    setSelectedCategoryId,
    setSelectedItemId,
    booleanObj
  } = useContext(HomeContext);

  const handleProductSelect = (categoryId, itemId) => {
    // setLoader(true);
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
  
  return (
    <>
      <Header/>
      <MobileTopBar/>
      <Banner/>

      <div className="w-full px-4 md:px-6 lg:px-10 my-0" style={{
        // backgroundColor: "#fcfce4" // active this color for dunked food.
        // backgroundImage: `url(${IMAGE_URL_Without_Storage}${websiteModificationData?.websiteModificationLive.json_log[0].websiteHeaderUrl})`,
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
      }}>
        <div className="flex justify-center w-full py-3">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl">
            
            {/* Left Section */}
            <div className="w-full space-y-6">
                {/* 
                  Feature Items Section
                */}
                <>
                  <section id={`section_${0}`}>
                    <h2
                      className="text-xl sm:text-2xl font-semibold"
                    >
                      Feature Items
                    </h2>
                  </section>

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <Link

                      href={`feature-items`}
                  


                      
                      className="border border-default shadow-xs flex justify-between relative bg-white rounded-lg transition-colors duration-300 text-[var(--font-color)] hover:bg-[var(--item-hover-background)] hover:text-[var(--item-hover-font-color)]"
                    >
                      {/* 🔥 Hot Deal Badge */}
                      {
                        <span
                          className="opacity-50 absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-0 rounded-bl-lg shadow-md"
                        >
                          Mostly Sold
                        </span>
                      }
                      
                      {/* <span
                        className="absolute bottom-0 right-0 bg-red-500 text-white text-xs font-bold px-1 py-1 rounded-bl-lg shadow-md"
                      >
                        Deal
                      </span>

                      <span className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-1 py-0 shadow-md">
                        Halal
                      </span> */}


                        {/* Text */}
                        <div className="py-1 px-2 flex flex-col gap-1 flex-1 min-w-0">
                          <p className="mt-2 text-sm font-bold line-clamp-2 break-words whitespace-normal">
                              {/* {title.split(" ").length >= 4 ? title.split(" ").slice(0, 3).join(" ") + "…" : title} */}
                              Feature Items
                          </p>
                          <hr className="my-1 border-gray-300" />
                          <p className="h-10 text-sm leading-snug line-clamp-2 break-words whitespace-normal">
                            Feature most popular items from various categories.
                          </p>

                          <div className="flex justify-between mt-2">
                            {/* ⭐ Rating */}
                            <div className="flex items-center gap-0 mt-1">
                              {/* {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill={star <= 4 ? "#facc15" : "#e5e7eb"} // yellow-400 / gray-200
                                  className="h-4 w-4"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.176 0l-3.377 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                                </svg>
                              ))}

                              <span className="text-xs text-gray-500 ml-1">
                                {4?.toFixed(1)}
                              </span> */}
                            </div>
                            <span className="text-base font-medium text-right block ">
                              &pound;{parseFloat(100.00).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Image */}
                        
                            <Image
                            src="/not-found.png"
                            className="object-cover w-32 h-full rounded-r-xl"
                            alt={"Feature Items"}
                            width={120}
                            height={120}
                          />

                    </Link>
                  </div>
                </>
                
                {navigationCategories?.map(
                  (category, index) =>
                    category?.items?.length > 0 && (
                      <>
                        <section key={category.id} id={`section_${index}`}>
                          <h2
                            className="text-xl sm:text-2xl font-semibold"
                            style={{
                              color:
                                websiteModificationData?.websiteModificationLive?.json_log?.[0]
                                  ?.categoryFontColor,
                            }}
                          >
                            {category.title}
                          </h2>
                        </section>

                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                              <Link

                                href={`/${storeName
                                  ?.replace(/ /g, "-")
                                  ?.toLowerCase()}/${category?.slug}/${item?.slug}`}
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
                                className="border border-default shadow-xs flex justify-between relative bg-white rounded-lg transition-colors duration-300 text-[var(--font-color)] hover:bg-[var(--item-hover-background)] hover:text-[var(--item-hover-font-color)]"
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
                               
                                {/* <span
                                  className="absolute bottom-0 right-0 bg-red-500 text-white text-xs font-bold px-1 py-1 rounded-bl-lg shadow-md"
                                >
                                  Deal
                                </span>

                                <span className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-1 py-0 shadow-md">
                                  Halal
                                </span> */}


                                  {/* Text */}
                                  <div className="py-1 px-2 flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="mt-2 text-sm font-bold line-clamp-2 break-words whitespace-normal">
                                       {/* {title.split(" ").length >= 4 ? title.split(" ").slice(0, 3).join(" ") + "…" : title} */}
                                       {title}
                                    </p>
                                    <hr className="my-1 border-gray-300" />
                                    <p className="h-10 text-sm leading-snug line-clamp-2 break-words whitespace-normal">
                                      {description}
                                    </p>

                                    <div className="flex justify-between mt-2">
                                      {/* ⭐ Rating */}
                                      <div className="flex items-center gap-0 mt-1">
                                        {/* {[1, 2, 3, 4, 5].map((star) => (
                                          <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill={star <= 4 ? "#facc15" : "#e5e7eb"} // yellow-400 / gray-200
                                            className="h-4 w-4"
                                          >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.176 0l-3.377 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                                          </svg>
                                        ))}

                                        <span className="text-xs text-gray-500 ml-1">
                                          {4?.toFixed(1)}
                                        </span> */}
                                      </div>
                                      <span className="text-base font-medium text-right block ">
                                        &pound;{parseFloat(price).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Image */}
                                  
                                    {image_url ? 
                                        <Image
                                          src={
                                            isValidHttpsUrl(image_url)
                                              ? image_url
                                              : `${IMAGE_URL_Without_Storage}${image_url}`
                                          }
                                          className="object-cover w-32 h-full rounded-r-xl"
                                          alt={title}
                                          width={120}
                                          height={120}
                                        />
                                      :
                                         <Image
                                          src="/not-found.png"
                                          className="object-cover w-32 h-full rounded-r-xl"
                                          alt={title}
                                          width={120}
                                          height={120}
                                        />
                                    }

                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )
                )}
            </div>

            {/* Right Panel */}
            <div className="hidden lg:block max-w-[30vw] min-w-[28vw] bg-[#eaeaea] sticky top-[15vh] right-0 mt-[50px] rounded-[15px] block max-h-[80vh] overflow-y-auto border border-gray-300 p-[20px]">
              <CheckoutDisplay />
            </div>

          </div>
        </div>
      </div>
      
      {
        // parseInt(booleanObj.isUnableToSendSms) === parseInt(0) &&
        <div className="block lg:hidden">
          <ViewCartMobileBtn />
        </div>
      }

      <hr className="my-6 border-gray-300" />

      <Footer />
    </>
  );
}
