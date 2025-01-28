import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import React, { Fragment } from "react";

export default function CounterItem({
    index,
    modifier,
    handleDecrement,
    handleIncrement,
    handleMobileModifierToggle,
}) 
{
    return(
        <li className={`msection${index}`}>
            <div className="fusingle-productlidiv">
            <hr className="modifier-hr"></hr>

            <div className="modifier-header" onClick={() => handleMobileModifierToggle(modifier?.id)}>
                <div className="modifier-div">
                
                
                <div className="alamsingle-product">

                    <div className="bnfrbpfsingle-product">
                    <span className="modifier-dropdown-items">
                        {modifier?.title}
                    </span>

                    <div className="fzsingle-product">
                        <div className={`g0afg1single-product ${modifier?.valid_class}`}>
                        {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                        </div>
                        <div className="choose-items">Choose { parseInt(modifier?.min_permitted) === parseInt(0) && "up to"} {modifier?.max_permitted}</div>
                    </div>
                    
                    </div>
                    
                    <div className="bresbtdqfysingle-product">
                    {
                        !modifier?.is_toggle_active &&
                        modifier?.modifier_secondary_items?.map((displaySelectedItems,displaySelectedItemsIndex) => 
                        {
                        return (
                            parseInt(displaySelectedItems?.counter) > parseInt(0) && (
                            <div key={`${index}.${displaySelectedItemsIndex}`}>
                                {parseInt(displaySelectedItems?.title?.length) > parseInt(20) ? displaySelectedItems?.title?.substring(0,20) + "...": displaySelectedItems?.title}
                            </div>
                            )
                        );
                        }
                    )}
                    </div>
                    
                </div>

                <div className="single-product-svg-div accordion">
                    <div className="single-product-svg-div-one">

                    {
                        modifier?.is_toggle_active ? 
                        <svg className="bottom-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" >
                        <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                        </svg>
                        : 
                        <svg className="right-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ cursor: "pointer" }}>
                        <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                        </svg>
                    }

                    </div>
                </div>
                </div>
            </div>

            {/* Listed Data */}
            {
                <div className={`g5single-product ${modifier?.is_toggle_active ? "show" : "fade"}`}>
                {
                    modifier?.modifier_secondary_items?.map((mobileSecondItems, mobileSecondItemsIndex) => 
                    {
                    return (
                        <Fragment key={`${index}.${mobileSecondItemsIndex}`}>
                            <div className="alg5bfsingle-product">
                                <div className="alaqbfsingle-product">
                                {
                                    parseInt(mobileSecondItems?.counter) > parseInt(0) &&
                                    <>
                                    <button className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn" disabled={mobileSecondItems?.is_item_select} onClick={() => handleDecrement(modifier?.id,mobileSecondItems?.id)}>

                                        <div className="ezfj">
                                        <div className="fjezh1">
                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                            </svg>
                                        </div>
                                        </div>
                                        
                                    </button>

                                    <div className="bresbtdqiqsingle-product">{parseInt(mobileSecondItems?.counter)}</div>
                                    </>
                                }

                                
                                <button type="button" className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn" disabled={parseInt(modifier?.max_permitted) === parseInt(modifier?.modifier_counter) ? true : false} onClick={() => handleIncrement(modifier?.id, mobileSecondItems?.id)}>
                                    <div className="ez fj">

                                    <div className="fj ez h1">
                                        <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                        <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                        </svg>
                                    </div>

                                    </div>
                                </button>
                                </div>

                                <div className="spacer _16"></div>
                                <div className="e4ald0ghsingle-productincdec">
                                <div className="ale4amc4gigjgksingle-productincdec">
                                    <div className="alaqsingle-product">
                                    <div className="alamglgmsingle-productincdec">
                                        <div className="bresdpg3gnsingle-productincdecheading">{mobileSecondItems?.title}</div>
                                        <div className="spacer _8"></div>
                                        {
                                        getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                        <div className="bresbtdqb1bzsingle-productincdecprice">
                                            &pound;{getAmountConvertToFloatWithFixed(mobileSecondItems?.price,2)}
                                        </div>
                                        }
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            {/* <hr className="efbvgogpsingle-producthr"></hr> */}
                        </Fragment>
                    );
                    }
                )}
                </div>
            }
            </div>
        </li>
    )
}
