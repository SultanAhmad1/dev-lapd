import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import moment from "moment";
import React, { Fragment } from "react";

export default function CounterItem({
    index,
    modifier,
    handleDecrement,
    handleIncrement,
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
                    Choose {parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}
                </span>
                </div>

            </div>
            </div>

            {/* List of all modifier group products */}
            <div className="hg">
            {
                modifier?.modifier_secondary_items?.map((secondItems,indexSecondItem) =>
                {
                    let isItemSuspend = false;
                    if(secondItems?.suspension_info !== null)
                    {
                        if(moment().format('YYYY-MM-DD') <= moment.unix(secondItems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                        {
                            isItemSuspend = true
                        }
                    }

                    return(
                        isItemSuspend === false &&
                        <Fragment key={indexSecondItem}>
                            <div className="product-modifier-item-detail" style={{marginTop: "8px"}}>

                                <div className="modifier-product-item-name-inc-dec">
                                
                                <div className="modifier-inc-dec">
                                    {
                                    parseInt(secondItems?.counter) > parseInt(0) &&
                                    <>
                                        <button className="modifier-btn" disabled={secondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,secondItems?.id)}>

                                        <div className="modifier-btn-div">
                                            <div className="modifier-btn-svg">
                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                            </svg>
                                            </div>
                                        </div>

                                        </button>

                                        <div className="incremented-values">{parseInt(secondItems?.counter)}</div>
                                    </>
                                    }
                            
                                    
                                    <button className="modifier-btn" disabled={(parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter)) ? true : false} onClick={() => handleIncrement(modifier?.id,secondItems?.id)}>

                                    <div className="modifier-btn-div">
                                        <div className="modifier-btn-svg">
                                        <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
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
                                        <div className="modifier-product-item-name-one-nested-div-one-nested-div">Add: {secondItems?.title}</div>
                                        <div className="spacer _8"></div>
                                        <div className="modifier-group-price">+&pound;{getAmountConvertToFloatWithFixed(secondItems?.price,2)}</div>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                </div>

                            </div>
                        </Fragment>
                    )
                })
            }
            </div>
        </li>
    )
}
