"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";

export default function Total({subtotal, deliveryCharge,serviceCharge,discountAmount})
{
    return(
        <>
            <ul className="space-y-2">
                <li className="flex justify-between items-center pb-1 font-medium">
                    <span className="text-md font-medium text-gray-700">Subtotal</span>
                    <span className="text-md font-medium text-gray-800">
                        &pound;{getAmountConvertToFloatWithFixed(subtotal, 2)}
                    </span>
                </li>

                <li className="flex justify-between items-center pb-1 font-medium">
                    <span className="text-md font-medium text-gray-700">Service</span>
                    <span className="text-md font-medium text-gray-800">
                        &pound;{getAmountConvertToFloatWithFixed(serviceCharge, 2)}
                    </span>
                </li>

                <li className="flex justify-between items-center pb-1 font-medium">
                    <span className="text-md font-medium text-gray-700">Discount</span>
                    <span className="text-md font-medium">
                        (&pound;{getAmountConvertToFloatWithFixed(discountAmount, 2)})
                    </span>
                </li>

                <li className="flex justify-between items-center pb-1 font-medium">
                    <span className="text-md font-medium text-gray-700">Delivery</span>
                    <span className="text-md font-medium text-gray-800">
                        &pound;{getAmountConvertToFloatWithFixed(deliveryCharge, 2)}
                    </span>
                </li>
            </ul>

            <div className="mt-2 flex justify-between items-center text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>
                    &pound;
                    {getAmountConvertToFloatWithFixed(
                        parseFloat(subtotal) +
                        parseFloat(deliveryCharge) +
                        parseFloat(serviceCharge) -
                        parseFloat(discountAmount),
                        2
                    )}
                </span>
            </div>
        </>
    )    
}
