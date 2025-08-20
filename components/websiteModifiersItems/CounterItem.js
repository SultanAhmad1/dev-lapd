import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React, { Fragment } from "react";

export default function CounterItem({
    index,
    modifier,
    handleDecrement,
    handleIncrement,
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

            {/* List of all modifier group products */}
            {
                modifier?.modifier_secondary_items?.map((secondItems,indexSecondItem) =>
                {
                    let isItemSuspend = secondItems?.suspension_info && (moment().format('YYYY-MM-DD') <= moment.unix(secondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                    
                    if(isItemSuspend)
                    {
                        return null
                    }
                    

                    return(
                        <div key={indexSecondItem} className="flex flex-row gap-2 items-center justify-between mb-2 p-2 border border-gray-200 rounded-lg shadow-sm bg-white">
                            
                            {/* Product Title and Price */}
                            <div className="mt-1">
                                <div className="text-base font-semibold">{secondItems?.title} &pound;{parseFloat(secondItems?.price).toFixed(2)}</div>
                            </div>

                            {/* Increment / Decrement Controls */}
                            <div className="flex items-center space-x-1">
                                {parseInt(secondItems?.counter) > 0 && (
                                    <>
                                    <button
                                        className="p-1 rounded-full bg-gray-100 disabled:opacity-50"
                                        disabled={secondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,secondItems?.id)}
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

                                    <div className="text-lg font-medium">{parseInt(secondItems?.counter)}</div>
                                    </>
                                )}

                                <button
                                    className="p-1 rounded-full bg-gray-100 disabled:opacity-50"
                                    disabled={(parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter)) ? true : false} onClick={() => handleIncrement(modifier?.id,secondItems?.id)}
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
                    )
                })
            }
        </li>
    )
}
