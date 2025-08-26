"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";
import Modifiers from "./Modifiers";

export default function MyOrders({orderLine}) 
{
    const hasNotExtras = {
        ...orderLine,
        order_line_modifier_group_products: orderLine?.order_line_modifier_group_products?.filter((isExtras) => parseInt(isExtras?.modifier_group?.is_extras) === parseInt(0))
    };
    const hasExtras = {
        ...orderLine,
        order_line_modifier_group_products: orderLine?.order_line_modifier_group_products?.filter((isExtras) => parseInt(isExtras?.modifier_group?.is_extras) === parseInt(1))
    };
    
    
    return(
        <div className="max-w-3xl mx-auto">
            {/* Order Item 1 */}
            <div className="border-b pb-4 mb-1">
                <div className="flex justify-between items-start text-sm sm:text-base font-semibold mb-1">
                    <div className="bg-gray-200 px-2 py-1">{parseInt(orderLine?.quantity)}</div>

                    {/* Product Name + Modifiers */}
                    <div className="flex-1 px-4 text-start">
                        <span className="pl-4">{orderLine?.product_name}</span>

                        {/* Modifier List: aligned under product name */}
                        <ul className="mt-1 pl-4 text-sm font-normal text-gray-700 space-y-1">
                            {
                                hasNotExtras?.order_line_modifier_group_products?.map((modifier, index) =>
                                {
                                    return(
                                        (parseInt(modifier?.default_option) === parseInt(0)) &&
                                        <Modifiers key={`${index}.${modifier?.id}`} {...{modifier}} />
                                    )
                                })
                            }

                            
                            {
                                hasExtras?.order_line_modifier_group_products?.map((modifier, index) =>
                                {
                                    return(
                                        (parseInt(modifier?.default_option) === parseInt(0)) &&
                                        <Modifiers key={`${index}.${modifier?.id}`} {...{modifier}} />
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div>&pound;{getAmountConvertToFloatWithFixed(orderLine?.total,2)}</div>
                </div>
            </div>

        </div>

    )
}
