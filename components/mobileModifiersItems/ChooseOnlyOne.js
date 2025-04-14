import { BLACK_COLOR, WHITE_COLOR } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React, { Fragment } from "react";

export default function ChooseOnlyOne({
  index,
  modifier,
  handleRadioInput,
  websiteModificationData,
  handleMobileModifierToggle,
}) 
{

  return(
    <li className={`msection${index}`} style={{margin: "0px 0px 30px 0px"}}>
      <div className="fusingle-productlidiv">
        <div className="modifier-header" onClick={() => handleMobileModifierToggle(modifier?.id)}>
          <div className="modifier-div">
            <div className="alamsingle-product">
              
              <div className="bnfrbpfsingle-product">

                <h5 className="modifier-dropdown-title">
                  {modifier?.title}
                </h5>

                <div className="fzsingle-product">
                  
                  <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                    {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                  </div>

                  <div className="choose-items">
                    Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                  </div>

                </div>
              </div>

              {/* Display selected modifier items. */}
              <div className="bresbtdqfysingle-product">
                <div>
                  { 
                    !modifier?.is_toggle_active && 
                    <Fragment>
                    {  
                      parseInt(modifier?.selected_item_name?.length) > parseInt(20) ? 
                      modifier?.selected_item_name?.substring(0,20) + "..." 
                      : 
                      modifier?.selected_item_name
                    }
                      <br/>
                    { 
                      modifier?.modifier_secondary_items?.map((nestedModifier, index) => (
                        (nestedModifier?.item_select_to_sale) &&
                        nestedModifier?.secondary_item_modifiers?.map((secondModifiers, nestedIndex) => (
                          secondModifiers?.is_second_item_modifier_clicked && 
                          secondModifiers?.secondary_items_modifier_items?.map((secondItems, itemIndex) => {
                          
                            return(secondItems?.item_select_to_sale && 
                              <Fragment key={`${index}.${nestedIndex}.${itemIndex}`}>
                                <span className="secondItemModifiers">{secondModifiers?.title}:</span> {secondItems?.title}
                                <br />
                              </Fragment>
                            )  
                          })
                        ))
                      ))
                    }
                    </Fragment>
                  }
                </div>
                {/* <div className="fzsingle-product">
                  <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                    {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                  </div>
                  <div>Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                </div> */}
              </div>
            </div>

            <div className="single-product-svg-div accordion">
              <div className="single-product-svg-div-one">
                {
                  modifier?.is_toggle_active ?
                  <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                  </svg>
                : 
                  <svg className="right-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
                    <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                  </svg>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Listed Data */}
        {
          <div className={`g5single-product ${modifier?.is_toggle_active ? "show" : "fade"}`}>
            {
              modifier?.modifier_secondary_items?.map((mobileSecondItems, mobileSecondIndex) => 
              {
                let isItemSuspend = false;
                if(mobileSecondItems?.suspension_info !== null)
                {
                  if(moment().format('YYYY-MM-DD') <= moment.unix(mobileSecondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                  {
                    isItemSuspend = true
                  }
                }
                return (
                  isItemSuspend === false &&
                  <div 
                    className="alakg6bfsingle-product" 
                    style={{
                      background: mobileSecondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR),
                      border: mobileSecondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR}`
                    }} 
                    key={`${index}.${mobileSecondIndex}`} 
                    onClick={() => handleRadioInput(modifier?.id,mobileSecondItems?.id,mobileSecondItems?.title,parseInt(mobileSecondItems ?.secondary_item_modifiers.length))}
                  >
                  
                    <label className={`brbsdpdqbkalbfafg6single-productlable`}>
                      
                      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {/* <div className="spacer _16"></div> */}
                      <div className="alamgmgnsingle-product">
                        <div className="bresdpg4gosingle-product" style={{color: mobileSecondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}}>
                          {mobileSecondItems?.title}
                        </div>
                        <div className="spacer _8"></div>
                        {
                          getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                          <div className="bresbtdqb1bzsingle-productincdecprice" style={{color: mobileSecondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}}>
                            &pound; {getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                          </div>
                        }
                      </div>
                    </label>

                    {
                      parseInt(mobileSecondItems?.secondary_item_modifiers?.length) > parseInt(0) && (
                      <div className="poquickreview-modal">
                        <div className="c8c7cuquickreview-modal">
                          <svg style={{ cursor: "pointer" }} width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                            <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill={`${mobileSecondItems?.item_select_to_sale ? (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR): "#AFAFAF"}`} transform="rotate(90, 12, 12)"></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        }
      </div>
    </li>
  )
}
