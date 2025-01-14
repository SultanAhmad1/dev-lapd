"use client";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React from "react";
import ModifierList from "./ModifierList";

export default function Modifiers({modifier})
{
    return(
        <>
            {/* Select option 1 */}
            {
                (modifier?.modifier_group?.select_single_option === 1 && modifier?.modifier_group?.maximum_number_of_options === 1) ?
                    <ModifierList modifier={modifier?.modifier_group_name} isCounter={false} qty={modifier?.quantity} product={modifier?.product_name} price={modifier?.price}/>
                : (modifier?.modifier_group?.select_single_option === 1 && modifier?.modifier_group?.maximum_number_of_options > 1) ?
                    <ModifierList modifier={modifier?.modifier_group_name} isCounter={false} qty={modifier?.quantity} product={modifier?.product_name} price={modifier?.price}/>
                : (modifier?.modifier_group?.select_single_option > 1 && modifier?.modifier_group?.maximum_number_of_options >= 1) &&
                    <ModifierList modifier={modifier?.modifier_group_name} isCounter={true} qty={modifier?.quantity} product={modifier?.product_name} price={modifier?.price}/>
            }
        
            {
                parseInt(modifier?.order_line_secondary_product_modifiers?.length) > parseInt(0) &&

                modifier?.order_line_secondary_product_modifiers?.map((secondaryProductModifier,index) =>
                {
                    return(
                        (secondaryProductModifier?.modifier_group?.select_single_option === 1 && secondaryProductModifier?.modifier_group?.maximum_number_of_options === 1) ?
                        <ModifierList key={index} modifier={secondaryProductModifier?.modifier_name} isCounter={false} qty={secondaryProductModifier?.quantity} product={secondaryProductModifier?.product_name} price={secondaryProductModifier?.price}/>
                        :(secondaryProductModifier?.modifier_group?.select_single_option === 1 && secondaryProductModifier?.modifier_group?.maximum_number_of_options > 1) ?
                        <ModifierList key={index} modifier={secondaryProductModifier?.modifier_name} isCounter={false} qty={secondaryProductModifier?.quantity} product={secondaryProductModifier?.product_name} price={secondaryProductModifier?.price}/>
                        : (secondaryProductModifier?.modifier_group?.select_single_option > 1 && secondaryProductModifier?.modifier_group?.maximum_number_of_options >= 1) &&
                        <ModifierList key={index} modifier={secondaryProductModifier?.modifier_name} isCounter={true} qty={secondaryProductModifier?.quantity} product={secondaryProductModifier?.product_name} price={secondaryProductModifier?.price}/>
                    )
                })
            }
        </>
    )
}
