import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React, { Fragment } from "react";

export default function CounterItem({
    index,
    secondItemModifier,
    selectedModifierId, 
    selectedModifierItemId,
    handleModalModifierToggle,
    handleModalDecrement,
    handleModalIncrement
}) 
{
    return(
        <li className="mb-10">
                                          
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
                                Choose {parseInt(secondItemModifier?.min_permitted) === parseInt(0) && "up to"}{secondItemModifier?.max_permitted}
                            </div>
                        </div>

                    </div>
                    <div className="chcicwd3czmodifier-choose">
                        {
                            !secondItemModifier?.is_second_item_modifier_clicked &&
                            secondItemModifier?.secondary_items_modifier_items?.map((displaySelectedItem, displaySelectedItemIndex) => 
                            {
                            return (
                                parseInt(displaySelectedItem?.counter) > parseInt(0) && 
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
                <div className={`iwmodifier-data ${secondItemModifier?.is_second_item_modifier_clicked? "show" : "fade"}`}>
                    {
                        secondItemModifier?.secondary_items_modifier_items?.map((item, itemIndex) => 
                        {
                            return (
                                <div key={`${index}.${itemIndex}`} style={{marginBottom: "8px"}}>
                                    <div className="product-modifier-item-detail">
                                        <div className="modifier-product-item-name-inc-dec">
                                            <div className="modifier-inc-dec">
                                            {
                                                parseInt(item?.counter) > parseInt(0) &&

                                                <>
                                                <button className="modifier-btn" disabled={item?.is_item_select} onClick={() =>handleModalDecrement(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}>
                                                    <div className="modifier-btn-div">
                                                    <div className="modifier-btn-svg">
                                                        <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                        <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                                        </svg>
                                                    </div>
                                                    </div>
                                                </button>

                                                <div className="incremented-values">
                                                    {parseInt(item?.counter)}
                                                </div>  
                                                
                                                </>
                                            }

                                            <button className="modifier-btn" disabled={ parseInt(secondItemModifier?.max_permitted) === parseInt(secondItemModifier?.modifier_counter)? true: false} onClick={() => handleModalIncrement(selectedModifierId,selectedModifierItemId,secondItemModifier?.id,item?.id)}>
                                                <div className="modifier-btn-div">
                                                <div className="modifier-btn-svg">
                                                    <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"focusable="false">
                                                        <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                                    </svg>
                                                </div>
                                                </div>
                                            </button>
                                            </div>

                                            <div className="spacer _16"></div>
                                            <div className="modifier-product-item-name-one-div">
                                            <div className="modifier-product-item-name-one-nested-div">
                                                <div className="modifier-product-item-name-one-nested-div-one">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                    <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                        {item?.title}
                                                    </div>
                                                    <div className="spacer _8"></div>
                                                    {
                                                        // getAmountConvertToFloatWithFixed(item?.price_info,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                        <div className="modifier-group-price">
                                                            &pound;{parseFloat(item?.price_info).toFixed(2)}
                                                        </div>
                                                    }
                                                </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        )
                    }
                </div>
            }
        </li>
    )
}
