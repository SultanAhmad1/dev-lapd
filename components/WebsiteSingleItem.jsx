"use client";

import moment from "moment";
import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import Image from "next/image";
import { Fragment } from "react";
import ChooseOnlyOne from "./websiteModifiersItems/ChooseOnlyOne";
import ChooseOneItemOneTime from "./websiteModifiersItems/ChooseOneItemOneTime";
import CounterItem from "./websiteModifiersItems/CounterItem";

export const WebsiteSingleItem = (props) => {
  const {
    optionNumber,
    singleItem,
    quantity,
    itemPrice,
    handleDisplayItemStates,
    handleRadioInput,
    handleCheckInput,
    handleDecrement,
    handleIncrement,
    handleQuantity,
    handleAddOrNextClickedToCart,
    handleNextClicked,
    websiteModificationData,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    isAnyModifierHasExtras,
  } = props;
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
  
  return (
    <div className="e5 e6">
      <div className="single-product-level-one-div">
        <div className="level-one-div-nested-one">
          <a className="back-btn-product" href="/">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="back-svg">
              <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3z"></path>
            </svg>
            <div className="spacer _8"></div>
            Back to list
          </a>

          <button className="cross-btn" onClick={() => handleDisplayItemStates("isItemClicked",false)}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="back-svg">
              <line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/>
              <line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/>
            </svg>
            <span>{singleItem?.title}</span>
          </button>

          {
            singleItem?.image_url &&
            <div className="product-img">
              <div className="bz">
                <div className="product-img-div-one-div">
                  <div className="product-img-div-one-div-nested">
                    <div className="product-img-div-one-div-nested-div">
                      <div className="product-img-zoom">
                        {
                          isValidHttpsUrl(singleItem?.image_url) ?
                          <Image
                            alt={singleItem?.title}
                            role="presentation"
                            src={singleItem?.image_url}
                            className="product-img-display"
                            loading="lazy"
                            width={100}
                            height={100}
                          />

                          :
                          <Image
                            alt={singleItem?.title}
                            role="presentation"
                            src={IMAGE_URL_Without_Storage+"/"+singleItem?.image_url}
                            className="product-img-display"
                            loading="lazy"
                            width={100}
                            height={100}
                          />

                        }
                        <div className="img-hr"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <div className="level-one-div-nested-two">
          <div className="product-title">
            <h2 className="product-h2"></h2>
            <h1 className="product-h1">{singleItem?.title}</h1>
            <span className="product-price-span">&pound;{parseFloat(singleItem?.price).toFixed(2)}</span>
            <div className="product_h8"></div>

            <div className="product-description">
              <div className="product-description-div">{singleItem?.description}</div>
            </div>

            <div className="product_h8"></div>
          </div>

          <div className="product-height"></div>

          <ul className="product-ul">
            {
              optionNumber === 1 && 
              singleItem?.modifier_group?.map((modifier, index) => {
                if(modifier?.isExtras === false)
                {
                  return (
                    // (parseInt(modifier?.modifier_secondary_items?.length) > 0) &&
                    (
                      modifier?.select_single_option === 1 && modifier?.max_permitted === 1 
                      ? 
                       <ChooseOnlyOne 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleRadioInput,
                              websiteModificationData,
                            }
                          }
                       />
                      : 
                        (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) 
                      ?
                        <ChooseOneItemOneTime 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleCheckInput,
                              websiteModificationData,
                            }
                          }
                        />
                      : 
                        (modifier?.select_single_option > 1 && modifier?.max_permitted >= 1) 
                      &&
                        <CounterItem 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleDecrement,
                              handleIncrement,
                            }
                          }
                        />
                    ) 
                  );
                }
              })
            }

            {/* optionNumber is greater than 1 and less than 2, isExtras must be true */}
            {
              optionNumber === 2 && 
              singleItem?.modifier_group?.map((modifier, index) => {
                if(modifier?.isExtras)
                {
                  return (
                    (parseInt(modifier?.modifier_secondary_items?.length) > 0) &&
                    (
                        modifier?.select_single_option === 1 && modifier?.min_permitted > 0 && modifier?.max_permitted === 1 
                      ? 
                        <ChooseOnlyOne 
                          key={index}
                          {
                            ...{
                              index,
                              modifier,
                              handleRadioInput,
                              websiteModificationData,
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
                            }
                          }
                        />
                    ) 
                  );
                }
              })
            }
          </ul>

          <div className="product-top-padding-2"></div>

          <div className="of">
            <div className="add-to-cart-btn-no-selection">
            
              <p>&pound;{parseFloat(quantity * itemPrice).toFixed(2)}</p>
              
                <div className="albfglh3single-product">
                  <div className="agbdh8h4albfsingle-product" >
                    
                    <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" disabled={quantity > 1 ? false : true} onClick={handleMobileQuantityDecrement}>
                      <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg" >
                        <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                      </svg>
                    </button>

                    <div className="aghhhibre3dpbualc4bfbzbmsingle-product">
                      {parseInt(quantity)}
                    </div>

                    <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-count-btn" onClick={handleMobileQuantityIncrement}>
                      <svg aria-hidden="true" color="#fff" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                        <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                      </svg>
                    </button>
                  </div>

                  {
                    isAnyModifierHasExtras ? 
                      <button type="button" style={{marginLeft: "10px"}} className="add-to-cart-btn-item" onClick={() => handleAddOrNextClickedToCart("next")}>
                        NEXT
                      </button>
                    :
                      <Fragment>
                        {
                          optionNumber === 2 &&
                          <button 
                            type="button" 
                            class="add-to-cart-back-btn-click" 
                            style={{marginLeft: "10px",minWidth: "100px"}} 
                            onClick={() => handleAddOrNextClickedToCart("back")}
                          >
                            Back
                          </button>
                        }
                        <button type="button" style={{marginLeft: "10px"}} className="add-to-cart-btn-item" onClick={() => handleAddOrNextClickedToCart("addToCart")}>
                          ADD TO CART
                        </button>

                      </Fragment>
                  }
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
