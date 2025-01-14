"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";

export default function ModifierList({modifier,isCounter, qty, product, price}) 
{
    return(
        <>  
            <li className="bheyezebalf0checkout-item-li ez">
                {
                    isCounter ?
                        <span className="bodgdfcvcheckout-li-modi-title">{parseInt(qty)} x {modifier}:</span>
                    :
                        <span className="bodgdfcvcheckout-li-modi-title">{modifier}:</span>
                }
                <div className="spacer _4"></div>
                <span className="albodgbqcvcheckout-li-modi-detail">
                    {product} (&pound;{getAmountConvertToFloatWithFixed(qty * price,2)})
                </span>
            </li>
        </>
    )
}
