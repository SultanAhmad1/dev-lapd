"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";
import ModifierList from "./ModifierList";

export default function Modifiers({modifier})
{
    return(
        <div>
            <ModifierList modifier={modifier?.modifier_group_name} product={modifier?.product_name} price={modifier?.price}/>
            {
                parseInt(modifier?.order_line_secondary_product_modifiers?.length) > parseInt(0) &&

                modifier?.order_line_secondary_product_modifiers?.map((secondaryProductModifier,index) =>
                {
                    return(
                        <ModifierList key={index} modifier={secondaryProductModifier?.modifier_name} product={secondaryProductModifier?.product_name} price={secondaryProductModifier?.price}/>
                    )
                })
            }
        </div>
    )
}
