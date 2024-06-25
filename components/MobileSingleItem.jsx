import { IMAGE_URL_Without_Storage } from "@/global/Axios";
import {
  getAmountConvertToFloatWithFixed,
  getCountryCurrencySymbol,
} from "@/global/Store";
import Link from "next/link";
import React, { memo } from "react";

export const MobileSingleItem = memo((props) => {
  const {
    itemprice,
    singleitem,
    handleMScroll,
    quantity,
    handleRadioInput,
    setIsaccordianclicked,
    handleCheckInput,
    handleMobileModifierToggle,
    handleDecrement,
    handleIncrement,
    handleMobileQuantityDecrement,
    handleMobileQuantityIncrement,
    handleMobileAddtoCart,
  } = props;

  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };

  return (
    <div onWheel={handleMScroll}>
      <div
        style={{
          width: "1px",
          height: "0px",
          padding: "0px",
          overflow: "hidden",
          position: "fixed",
          top: "1px",
          left: "1px",
        }}
      ></div>
      <div>
        <div className="arc2single-product">
          <div className="albfsingle-product">
            <div className="akb0cccdsingle-product">
              <div className="ctascusingle-product">
                <div className="agaksingle-product">
                  <div className="agasbcbksingle-product"></div>
                  <div className="akcyczbfsingle-product">
                    <div className="d5single-product">
                      <Link
                        className="d6aqbfc4single-product-cross-btn"
                        href="/"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <title>X</title>
                          <path
                            d="m21.1 5.1-2.2-2.2-6.9 7-6.9-7-2.2 2.2 7 6.9-7 6.9 2.2 2.2 6.9-7 6.9 7 2.2-2.2-7-6.9 7-6.9Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                    {/* 
                    <div className="bre3dpsingle-product">{singleitem?.title}</div>
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
                          (singleitem?.image_url && singleitem?.image_url !== null) &&
                          isValidHttpsUrl(singleitem?.image_url) ?
                            <img
                              role="presentation"
                              src={singleitem?.image_url}
                              alt={singleitem?.title}
                              className="egbkaeeheisingle-productimg"
                            />
                          :
                            <img
                              role="presentation"
                              src={singleitem?.image_url}
                              alt={IMAGE_URL_Without_Storage+""+singleitem?.title}
                              className="egbkaeeheisingle-productimg"
                            />
                        }
                        <div className="agasatbdbcajsingle-product"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="eksingle-product">
                <div className="bnelbpemeneoalbfsingle-product">
                  {singleitem?.title}
                </div>
                <span
                  data-testid="rich-text"
                  className="fnfofpbnfqbpfrb1single-product-price"
                >
                  {singleitem?.country_price_symbol}
                  {parseFloat(singleitem?.price).toFixed(2)}
                </span>
                <div className="epeqsingle-product-div"></div>
                <div className="er">
                  <div className="bresbtdqetbxsingle-product">
                    {singleitem?.description}
                  </div>
                </div>
              </div>

              <ul className="ftsingle-productul">
                {singleitem?.modifier_group?.map((modifier, index) => {
                  return parseInt(modifier?.modifier_secondary_items?.length) >
                    parseInt(0) &&
                    // {/* minimum option = '1' and maximum option = 1 and single item select = 1 */}
                    modifier?.select_single_option === 1 &&
                    modifier?.min_permitted === 1 &&
                    modifier?.max_permitted === 1 ? (
                    <li key={index} className={`msection${index}`}>
                      <div className="fusingle-productlidiv">
                        <hr className="modifier-hr"></hr>

                        <div
                          className="modifier-header"
                          onClick={() =>
                            handleMobileModifierToggle(modifier?.id)
                          }
                        >
                          <div className="modifier-div">
                            <div className="alamsingle-product">
                              <div className="bnfrbpfsingle-product">
                                {modifier?.title}
                              </div>
                              <div className="bresbtdqfysingle-product">
                                <span>Choose {modifier?.max_permitted}</span>
                                <div className="fzsingle-product">
                                  <div
                                    className={`g0afg1single-product ${modifier?.valid_class}`}
                                  >
                                    {parseInt(modifier?.min_permitted) >
                                    parseInt(0)
                                      ? "Required"
                                      : "Optional"}
                                  </div>
                                </div>
                              </div>
                              {!modifier?.is_toggle_active && (
                                <div>
                                  {parseInt(
                                    modifier?.selected_item_name?.length
                                  ) > parseInt(20)
                                    ? modifier?.selected_item_name?.substring(
                                        0,
                                        20
                                      ) + "..."
                                    : modifier?.selected_item_name}
                                </div>
                              )}
                            </div>

                            <div className="single-product-svg-div accordion">
                              <div className="single-product-svg-div-one">
                                {modifier?.is_toggle_active ? (
                                  <svg
                                    className="bottom-arrow-head-svg"
                                    width="30px"
                                    height="30px"
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
                                ) : (
                                  <svg
                                    className="rigth-arrow-head-svg"
                                    width="30px"
                                    height="30px"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    focusable="false"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <path
                                      d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                      fill="currentColor"
                                      transform="rotate(90, 12, 12)"
                                    ></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Listed Data */}
                        {
                          <div
                            className={`g5single-product ${
                              modifier?.is_toggle_active ? "show" : "fade"
                            }`}
                          >
                            {modifier?.modifier_secondary_items?.map(
                              (mobileSecondItems, mobileSecondIndex) => {
                                return (
                                  <>
                                    <div
                                      className="alakg6bfsingle-product"
                                      key={`${index}.${mobileSecondIndex}`}
                                      onClick={() =>
                                        handleRadioInput(
                                          modifier?.id,
                                          mobileSecondItems?.id,
                                          mobileSecondItems?.title,
                                          parseInt(mobileSecondItems ?.secondary_item_modifiers.length)
                                        )
                                      }
                                    >
                                      {parseInt(
                                        mobileSecondItems
                                          ?.secondary_item_modifiers?.length
                                      ) > parseInt(0) && (
                                        <div className="poquickreview-modal">
                                          <div className="c8c7cuquickreview-modal">
                                            <svg
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              width="30px"
                                              height="30px"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                              aria-hidden="true"
                                              focusable="false"
                                            >
                                              <path
                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                fill="#AFAFAF"
                                                transform="rotate(90, 12, 12)"
                                              ></path>
                                            </svg>
                                          </div>
                                        </div>
                                      )}
                                      <input
                                        type="radio"
                                        className="radio-input"
                                      ></input>

                                      <label
                                        className={`brbsdpdqbkalbfafg6single-productlable ${mobileSecondItems?.activeClass}`}
                                      >
                                        <div className="spacer _16"></div>
                                        <div className="modifier-product">
                                          <div className="ale4amc4gjgkglsingle-product">
                                            <div className="alaqsingle-product">
                                              <div className="alamgmgnsingle-product">
                                                <div className="bresdpg4gosingle-product">
                                                  {mobileSecondItems?.title}
                                                </div>
                                                <div className="spacer _8"></div>
                                                {getAmountConvertToFloatWithFixed(
                                                  mobileSecondItems?.price,
                                                  2
                                                ) >
                                                  getAmountConvertToFloatWithFixed(
                                                    0,
                                                    2
                                                  ) && (
                                                  <div className="bresbtdqb1bzsingle-productincdecprice">
                                                    {getCountryCurrencySymbol()}
                                                    {getAmountConvertToFloatWithFixed(
                                                      mobileSecondItems?.price,
                                                      2
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </label>
                                    </div>

                                    <hr className="efbvgpgq"></hr>
                                  </>
                                );
                              }
                            )}
                          </div>
                        }
                      </div>
                    </li>
                  ) : // {/* minimum option = '0' and maximum option = 1 and single item select = 1 */}
                  modifier?.select_single_option === 1 &&
                    modifier?.min_permitted === 0 &&
                    modifier?.max_permitted >= 1 ? (
                    <li key={index} className={`msection${index}`}>
                      <div className="fusingle-productlidiv">
                        <hr className="modifier-hr"></hr>

                        <div
                          className="modifier-header"
                          onClick={() =>
                            handleMobileModifierToggle(modifier?.id)
                          }
                        >
                          <div className="modifier-div">
                            <div className="alamsingle-product">
                              <div className="bnfrbpfsingle-product">
                                {modifier?.title}
                              </div>
                              <div className="bresbtdqfysingle-product">
                                <span>Choose {modifier?.max_permitted}</span>
                                <div className="fzsingle-product">
                                  <div
                                    className={`g0afg1single-product ${modifier?.valid_class}`}
                                  >
                                    {parseInt(modifier?.min_permitted) >
                                    parseInt(0)
                                      ? "Required"
                                      : "Optional"}
                                  </div>
                                </div>
                              </div>
                              {!modifier?.is_toggle_active &&
                                modifier?.modifier_secondary_items?.map(
                                  (displaySelectedItems, mobileSecondIndex) => {
                                    return (
                                      displaySelectedItems?.is_item_select && (
                                        <div
                                          key={`${index}.${mobileSecondIndex}`}
                                        >
                                          {parseInt(
                                            displaySelectedItems?.title?.length
                                          ) > parseInt(20)
                                            ? displaySelectedItems?.title?.substring(
                                                0,
                                                20
                                              ) + "..."
                                            : displaySelectedItems?.title}
                                        </div>
                                      )
                                    );
                                  }
                                )}
                            </div>
                            <div
                              className="single-product-svg-div accordion"
                              onClick={() => setIsaccordianclicked(true)}
                            >
                              <div className="single-product-svg-div-one">
                                {modifier?.is_toggle_active ? (
                                  <svg
                                    className="bottom-arrow-head-svg"
                                    width="30px"
                                    height="30px"
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
                                ) : (
                                  <svg
                                    className="rigth-arrow-head-svg"
                                    width="30px"
                                    height="30px"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    focusable="false"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <path
                                      d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                      fill="currentColor"
                                      transform="rotate(90, 12, 12)"
                                    ></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Listed Data */}
                        {
                          <div
                            className={`g5single-product ${
                              modifier?.is_toggle_active ? "show" : "fade"
                            }`}
                          >
                            {modifier?.modifier_secondary_items?.map(
                              (mobileSecondItems, mobileSecondItemsIndex) => {
                                return mobileSecondItems.activeClass !==
                                  "mchw" ? (
                                  <div
                                    key={`${index}.${mobileSecondItemsIndex}`}
                                    onClick={() =>
                                      handleCheckInput(
                                        modifier?.id,
                                        mobileSecondItems?.id,
                                        parseInt(
                                          mobileSecondItems
                                            ?.secondary_item_modifiers.length
                                        )
                                      )
                                    }
                                  >
                                    <div className="alakg6bfsingle-product">
                                      <input
                                        type="checkbox"
                                        className="checkbox-input"
                                      />

                                      <label
                                        className={`brbsdpdqbkalbfafg6single-productlablecheck ${mobileSecondItems?.activeClass}`}
                                      >
                                        <div className="spacer _16"></div>
                                        <div className="modifier-product">
                                          <div className="ale4amc4gjgkglsingle-product">
                                            <div className="alaqsingle-product">
                                              <div className="alamgmgnsingle-product">
                                                <div className="bresdpg4gosingle-product">
                                                  {mobileSecondItems?.title}
                                                </div>
                                                <div className="spacer _8"></div>
                                                {getAmountConvertToFloatWithFixed(
                                                  mobileSecondItems?.price,
                                                  2
                                                ) >
                                                  getAmountConvertToFloatWithFixed(
                                                    0,
                                                    2
                                                  ) && (
                                                  <div className="bresbtdqb1bzsingle-productincdecprice">
                                                    {
                                                      mobileSecondItems?.country_price_symbol
                                                    }
                                                    {getAmountConvertToFloatWithFixed(
                                                      mobileSecondItems?.price,
                                                      2
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                    <hr className="efbvgpgq"></hr>
                                  </div>
                                ) : (
                                  <div
                                    key={`${index}.${mobileSecondItemsIndex}`}
                                  >
                                    <div className="alakg6bfsingle-product">
                                      <input
                                        type="checkbox"
                                        className="checkbox-input"
                                      />

                                      <label
                                        className={`brbsdpdqbkalbfafg6single-productlablecheck ${mobileSecondItems?.activeClass}`}
                                      >
                                        <div className="spacer _16"></div>
                                        <div className="modifier-product">
                                          <div className="ale4amc4gjgkglsingle-product">
                                            <div className="alaqsingle-product">
                                              <div className="alamgmgnsingle-product">
                                                <div className="bresdpg4gosingle-product">
                                                  {mobileSecondItems?.title}
                                                </div>
                                                <div className="spacer _8"></div>
                                                {getAmountConvertToFloatWithFixed(
                                                  mobileSecondItems?.price,
                                                  2
                                                ) >
                                                  getAmountConvertToFloatWithFixed(
                                                    0,
                                                    2
                                                  ) && (
                                                  <div className="bresbtdqb1bzsingle-productincdecprice">
                                                    {
                                                      mobileSecondItems?.country_price_symbol
                                                    }
                                                    {getAmountConvertToFloatWithFixed(
                                                      mobileSecondItems?.price,
                                                      2
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                    <hr className="efbvgpgq"></hr>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        }
                      </div>
                    </li>
                  ) : (
                    // (modifier?.select_single_option > 1 && (modifier?.min_permitted === 0 && modifier?.max_permitted > 1)) &&
                    // {/* minimum option = '- / 0' and maximum option = 5 and single item select = 2 */}
                    <li key={index} className={`msection${index}`}>
                      <div className="fusingle-productlidiv">
                        <hr className="modifier-hr"></hr>

                        <div
                          className="modifier-header"
                          onClick={() =>
                            handleMobileModifierToggle(modifier?.id)
                          }
                        >
                          <div className="modifier-div">
                            <div className="alamsingle-product">
                              <div className="bnfrbpfsingle-product">
                                {modifier?.title}
                              </div>
                              <div className="bresbtdqfysingle-product">
                                <span>Choose {modifier?.max_permitted}</span>
                                <div className="fzsingle-product">
                                  <div
                                    className={`g0afg1single-product ${modifier?.valid_class}`}
                                  >
                                    {parseInt(modifier?.min_permitted) >
                                    parseInt(0)
                                      ? "Required"
                                      : "Optional"}
                                  </div>
                                </div>
                              </div>
                              {!modifier?.is_toggle_active &&
                                modifier?.modifier_secondary_items?.map(
                                  (
                                    displaySelectedItems,
                                    displaySelectedItemsIndex
                                  ) => {
                                    return (
                                      parseInt(displaySelectedItems?.counter) >
                                        parseInt(0) && (
                                        <div
                                          key={`${index}.${displaySelectedItemsIndex}`}
                                        >
                                          {parseInt(
                                            displaySelectedItems?.title?.length
                                          ) > parseInt(20)
                                            ? displaySelectedItems?.title?.substring(
                                                0,
                                                20
                                              ) + "..."
                                            : displaySelectedItems?.title}
                                        </div>
                                      )
                                    );
                                  }
                                )}
                            </div>
                            <div className="single-product-svg-div accordion">
                              <div className="single-product-svg-div-one">
                                {modifier?.is_toggle_active ? (
                                  <svg
                                    className="bottom-arrow-head-svg"
                                    width="30px"
                                    height="30px"
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
                                ) : (
                                  <svg
                                    className="rigth-arrow-head-svg"
                                    width="30px"
                                    height="30px"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    focusable="false"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <path
                                      d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                      fill="currentColor"
                                      transform="rotate(90, 12, 12)"
                                    ></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Listed Data */}
                        {
                          <div
                            className={`g5single-product ${
                              modifier?.is_toggle_active ? "show" : "fade"
                            }`}
                          >
                            {modifier?.modifier_secondary_items?.map(
                              (mobileSecondItems, mobileSecondItemsIndex) => {
                                return (
                                  <div
                                    key={`${index}.${mobileSecondItemsIndex}`}
                                  >
                                    <div className="alg5bfsingle-product">
                                      <div className="alaqbfsingle-product">
                                        <button
                                          className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn"
                                          disabled={
                                            mobileSecondItems?.is_item_select
                                          }
                                          onClick={() =>
                                            handleDecrement(
                                              modifier?.id,
                                              mobileSecondItems?.id
                                            )
                                          }
                                        >
                                          <div className="ezfj">
                                            <div className="fjezh1">
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
                                                  d="m7.33325 13v-2h9.33335v2z"
                                                  fill="#000000"
                                                ></path>
                                              </svg>
                                            </div>
                                          </div>
                                        </button>

                                        <div className="bresbtdqiqsingle-product">
                                          {parseInt(mobileSecondItems?.counter)}
                                        </div>

                                        <button
                                          className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn"
                                          disabled={
                                            parseInt(
                                              modifier?.max_permitted
                                            ) ===
                                            parseInt(modifier?.modifier_counter)
                                              ? true
                                              : false
                                          }
                                          onClick={() =>
                                            handleIncrement(
                                              modifier?.id,
                                              mobileSecondItems?.id
                                            )
                                          }
                                        >
                                          <div className="ez fj">
                                            <div className="fj ez h1">
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
                                                  d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z"
                                                  fill="#000000"
                                                ></path>
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
                                              <div className="bresdpg3gnsingle-productincdecheading">
                                                {mobileSecondItems?.title}
                                              </div>
                                              <div className="spacer _8"></div>
                                              {getAmountConvertToFloatWithFixed(
                                                mobileSecondItems?.price,
                                                2
                                              ) >
                                                getAmountConvertToFloatWithFixed(
                                                  0,
                                                  2
                                                ) && (
                                                <div className="bresbtdqb1bzsingle-productincdecprice">
                                                  {
                                                    mobileSecondItems?.country_price_symbol
                                                  }
                                                  {getAmountConvertToFloatWithFixed(
                                                    mobileSecondItems?.price,
                                                    2
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <hr className="efbvgogpsingle-producthr"></hr>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        }
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="h2single-product"></div>
              <div>
                <div className="albfglh3single-product">
                  <div className="akh4gzh5h6bxgtb1h7single-product">
                    <div className="agbdh8h4albfsingle-product">
                      <button
                        className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-dec-product"
                        disabled={quantity > 1 ? false : true}
                        onClick={handleMobileQuantityDecrement}
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 20 20"
                          className="hfg0ebhgsingle-product-svg"
                        >
                          <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                        </svg>
                      </button>

                      <div style={{ width: "48px" }}></div>

                      <button
                        className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-inc-product"
                        onClick={handleMobileQuantityIncrement}
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 20 20"
                          className="hfg0ebhgsingle-product-svg"
                        >
                          <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                        </svg>
                      </button>
                    </div>

                    <div className="aghhhibre3dpbualc4bfbzbmsingle-product">
                      <div>{parseInt(quantity)}</div>
                    </div>
                  </div>
                </div>

                <div className="epezsingle-product"></div>
                <hr className="efeqhjg2single-producthr"></hr>
              </div>

              <div className="iosignle-product"></div>
              <div className="i7single-product"></div>
              <div className="iaibicblidieifigcsctbcsingle-product">
                <button
                  className="e3bubrdpb9ihbkalbfc4afh2iibbijikilgwgxsingle-product"
                  onClick={handleMobileAddtoCart}
                >
                  Add {quantity} to order
                  <span className="bre3dpbud6imbfsingle-product-span">
                    &nbsp;•&nbsp;
                  </span>
                  {getCountryCurrencySymbol()}{" "}
                  {getAmountConvertToFloatWithFixed(quantity * itemprice, 2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "1px",
          height: "0px",
          padding: "0px",
          overflow: "hidden",
          position: "fixed",
          top: "1px",
          left: "1px",
        }}
      ></div>
    </div>
  );
});
