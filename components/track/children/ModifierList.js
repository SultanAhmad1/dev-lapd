"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";

export default function ModifierList({modifier, product, price}) 
{
    return(
        <li className="bheyezebalf0checkout-item-li ez">
            <span className="bodgdfcvcheckout-li-modi-title">{modifier}:</span>
            <div className="spacer _4"></div>
            <span className="albodgbqcvcheckout-li-modi-detail">
                {product} (&pound;{getAmountConvertToFloatWithFixed(price,2)})
            </span>
        </li>
    )
}
