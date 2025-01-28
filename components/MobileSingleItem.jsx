"use client";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import {
  getAmountConvertToFloatWithFixed,
} from "@/global/Store";
import moment from "moment";
import React, { Fragment} from "react";
import ChooseOnlyOne from "./mobileModifiersItems/ChooseOnlyOne";
import ChooseOneItemOneTime from "./mobileModifiersItems/ChooseOneItemOneTime";
import CounterItem from "./mobileModifiersItems/CounterItem";

export const MobileSingleItem = (props) => {
  const {
    optionNumber,
    itemPrice,
    singleItem,
    handleMScroll,
    quantity,
    handleRadioInput,
    handleCheckInput,
    handleMobileModifierToggle,
    handleDecrement,
    handleIncrement,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    handleMobileAddToCart,
    handleNextClicked,
    websiteModificationData,
    isAnyModifierHasExtras
  } = props;

  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };

  return (
    <div onWheel={handleMScroll}>
      <div style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
      <div className="arc2single-product">
        <div className="albfsingle-product">
          <div className="akb0cccdsingle-product">
            <div className="ctascusingle-product">
              <div className="agaksingle-product">
                <div className="akcyczbfsingle-product">
                  <div className="d5single-product">
                    <a  className="d6aqbfc4single-product-cross-btn" href="/">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <title>X</title>
                        <path d="m21.1 5.1-2.2-2.2-6.9 7-6.9-7-2.2 2.2 7 6.9-7 6.9 2.2 2.2 6.9-7 6.9 7 2.2-2.2-7-6.9 7-6.9Z" fill="currentColor"></path>
                      </svg>
                    </a>
                  </div>
                  {/* 
                  <div className="bre3dpsingle-product">{singleItem?.title}</div>
                  <div className="e9single-product"></div> */}
                </div>
              </div>
            </div>
            
            <div>
              <div className="akbkbxc3single-product">
                <div className="bkeaebalsingle-product">
                  <div className="ecsingle-product">
                    <div className="akedeebkefsingle-product">
                      {
                        (singleItem?.image_url && singleItem?.image_url !== null) &&

                        isValidHttpsUrl(singleItem?.image_url) ?
                          <img loading="lazy" width={100} height={100} role="presentation" src={singleItem?.image_url} alt={singleItem?.title} className="egbkaeeheisingle-productimg" />
                        :
                          <img loading="lazy" width={100} height={100} role="presentation" src={`${IMAGE_URL_Without_Storage}${singleItem?.image_url}`} alt={singleItem?.title} className="egbkaeeheisingle-productimg"/>
                      }
                      <div className="agasatbdbcajsingle-product"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="eksingle-product">
              <div className="bnelbpemeneoalbfsingle-product">
                {singleItem?.title}
              </div>
              <span data-testid="rich-text" className="fnfofpbnfqbpfrb1single-product-price">
                &pound;{parseFloat(singleItem?.price).toFixed(2)}
              </span>
              <div className="epeqsingle-product-div"></div>
              <div className="er">
                <div className="bresbtdqetbxsingle-product">
                  {singleItem?.description}
                </div>
              </div>
            </div>

            <ul className="ftsingle-productul">
              {
                optionNumber === 1 &&
                singleItem?.modifier_group?.map((modifier, index) => 
                {
                  if(modifier?.isExtras === false) 
                  {
                    return(
                      parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0) &&
                        modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1 ? 
                        <ChooseOnlyOne 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleRadioInput,
                              websiteModificationData,
                              handleMobileModifierToggle,
                            }
                          }
                        />
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) ?
                        <ChooseOneItemOneTime 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleCheckInput,
                              websiteModificationData,
                              handleMobileModifierToggle,
                            }
                          }
                        />
                      : 
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) &&
                          <CounterItem 
                            key={index}
                            {
                              ...{
                                index,
                                modifier,
                                handleDecrement,
                                handleIncrement,
                                handleMobileModifierToggle,
                              }
                            }
                          />
                    )
                  }
                })
              }

              {/* Display IsExtras with True */}
              {
                optionNumber === 2 &&
                singleItem?.modifier_group?.map((modifier, index) => 
                {
                  if(modifier?.isExtras)
                  {
                    return(
                      parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0) &&
                        modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1 ? 
                        <ChooseOnlyOne 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleRadioInput,
                              websiteModificationData,
                              handleMobileModifierToggle,
                            }
                          }
                        />
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) ?
                        <ChooseOneItemOneTime 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleCheckInput,
                              websiteModificationData,
                              handleMobileModifierToggle,
                            }
                          }
                        />
                      
                      : 
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) &&
                        <CounterItem 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleDecrement,
                              handleIncrement,
                              handleMobileModifierToggle,
                            }
                          }
                        />
                    )
                  }
                })
              }
            </ul>

            <div className="h2single-product"></div>
            <div>
              
              <div className="epezsingle-product"></div>
              <hr className="efeqhjg2single-producthr"></hr>
            </div>

            <div className="iosignle-product"></div>
            <div className="i7single-product"></div>

            {/* <div className="iaibicblidieifigcsctbcsingle-product">
              <p style={{fontWeight: "bold", fontSize: "24px"}}>
                &pound;{getAmountConvertToFloatWithFixed(quantity * itemPrice, 2)}
              </p>

              <div className="albfglh3single-product">

                <div className="agbdh8h4albfsingle-product">
                  <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" disabled={quantity > 1 ? false : true} onClick={handleMobileQuantityDecrement} >
                    <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg" >
                      <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                    </svg>
                  </button>
                  
                  <div className="aghhhibre3dpbualc4bfbzbmsingle-product">{parseInt(quantity)}</div>

                  <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" onClick={handleMobileQuantityIncrement}>
                    <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                      <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                    </svg>
                  </button>
                </div>
                  
                <button type="button" style={{marginLeft: "20px"}} className="add-to-cart-btn-item" onClick={handleMobileAddToCart}>
                  ADD TO CART
                </button>
              </div>
          
            </div> */}
            
            <div className="add-to-cart-design">
              <p style={{fontWeight: "bold", padding: "5px"}}>
                &pound;{getAmountConvertToFloatWithFixed(quantity * itemPrice, 2)}
              </p>


              <div className="agbdh8h4albfsingle-product">
                <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" disabled={quantity > 1 ? false : true} onClick={handleMobileQuantityDecrement} >
                  <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg" >
                    <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                  </svg>
                </button>
                
                <div className="aghhhibre3dpbualc4bfbzbmsingle-product">{parseInt(quantity)}</div>

                <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" onClick={handleMobileQuantityIncrement}>
                  <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                    <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                  </svg>
                </button>
              </div>
              {
                
                isAnyModifierHasExtras ? 
                  <button type="button" style={{marginLeft: "20px"}} className="add-to-cart-btn-item" onClick={() => handleMobileAddToCart("next")}>
                    Next
                  </button>
                :
                  <button type="button" style={{marginLeft: "20px"}} className="add-to-cart-btn-item" onClick={() => handleMobileAddToCart("addToCart")}>
                    ADD TO CART
                  </button>
              }
          
            </div>
            
          </div>
        </div>
      </div>
      <div style={{width: "1px",height: "0px",padding: "0px",overflow: "hidden",position: "fixed",top: "1px",left: "1px",}}></div>
    </div>
  );
}
