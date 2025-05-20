import { BLACK_COLOR, WHITE_COLOR } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React from "react";

export default function ChooseOneItemOneTime({
    index,
    modifier,
    handleCheckInput,
    websiteModificationData,
})
{
    return(
        <li className={`section${index}`}>
            <div className="product-list-div">
            <div className="product-modifier-groups">
                <div className="product-modifier-name">
                {modifier?.title}
                </div>
            </div>

            <div className="product-required">
                
                <div className={`product-required-div ${modifier?.valid_class}`}>
                {parseInt(modifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                </div>
                
                <div className="product-modifier-option">
                <span>
                    Choose { parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                </span>
                </div>

            </div>
            </div>
            {/* List of all modifier group products */}
            <div className="hg">
            {
                modifier?.modifier_secondary_items?.map((secondItems, indexSecondItem) => {

                let isItemSuspend = false;
                if(secondItems?.suspension_info !== null)
                {
                    if(moment().format('YYYY-MM-DD') <= moment.unix(secondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                    {
                    isItemSuspend = true
                    }
                }

                return (
                    isItemSuspend === false &&
                    <div key={`${index}.${indexSecondItem}`}>
                    {
                        secondItems.activeClass !== "mchw" ? 
                        <div 
                            className="product-modifier-item-detail"  
                            style={{
                                marginTop: "8px",
                                background: secondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR), 
                                border: secondItems?.item_select_to_sale && `1px solid ${(websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR)}`
                            }} 
                            onClick={() => handleCheckInput(modifier?.id,secondItems?.id,parseInt(secondItems?.secondary_item_modifiers.length))}
                        >
                            <label className={`modifier-product-item-name-checkbox`} style={{ '--before-color': `${secondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR)}`,}}>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}`} strokeWidth="2.5" strokeLinejoin="round"/>
                            </svg>
                            <div className="spacer _16"></div>
                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                <div className="modifier-product-item-name-one-nested-div-one-nested-div" style={{color: secondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)}}>
                                    {secondItems?.title}
                                </div>
                                <div className="spacer _8"></div>
                                {
                                    // getAmountConvertToFloatWithFixed(secondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) &&
                                    <div 
                                        className="modifier-group-price" 
                                        style={{
                                            color: secondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR)
                                        }}
                                    >
                                        &pound;{getAmountConvertToFloatWithFixed(secondItems?.price,2)}
                                    </div>
                                }
                            </div>
                            </label>
                        </div>
                    :
                        <div style={{marginTop: "8px"}} className="product-modifier-item-detail">
                            <label className={`modifier-product-item-name-checkbox`} style={{ '--before-color': `${secondItems?.item_select_to_sale && (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR)}`,}}>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${secondItems?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`} strokeWidth="2.5" strokeLinejoin="round"/>
                                </svg>
                                <div className="spacer _16"></div>
                                <div className="modifier-product-item-name-one-nested-div-one-nested">
                                    <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                        {secondItems?.title}
                                    </div>
                                    <div className="spacer _8"></div>
                                    {
                                        // getAmountConvertToFloatWithFixed(secondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                        <div className="modifier-group-price">&pound;{parseFloat(secondItems?.price).toFixed(2)}</div>
                                    }
                                </div>
                            </label>
                        </div>
                    }
                    </div>
                );
                })
            }
            </div>
        </li>
    )
}
