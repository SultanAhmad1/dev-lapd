"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";
import Modifiers from "./Modifiers";

export default function MyOrders({orderLine}) 
{
    return(
        <div className="es-et-checkout">
            <div className="al-d5-eg-bh-dd-et-eu-d1-checkout-edit-item d1">
                <div className="bodgdfcheckout-qty">
                    {parseInt(orderLine?.quantity)}
                </div>
                <div className="al-am-cj-ew-checkout">
                    <span className="bo-bp-df-cv-checkout-item-header">{orderLine?.product_name}</span>
                    <ul className="excheckout">
                        
                        {
                            orderLine?.order_line_modifier_group_products?.map((modifier, index) =>
                            {
                                return(
                                    (modifier?.default_option !== 1) &&
                                    <Modifiers key={`${index}.${modifier?.id}`} {...{modifier}} />
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="f1-al-am-checkout-item-qty">
                    <span className="gy-e2-gz-checkout-item-qty-span">&pound;{getAmountConvertToFloatWithFixed(orderLine?.total,2)}</span>
                </div>
            </div>

            <hr style={{marginBottom: "10px", marginTop: "10px"}}/>
        </div>
    )
}
