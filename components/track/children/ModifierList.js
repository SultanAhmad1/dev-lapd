"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";

export default function ModifierList({modifier,isCounter, qty, product, price}) 
{
    return(
        <li>
            {
                isCounter ?
                    <>{parseInt(qty)} x {modifier}:</>
                :
                    <>{modifier}:</>
            }
            {product} (&pound;{getAmountConvertToFloatWithFixed(qty * price,2)})
        </li>
    )
}
