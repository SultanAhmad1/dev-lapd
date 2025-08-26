import { BLACK_COLOR, WHITE_COLOR } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React from "react";

export default function ChooseOneItemOneTime({
    index,
    modifier,
    handleCheckInput,
    websiteModificationData,
})
{
    return(
        <li className={`section${index} mb-3 space-y-2`}>
            {/* Header */}
            <div
                className="flex justify-between items-start cursor-pointer"
            >
                <div className="flex-1 space-y-1 p-2">
                {/* Title and Options Row */}
                <div className="flex items-start justify-between">
                    <h5 className="text-base font-semibold">{modifier?.title}</h5>

                    <div className="flex flex-col items-end text-sm text-gray-600">
                    <span className={`px-1 py-1 rounded-xl ${modifier?.valid_class}`}>
                        {parseInt(modifier?.min_permitted) > 0 ? 'Required' : 'Optional'}
                    </span>
                    <span>
                        Choose {parseInt(modifier?.min_permitted) === 0 && 'up to'} {modifier?.max_permitted}
                    </span>
                    </div>
                </div>

                </div>

            </div>

            {/* Selected Item(s) */}      
            {
            modifier?.modifier_secondary_items?.map((item, indexSecondItem) => {

                let isItemSuspend = item?.suspension_info && (moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                if(isItemSuspend)
                {
                    return null
                }

                const isSelected = item?.item_select_to_sale;
                const bgColor = isSelected && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR);
                const borderColor = isSelected && `1px solid ${(websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR)}`;
                const textColor = isSelected && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR);

                return (
                    <div
                        key={`${index}.${indexSecondItem}`}
                        onClick={() =>handleCheckInput(modifier?.id,item?.id,item?.title, parseInt(item?.secondary_item_modifiers.length))}
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
                            <p className="text-left" style={{ color: textColor }}>
                            {item?.title}
                            </p>
                            <p className="text-sm text-right whitespace-nowrap font-bold" style={{ color: textColor }}>
                            &pound;{getAmountConvertToFloatWithFixed(item?.price, 2)}
                            </p>
                        </div>
                        </div>

                        {/* Arrow icon (if needed) */}
                        {
                        parseInt(item?.secondary_item_modifiers?.length) > parseInt(0) &&
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                            fill={`${item?.item_select_to_sale ? (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR): "#AFAFAF"}`}
                            transform="rotate(90, 12, 12)"
                            />
                        </svg>
                        }
                    </div>
                );
            }
            )}
        </li>
    )
}
