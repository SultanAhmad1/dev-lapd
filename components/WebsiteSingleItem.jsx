"use client";

import moment from "moment";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import { Fragment } from "react";
import ChooseOnlyOne from "./websiteModifiersItems/ChooseOnlyOne";
import ChooseOneItemOneTime from "./websiteModifiersItems/ChooseOneItemOneTime";
import CounterItem from "./websiteModifiersItems/CounterItem";

export const WebsiteSingleItem = (props) => {
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
    websiteModificationData,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    isAnyModifierHasExtras,

    checkPromotionActive,
    getPromotionText,
    getPromotionBgColor,
    getPromotionTextColor,
  } = props;
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto px-4 pt-8 pb-36"> 
        <div className="flex flex-col lg:flex-row gap-6 max-w-5xl w-full mx-auto bg-white p-6 rounded-lg shadow-md">

          {/* Left Side */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center text-sm text-gray-700 hover:text-black">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3z" />
                </svg>
                <span className="ml-2">Back to list</span>
              </a>
            </div>

            
            <div className="relative border rounded">
              {singleItem?.image_url && (
                <Image
                  alt={singleItem?.title}
                  src={
                    isValidHttpsUrl(singleItem?.image_url)
                      ? singleItem.image_url
                      : `${IMAGE_URL_Without_Storage}/${singleItem.image_url}`
                  }
                  className="w-full object-cover overflow-hidden"
                  loading="lazy"
                  width={300}
                  height={200}
                />
              )}

                 
                {
                  checkPromotionActive &&
                  <span
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md"
                    style={{ backgroundColor: getPromotionBgColor, color: getPromotionTextColor }}
                  >
                    {getPromotionText}
                  </span>
                }
              </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2 space-y-14 relative">
            <div>
              <h1 className="text-2xl font-semibold">{singleItem?.title}</h1>
              <p className="text-lg font-medium">£{parseFloat(singleItem?.price).toFixed(2)}</p>
              <p className="text-gray-600 mt-2">{singleItem?.description}</p>
            </div>

            <ul className="space-y-4">
              {(optionNumber === 1 || optionNumber === 2) &&
                singleItem?.modifier_group?.map((modifier, index) => {
                  const isExtras = optionNumber === 2;
                  if ((isExtras && modifier?.isExtras) || (!isExtras && !modifier?.isExtras)) {
                    if (modifier?.modifier_secondary_items?.length > 0) {
                      if (modifier.select_single_option === 1 && modifier.max_permitted === 1) {
                        return <ChooseOnlyOne key={index} {...{ index, modifier, handleRadioInput, websiteModificationData }} />;
                      }
                      if (modifier.select_single_option === 1 && modifier.max_permitted > 1) {
                        return <ChooseOneItemOneTime key={index} {...{ index, modifier, handleCheckInput, websiteModificationData }} />;
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
                        <button
                          className="ml-3 px-4 py-2 bg-green-600 text-white rounded"
                          onClick={() => handleAddOrNextClickedToCart("addToCart")}
                        >
                          ADD TO CART
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>


            {/* Sticky Footer Button */}
{/*             
            <div className="fixed bottom-0 z-40 w-full px-4 lg:w-1/3 lg:right-[16rem] 2xl:right-[25rem] 2xl:w-1/3">
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
                        <button
                          className="ml-3 px-4 py-2 bg-green-600 text-white rounded"
                          onClick={() => handleAddOrNextClickedToCart("addToCart")}
                        >
                          ADD TO CART
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
}
