import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React, { Fragment } from "react";

export default function ChooseOnlyOne({
    index,
    secondItemModifier,
    selectedModifierId,
    handleModalRadioInput,
    selectedModifierItemId,
    secondItemModifierIndex,
    handleModalModifierToggle,
    websiteModificationData,
}) 
{
    return(
        <li className="mb-10">
            <div className="k5modifier-modal-item">
                <div className="alaqg5fxmodifier-modal-div" onClick={() => handleModalModifierToggle(selectedModifierId, selectedModifierItemId, secondItemModifier?.id)}>
                    <div className="alammodifier-modal">
                        <div className="product-modifier-name">
                            
                            <span className="modifier-dropdown-title">
                                {secondItemModifier?.title}
                            </span>

                               
                            <div className="irmodifier-modal">
                                <div className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}>
                                    {parseInt(secondItemModifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                                </div>
                                <div className="choose-items">
                                    Choose {parseInt(secondItemModifier?.min_permitted) === parseInt(0) && "up to"} {secondItemModifier?.max_permitted}
                                </div>
                            </div>
                        </div>
                        <div className="chcicwd3czmodifier-choose">
                            
                            {
                                !secondItemModifier?.is_second_item_modifier_clicked &&
                                secondItemModifier?.secondary_items_modifier_items?.map((displaySelectedItem, displaySelectedItemIndex) => 
                                {
                                    return (
                                    displaySelectedItem?.is_item_select && 
                                        <Fragment key={`${index}.${displaySelectedItemIndex}`}>
                                            {parseInt(displaySelectedItem?.title?.length) > parseInt(20) ? displaySelectedItem?.title?.substring(0,20) + "..." : displaySelectedItem?.title}
                                            <br />
                                        </Fragment>
                                    );
                                })
                            }
                         
                        </div>
                    
                    </div>

                    <div className="single-product-svg-div accordion">
                        <div className="single-product-svg-div-one">
                            {
                                secondItemModifier?.is_second_item_modifier_clicked ? 
                                <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                </svg>
                                : 
                                <svg className="right-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer",}}>
                                    <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                                </svg>
                            }
                        </div>
                    </div>
                </div>

                {
                    <div className={`iwmodifier-data ${secondItemModifier?.is_second_item_modifier_clicked ? "show" : "fade"}`}>
                    {
                        secondItemModifier?.secondary_items_modifier_items?.map((item, itemIndex) => 
                        {
                            let isItemSuspend = false;
                            if(item?.suspension_info !== null)
                            {
                                if(moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                                {
                                isItemSuspend = true
                                }
                            }
                            return (
                                isItemSuspend === false &&
                                <div 
                                        className="alakixc5modifier-data" 
                                        style={{
                                                background: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
                                                border: item?.item_select_to_sale && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`
                                            }} 
                                        key={`${index}.${itemIndex}`} 
                                        onClick={() => handleModalRadioInput(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}
                                    >

                                    <label className={`chd2cjmodifier-modal-label`} style={{ '--before-color': `${item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`,}}>
                                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>

                                        <div className="spacer _16"></div>

                                        <div className="alamdxdvmodifier-modal">

                                            <div className="chic-cj-ckjdmodifier-modal" style={{color: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                {item?.title}
                                            </div>

                                            <div className="spacer _8"></div>
                                            {
                                                getAmountConvertToFloatWithFixed(item?.price_info,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="modifier-group-price" style={{color: item?.item_select_to_sale && websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                                                    &pound;{parseFloat(item?.price_info).toFixed(2)}
                                                </div>
                                            }

                                        </div>
                                    </label>

                                </div>
                            );
                        }
                    )}
                    </div>
                }
            </div>
        </li>
    )
}
