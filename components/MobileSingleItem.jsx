"use client";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import {
  getAmountConvertToFloatWithFixed,
} from "@/global/Store";
import moment from "moment";
import React, { Fragment} from "react";

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
    <div onWheel={handleMScroll}>
      <div style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
      <div className="arc2single-product">
        <div className="albfsingle-product">
          <div className="akb0cccdsingle-product">
            <div className="ctascusingle-product">
              <div className="agaksingle-product">
                <div className="akcyczbfsingle-product">
                  <div className="d5single-product">
                    <a  className="d6aqbfc4single-product-cross-btn" href="/">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <title>X</title>
                        <path d="m21.1 5.1-2.2-2.2-6.9 7-6.9-7-2.2 2.2 7 6.9-7 6.9 2.2 2.2 6.9-7 6.9 7 2.2-2.2-7-6.9 7-6.9Z" fill="currentColor"></path>
                      </svg>
                    </a>
                  </div>
                  {/* 
                  <div className="bre3dpsingle-product">{singleItem?.title}</div>
                  <div className="e9single-product"></div> */}
                </div>
              </div>
            </div>
            
            <div>
              <div className="akbkbxc3single-product">
                <div className="bkeaebalsingle-product">
                  <div className="ecsingle-product">
                    <div className="akedeebkefsingle-product">
                      {
                        (singleItem?.image_url && singleItem?.image_url !== null) &&

                        isValidHttpsUrl(singleItem?.image_url) ?
                          <img loading="lazy" width={100} height={100} role="presentation" src={singleItem?.image_url} alt={singleItem?.title} className="egbkaeeheisingle-productimg" />
                        :
                          <img loading="lazy" width={100} height={100} role="presentation" src={`${IMAGE_URL_Without_Storage}${singleItem?.image_url}`} alt={singleItem?.title} className="egbkaeeheisingle-productimg"/>
                      }
                      <div className="agasatbdbcajsingle-product"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="eksingle-product">
              <div className="bnelbpemeneoalbfsingle-product">
                {singleItem?.title}
              </div>
              <span data-testid="rich-text" className="fnfofpbnfqbpfrb1single-product-price">
                &pound;{parseFloat(singleItem?.price).toFixed(2)}
              </span>
              <div className="epeqsingle-product-div"></div>
              <div className="er">
                <div className="bresbtdqetbxsingle-product">
                  {singleItem?.description}
                </div>
              </div>
            </div>

            <ul className="ftsingle-productul">
              {
                optionNumber === 1 &&
                singleItem?.modifier_group?.map((modifier, index) => 
                {
                  if(modifier?.isExtras === false) 
                  {
                    return(
                      parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0) &&
                        modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1 ? 
                        <li key={index} className={`msection${index}`} style={{margin: "10px 0px 10px 0px"}}>
                          <div className="fusingle-productlidiv">
                            <div className="modifier-header" onClick={() => handleMobileModifierToggle(modifier?.id)}>
                              <div className="modifier-div">
                                <div className="alamsingle-product">
                                  
                                  <div className="bnfrbpfsingle-product">{modifier?.title}</div>
  
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
                                    <div className="fzsingle-product">
                                      <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                      </div>
                                      <div>Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                                    </div>
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
                                      <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
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
                                      <div className="alakg6bfsingle-product" style={{background: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: mobileSecondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} key={`${index}.${mobileSecondIndex}`} onClick={() => handleRadioInput(modifier?.id,mobileSecondItems?.id,mobileSecondItems?.title,parseInt(mobileSecondItems ?.secondary_item_modifiers.length))}>
                                     
                                        <label className={`brbsdpdqbkalbfafg6single-productlable`}>
                                          
                                          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          <div className="spacer _16"></div>
                                          <div className="alamgmgnsingle-product">
                                            <div className="bresdpg4gosingle-product" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                              {mobileSecondItems?.title}
                                            </div>
                                            <div className="spacer _8"></div>
                                            {
                                              getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                              <div className="bresbtdqb1bzsingle-productincdecprice" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
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
                                                <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill={`${mobileSecondItems?.item_select_to_sale ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor : "#AFAFAF"}`} transform="rotate(90, 12, 12)"></path>
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
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) ?
                        <li key={index} className={`msection${index}`} style={{margin: "10px 0px 10px 0px"}}>
                          <div className="fusingle-productlidiv">
  
                            <div className="modifier-header" onClick={() =>handleMobileModifierToggle(modifier?.id)}>
                              <div className="modifier-div">
                                <div className="alamsingle-product">
                                  <div className="bnfrbpfsingle-product">{modifier?.title}</div>
  
                                  <div className="bresbtdqfysingle-product">
                                    <div>
                                      {
                                        !modifier?.is_toggle_active &&
                                        modifier?.modifier_secondary_items?.map((displaySelectedItems, mobileSecondIndex) => 
                                        {
                                          return (
                                            displaySelectedItems?.is_item_select && 
                                            <Fragment key={`${index}.${mobileSecondIndex}`}>
                                              {parseInt(displaySelectedItems?.title?.length) > parseInt(20) ? displaySelectedItems?.title?.substring(0,20) + "..." : displaySelectedItems?.title}
                                              <br/>
                                              { 
                                                displaySelectedItems?.modifier_secondary_items?.map((nestedModifier, index) => (
                                                  (nestedModifier?.item_select_to_sale) &&
                                                  nestedModifier?.secondary_item_modifiers?.map((secondModifiers, nestedIndex) => (
                                                    secondModifiers?.is_second_item_modifier_clicked && 
                                                    secondModifiers?.secondary_items_modifier_items?.map((secondItems, itemIndex) => {
                                                      return(
                                                      secondItems?.item_select_to_sale && 
                                                      <Fragment key={`${index}.${nestedIndex}.${itemIndex}`}>
                                                        <span className="secondItemModifiers">{secondModifiers?.title}:</span>${secondItems?.title}
                                                        <br />
                                                      </Fragment>
                                                      )
                                                    })
                                                  ))
                                                ))
                                              }
                                            </Fragment>
                                          );
                                        })
                                      }
                                    </div>
                                    <div className="fzsingle-product">
                                      <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                      </div>
                                      <div>Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                                    </div>
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
                                      <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
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
                                  modifier?.modifier_secondary_items?.map((mobileSecondItems, mobileSecondItemsIndex) => 
                                  {
                                    let isItemSuspend = false;
                                    if(mobileSecondItems?.suspension_info !== null)
                                    {
                                      if(moment().format('YYYY-MM-DD') <= moment.unix(mobileSecondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                                      {
                                        isItemSuspend = true
                                      }
                                    }
  
                                    return( 
                                      isItemSuspend === false &&
                                      mobileSecondItems.activeClass !== "mchw" ? 
                                      <Fragment key={`${index}.${mobileSecondItemsIndex}`} >
                                        <div className="alakg6bfsingle-product" style={{background: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: mobileSecondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() => handleCheckInput(modifier?.id,mobileSecondItems?.id, parseInt(mobileSecondItems?.secondary_item_modifiers.length))}>
                                          <label className={`brbsdpdqbkalbfafg6single-productlablecheck`}>
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="spacer _16"></div>
                                            <div className="alamgmgnsingle-product">
                                              <div className="bresdpg4gosingle-product" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                {mobileSecondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="bresbtdqb1bzsingle-productincdecprice" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                  {
                                                    mobileSecondItems?.country_price_symbol
                                                  }
                                                  {getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                                </div>
                                              }
                                            </div>
                                          </label>
                                        </div>
                                      </Fragment>
                                    : 
                                      <Fragment key={`${index}.${mobileSecondItemsIndex}`}>
                                        <div className="alakg6bfsingle-product">
                                          <label className={`brbsdpdqbkalbfafg6single-productlablecheck`}>
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="spacer _16"></div>
                                            
                                            <div className="alamgmgnsingle-product">
                                              <div className="bresdpg4gosingle-product">
                                                {mobileSecondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="bresbtdqb1bzsingle-productincdecprice">
                                                  &pound; {getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                                </div>
                                              }
                                            </div>
                                                
                                          </label>
                                        </div>
                                      </Fragment>
                                    )
                                  })
                                }
                              </div>
                            }
                          </div>
                        </li>
                      
                      : 
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) &&
                        <li key={index} className={`msection${index}`}>
                          <div className="fusingle-productlidiv">
                            <hr className="modifier-hr"></hr>
  
                            <div className="modifier-header" onClick={() => handleMobileModifierToggle(modifier?.id)}>
                              <div className="modifier-div">
                                
                              
                                <div className="alamsingle-product">
  
                                  <div className="bnfrbpfsingle-product">{modifier?.title}</div>
                                  
                                  <div className="bresbtdqfysingle-product">
                                    <div>
                                      {
                                        !modifier?.is_toggle_active &&
                                        modifier?.modifier_secondary_items?.map((displaySelectedItems,displaySelectedItemsIndex) => 
                                        {
                                          return (
                                            parseInt(displaySelectedItems?.counter) > parseInt(0) && (
                                              <div key={`${index}.${displaySelectedItemsIndex}`}>
                                                {parseInt(displaySelectedItems?.title?.length) > parseInt(20) ? displaySelectedItems?.title?.substring(0,20) + "...": displaySelectedItems?.title}
                                              </div>
                                            )
                                          );
                                        }
                                      )}
                                    </div>
  
                                    <div className="fzsingle-product">
                                      <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                      </div>
                                      <div>Choose { parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                                    </div>
                                  
                                  </div>
                                  
                                </div>
  
                                <div className="single-product-svg-div accordion">
                                  <div className="single-product-svg-div-one">
  
                                    {
                                      modifier?.is_toggle_active ? 
                                      <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" >
                                        <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                      </svg>
                                      : 
                                      <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
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
                                  modifier?.modifier_secondary_items?.map((mobileSecondItems, mobileSecondItemsIndex) => 
                                  {
                                    return (
                                      <div key={`${index}.${mobileSecondItemsIndex}`}>
                                        <div className="alg5bfsingle-product">
                                          <div className="alaqbfsingle-product">
                                            {
                                              parseInt(mobileSecondItems?.counter) > parseInt(0) &&
                                              <>
                                                <button className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn" disabled={mobileSecondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,mobileSecondItems?.id)}>
      
                                                  <div className="ezfj">
                                                    <div className="fjezh1">
                                                      <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                        <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                  
                                                </button>
  
                                                <div className="bresbtdqiqsingle-product">{parseInt(mobileSecondItems?.counter)}</div>
                                              </>
                                            }
  
                                            
                                            <button type="button" className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn" disabled={parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter) ? true : false} onClick={() => handleIncrement(modifier?.id, mobileSecondItems?.id)}>
                                              <div className="ez fj">
  
                                                <div className="fj ez h1">
                                                  <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                    <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                                  </svg>
                                                </div>
  
                                              </div>
                                            </button>
                                          </div>
  
                                          <div className="spacer _16"></div>
                                          <div className="e4ald0ghsingle-productincdec">
                                            <div className="ale4amc4gigjgksingle-productincdec">
                                              <div className="alaqsingle-product">
                                                <div className="alamglgmsingle-productincdec">
                                                  <div className="bresdpg3gnsingle-productincdecheading">{mobileSecondItems?.title}</div>
                                                  <div className="spacer _8"></div>
                                                  {
                                                    getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                    <div className="bresbtdqb1bzsingle-productincdecprice">
                                                      &pound;{getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                                    </div>
                                                  }
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <hr className="efbvgogpsingle-producthr"></hr>
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
                })
              }

              {/* Display IsExtras with True */}
              {
                optionNumber === 2 &&
                singleItem?.modifier_group?.map((modifier, index) => 
                {
                  if(modifier?.isExtras)
                  {
                    return(
                      parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0) &&
                        modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1 ? 
                        <li key={index} className={`msection${index}`} style={{margin: "10px 0px 10px 0px"}}>
                          <div className="fusingle-productlidiv">
                            <div className="modifier-header" onClick={() => handleMobileModifierToggle(modifier?.id)}>
                              <div className="modifier-div">
                                <div className="alamsingle-product">
                                  
                                  <div className="bnfrbpfsingle-product">{modifier?.title}</div>
    
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
                                    <div className="fzsingle-product">
                                      <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                      </div>
                                      <div>Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                                    </div>
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
                                      <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
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
                                      <div className="alakg6bfsingle-product" style={{background: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: mobileSecondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} key={`${index}.${mobileSecondIndex}`} onClick={() => handleRadioInput(modifier?.id,mobileSecondItems?.id,mobileSecondItems?.title,parseInt(mobileSecondItems ?.secondary_item_modifiers.length))}>
                                        {
                                          parseInt(mobileSecondItems?.secondary_item_modifiers?.length) > parseInt(0) && (
                                          <div className="poquickreview-modal">
                                            <div className="c8c7cuquickreview-modal">
                                              <svg style={{ cursor: "pointer" }} width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill={`${mobileSecondItems?.item_select_to_sale ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor : "#AFAFAF"}`} transform="rotate(270, 12, 12)"></path>
                                              </svg>
                                            </div>
                                          </div>
                                        )}
                                        <label className={`brbsdpdqbkalbfafg6single-productlable`}>
                                          
                                          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          <div className="spacer _16"></div>
                                          <div className="alamgmgnsingle-product">
                                            <div className="bresdpg4gosingle-product" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                              {mobileSecondItems?.title}
                                            </div>
                                            <div className="spacer _8"></div>
                                            {
                                              getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                              <div className="bresbtdqb1bzsingle-productincdecprice" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                &pound; {getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                              </div>
                                            }
                                          </div>
                                        </label>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            }
                          </div>
                        </li>
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) ?
                        <li key={index} className={`msection${index}`} style={{margin: "10px 0px 10px 0px"}}>
                          <div className="fusingle-productlidiv">
    
                            <div className="modifier-header" onClick={() =>handleMobileModifierToggle(modifier?.id)}>
                              <div className="modifier-div">
                                <div className="alamsingle-product">
                                  <div className="bnfrbpfsingle-product">{modifier?.title}</div>
    
                                  <div className="bresbtdqfysingle-product">
                                    <div>
                                      {
                                        !modifier?.is_toggle_active &&
                                        modifier?.modifier_secondary_items?.map((displaySelectedItems, mobileSecondIndex) => 
                                        {
                                          return (
                                            displaySelectedItems?.is_item_select && 
                                            <Fragment key={`${index}.${mobileSecondIndex}`}>
                                              {parseInt(displaySelectedItems?.title?.length) > parseInt(20) ? displaySelectedItems?.title?.substring(0,20) + "..." : displaySelectedItems?.title}
                                              <br/>
                                              { 
                                                displaySelectedItems?.modifier_secondary_items?.map((nestedModifier, index) => (
                                                  (nestedModifier?.item_select_to_sale) &&
                                                  nestedModifier?.secondary_item_modifiers?.map((secondModifiers, nestedIndex) => (
                                                    secondModifiers?.is_second_item_modifier_clicked && 
                                                    secondModifiers?.secondary_items_modifier_items?.map((secondItems, itemIndex) => {
                                                      return(
                                                      secondItems?.item_select_to_sale && 
                                                      <Fragment key={`${index}.${nestedIndex}.${itemIndex}`}>
                                                        <span className="secondItemModifiers">{secondModifiers?.title}:</span>${secondItems?.title}
                                                        <br />
                                                      </Fragment>
                                                      )
                                                    })
                                                  ))
                                                ))
                                              }
                                            </Fragment>
                                          );
                                        })
                                      }
                                    </div>
                                    <div className="fzsingle-product">
                                      <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                      </div>
                                      <div>Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                                    </div>
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
                                      <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
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
                                  modifier?.modifier_secondary_items?.map((mobileSecondItems, mobileSecondItemsIndex) => 
                                  {
                                    let isItemSuspend = false;
                                    if(mobileSecondItems?.suspension_info !== null)
                                    {
                                      if(moment().format('YYYY-MM-DD') <= moment.unix(mobileSecondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                                      {
                                        isItemSuspend = true
                                      }
                                    }
    
                                    return( 
                                      isItemSuspend === false &&
                                      mobileSecondItems.activeClass !== "mchw" ? 
                                      <Fragment key={`${index}.${mobileSecondItemsIndex}`} >
                                        <div className="alakg6bfsingle-product" style={{background: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: mobileSecondItems?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() => handleCheckInput(modifier?.id,mobileSecondItems?.id, parseInt(mobileSecondItems?.secondary_item_modifiers.length))}>
                                          <label className={`brbsdpdqbkalbfafg6single-productlablecheck`}>
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="spacer _16"></div>
                                            <div className="alamgmgnsingle-product">
                                              <div className="bresdpg4gosingle-product" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                {mobileSecondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="bresbtdqb1bzsingle-productincdecprice" style={{color: mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                  {
                                                    mobileSecondItems?.country_price_symbol
                                                  }
                                                  {getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                                </div>
                                              }
                                            </div>
                                          </label>
                                        </div>
                                      </Fragment>
                                    : 
                                      <Fragment key={`${index}.${mobileSecondItemsIndex}`}>
                                        <div className="alakg6bfsingle-product">
                                          <label className={`brbsdpdqbkalbfafg6single-productlablecheck`}>
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${mobileSecondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="spacer _16"></div>
                                            
                                            <div className="alamgmgnsingle-product">
                                              <div className="bresdpg4gosingle-product">
                                                {mobileSecondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="bresbtdqb1bzsingle-productincdecprice">
                                                  &pound; {getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                                </div>
                                              }
                                            </div>
                                                
                                          </label>
                                        </div>
                                      </Fragment>
                                    )
                                  })
                                }
                              </div>
                            }
                          </div>
                        </li>
                      
                      : 
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) &&
                        <li key={index} className={`msection${index}`}>
                          <div className="fusingle-productlidiv">
                            <hr className="modifier-hr"></hr>
    
                            <div className="modifier-header" onClick={() => handleMobileModifierToggle(modifier?.id)}>
                              <div className="modifier-div">
                                
                              
                                <div className="alamsingle-product">
    
                                  <div className="bnfrbpfsingle-product">{modifier?.title}</div>
                                  
                                  <div className="bresbtdqfysingle-product">
                                    <div>
                                      {
                                        !modifier?.is_toggle_active &&
                                        modifier?.modifier_secondary_items?.map((displaySelectedItems,displaySelectedItemsIndex) => 
                                        {
                                          return (
                                            parseInt(displaySelectedItems?.counter) > parseInt(0) && (
                                              <div key={`${index}.${displaySelectedItemsIndex}`}>
                                                {parseInt(displaySelectedItems?.title?.length) > parseInt(20) ? displaySelectedItems?.title?.substring(0,20) + "...": displaySelectedItems?.title}
                                              </div>
                                            )
                                          );
                                        }
                                      )}
                                    </div>
    
                                    <div className="fzsingle-product">
                                      <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                      </div>
                                      <div>Choose { parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                                    </div>
                                  
                                  </div>
                                  
                                </div>
    
                                <div className="single-product-svg-div accordion">
                                  <div className="single-product-svg-div-one">
    
                                    {
                                      modifier?.is_toggle_active ? 
                                      <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" >
                                        <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                      </svg>
                                      : 
                                      <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
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
                                  modifier?.modifier_secondary_items?.map((mobileSecondItems, mobileSecondItemsIndex) => 
                                  {
                                    return (
                                      <div key={`${index}.${mobileSecondItemsIndex}`}>
                                        <div className="alg5bfsingle-product">
                                          <div className="alaqbfsingle-product">
                                            {
                                              parseInt(mobileSecondItems?.counter) > parseInt(0) &&
                                              <>
                                                <button className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn" disabled={mobileSecondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,mobileSecondItems?.id)}>
      
                                                  <div className="ezfj">
                                                    <div className="fjezh1">
                                                      <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                        <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                  
                                                </button>
    
                                                <div className="bresbtdqiqsingle-product">{parseInt(mobileSecondItems?.counter)}</div>
                                              </>
                                            }
    
                                              
                                            <button type="button" className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn" disabled={parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter) ? true : false} onClick={() => handleIncrement(modifier?.id, mobileSecondItems?.id)}>
                                              <div className="ez fj">
    
                                                <div className="fj ez h1">
                                                  <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                    <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                                  </svg>
                                                </div>
    
                                              </div>
                                            </button>
                                          </div>
    
                                          <div className="spacer _16"></div>
                                          <div className="e4ald0ghsingle-productincdec">
                                            <div className="ale4amc4gigjgksingle-productincdec">
                                              <div className="alaqsingle-product">
                                                <div className="alamglgmsingle-productincdec">
                                                  <div className="bresdpg3gnsingle-productincdecheading">{mobileSecondItems?.title}</div>
                                                  <div className="spacer _8"></div>
                                                  {
                                                    getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                    <div className="bresbtdqb1bzsingle-productincdecprice">
                                                      &pound;{getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                                    </div>
                                                  }
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <hr className="efbvgogpsingle-producthr"></hr>
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
                })
              }
            </ul>

            <div className="h2single-product"></div>
            <div>
              
              <div className="epezsingle-product"></div>
              <hr className="efeqhjg2single-producthr"></hr>
            </div>

            <div className="iosignle-product"></div>
            <div className="i7single-product"></div>

            {/* <div className="iaibicblidieifigcsctbcsingle-product">
              <p style={{fontWeight: "bold", fontSize: "24px"}}>
                &pound;{getAmountConvertToFloatWithFixed(quantity * itemPrice, 2)}
              </p>

              <div className="albfglh3single-product">

                <div className="agbdh8h4albfsingle-product">
                  <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" disabled={quantity > 1 ? false : true} onClick={handleMobileQuantityDecrement} >
                    <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg" >
                      <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                    </svg>
                  </button>
                  
                  <div className="aghhhibre3dpbualc4bfbzbmsingle-product">{parseInt(quantity)}</div>

                  <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" onClick={handleMobileQuantityIncrement}>
                    <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                      <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                    </svg>
                  </button>
                </div>
                  
                <button type="button" style={{marginLeft: "20px"}} className="add-to-cart-btn-item" onClick={handleMobileAddToCart}>
                  ADD TO CART
                </button>
              </div>
          
            </div> */}
            
            <div className="add-to-cart-design">
              <p style={{fontWeight: "bold", padding: "5px"}}>
                &pound;{getAmountConvertToFloatWithFixed(quantity * itemPrice, 2)}
              </p>


              <div className="agbdh8h4albfsingle-product">
                <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" disabled={quantity > 1 ? false : true} onClick={handleMobileQuantityDecrement} >
                  <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg" >
                    <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                  </svg>
                </button>
                
                <div className="aghhhibre3dpbualc4bfbzbmsingle-product">{parseInt(quantity)}</div>

                <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" onClick={handleMobileQuantityIncrement}>
                  <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                    <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                  </svg>
                </button>
              </div>
              {
                
                isAnyModifierHasExtras ? 
                  <button type="button" style={{marginLeft: "20px"}} className="add-to-cart-btn-item" onClick={() => handleMobileAddToCart("next")}>
                    Next
                  </button>
                :
                  <button type="button" style={{marginLeft: "20px"}} className="add-to-cart-btn-item" onClick={() => handleMobileAddToCart("addToCart")}>
                    ADD TO CART
                  </button>
              }
          
            </div>
            
          </div>
        </div>
      </div>
      <div style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
    </div>
  );
}
