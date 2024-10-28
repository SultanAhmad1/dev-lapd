"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";
import Modifiers from "./Modifiers";

export default function MyOrders({orderLine}) 
{
    return(
        <div className="esetcheckout">
            <div className="ald5egbhddeteud1checkout-edit-item d1">
                <div className="bodgdfcheckout-qty">
                    {parseInt(orderLine?.quantity)}
                </div>
                <div className="alamcjewcheckout">
                    <span className="bobpdfcvcheckout-item-header">{orderLine?.product_name}</span>
                    <ul className="excheckout">
                        
                        {
                            orderLine?.order_line_modifier_group_products?.map((modifier, index) =>
                            {
                                return(
                                    (modifier?.default_option !== 1) &&
                                    <Modifiers key={index?.modifier?.id} {...{modifier}} />
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="f1alamcheckout-item-qty">
                    <span className="gye2gzcheckout-item-qty-span">&pound;{getAmountConvertToFloatWithFixed(orderLine?.total,2)}</span>
                </div>
            </div>
        </div>
    )
}
