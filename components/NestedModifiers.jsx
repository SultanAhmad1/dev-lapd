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
                  <div key={index} className="fixed inset-0 z-40 flex justify-center items-start overflow-y-auto bg-black bg-opacity-50">
                    {/* Focus guard (accessibility) */}
                    <div data-focus-guard="true" tabIndex="0" className="sr-only" />

                    <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                      
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold truncate">{secondaryItem?.title}</h2>
                        <button
                          aria-label="Close"
                          onClick={() => handleDisplayItemStates("isModifierClicked", false)}
                          className="text-gray-500 hover:text-red-500 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 10 10"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9 1L5 5M1 9L5 5M5 5L1 1M5 5L9 9" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      {/* Scrollable Body */}
                      <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                        <ul className="space-y-4">
                          {secondaryItem?.secondary_item_modifiers?.map((secondItemModifier, secondItemModifierIndex) => {
                            const commonProps = {
                              index,
                              secondItemModifier,
                              selectedModifierId,
                              selectedModifierItemId,
                              secondItemModifierIndex,
                              websiteModificationData,
                              handleModalModifierToggle,
                            };

                            if (
                              secondItemModifier?.select_single_option === 1 &&
                              secondItemModifier?.min_permitted === 1 &&
                              secondItemModifier?.max_permitted === 1
                            ) {
                              return (
                                <ChooseOnlyOne
                                  key={`${index}.${secondItemModifierIndex}`}
                                  {...commonProps}
                                  handleModalRadioInput={handleModalRadioInput}
                                />
                              );
                            }

                            if (
                              secondItemModifier?.select_single_option === 1 &&
                              secondItemModifier?.max_permitted > 1
                            ) {
                              return (
                                <ChooseOneItemOneTime
                                  key={`${index}.${secondItemModifierIndex}`}
                                  {...commonProps}
                                  handleModalCheckInput={handleModalCheckInput}
                                />
                              );
                            }

                            if (
                              secondItemModifier?.select_single_option > 1 &&
                              secondItemModifier?.max_permitted >= 1
                            ) {
                              return (
                                <CounterItem
                                  key={`${index}.${secondItemModifierIndex}`}
                                  {...commonProps}
                                  handleModalDecrement={handleModalDecrement}
                                  handleModalIncrement={handleModalIncrement}
                                />
                              );
                            }

                            return null;
                          })}
                        </ul>
                      </div>

                      {/* Footer */}
                      <div className="p-4 border-t">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center items-center px-5 py-2 rounded-lg font-medium text-white text-center"
                          style={{
                            backgroundColor:
                              websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                            color:
                              websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                          }}
                          onClick={() => handleSaveBtn(selectedModifierId, selectedModifierItemId)}
                        >
                          Update
                          <span className="mx-1">•</span>
                          &pound;{getAmountConvertToFloatWithFixed(selectedModifierItemPrice, 2)}
                        </button>

                      </div>
                    </div>

                    {/* Focus guard (accessibility) */}
                    <div data-focus-guard="true" tabIndex="0" className="sr-only" />
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
