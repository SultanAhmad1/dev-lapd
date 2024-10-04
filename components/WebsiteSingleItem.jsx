import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import {
  getAmountConvertToFloatWithFixed,
} from "@/global/Store";
import moment from "moment";
import Link from "next/link";
import React, { memo } from "react";

export const WebsiteSingleItem = (props) => {
  const {
    singleitem,
    quantity,
    itemprice,
    setIsitemclicked,
    handleRadioInput,
    handleCheckInput,
    handleDecrement,
    handleIncrement,
    handleQuantity,
    handleAddtoCart,
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

          <button className="cross-btn" onClick={() => setIsitemclicked(false)}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="back-svg">
              <line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/>
              <line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/>
            </svg>
            <span>{singleitem?.title}</span>
          </button>

          {
            (singleitem?.image_url && singleitem?.image_url !== null) && 
            <div className="product-img">
              <div className="bz">
                <div className="product-img-div-one-div">
                  <div className="product-img-div-one-div-nested">
                    <div className="product-img-div-one-div-nested-div">
                      <div className="product-img-zoom">
                        {
                          isValidHttpsUrl(singleitem?.image_url) ?
                          <img
                            alt={singleitem?.title}
                            role="presentation"
                            src={singleitem?.image_url}
                            className="product-img-display"
                          />

                          :
                          <img
                            alt={singleitem?.title}
                            role="presentation"
                            src={IMAGE_URL_Without_Storage+""+singleitem?.image_url}
                            className="product-img-display"
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
            <h1 className="product-h1">{singleitem?.title}</h1>
            <span className="product-price-span">&pound;{parseFloat(singleitem?.price).toFixed(2)}</span>
            <div className="product_h8"></div>

            <div className="product-description">
              <div className="product-description-div">{singleitem?.description}</div>
            </div>

            <div className="product_h8"></div>
          </div>

          <div className="product-height"></div>

          <ul className="product-ul">
            {singleitem?.modifier_group?.map((modifier, index) => {
              return (
                // {/* minimum option = '1' and maximum option = 1 and single item select = 1 */}
                // modifier?.select_single_option === 1 && modifier?.min_permitted === 1 && modifier?.max_permitted === 1 ? 
                modifier?.select_single_option === 1 && modifier?.min_permitted === 1 && modifier?.max_permitted === 1 ? 
                (
                  <li key={index} className={`section${index}`} index={index}>
                    <div>
                      <div>
                        <hr className="product_hr"></hr>
                        <div className="product-list-div">
                          <div className="product-modifier-groups">
                            <div className="product-modifier-name">
                              {modifier?.title}
                            </div>
                            <div className="product-modifier-option">
                              <span>Choose {modifier?.max_permitted}</span>
                            </div>
                          </div>
                          <div className="product-required">
                            <div className={`product-required-div ${modifier?.valid_class}`}>
                              {parseInt(modifier?.min_permitted) > parseInt(0) ? "Required" : "Optional"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hg">
                        {
                          modifier?.modifier_secondary_items?.map((seconditems, indexSecondItem) => {

                            let isItemSuspend = false;
                            if(seconditems?.suspension_info !== null)
                            {
                              if(moment().format('YYYY-MM-DD') <= moment.unix(seconditems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                              {
                                isItemSuspend = true
                              }
                            }

                            return (
                              isItemSuspend === false && 
                              <div key={`${index}.${indexSecondItem}`}>
                                <hr className="product-modifier-items-hr"></hr>
                                <div className="product-modifier-item-detail" onClick={() =>handleRadioInput(modifier?.id,seconditems?.id,seconditems?.title, parseInt(seconditems?.secondary_item_modifiers.length))}>
                                  {
                                    parseInt(seconditems?.secondary_item_modifiers?.length) > parseInt(0) && 
                                    <div className="poquickreview-modal">
                                      <div className="c8c7cuquickreview-modal">
                                        <svg style={{ cursor: "pointer" }} width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                          <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="#AFAFAF" transform="rotate(90, 12, 12)"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  }
                                  <input type="radio" className="radio-input"></input>
                                  {/* <label className="modifier-product-item-name nv"> select radio */}
                                  <label className={`modifier-product-item-name ${seconditems?.activeClass}`}>
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                      <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                          <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                              {seconditems?.title}
                                            </div>
                                            <div className="spacer _8"></div>
                                            {
                                              parseInt(seconditems?.price) > parseInt(0) && 
                                              <div className="modifier-group-price">
                                                {seconditems?.country_price_symbol}
                                                {getAmountConvertToFloatWithFixed(seconditems?.price,2)}
                                              </div>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </li>
                ) : // {/* minimum option = '0' and maximum option = 1 and single item select = 1 */}
                // modifier?.select_single_option === 1 &&
                modifier?.max_permitted >= 1 && (
                  <li key={index} className={`section${index}`} index={index}>
                    <div>
                      <div>
                        <hr className="product_hr"></hr>

                        <div className="product-list-div">
                          <div className="product-modifier-groups">
                            <div className="product-modifier-name">
                              {modifier?.title}
                            </div>
                            <div className="product-modifier-option">
                              <span>
                                Choose up to {modifier?.max_permitted}
                              </span>
                            </div>
                          </div>
                          <div className="product-required">
                            <div className={`product-required-div ${modifier?.valid_class}`}>
                              {parseInt(modifier?.min_permitted) > parseInt(0)? "Required" : "Optional"}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* List of all modifier group products */}
                      <div className="hg">
                        {
                          modifier?.modifier_secondary_items?.map((seconditems, indexSecondItem) => {

                            let isItemSuspend = false;
                            if(seconditems?.suspension_info !== null)
                            {
                              if(moment().format('YYYY-MM-DD') <= moment.unix(seconditems?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                              {
                                isItemSuspend = true
                              }
                            }

                            return (
                              isItemSuspend === false &&
                              <div key={`${index}.${indexSecondItem}`}>
                                <hr className="product-modifier-items-hr"></hr>
                                {seconditems.activeClass !== "mchw" ? (
                                  <div className="product-modifier-item-detail" onClick={() => handleCheckInput(modifier?.id,seconditems?.id,parseInt(seconditems?.secondary_item_modifiers.length))}>
                                    <input type="checkbox" className="checkbox-input" />
                                    <label className={`modifier-product-item-name-checkbox ${seconditems.activeClass}`}>
                                      <div className="spacer _16"></div>
                                      <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                          <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                {seconditems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(seconditems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && 
                                                <div className="modifier-group-price">&pound;{getAmountConvertToFloatWithFixed(seconditems?.price,2)}</div>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="product-modifier-item-detail">
                                    <input type="checkbox" className="checkbox-input" />
                                    <label className={`modifier-product-item-name-checkbox ${seconditems.activeClass}`}>
                                      <div className="spacer _16"></div>
                                      <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                          <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                {seconditems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {
                                                getAmountConvertToFloatWithFixed(seconditems?.price,2) > getAmountConvertToFloatWithFixed(0,2) && (
                                                <div className="modifier-group-price">&pound;{parseFloat(seconditems?.price).toFixed(2)}</div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  </li>
                ) 
                // : (
                  // (modifier?.select_single_option > 1 && (modifier?.min_permitted === 0 && modifier?.max_permitted > 1)) &&
                  // {/* minimum option = '- / 0' and maximum option = 5 and single item select = 2 */}
                //   <li key={index} className={`section${index}`} index={index}>
                //     <div>
                //       <div>
                //         <hr className="product_hr"></hr>
                //         <div className="product-list-div">
                //           <div className="product-modifier-groups">
                //             <div className="product-modifier-name">
                //               {modifier?.title}
                //             </div>
                //             <div className="product-modifier-option">
                //               <span>
                //                 Choose up to {modifier?.max_permitted}
                //               </span>
                //             </div>
                //           </div>
                //           <div className="product-required">
                //             <div
                //               className={`product-required-div ${modifier?.valid_class}`}
                //             >
                //               {parseInt(modifier?.min_permitted) > parseInt(0)
                //                 ? "Required"
                //                 : "Optional"}
                //             </div>
                //           </div>
                //         </div>
                //       </div>
                //       {/* List of all modifier group products */}
                //       <div className="hg">
                //         {modifier?.modifier_secondary_items?.map(
                //           (seconditems, indexSecondItem) => {
                //             return (
                //               <div key={`${index}.${indexSecondItem}`}>
                //                 <hr className="product-modifier-items-hr"></hr>

                //                 <div className="product-modifier-item-detail">
                //                   <div className="modifier-product-item-name-inc-dec">
                //                     <div className="modifier-inc-dec">
                //                       <button
                //                         className="modifier-btn"
                //                         disabled={seconditems?.is_item_select}
                //                         onClick={() =>
                //                           handleDecrement(
                //                             modifier?.id,
                //                             seconditems?.id
                //                           )
                //                         }
                //                       >
                //                         <div className="modifier-btn-div">
                //                           <div className="modifier-btn-svg">
                //                             <svg
                //                               width="24px"
                //                               height="24px"
                //                               fill="none"
                //                               viewBox="0 0 24 24"
                //                               xmlns="http://www.w3.org/2000/svg"
                //                               aria-hidden="true"
                //                               focusable="false"
                //                             >
                //                               <path
                //                                 d="m7.33325 13v-2h9.33335v2z"
                //                                 fill="#000000"
                //                               ></path>
                //                             </svg>
                //                           </div>
                //                         </div>
                //                       </button>

                //                       <div className="incremented-values">
                //                         {seconditems?.counter}
                //                       </div>

                //                       <button
                //                         className="modifier-btn"
                //                         disabled={
                //                           parseInt(modifier?.max_permitted) ===
                //                           parseInt(modifier?.modifier_counter)
                //                             ? true
                //                             : false
                //                         }
                //                         onClick={() =>
                //                           handleIncrement(
                //                             modifier?.id,
                //                             seconditems?.id
                //                           )
                //                         }
                //                       >
                //                         <div className="modifier-btn-div">
                //                           <div className="modifier-btn-svg">
                //                             <svg
                //                               width="24px"
                //                               height="24px"
                //                               fill="none"
                //                               viewBox="0 0 24 24"
                //                               xmlns="http://www.w3.org/2000/svg"
                //                               aria-hidden="true"
                //                               focusable="false"
                //                             >
                //                               <path
                //                                 d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z"
                //                                 fill="#000000"
                //                               ></path>
                //                             </svg>
                //                           </div>
                //                         </div>
                //                       </button>
                //                     </div>

                //                     <div className="spacer _16"></div>
                //                     <div className="modifier-product-item-name-one-div">
                //                       <div className="modifier-product-item-name-one-nested-div">
                //                         <div className="modifier-product-item-name-one-nested-div-one">
                //                           <div className="modifier-product-item-name-one-nested-div-one-nested">
                //                             <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                //                               {seconditems?.title}
                //                             </div>
                //                             <div className="spacer _8"></div>
                //                             {getAmountConvertToFloatWithFixed(
                //                               seconditems?.price,
                //                               2
                //                             ) >
                //                               getAmountConvertToFloatWithFixed(
                //                                 0,
                //                                 2
                //                               ) && (
                //                               <div className="modifier-group-price">
                //                                 {
                //                                   seconditems?.country_price_symbol
                //                                 }
                //                                 {getAmountConvertToFloatWithFixed(
                //                                   seconditems?.price,
                //                                   2
                //                                 )}
                //                               </div>
                //                             )}
                //                           </div>
                //                         </div>
                //                       </div>
                //                     </div>
                //                   </div>
                //                 </div>
                //               </div>
                //             );
                //           }
                //         )}
                //       </div>
                //     </div>
                //   </li>
                // )
              );
            })}
          </ul>

          <div className="product-top-padding-2"></div>

          <div className="of">
            <hr className="ed b9 og ho"></hr>
            <div className="add-to-cart-btn-no-selection">
              <div className="single-item-qty-div">
                <div className="qty-selector">
                  <div className="qty-selector-div">
                    <select className="qty-select" onClick={handleQuantity}>
                      <option value="1" className="co">
                        1
                      </option>
                      <option value="2" className="co">
                        2
                      </option>
                      <option value="3" className="co">
                        3
                      </option>
                      <option value="4" className="co">
                        4
                      </option>
                      <option value="5" className="co">
                        5
                      </option>
                      <option value="6" className="co">
                        6
                      </option>
                      <option value="7" className="co">
                        7
                      </option>
                      <option value="8" className="co">
                        8
                      </option>
                      <option value="9" className="co">
                        9
                      </option>
                      <option value="10" className="co">
                        10
                      </option>
                      <option value="11" className="co">
                        11
                      </option>
                      <option value="12" className="co">
                        12
                      </option>
                      <option value="13" className="co">
                        13
                      </option>
                      <option value="14" className="co">
                        14
                      </option>
                      <option value="15" className="co">
                        15
                      </option>
                      <option value="16" className="co">
                        16
                      </option>
                      <option value="17" className="co">
                        17
                      </option>
                      <option value="18" className="co">
                        18
                      </option>
                      <option value="19" className="co">
                        19
                      </option>
                      <option value="20" className="co">
                        20
                      </option>
                      <option value="21" className="co">
                        21
                      </option>
                      <option value="22" className="co">
                        22
                      </option>
                      <option value="23" className="co">
                        23
                      </option>
                      <option value="24" className="co">
                        24
                      </option>
                      <option value="25" className="co">
                        25
                      </option>
                      <option value="26" className="co">
                        26
                      </option>
                      <option value="27" className="co">
                        27
                      </option>
                      <option value="28" className="co">
                        28
                      </option>
                      <option value="29" className="co">
                        29
                      </option>
                      <option value="30" className="co">
                        30
                      </option>
                      <option value="31" className="co">
                        31
                      </option>
                      <option value="32" className="co">
                        32
                      </option>
                      <option value="33" className="co">
                        33
                      </option>
                      <option value="34" className="co">
                        34
                      </option>
                      <option value="35" className="co">
                        35
                      </option>
                      <option value="36" className="co">
                        36
                      </option>
                      <option value="37" className="co">
                        37
                      </option>
                      <option value="38" className="co">
                        38
                      </option>
                      <option value="39" className="co">
                        39
                      </option>
                      <option value="40" className="co">
                        40
                      </option>
                      <option value="41" className="co">
                        41
                      </option>
                      <option value="42" className="co">
                        42
                      </option>
                      <option value="43" className="co">
                        43
                      </option>
                      <option value="44" className="co">
                        44
                      </option>
                      <option value="45" className="co">
                        45
                      </option>
                      <option value="46" className="co">
                        46
                      </option>
                      <option value="47" className="co">
                        47
                      </option>
                      <option value="48" className="co">
                        48
                      </option>
                      <option value="49" className="co">
                        49
                      </option>
                      <option value="50" className="co">
                        50
                      </option>
                      <option value="51" className="co">
                        51
                      </option>
                      <option value="52" className="co">
                        52
                      </option>
                      <option value="53" className="co">
                        53
                      </option>
                      <option value="54" className="co">
                        54
                      </option>
                      <option value="55" className="co">
                        55
                      </option>
                      <option value="56" className="co">
                        56
                      </option>
                      <option value="57" className="co">
                        57
                      </option>
                      <option value="58" className="co">
                        58
                      </option>
                      <option value="59" className="co">
                        59
                      </option>
                      <option value="60" className="co">
                        60
                      </option>
                      <option value="61" className="co">
                        61
                      </option>
                      <option value="62" className="co">
                        62
                      </option>
                      <option value="63" className="co">
                        63
                      </option>
                      <option value="64" className="co">
                        64
                      </option>
                      <option value="65" className="co">
                        65
                      </option>
                      <option value="66" className="co">
                        66
                      </option>
                      <option value="67" className="co">
                        67
                      </option>
                      <option value="68" className="co">
                        68
                      </option>
                      <option value="69" className="co">
                        69
                      </option>
                      <option value="70" className="co">
                        70
                      </option>
                      <option value="71" className="co">
                        71
                      </option>
                      <option value="72" className="co">
                        72
                      </option>
                      <option value="73" className="co">
                        73
                      </option>
                      <option value="74" className="co">
                        74
                      </option>
                      <option value="75" className="co">
                        75
                      </option>
                      <option value="76" className="co">
                        76
                      </option>
                      <option value="77" className="co">
                        77
                      </option>
                      <option value="78" className="co">
                        78
                      </option>
                      <option value="79" className="co">
                        79
                      </option>
                      <option value="80" className="co">
                        80
                      </option>
                      <option value="81" className="co">
                        81
                      </option>
                      <option value="82" className="co">
                        82
                      </option>
                      <option value="83" className="co">
                        83
                      </option>
                      <option value="84" className="co">
                        84
                      </option>
                      <option value="85" className="co">
                        85
                      </option>
                      <option value="86" className="co">
                        86
                      </option>
                      <option value="87" className="co">
                        87
                      </option>
                      <option value="88" className="co">
                        88
                      </option>
                      <option value="89" className="co">
                        89
                      </option>
                      <option value="90" className="co">
                        90
                      </option>
                      <option value="91" className="co">
                        91
                      </option>
                      <option value="92" className="co">
                        92
                      </option>
                      <option value="93" className="co">
                        93
                      </option>
                      <option value="94" className="co">
                        94
                      </option>
                      <option value="95" className="co">
                        95
                      </option>
                      <option value="96" className="co">
                        96
                      </option>
                      <option value="97" className="co">
                        97
                      </option>
                      <option value="98" className="co">
                        98
                      </option>
                      <option value="99" className="co">
                        99
                      </option>
                    </select>

                    <div className="svg-div">
                      <div className="svg-div-one">
                        <svg
                          width="24px"
                          height="24px"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                            fill="currentColor"
                            transform="rotate(180, 12, 12)"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="da c7"></div>
              <button className="add-to-cart-btn-item" onClick={handleAddtoCart}>
                Add {quantity} to order cell
                <span className="add-cart-span">&nbsp;•&nbsp;</span>
                &pound;
                {parseFloat(quantity * itemprice).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
