import { BLACK_COLOR, WHITE_COLOR } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React, { Fragment } from "react";

export default function ChooseOnlyOne({
    index,
    secondItemModifier,
    selectedModifierId,
    handleModalRadioInput,
    selectedModifierItemId,
    handleModalModifierToggle,
    websiteModificationData,
}) 
{
    return(
      <li className="mb-6">
  <div className="space-y-2">
    {/* Header */}
    <div
      className="flex justify-between items-start p-3 bg-gray-100 rounded-md shadow cursor-pointer"
      onClick={() =>
        handleModalModifierToggle(
          selectedModifierId,
          selectedModifierItemId,
          secondItemModifier?.id
        )
      }
    >
      <div className="flex-1 space-y-1">
        {/* Title + Requirement Info */}
        <div className="flex justify-between items-start">
          <h5 className="text-base font-semibold text-gray-800">{secondItemModifier?.title}</h5>
          <div className="flex flex-col items-end text-sm text-gray-600">
            <span className={`px-2 py-1 rounded-full text-xs ${secondItemModifier?.valid_class}`}>
              {parseInt(secondItemModifier?.min_permitted) > 0 ? 'Required' : 'Optional'}
            </span>
            <span className="text-xs">
              Choose {parseInt(secondItemModifier?.min_permitted) === 0 && 'up to'}{' '}
              {secondItemModifier?.max_permitted}
            </span>
          </div>
        </div>

        {/* Selected Item(s) */}
        {!secondItemModifier?.is_second_item_modifier_clicked && (
          <div className="text-sm text-gray-500">
            {secondItemModifier?.secondary_items_modifier_items?.map(
              (item, idx) =>
                item?.is_item_select && (
                  <Fragment key={`${index}.${idx}`}>
                    {item?.title?.length > 20
                      ? `${item?.title.substring(0, 20)}...`
                      : item?.title}
                    <br />
                  </Fragment>
                )
            )}
          </div>
        )}
      </div>

      {/* Toggle Arrow */}
      <svg
        className="w-5 h-5 text-gray-500 ml-2"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
          transform={`rotate(${secondItemModifier?.is_second_item_modifier_clicked ? '180' : '90'}, 12, 12)`}
        />
      </svg>
    </div>

    {/* Expanded Modifier Options */}
    {secondItemModifier?.is_second_item_modifier_clicked && (
      <div className="space-y-2">
        {secondItemModifier?.secondary_items_modifier_items?.map((item, i) => {
          const isSuspended =
            item?.suspension_info &&
            moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD');

          if (isSuspended) return null;

          const isSelected = item?.item_select_to_sale;
          const bgColor =
            isSelected &&
            (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR);
          const textColor =
            isSelected &&
            (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR);
          const borderColor = isSelected ? `1px solid ${bgColor}` : '1px solid #e5e7eb';

          return (
            <div
              key={`${index}.${i}`}
              onClick={() =>
                handleModalRadioInput(
                  selectedModifierId,
                  selectedModifierItemId,
                  secondItemModifier?.id,
                  item?.id
                )
              }
              className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors`}
              style={{ backgroundColor: bgColor || '', border: borderColor, color: textColor || '' }}
            >
              {/* Item Content */}
              <div className="flex items-center gap-3 flex-1">
                {/* Checkmark Icon */}
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
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
                  <p className="text-sm font-semibold">{item?.title}</p>
                  <p className="text-sm whitespace-nowrap font-semibold">
                    &pound;{getAmountConvertToFloatWithFixed(item?.price_info, 2)}
                  </p>
                </div>
              </div>

              {/* Nested Modifiers Indicator */}
              {parseInt(item?.secondary_item_modifiers?.length) > 0 && (
                <svg
                  className="w-5 h-5 text-gray-500 ml-2"
                  viewBox="0 0 24 24"
                fill="currentColor"
                >
                  <path
                    d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
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
