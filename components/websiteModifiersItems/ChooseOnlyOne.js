import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React, { Fragment } from "react";

export default function ChooseOnlyOne({
  index,
  modifier,
  handleRadioInput,
  websiteModificationData,
}) 
{
  return(
    <li className={`section${index}`}>
      {/* <hr className="product_hr"></hr> */}
      <div className="product-list-div">
        <div className="product-modifier-groups">
          <div className="product-modifier-name">
            {modifier?.title}
          </div>
        </div>
        <div className="product-required">
          <div className={`product-required-div ${modifier?.valid_class}`}>
            {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
          </div>
          <div className="product-modifier-option">
            <span>Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</span>
          </div>
        </div>
      </div>
      <div className="hg">
        {
          modifier?.modifier_secondary_items?.map((secondItems, indexSecondItem) => {

            let isItemSuspend = false;
            if(secondItems?.suspension_info !== null)
            {
              if(moment().format('YYYY-MM-DD') <= moment.unix(secondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
              {
                isItemSuspend = true
              }
            }

            return (
              isItemSuspend === false && 
              <Fragment key={`${index}.${indexSecondItem}`}>
                <div 
                    className="product-modifier-item-detail"  
                    style={{
                      marginTop: "8px",
                      background: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
                      border: secondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`
                    }}

                    onClick={() =>handleRadioInput(modifier?.id,secondItems?.id,secondItems?.title, parseInt(secondItems?.secondary_item_modifiers.length))}
                  >
                
                  <label className={`modifier-product-item-name`} style={{ '--before-color': `${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinejoin="round"/>
                    </svg>

                    <div className="spacer _16"></div>
                    <div className="modifier-product-item-name-one-nested-div-one-nested" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                      <span className="modifier-product-item-name-one-nested-div-one-nested-div">
                        {secondItems?.title}
                      </span>
                      {
                        parseInt(secondItems?.price) > parseInt(0) && 
                        <span 
                            className="modifier-group-price" 
                            style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}
                          >
                          &pound;{getAmountConvertToFloatWithFixed(secondItems?.price,2)}
                        </span>
                      }
                    </div>
                  </label>

                  {
                    parseInt(secondItems?.secondary_item_modifiers?.length) > parseInt(0) && 
                    // If an item has nested modifiers then left arrow image show.
                    <div className="poquickreview-modal">
                      <div className="c8c7cuquickreview-modal">
                        <svg style={{ cursor: "pointer" }} width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                          <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill={`${secondItems?.item_select_to_sale ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor : "#AFAFAF"}`} transform="rotate(90, 12, 12)"></path>
                        </svg>
                      </div>
                    </div>
                  }
                </div>
              </Fragment>
            );
          }
        )}
      </div>
    </li>
  )
}
