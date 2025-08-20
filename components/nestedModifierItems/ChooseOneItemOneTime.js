import { BLACK_COLOR, WHITE_COLOR } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React, { Fragment } from "react";

export default function ChooseOneItemOneTime({
    index,
    secondItemModifier,
    selectedModifierId,
    selectedModifierItemId,
    handleModalCheckInput,
    handleModalModifierToggle,
    websiteModificationData,
})
{
    return(
        <li className={`mb-6`}>
            <div className="space-y-2">
                {/* Header */}                        
                <div
                    className="flex justify-between items-start cursor-pointer bg-gray-100"
                    onClick={() => handleModalModifierToggle(selectedModifierId, selectedModifierItemId, secondItemModifier?.id)}
                >
                    <div className="flex-1 space-y-1 p-2">
                        {/* Title and Options Row */}
                        <div className="flex items-start justify-between">
                            <h5 className="text-base font-semibold">{secondItemModifier?.title}</h5>

                            <div className="flex flex-col items-end text-sm text-gray-600">
                                <span className={`px-1 py-1 rounded-xl ${secondItemModifier?.valid_class}`}>
                                {parseInt(secondItemModifier?.min_permitted) > 0 ? 'Required' : 'Optional'}
                                </span>
                                <span>
                                Choose {parseInt(secondItemModifier?.min_permitted) === 0 && 'up to'} {secondItemModifier?.max_permitted}
                                </span>
                            </div>
                        </div>

                        {/* Selected Item(s) */}
                        {!secondItemModifier?.is_second_item_modifier_clicked && (
                            <div className="text-sm text-gray-500">
                                {
                                    !secondItemModifier?.is_second_item_modifier_clicked &&
                                    secondItemModifier?.secondary_items_modifier_items?.map((displaySelectedItem, displaySelectedItemIndex) => 
                                    {
                                        return (
                                            displaySelectedItem?.is_item_select && 
                                            <Fragment key={`${index}.${displaySelectedItemIndex}`}>
                                                {parseInt(displaySelectedItem?.title?.length) > parseInt(20) ? displaySelectedItem?.title?.substring(0,20) + "..." : displaySelectedItem?.title}
                                                <br />
                                            </Fragment>
                                        );
                                    })
                                }
                            </div>
                        )}
                    </div>

                    <div className="ml-2">
                        <svg
                        className="w-6 h-6 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        >
                        <path
                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                            transform={`rotate(${secondItemModifier?.is_second_item_modifier_clicked ? '180' : '90'}, 12, 12)`}
                        />
                        </svg>
                    </div>
                </div>

                {secondItemModifier?.is_second_item_modifier_clicked && (
                    <div className="space-y-1">
                        {secondItemModifier?.secondary_items_modifier_items?.map((item, i) => {
                            const isSuspended = item?.suspension_info &&
                            moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD');
            
                            if (isSuspended) return null;
            
                            const isSelected = item?.item_select_to_sale;
                            const bgColor = isSelected && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR);
                            const borderColor = isSelected && `1px solid ${(websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR)}`;
                            const textColor = isSelected && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR);
            
                            return (
                            <div
                                key={`${index}.${i}`}
                                onClick={() =>
                                    handleModalCheckInput(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)
                                }
                                className={`flex items-center justify-between p-3 border rounded-md cursor-pointer`}
                                style={{ background: bgColor, borderColor }}
                            >
                                {/* Left Icon + Title + Price */}
                                <div className="flex items-center gap-2 flex-1">
                                {/* Checkmark Icon */}
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.89163 13.2687L9.16582 17.5427L18.7085 8"
                                        stroke={textColor}
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
            
                                {/* Title and Price */}
                                <div className="flex justify-between items-center w-full font-bold">
                                    <p className="text-left font-semibold" style={{ color: textColor }}>
                                    {item?.title}
                                    </p>
                                    <p className="text-sm text-right font-semibold whitespace-nowrap" style={{ color: textColor }}>
                                        &pound;{getAmountConvertToFloatWithFixed(item?.price_info, 2)}
                                    </p>
                                </div>
                                </div>
            
                                {/* Arrow icon (if needed) */}
                                {parseInt(item?.secondary_item_modifiers?.length) > 0 && (
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                    fill={textColor}
                                    transform="rotate(90, 12, 12)"
                                    />
                                </svg>
                                )}
                            </div>
            
                            );
                        })}
                    </div>
                )}
            </div>
        </li>
    )
}
