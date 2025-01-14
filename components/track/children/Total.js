"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";

export default function Total({subtotal, deliveryCharge,serviceCharge,discountAmount})
{
    return(
        <>
            <ul>
                <li className="bobpcheckout-sutotals">
                    <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">Subtotal</div>
                    </div>

                    <div className="bobpbqbrb1checkout">
                        <span className="">&pound;{getAmountConvertToFloatWithFixed(subtotal,2)}</span>
                    </div>
                </li>

                <li className="dxgvcheck"></li>

                <li className="dxgvcheck"></li>

                <li className="bobpcheckout-sutotals">
                    <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">Service</div>
                    </div>

                    <div className="bobpbqbrb1checkout">
                        <span className="">&pound;{getAmountConvertToFloatWithFixed(serviceCharge,2)}</span>
                    </div>
                </li>

                <li className="bobpcheckout-sutotals">
                    <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">Discount</div>
                    </div>

                    <div className="bobpbqbrb1checkout">
                        <span className="">(&pound;{getAmountConvertToFloatWithFixed(discountAmount, 2)})</span>
                    </div>
                </li>

                <li className="dxgvcheck"></li>

                <li className="bobpcheckout-sutotals">
                    <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">Delivery</div>
                    </div>

                    <div className="bobpbqbrb1checkout">
                        <span className="">&pound;{getAmountConvertToFloatWithFixed(deliveryCharge,2)}</span>
                    </div>
                </li>
            </ul>

            <div className="bkgfbmggal-checkout">
                <div className="albcaqcheckout-total">Total</div>&pound;{getAmountConvertToFloatWithFixed((parseFloat(subtotal) + parseFloat(deliveryCharge) + parseFloat(serviceCharge)) - parseFloat(discountAmount),2)}
            </div>
        </>
    )    
}
