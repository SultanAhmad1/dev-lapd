"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React, { Fragment } from "react";

export const NestedModifiers = (props) => 
{
  const {
    selectedModifierItemPrice,
    selectedModifierId,
    selectedModifierItemId,
    singleitem,
    handleBackArrow,
    handleModalModifierToggle,
    handleSaveBtn,
    handleModalCheckInput,
    handleModalRadioInput,
    setIsmodifierclicked,
    websiteModificationData,
  } = props;

  return (
    <Fragment>
      {
        singleitem?.modifier_group.map((modalmodifier, index) => 
        {
          return (
            modalmodifier?.id === selectedModifierId &&
            modalmodifier?.modifier_secondary_items?.map((secondaryItem, index) => 
            {
              return (
                secondaryItem?.id === selectedModifierItemId && (
                  <div key={index}>
                    <div>
                      <div className="agasatdsjbmodifier-modal">
                        <div data-focus-guard="true" tabIndex="0" style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
                        <div>
                          <div className="arjcd5dvasatenmodifier-modal">
                            <div className="alc5dtbzjdfmenmodifier-modal">
                              <div className="akb0jjjkjljmmodifier-modal">
                                <div>
                                  <div className="s2akc0modifier-modal">
                                    <div className="fqs3alaqc5s4ass5c0modifier-modal">
                                      <button aria-label="Go back" className="almodifier-back-btn" onClick={() =>handleBackArrow(selectedModifierId,selectedModifierItemId)}>
                                        <div className="c8c7cumodifier-back-btn-div">
                                          <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M20.3333 13.25H7.25L11.8333 19.5H8.91667L3.5 12L8.91667 4.5H11.8333L7.25 10.75H20.3333V13.25Z" fill="currentColor"></path>
                                          </svg>
                                        </div>
                                      </button>
                                      <div className="spacer _16"></div>

                                      <div className="e6kae8kbmodifier-modal-name">
                                        {secondaryItem?.title}
                                      </div>
                                    </div>

                                    <ul className="g0s6modifier-modal">
                                      {
                                        secondaryItem?.secondary_item_modifiers?.map((secondItemModifier,secondItemModifierIndex) => 
                                        {
                                          return(
                                            secondItemModifier?.select_single_option === 1 && secondItemModifier?.min_permitted === 1 && secondItemModifier?.max_permitted === 1 ?
                                              <li key={`${index}.${secondItemModifierIndex}`} className="mb-10">
                                                <div className="k5modifier-modal-item">
                                                  <div className="alaqg5fxmodifier-modal-div" onClick={() => handleModalModifierToggle(selectedModifierId, selectedModifierItemId, secondItemModifier?.id)}>
                                                    <div className="alammodifier-modal">
                                                      <div className="product-modifier-name">
                                                        {secondItemModifier?.title}
                                                      </div>
                                                      <div className="chcicwd3czmodifier-choose">
                                                        <span>
                                                          Choose {secondItemModifier?.max_permitted}
                                                        </span>
                                                        <div className="irmodifier-modal">
                                                          <div className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}>
                                                            {parseInt(secondItemModifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      {
                                                        !secondItemModifier?.is_second_item_modifier_clicked &&
                                                        secondItemModifier?.secondary_items_modifier_items?.map((displaySelectedItem, displaySelectedItemIndex) => 
                                                        {
                                                          return (
                                                            displaySelectedItem?.is_item_select && 
                                                              <Fragment key={`${index}.${displaySelectedItemIndex}`}>
                                                                {parseInt(displaySelectedItem?.title?.length) > parseInt(20) ? displaySelectedItem?.title?.substring(0,20) + "..." : displaySelectedItem?.title}
                                                              </Fragment>
                                                          );
                                                        })
                                                      }
                                                    </div>

                                                    <div className="single-product-svg-div accordion">
                                                      <div className="single-product-svg-div-one">
                                                        {
                                                          secondItemModifier?.is_second_item_modifier_clicked ? 
                                                          <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                            <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                                          </svg>
                                                        : 
                                                          <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer",}}>
                                                            <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                                                          </svg>
                                                        }
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {
                                                    <div className={`iwmodifier-data ${secondItemModifier?.is_second_item_modifier_clicked ? "show" : "fade"}`}>
                                                      {
                                                        secondItemModifier?.secondary_items_modifier_items?.map((item, itemIndex) => 
                                                        {
                                                          let isItemSuspend = false;
                                                          if(item?.suspension_info !== null)
                                                          {
                                                            if(moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                                                            {
                                                              isItemSuspend = true
                                                            }
                                                          }
                                                          return (
                                                            isItemSuspend === false &&
                                                            <div className="alakixc5modifier-data" style={{background: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: item?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} key={`${index}.${itemIndex}`} onClick={() => handleModalRadioInput(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}>

                                                              <label className={`chd2cjmodifier-modal-label`} style={{ '--before-color': `${item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                  <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                                <div className="spacer _16"></div>
                                                                <div className="alamdxdvmodifier-modal">
                                                                  <div className="chcicjckjdmodifier-modal" style={{color: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                                    {item?.title}
                                                                  </div>
                                                                  <div className="spacer _8"></div>
                                                                  {
                                                                    getAmountConvertToFloatWithFixed(item?.price_info,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                                    <div className="modifier-group-price" style={{color: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                                      &pound;{parseFloat(item?.price_info).toFixed(2)}
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
                                            secondItemModifier?.max_permitted >= 1 &&
                                            <li key={index} className="mb-10">
                                              <div className="k5modifier-modal-item">
                                                <div className="alaqg5fxmodifier-modal-div" onClick={() => handleModalModifierToggle(selectedModifierId,selectedModifierItemId,secondItemModifier?.id)}>
                                                  <div className="alammodifier-modal">
                                                    <div className="product-modifier-name">
                                                      {secondItemModifier?.title}
                                                    </div>
                                                    <div className="chcicwd3czmodifier-choose">
                                                      <span>
                                                        Choose {secondItemModifier?.max_permitted}
                                                      </span>
                                                      <div className="irmodifier-modal">
                                                        <div className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}>
                                                          {parseInt(secondItemModifier?.min_permitted) > parseInt(0) ? "Required": "Optional"}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    { 
                                                      !secondItemModifier?.is_second_item_modifier_clicked &&
                                                      secondItemModifier?.secondary_items_modifier_items?.map((dispayItemCounter,dispayItemCounterindex) => 
                                                      {
                                                        return (
                                                          dispayItemCounter?.is_item_select && 
                                                            <div key={`${index}.${dispayItemCounterindex}`}>
                                                              {
                                                                parseInt(dispayItemCounter?.title?.length) >
                                                                parseInt(20) ? dispayItemCounter?.title?.substring(0,20) + "..."
                                                                : dispayItemCounter?.title
                                                              }
                                                            </div>
                                                        );
                                                      })
                                                    }
                                                  </div>

                                                  <div className="single-product-svg-div accordion">
                                                    <div className="single-product-svg-div-one">
                                                      {
                                                        secondItemModifier?.is_second_item_modifier_clicked ? 
                                                        <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                          <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                                        </svg>
                                                      : 
                                                        <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer",}}>
                                                          <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)" ></path>
                                                        </svg>
                                                      }
                                                    </div>
                                                  </div>
                                                </div>

                                                {
                                                  <div
                                                    className={`iwmodifier-data ${secondItemModifier?.is_second_item_modifier_clicked ? "show" : "fade"}`}>
                                                    {
                                                      secondItemModifier?.secondary_items_modifier_items?.map((item, itemIndex) => 
                                                      {
                                                        let isItemSuspend = false;
                                                        if(item?.suspension_info !== null)
                                                        {
                                                          if(moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                                                          {
                                                            isItemSuspend = true
                                                          }
                                                        }
                                                        return(
                                                          isItemSuspend = false &&
                                                          <div key={`${index}.${itemIndex}`}>
                                                            <hr className="edb9jegdmodifier-hr"></hr>
                                                            {
                                                              item?.activeClass !=="mchw" ? (
                                                              <div className="alakixc5modifier-data" style={{background: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, border: item?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`}} onClick={() =>handleModalCheckInput(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}>
                                                                <label className={`modifier-product-item-name-checkbox ${item?.activeClass}`} style={{ '--before-color': `${item?.activeClass && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                                                  <div className="spacer _16"></div>
                                                                      <div className="alamdxdvmodifier-modal">
                                                                        <span className="chcicjckjdmodifier-modal" style={{color: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                                          {item?.title}
                                                                        </span>
                                                                        <div className="spacer _8"></div>
                                                                        {
                                                                          getAmountConvertToFloatWithFixed(item?.price_info,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                                          <span className="modifier-group-price" style={{color: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                                            &pound;{parseFloat(item?.price_info).toFixed(2)}
                                                                          </span>
                                                                        }
                                                                      </div>
                                                                </label>
                                                              </div>
                                                            ) : (
                                                              <div className="alakixc5modifier-data">
                                                                <label className={`modifier-product-item-name-checkbox ${item?.activeClass}`} style={{ '--before-color': `${item?.activeClass && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                                                  <div className="spacer _16"></div>
                                                                  <div className="alamdxdvmodifier-modal">
                                                                    <div className="chcicjckjdmodifier-modal">
                                                                      {item?.title}
                                                                    </div>
                                                                    <div className="spacer _8"></div>
                                                                    {
                                                                      getAmountConvertToFloatWithFixed(item?.price_info,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                                      <div className="modifier-group-price">
                                                                        &pound;{parseFloat(item?.price_info).toFixed(2)}
                                                                      </div>
                                                                    }
                                                                  </div>
                                                                </label>
                                                              </div>
                                                            )}
                                                          </div>
                                                        )
                                                      }
                                                    )}
                                                  </div>
                                                }
                                              </div>
                                            </li>
                                          // : 
                                          // <li key={index} className="mb-10">
                                          //   <div>
                                          //     <div>
                                          //       <hr className="product_hr"></hr>
                                          //       <div className="product-list-div" onClick={() => handleModalModifierToggle(selectedModifierId,selectedModifierItemId,secondItemModifier?.id)}>
                                          //         <div className="product-modifier-groups">
                                          //           <div className="product-modifier-name">
                                          //             Add: {secondItemModifier?.title}
                                          //           </div>
                                          //           <div className="product-modifier-option">
                                          //             <span>
                                          //               Choose up to {secondItemModifier?.max_permitted}
                                          //             </span>
                                          //             <div className="irmodifier-modal">
                                          //               <div className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}>
                                          //                 {parseInt(secondItemModifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                                          //               </div>
                                          //             </div>
                                          //           </div>
                                          //           {
                                          //             !secondItemModifier?.is_second_item_modifier_clicked &&
                                          //             secondItemModifier?.secondary_items_modifier_items?.map((dispayItemCounter, dispayItemCounterndex) => 
                                          //             {
                                          //                 return (
                                          //                   getAmountConvertToFloatWithFixed(dispayItemCounter?.counter,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                          //                     <div key={`${index}.${dispayItemCounterndex}`}>
                                          //                       {
                                          //                         parseInt(dispayItemCounter?.title?.length) > parseInt(20) 
                                          //                         ? dispayItemCounter?.title?.substring(0,20) + "..."
                                          //                         : dispayItemCounter?.title
                                          //                       }
                                          //                     </div>
                                          //               )
                                          //             })
                                          //           }
                                          //         </div>

                                          //         <div className="single-product-svg-div accordion">
                                          //           <div className="single-product-svg-div-one">
                                          //             {
                                          //               secondItemModifier?.is_second_item_modifier_clicked ? 
                                          //               <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"focusable="false">
                                          //                 <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                          //               </svg> 
                                          //             :
                                          //               <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer",}}>
                                          //                 <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                                          //               </svg>
                                          //             }
                                          //           </div>
                                          //         </div>
                                          //       </div>
                                          //     </div>

                                          //     {
                                          //       <div className={`iwmodifier-data ${secondItemModifier?.is_second_item_modifier_clicked? "show" : "fade"}`}>
                                          //         {
                                          //           secondItemModifier?.secondary_items_modifier_items?.map((item, itemIndex) => 
                                          //           {
                                          //             return (
                                          //               <div key={`${index}.${itemIndex}`}>
                                          //                 <hr className="product-modifier-items-hr"></hr>
                                          //                 <div className="product-modifier-item-detail">
                                          //                   <div className="modifier-product-item-name-inc-dec">
                                          //                     <div className="modifier-inc-dec">
                                          //                       <button className="modifier-btn" disabled={item?.is_item_select} onClick={() =>handleModalDecrement(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}>
                                          //                         <div className="modifier-btn-div">
                                          //                           <div className="modifier-btn-svg">
                                          //                             <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                          //                               <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                          //                             </svg>
                                          //                           </div>
                                          //                         </div>
                                          //                       </button>

                                          //                       <div className="incremented-values">
                                          //                         {item?.counter}
                                          //                       </div>

                                          //                       <button className="modifier-btn" disabled={ parseInt(secondItemModifier?.max_permitted) ===parseInt(secondItemModifier?.modifier_counter)? true: false} onClick={() => handleModalIncrement(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}>
                                          //                         <div className="modifier-btn-div">
                                          //                           <div className="modifier-btn-svg">
                                          //                             <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"focusable="false">
                                          //                               <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                          //                             </svg>
                                          //                           </div>
                                          //                         </div>
                                          //                       </button>
                                          //                     </div>

                                          //                     <div className="spacer _16"></div>
                                          //                     <div className="modifier-product-item-name-one-div">
                                          //                       <div className="modifier-product-item-name-one-nested-div">
                                          //                         <div className="modifier-product-item-name-one-nested-div-one">
                                          //                           <div className="modifier-product-item-name-one-nested-div-one-nested">
                                          //                             <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                          //                               {item?.title}
                                          //                             </div>
                                          //                             <div className="spacer _8"></div>
                                          //                             {
                                          //                               getAmountConvertToFloatWithFixed(item?.price_info,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                          //                               <div className="modifier-group-price">
                                          //                                 &pound; {parseFloat(item?.price_info).toFixed(2)}
                                          //                               </div>
                                          //                             }
                                          //                           </div>
                                          //                         </div>
                                          //                       </div>
                                          //                     </div>
                                          //                   </div>
                                          //                 </div>
                                          //               </div>
                                          //             );
                                          //           }
                                          //         )}
                                          //       </div>
                                          //     }
                                          //   </div>
                                          // </li>
                                          )
                                        })
                                      }
                                    </ul>

                                    <hr className="e0b9duiomodifier-modal"></hr>

                                    <div className="fqdvb5afprmodifier-modal">
                                      <button 
                                        className="gacxchcjc9modifier-modal-save-btn" 
                                        style={{ 
                                          '--before-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                          '--before-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                        }} 
                                        onClick={() => handleSaveBtn(selectedModifierId,selectedModifierItemId)}
                                      >
                                        Update
                                        <span className="chgacjcxcypwc5modifier-modal-save-span">&nbsp;•&nbsp;</span>
                                        &pound;{getAmountConvertToFloatWithFixed(selectedModifierItemPrice,2)}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <button aria-label="Close" className="lblcldlelflgb1modifier_close_btn" onClick={() => setIsmodifierclicked(false)}>
                                  <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style={{ stroke: "currentcolor" }}>
                                    <path d="M9 1L5 5M1 9L5 5M5 5L1 1M5 5L9 9" strokeWidth="2" strokeLinecap="round"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-focus-guard="true" tabIndex="0" style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
                      </div>
                    </div>
                  </div>
                )
              );
            })
          );
        })
      }
    </Fragment>
  );
}
