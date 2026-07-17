"use client";

import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import ChooseOnlyOne from "./websiteModifiersItems/ChooseOnlyOne";
import ChooseOneItemOneTime from "./websiteModifiersItems/ChooseOneItemOneTime";
import CounterItem from "./websiteModifiersItems/CounterItem";
import Link from "next/link";
import { useContext } from "react";
import HomeContext from "@/contexts/HomeContext";
import moment from "moment/moment";
import { memo } from "react";

export const WebsiteSingleItem = memo((props) => {

  const {selectedStoreDetails, setAtFirstLoad} = useContext(HomeContext);
  
  const {
    optionNumber,
    singleItem,
    quantity,
    itemPrice,
    handleRadioInput,
    handleCheckInput,
    handleDecrement,
    handleIncrement,
    handleAddOrNextClickedToCart,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    isAnyModifierHasExtras,
    layoutWebsiteModification,

    checkPromotionActive,
    getPromotionText,
    getPromotionBgColor,
    getPromotionTextColor,
  } = props;
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
  
  let isPromotionActive = false
  let promotionText = singleItem?.promotion_text
  let promotionBgColor = singleItem?.promotion_bg_color
  let promotionTextColor = singleItem?.promotion_text_color

  const dayNameAndTime = moment.tz("HH:mm", "Europe/London").format("HH:mm:ss");

  if(parseInt(singleItem?.is_promotion) === parseInt(1))
  {
    const currentDay = moment().format("dddd")
    const findDay = singleItem?.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
    if(findDay)
    {
      if(dayNameAndTime >= moment(singleItem?.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(singleItem?.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
      {
        isPromotionActive = true
        promotionText = singleItem?.promotion_text
        promotionBgColor = singleItem?.promotion_bg_color
        promotionTextColor = singleItem?.promotion_text_color
      }
    }
  }
  else if(singleItem?.is_coming_soon === 1 && moment(singleItem?.coming_soon_start_date).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD'))
  {
    isPromotionActive = true
    promotionText = "Coming soon"
    promotionBgColor = "#ffc107"
    promotionTextColor = "212529"
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto px-4 pt-8 pb-36"> 
        <div className="flex flex-col lg:flex-row gap-6 max-w-5xl w-full mx-auto bg-white p-6 rounded-lg shadow-md">

          {/* Left Side */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center text-sm text-gray-700 hover:text-black">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3z" />
                </svg>
                <span className="ml-2">Back to list</span>
              </Link>
            </div>
            
            <div className="relative border rounded overflow-hidden group">
              {singleItem?.image_url && (
                <>
                {
                  isPromotionActive &&
                  <span
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-3 rounded-bl-lg shadow-md"
                    style={{ backgroundColor: promotionBgColor, color: promotionTextColor }}
                  >
                    {promotionText}
                  </span>
                }

                  <Image
                    alt={singleItem?.title}
                    src={
                      isValidHttpsUrl(singleItem?.image_url)
                        ? singleItem.image_url
                        : `${IMAGE_URL_Without_Storage}/${singleItem.image_url}`
                    }
                    width={300}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </>
              )}

              {!singleItem?.display_at_banner && checkPromotionActive && (
                <span
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md z-10"
                  style={{
                    backgroundColor: getPromotionBgColor,
                    color: getPromotionTextColor,
                  }}
                >
                  {getPromotionText}
                </span>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2 space-y-14 relative">
            <div>
              <h1 className="text-2xl font-semibold">{singleItem?.title}</h1>
              <p className="text-lg font-medium">&pound;{parseFloat(singleItem?.price || 0).toFixed(2)}</p>
              <p className="text-gray-600 mt-2 whitespace-pre-line">{singleItem?.description}</p>
            </div>

            <ul className="space-y-4">
              {(optionNumber === 1 || optionNumber === 2) &&
                singleItem?.modifier_group?.map((modifier, index) => {
                  const isExtras = optionNumber === 2;
                  if ((isExtras && modifier?.isExtras) || (!isExtras && !modifier?.isExtras)) {
                    if (modifier?.modifier_secondary_items?.length > 0) {
                      if (modifier.select_single_option === 1 && modifier.max_permitted === 1) {
                        return <ChooseOnlyOne key={index} {...{ index, modifier, handleRadioInput,layoutWebsiteModification }} />;
                      }
                      if (modifier.select_single_option === 1 && modifier.max_permitted > 1) {
                        return <ChooseOneItemOneTime key={index} {...{ index, modifier, handleCheckInput,  layoutWebsiteModification }} />;
                      }
                      if (modifier.select_single_option > 1 && modifier.max_permitted >= 1) {
                        return <CounterItem key={index} {...{ index, modifier, handleDecrement, handleIncrement }} />;
                      }
                    }
                  }
                })}
            </ul>
              
              
            <div className="bottom-0 left-0 w-full mt-5">
              <div className="bg-black text-white px-4 py-5 rounded-t-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold">£{parseFloat(quantity * itemPrice).toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-gray-700 text-white rounded-xl disabled:opacity-50 border-2 border-white"
                      disabled={quantity <= 1}
                      onClick={handleMobileQuantityDecrement}
                    >
                      -
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-700 text-white rounded-xl border-2 border-white"
                      onClick={handleMobileQuantityIncrement}
                    >
                      +
                    </button>

                    {isAnyModifierHasExtras ? (
                      <button
                        className="ml-3 px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() => handleAddOrNextClickedToCart("next")}
                      >
                        NEXT
                      </button>
                    ) : (
                      <>
                        {optionNumber === 2 && (
                          <button
                            className="ml-3 px-4 py-2 border rounded bg-gray-300 text-black"
                            onClick={() => handleAddOrNextClickedToCart("back")}
                          >
                            Back
                          </button>
                        )}

                        {
                          singleItem?.is_coming_soon === 1 && moment(singleItem?.coming_soon_start_date,"YYYY-MM-DD").format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD") ?
                            <button
                              type="button"
                              className="uppercase h-8 px-4 bg-[#ffc107] hover:bg-[#ffca2c] active:bg-[#e0a800] text-[#212529] text-sm font-bold rounded-md shadow-md transition duration-200"
                            >
                              Coming Soon
                            </button>
                          :
                          selectedStoreDetails === null ?
                            <button
                              type="button"
                              className="ml-3 px-4 py-2 bg-green-600 text-white rounded uppercase"
                              onClick={() => setAtFirstLoad(true)}
                            >
                              Order NOW
                            </button>
                          :
                            <button
                              type="button"
                              className="ml-3 px-4 py-2 bg-green-600 text-white rounded uppercase"
                              onClick={() => handleAddOrNextClickedToCart("addToCart")}
                            >
                              ADD TO CART
                            </button>
                        }
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

       
        </div>
      </div>
    </div>
  );
})
