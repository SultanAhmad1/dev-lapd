import React, { Fragment } from "react";

export default function CounterItem({
    index,
    secondItemModifier,
    selectedModifierId, 
    selectedModifierItemId,
    handleModalModifierToggle,
    handleModalDecrement,
    handleModalIncrement
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
                                            parseInt(displaySelectedItem?.counter) > parseInt(0) && 
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

                {
                    secondItemModifier?.is_second_item_modifier_clicked &&
                    secondItemModifier?.secondary_items_modifier_items?.map((item, itemIndex) => 
                    {
                        const isSuspended = item?.suspension_info && moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD');
                        if (isSuspended) return null;

                        return (
                            
                            <div key={`${index}.${itemIndex}`}  className="flex flex-row gap-2 items-center justify-between mb-2 p-2 border border-gray-200 rounded-lg shadow-sm bg-white">
                                
                                {/* Product Title and Price */}
                                <div className="mt-1">
                                    <div className="text-base font-semibold">{item?.title} &pound;{parseFloat(item?.price_info).toFixed(2)}</div>
                                </div>

                                {/* Increment / Decrement Controls */}
                                <div className="flex items-center space-x-1">
                                    {parseInt(item?.counter) > 0 && (
                                        <>
                                        <button
                                            className="p-1 rounded-full bg-gray-100 disabled:opacity-50"
                                            disabled={item?.is_item_select}
                                            onClick={() =>
                                            handleModalDecrement(
                                                selectedModifierId,
                                                selectedModifierItemId,
                                                secondItemModifier?.id,
                                                item?.id
                                            )
                                            }
                                        >
                                            <svg
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            focusable="false"
                                            >
                                            <path d="m7.33325 13v-2h9.33335v2z" fill="#000000" />
                                            </svg>
                                        </button>

                                        <div className="text-lg font-medium">{parseInt(item?.counter)}</div>
                                        </>
                                    )}

                                    <button
                                        className="p-1 rounded-full bg-gray-100 disabled:opacity-50"
                                        disabled={
                                        parseInt(secondItemModifier?.max_permitted) ===
                                        parseInt(secondItemModifier?.modifier_counter)
                                        }
                                        onClick={() =>
                                        handleModalIncrement(
                                            selectedModifierId,
                                            selectedModifierItemId,
                                            secondItemModifier?.id,
                                            item?.id
                                        )
                                        }
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            focusable="false"
                                        >
                                        <path
                                            d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z"
                                            fill="#000000"
                                        />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </li>
    )
}
