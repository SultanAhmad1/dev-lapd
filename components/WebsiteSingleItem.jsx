"use client";

import moment from "moment";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import {getAmountConvertToFloatWithFixed} from "@/global/Store";
import Image from "next/image";
import { Fragment } from "react";
import Link from "next/link";

export const WebsiteSingleItem = (props) => {
  const {
    optionNumber,
    singleItem,
    quantity,
    itemPrice,
    handleDisplayItemStates,
    handleRadioInput,
    handleCheckInput,
    handleDecrement,
    handleIncrement,
    handleQuantity,
    handleAddOrNextClickedToCart,
    handleNextClicked,
    websiteModificationData,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    isAnyModifierHasExtras,
  } = props;
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
  
  
  
  return (
    <div className="e5 e6">
      <div className="single-product-level-one-div">
        <div className="level-one-div-nested-one">
          <Link className="back-btn-product" href="/">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="back-svg">
              <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3z"></path>
            </svg>
            <div className="spacer _8"></div>
            Back to list
          </Link>

          <button className="cross-btn" onClick={() => handleDisplayItemStates("isItemClicked",false)}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="back-svg">
              <line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/>
              <line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/>
            </svg>
            <span>{singleItem?.title}</span>
          </button>

          {
            (singleItem?.image_url && singleItem?.image_url !== null) && 
            <div className="product-img">
              <div className="bz">
                <div className="product-img-div-one-div">
                  <div className="product-img-div-one-div-nested">
                    <div className="product-img-div-one-div-nested-div">
                      <div className="product-img-zoom">
                        {
                          isValidHttpsUrl(singleItem?.image_url) ?
                          <img
                            alt={singleItem?.title}
                            role="presentation"
                            src={singleItem?.image_url}
                            className="product-img-display"
                            loading="lazy"
                          />

                          :
                          <img
                            alt={singleItem?.title}
                            role="presentation"
                            src={"/"+singleItem?.image_url}
                            className="product-img-display"
                            loading="lazy"
                          />

                        }
                        <div className="img-hr"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <div className="level-one-div-nested-two">
          <div className="product-title">
            <h2 className="product-h2"></h2>
            <h1 className="product-h1">{singleItem?.title}</h1>
            <span className="product-price-span">&pound;{parseFloat(singleItem?.price).toFixed(2)}</span>
            <div className="product_h8"></div>

            <div className="product-description">
              <div className="product-description-div">{singleItem?.description}</div>
            </div>

            <div className="product_h8"></div>
          </div>

          <div className="product-height"></div>

          <ul className="product-ul">
            {
              optionNumber === 1 && 
              singleItem?.modifier_group?.map((modifier, index) => {
                if(modifier?.isExtras === false)
                {
                  return (
                    // (parseInt(modifier?.modifier_secondary_items?.length) > 0) &&
                    (
                      modifier?.select_single_option === 1 && modifier?.max_permitted === 1 
                      ? 
                        <li key={index} className={`section${index}`} index={index}>
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
                                    <div className="product-modifier-item-detail"  style={{marginTop: "8px",background: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: secondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() =>handleRadioInput(modifier?.id,secondItems?.id,secondItems?.title, parseInt(secondItems?.secondary_item_modifiers.length))}>
                                    
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
                                            <span className="modifier-group-price" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
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
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) 
                      ?
                        <li key={index} className={`section${index}`} index={index}>
                          <div className="product-list-div">
                            <div className="product-modifier-groups">
                              <div className="product-modifier-name">
                                {modifier?.title}
                              </div>
                            </div>
  
                            <div className="product-required">
                              
                              <div className={`product-required-div ${modifier?.valid_class}`}>
                                {parseInt(modifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                              </div>
                              
                              <div className="product-modifier-option">
                                <span>
                                  Choose { parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                                </span>
                              </div>
  
                            </div>
                          </div>
                          {/* List of all modifier group products */}
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
                                  <div key={`${index}.${indexSecondItem}`}>
                                    {
                                      secondItems.activeClass !== "mchw" ? 
                                      <div className="product-modifier-item-detail"  style={{marginTop: "8px",background: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: secondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() => handleCheckInput(modifier?.id,secondItems?.id,parseInt(secondItems?.secondary_item_modifiers.length))}>
                                          <label className={`modifier-product-item-name-checkbox`} style={{ '--before-color': `${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="spacer _16"></div>
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested-div" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                {secondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(secondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="modifier-group-price" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>&pound;{getAmountConvertToFloatWithFixed(secondItems?.price,2)}</div>
                                              }
                                            </div>
                                          </label>
                                      </div>
                                    :
                                      <div style={{marginTop: "8px"}} className="product-modifier-item-detail">
                                        <label className={`modifier-product-item-name-checkbox`} style={{ '--before-color': `${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`} strokeWidth="2.5" strokeLinejoin="round"/>
                                          </svg>
                                          <div className="spacer _16"></div>
                                          <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                              {secondItems?.title}
                                            </div>
                                            <div className="spacer _8"></div>
                                            {
                                              getAmountConvertToFloatWithFixed(secondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && (
                                              <div className="modifier-group-price">&pound;{parseFloat(secondItems?.price).toFixed(2)}</div>
                                            )}
                                          </div>
                                        </label>
                                      </div>
                                    }
                                  </div>
                                );
                              })
                            }
                          </div>
                        </li>
                      : 
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) 
                      &&
                        <li key={index} className={`section${index}`} index={index}>
    
                          <div className="product-list-div">
                            <div className="product-modifier-groups">
                              <div className="product-modifier-name">
                                {modifier?.title}
                              </div>
                            </div>
    
                            <div className="product-required">
                              
                              <div className={`product-required-div ${modifier?.valid_class}`}>
                                {parseInt(modifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                              </div>
                              
                              <div className="product-modifier-option">
                                <span>
                                  Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                                </span>
                              </div>
    
                            </div>
                          </div>
    
                          {/* List of all modifier group products */}
                          <div className="hg">
                            {
                              modifier?.modifier_secondary_items?.map((secondItems,indexSecondItem) =>
                              {
                                return(
                                  <Fragment key={indexSecondItem}>
                                    <div className="product-modifier-item-detail" style={{marginTop: "8px"}}>
    
                                      <div className="modifier-product-item-name-inc-dec">
                                      
                                        <div className="modifier-inc-dec">
                                          {
                                            parseInt(secondItems?.counter) > parseInt(0) &&
                                            <>
                                              <button className="modifier-btn" disabled={secondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,secondItems?.id)}>
    
                                                <div className="modifier-btn-div">
                                                  <div className="modifier-btn-svg">
                                                    <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                      <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                                    </svg>
                                                  </div>
                                                </div>
    
                                              </button>
    
                                              <div className="incremented-values">{parseInt(secondItems?.counter)}</div>
                                            </>
                                          }
                                  
                                            
                                          <button className="modifier-btn" disabled={(parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter)) ? true : false} onClick={() => handleIncrement(modifier?.id,secondItems?.id)}>
    
                                            <div className="modifier-btn-div">
                                              <div className="modifier-btn-svg">
                                                <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                  <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                                </svg>
                                              </div>
                                            </div>
    
                                          </button>
                                        </div>
    
                                        <div className="spacer _16"></div>
                                        <div className="modifier-product-item-name-one-div">
                                          <div className="modifier-product-item-name-one-nested-div">
                                            <div className="modifier-product-item-name-one-nested-div-one">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested-div">Add: {secondItems?.title}</div>
                                                <div className="spacer _8"></div>
                                                <div className="modifier-group-price">+{secondItems?.country_price_symbol}{getAmountConvertToFloatWithFixed(secondItems?.price,2)}</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
    
                                      </div>
    
                                    </div>
                                  </Fragment>
                                )
                              })
                            }
                          </div>
                        </li>
                    ) 
                  );
                }
              })
            }

            {/* optionNumber is greater than 1 and less than 2, isExtras must be true */}
            {
              optionNumber === 2 && 
              singleItem?.modifier_group?.map((modifier, index) => {
                if(modifier?.isExtras)
                {
                  return (
                    (parseInt(modifier?.modifier_secondary_items?.length) > 0) &&
                    (
                        modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1 
                      ? 
                        <li key={index} className={`section${index}`} index={index}>
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
                                    <div className="product-modifier-item-detail"  style={{marginTop: "8px",background: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: secondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() =>handleRadioInput(modifier?.id,secondItems?.id,secondItems?.title, parseInt(secondItems?.secondary_item_modifiers.length))}>
                                      
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
                                            <span className="modifier-group-price" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
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
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) ?
                        <li key={index} className={`section${index}`} index={index}>
                          <div className="product-list-div">
                            <div className="product-modifier-groups">
                              <div className="product-modifier-name">
                                {modifier?.title}
                              </div>
                            </div>
  
                            <div className="product-required">
                              
                              <div className={`product-required-div ${modifier?.valid_class}`}>
                                {parseInt(modifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                              </div>
                              
                              <div className="product-modifier-option">
                                <span>
                                  Choose { parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                                </span>
                              </div>
  
                            </div>
                          </div>
                          {/* List of all modifier group products */}
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
                                  <div key={`${index}.${indexSecondItem}`}>
                                    {
                                      secondItems.activeClass !== "mchw" ? 
                                      <div className="product-modifier-item-detail"  style={{marginTop: "8px",background: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: secondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() => handleCheckInput(modifier?.id,secondItems?.id,parseInt(secondItems?.secondary_item_modifiers.length))}>
                                          <label className={`modifier-product-item-name-checkbox`} style={{ '--before-color': `${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="spacer _16"></div>
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested-div" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                {secondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(secondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="modifier-group-price" style={{color: secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>&pound;{getAmountConvertToFloatWithFixed(secondItems?.price,2)}</div>
                                              }
                                            </div>
                                          </label>
                                      </div>
                                    :
                                      <div style={{marginTop: "8px"}} className="product-modifier-item-detail">
                                        <label className={`modifier-product-item-name-checkbox`} style={{ '--before-color': `${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`} strokeWidth="2.5" strokeLinejoin="round"/>
                                          </svg>
                                          <div className="spacer _16"></div>
                                          <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                              {secondItems?.title}
                                            </div>
                                            <div className="spacer _8"></div>
                                            {
                                              getAmountConvertToFloatWithFixed(secondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && (
                                              <div className="modifier-group-price">&pound;{parseFloat(secondItems?.price).toFixed(2)}</div>
                                            )}
                                          </div>
                                        </label>
                                      </div>
                                    }
                                  </div>
                                );
                              })
                            }
                          </div>
                        </li>
                      :
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) &&
                        <li key={index} className={`section${index}`} index={index}>
    
                          <div className="product-list-div">
                            <div className="product-modifier-groups">
                              <div className="product-modifier-name">
                                {modifier?.title}
                              </div>
                            </div>
    
                            <div className="product-required">
                              
                              <div className={`product-required-div ${modifier?.valid_class}`}>
                                {parseInt(modifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                              </div>
                              
                              <div className="product-modifier-option">
                                <span>
                                  Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                                </span>
                              </div>
    
                            </div>
                          </div>
    
                          {/* List of all modifier group products */}
                          <div className="hg">
                            {
                              modifier?.modifier_secondary_items?.map((secondItems,indexSecondItem) =>
                              {
                                return(
                                  <Fragment key={indexSecondItem}>
                                    <div className="product-modifier-item-detail" style={{marginTop: "8px"}}>
    
                                      <div className="modifier-product-item-name-inc-dec">
                                      
                                        <div className="modifier-inc-dec">
                                          {
                                            parseInt(secondItems?.counter) > parseInt(0) &&
                                            <>
                                              <button className="modifier-btn" disabled={secondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,secondItems?.id)}>
    
                                                <div className="modifier-btn-div">
                                                  <div className="modifier-btn-svg">
                                                    <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                      <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                                    </svg>
                                                  </div>
                                                </div>
    
                                              </button>
    
                                              <div className="incremented-values">{parseInt(secondItems?.counter)}</div>
                                            </>
                                          }
                                  
                                            
                                          <button className="modifier-btn" disabled={(parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter)) ? true : false} onClick={() => handleIncrement(modifier?.id,secondItems?.id)}>
    
                                            <div className="modifier-btn-div">
                                              <div className="modifier-btn-svg">
                                                <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                  <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                                </svg>
                                              </div>
                                            </div>
    
                                          </button>
                                        </div>
    
                                        <div className="spacer _16"></div>
                                        <div className="modifier-product-item-name-one-div">
                                          <div className="modifier-product-item-name-one-nested-div">
                                            <div className="modifier-product-item-name-one-nested-div-one">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested-div">Add: {secondItems?.title}</div>
                                                <div className="spacer _8"></div>
                                                <div className="modifier-group-price">+{secondItems?.country_price_symbol}{getAmountConvertToFloatWithFixed(secondItems?.price,2)}</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
    
                                      </div>
    
                                    </div>
                                  </Fragment>
                                )
                              })
                            }
                          </div>
                        </li>
                    ) 
                  );
                }
              })
            }
          </ul>

          <div className="product-top-padding-2"></div>

          <div className="of">
            <div className="add-to-cart-btn-no-selection">
            
              <p>&pound;{parseFloat(quantity * itemPrice).toFixed(2)}</p>
              
                <div className="albfglh3single-product">
                  <div className="agbdh8h4albfsingle-product" >
                    
                    <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" disabled={quantity > 1 ? false : true} onClick={handleMobileQuantityDecrement}>
                      <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg" >
                        <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                      </svg>
                    </button>

                    <div className="aghhhibre3dpbualc4bfbzbmsingle-product">
                      {parseInt(quantity)}
                    </div>

                    <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" onClick={handleMobileQuantityIncrement}>
                      <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                        <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                      </svg>
                    </button>
                  </div>

                  {
                    isAnyModifierHasExtras ? 
                      <button type="button" style={{marginLeft: "10px"}} className="add-to-cart-btn-item" onClick={() => handleAddOrNextClickedToCart("next")}>
                        Next
                      </button>
                    :
                      <button type="button" style={{marginLeft: "10px"}} className="add-to-cart-btn-item" onClick={() => handleAddOrNextClickedToCart("addToCart")}>
                        ADD TO CART
                      </button>
                  }
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
