"use client";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import {
  getAmountConvertToFloatWithFixed,
} from "@/global/Store";
import ChooseOnlyOne from "./mobileModifiersItems/ChooseOnlyOne";
import ChooseOneItemOneTime from "./mobileModifiersItems/ChooseOneItemOneTime";
import CounterItem from "./mobileModifiersItems/CounterItem";
import Image from "next/image";

export const MobileSingleItem = (props) => {
  const {
    optionNumber,
    itemPrice,
    singleItem,
    handleMScroll,
    quantity,
    handleRadioInput,
    handleCheckInput,
    handleMobileModifierToggle,
    handleDecrement,
    handleIncrement,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    handleMobileAddToCart,
    handleNextClicked,
    websiteModificationData,
    isAnyModifierHasExtras
  } = props;

  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
  
  return (

    <div onWheel={handleMScroll} className="fixed inset-0 z-40 bg-white overflow-y-auto">
      <div className="relative w-screen h-64">
        {/* Sticky Close Button — Overlapping on top of image */}
        <div className="absolute top-4 left-4 z-40">
          <a href="/" className="text-gray-600 hover:text-black">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white hover:text-black"
            >
              <path
                d="m21.1 5.1-2.2-2.2-6.9 7-6.9-7-2.2 2.2 7 6.9-7 6.9 2.2 2.2 6.9-7 6.9 7 2.2-2.2-7-6.9 7-6.9Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        {/* Full-bleed image with no spacing */}
        {singleItem?.image_url && (
          <Image
            fill
            role="presentation"
            src={
              isValidHttpsUrl(singleItem?.image_url)
                ? singleItem?.image_url
                : `${IMAGE_URL_Without_Storage}${singleItem?.image_url}`
            }
            alt={singleItem?.title}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out scale-100"
          />
        )}
      </div>


      <div className="flex flex-col md:flex-row gap-6  p-3">

        <div className="space-y-4">

          <h2 className="text-xl font-semibold m-0">{singleItem?.title}</h2>
          <span className="text-lg text-black font-bold">&pound;{parseFloat(singleItem?.price).toFixed(2)}</span>
          <p className="text-sm text-gray-700">{singleItem?.description}</p>

          <ul className="space-y-4 pb-32">
            {[1, 2].includes(optionNumber) &&
              singleItem?.modifier_group?.map((modifier, index) => {
                const shouldShow = optionNumber === 1 ? !modifier?.isExtras : modifier?.isExtras;
                if (!shouldShow || parseInt(modifier?.modifier_secondary_items?.length) === 0) return null;

                if (modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1) {
                  return <ChooseOnlyOne key={index} {...{ index, modifier, handleRadioInput, websiteModificationData, handleMobileModifierToggle }} />;
                } else if (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) {
                  return <ChooseOneItemOneTime key={index} {...{ index, modifier, handleCheckInput, websiteModificationData, handleMobileModifierToggle }} />;
                } else if (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) {
                  return <CounterItem key={index} {...{ index, modifier, handleDecrement, handleIncrement, handleMobileModifierToggle }} />;
                }
                return null;
              })}
          </ul>

        <div className="fixed bottom-0 left-0 w-full z-40 bg-black text-white px-4 py-5">
          <div className="flex items-center justify-between gap-2">
            {/* Price and Quantity Section */}
            <div className="flex items-center gap-3">
              {/* Price */}
              <span className="text-white font-semibold text-sm">&pound;{getAmountConvertToFloatWithFixed(quantity * itemPrice, 2)}</span>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMobileQuantityDecrement}
                  disabled={quantity <= 1}
                  className="w-6 h-6 rounded-full border border-white text-white flex items-center justify-center disabled:opacity-50"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-6 h-6 text-center text-black bg-white rounded"
                />
                <button
                  onClick={handleMobileQuantityIncrement}
                  className="w-6 h-6 rounded-full border border-white text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {
                  
              isAnyModifierHasExtras ? 
                <button type="button" className="h-8 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-bold rounded-md shadow-md transition duration-200" onClick={() => handleMobileAddToCart("next")}>
                  NEXT
                </button>
              :
                 
              <div className="flex items-center gap-1">
                {
                  optionNumber === 2 &&
                  <button
                    type="button"
                    onClick={() => handleMobileAddToCart('back')}
                    className="h-8 px-2 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white text-sm font-bold rounded-md shadow-md transition duration-200"
                  >
                    Back
                  </button>
                }
                <button
                  type="button"
                  onClick={() => handleMobileAddToCart("addToCart")}
                  className="h-8 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-bold rounded-md shadow-md transition duration-200"
                >
                  ADD TO CART
                </button>
              </div>
            }
                
          </div>
        </div>

        </div>

      </div>
    </div>
  );
}
