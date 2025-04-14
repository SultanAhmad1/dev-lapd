"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React, { Fragment } from "react";
import ChooseOnlyOne from "./nestedModifierItems/ChooseOnlyOne";
import ChooseOneItemOneTime from "./nestedModifierItems/ChooseOneItemOneTime";
import CounterItem from "./nestedModifierItems/CounterItem";

export const NestedModifiers = (props) => 
{
  const {
    handleModalIncrement,
    handleModalDecrement,
    selectedModifierItemPrice,
    selectedModifierId,
    selectedModifierItemId,
    singleItem,
    handleBackArrow,
    handleModalModifierToggle,
    handleSaveBtn,
    handleModalCheckInput,
    handleModalRadioInput,
    handleDisplayItemStates,
    websiteModificationData,
  } = props;

  return (
    <Fragment>
      {
        singleItem?.modifier_group.map((modalModifier, index) => 
        {
          return (
            modalModifier?.id === selectedModifierId &&
            modalModifier?.modifier_secondary_items?.map((secondaryItem, index) => 
            {
              return (
                secondaryItem?.id === selectedModifierItemId && (
                  <div key={index}>
                    <div className="agasatdsjbmodifier-modal">
                      <div data-focus-guard="true" tabIndex="0" style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
                        <div className="arjcd5dvasatenmodifier-modal">
                          <div className="alc5dtbzjdfmenmodifier-modal">
                            <div className="akb0jjjkjljmmodifier-modal">
                              
                              <div className="s2akc0modifier-modal">
                                <div className="fqs3alaqc5s4ass5c0modifier-modal">

                                  <div className="e6kae8kbmodifier-modal-name">
                                    {secondaryItem?.title}
                                  </div>

                                  <button
                                    // className="almodifier-back-btn" 
                                    onClick={() =>handleBackArrow(selectedModifierId,selectedModifierItemId)}>
                                    {/* <div className="c8c7cumodifier-back-btn-div"> */}
                                      {/* <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                        <path d="M20.3333 13.25H7.25L11.8333 19.5H8.91667L3.5 12L8.91667 4.5H11.8333L7.25 10.75H20.3333V13.25Z" fill="currentColor"></path>
                                      </svg> */}

                                    <svg 
                                      fill="#000000" 
                                      viewBox="0 0 32 32"  
                                      width="24px" 
                                      height="24px" 
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                      <g 
                                        id="SVGRepo_tracerCarrier" 
                                        strokeLineCap="round" 
                                        strokeLinejoin="round"
                                      ></g>
                                      
                                      <g id="SVGRepo_iconCarrier"> 
                                        <path 
                                          d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"
                                        >
                                        </path> 
                                      </g>
                                    </svg>
                                    {/* </div> */}
                                  </button>

                                </div>

                                <ul className="g0s6modifier-modal">
                                  {
                                    secondaryItem?.secondary_item_modifiers?.map((secondItemModifier,secondItemModifierIndex) => 
                                    {
                                      return(
                                      secondItemModifier?.select_single_option === 1 && secondItemModifier?.min_permitted === 1 && secondItemModifier?.max_permitted === 1 ?
                                        <ChooseOnlyOne 
                                          key={`${index}.${secondItemModifierIndex}`} 
                                          {
                                            ...{
                                              index,
                                              secondItemModifier,
                                              selectedModifierId,
                                              selectedModifierItemId,
                                              handleModalRadioInput,
                                              secondItemModifierIndex,
                                              handleModalModifierToggle,
                                              websiteModificationData,
                                            }
                                          }
                                        />
                                      : 
                                      (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted > 1) ?
                                        <ChooseOneItemOneTime 
                                          key={`${index}.${secondItemModifierIndex}`} 
                                          {
                                            ...{
                                              index,
                                              secondItemModifier,
                                              selectedModifierId,
                                              selectedModifierItemId,
                                              secondItemModifierIndex,
                                              handleModalCheckInput,
                                              handleModalModifierToggle,
                                              websiteModificationData,
                                            }
                                          }
                                        />
                                      : 
                                      (secondItemModifier?.select_single_option > 1 && secondItemModifier?.max_permitted >= 1) &&
                                      
                                        <CounterItem 
                                          key={`${index}.${secondItemModifierIndex}`} 
                                          {
                                            ...{
                                              index,
                                              selectedModifierId, 
                                              selectedModifierItemId,
                                              secondItemModifier,
                                              selectedModifierId,
                                              handleModalModifierToggle,
                                              handleModalDecrement,
                                              handleModalIncrement
                                            }
                                          }
                                        />
                                      )
                                    })
                                  }
                                </ul>

                                <hr className="e0b9duiomodifier-modal"></hr>

                                <div className="fqdvb5afprmodifier-modal">
                                  <button type="button" className="gacxchcjc9modifier-modal-save-btn" style={{'--before-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,'--before-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,}} onClick={() => handleSaveBtn(selectedModifierId,selectedModifierItemId)}>
                                    Update
                                    <span className="chgacjcxcypwc5modifier-modal-save-span">&nbsp;•&nbsp;</span>
                                    &pound;{getAmountConvertToFloatWithFixed(selectedModifierItemPrice,2)}
                                  </button>
                                </div>
                              </div>

                              <button type="button" aria-label="Close" className="lblcldlelflgb1modifier_close_btn" onClick={() => handleDisplayItemStates("isModifierClicked", false)}>
                                <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style={{ stroke: "currentcolor" }}>
                                  <path d="M9 1L5 5M1 9L5 5M5 5L1 1M5 5L9 9" strokeWidth="2" strokeLinecap="round"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div data-focus-guard="true" tabIndex="0" style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
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
