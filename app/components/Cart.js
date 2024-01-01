import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import Link from 'next/link'
import { getAmountConvertToFloatWithFixed, getCountryCurrencySymbol, setLocalStorage, setSessionStorage } from '../global/Store'
import moment from 'moment'
import { BRAND_GUID, DELIVERY_ID, axiosPrivate } from '../global/Axios'
import { useRouter } from 'next/navigation'

export default function Cart() 
{
    const route = useRouter()
    const {
        settotalOrderAmountValue,
        selectedFilter,
        storeName,
        cartdata,
        setCartdata,
        iscartitemdottedbtnclicked,
        iscartfull,
        setIscartbtnclicked,
        setIscartitemdottedbtnclicked,
        setIscheckoutclicked,
        deliverymatrix,
        postcode,
        postcodefororderamount
    } = useContext(HomeContext)

    const [subtotalOrderAmount, setSubtotalOrderAmount] = useState(0)
    const [totalOrderAmount, setTotalOrderAmount] = useState(0)
    
    const [deliveryfee, setDeliveryfee] = useState(0)

    const [deliverymessage, setDeliverymessage] = useState("")

    const [discountvalue, setDiscountValue] = useState(0)

    const [amountdiscountmessage, setAmountDiscountMessage] = useState("")
    // Boolean States
    const [isaddpromocodebtntoggle, setIsaddpromocodebtntoggle] = useState(false)
    const [isordersubtotallessthanordervalue, setIsordersubtotallessthanordervalue] = useState(true)
    // Coupon Code States
    const [coupon, setCoupon] = useState("")
    const [isappliedbtnactive, setIsappliedbtnactive] = useState(true)
    
    const getOrderAmount = async (subTotalArgument) =>
    {
        try {
            const filterData = {
                endData: moment().format('YYYY-MM-DD'),
                active: 1,
                partner: 2,
                brand: BRAND_GUID,
                postcode: postcodefororderamount
            }

            console.log("Filter data:", filterData);
            const response = await axiosPrivate.post(`/apply-amount-discount`,filterData)
            console.log("Amount Discount Success data:", response);
            
            const amountDiscounts = response?.data?.data?.applyAmountDiscount
            let workingIndex = 0
            if(parseInt(amountDiscounts.length) > parseInt(0))
            {
                // Stage - I get the Index.
                for (let index = 0; index < parseInt(amountDiscounts.length); index++) 
                {
                    if(parseInt(subTotalArgument) >= parseInt(amountDiscounts[index]?.need_to_spend))
                    {
                        if(parseInt(subTotalArgument) >= parseInt(amountDiscounts[++index]?.need_to_spend))
                        {
                            workingIndex = ++index;
                            break;
                        }
                        else
                        {
                            workingIndex = index
                            break;
                        }
                    }
                }

                // Stage - II match the index and get related data.
                if(amountDiscounts[workingIndex] === undefined)
                {
                    workingIndex -= 1
                }
             
                if(parseInt(subTotalArgument) >= parseInt(amountDiscounts[workingIndex].need_to_spend))
                {
                    // setLocalStorage('order_amount_number', amountDiscounts[workingIndex].amount_guid)
                    setSessionStorage('order_amount_number', amountDiscounts[workingIndex].amount_guid)
                    if(amountDiscounts[workingIndex].discount_type === "P")
                    {
                        const getThePercentage = (amountDiscounts[workingIndex].value / 100)
                        const getDiscount = parseFloat(subTotalArgument) * parseFloat(getThePercentage)
                        setDiscountValue(getAmountConvertToFloatWithFixed(getDiscount,2))
                    }
                    else
                    {
                        const getDiscount = parseFloat(subTotalArgument) - parseFloat(amountDiscounts[workingIndex].value)
                        setDiscountValue(getAmountConvertToFloatWithFixed(getDiscount,2))
                    }
                }
                else
                {
                    const getAmountDiscountDifference = (parseInt(subTotalArgument) >= parseInt(amountDiscounts[workingIndex].need_to_spend)) ? parseFloat(subTotalArgument) - parseFloat(amountDiscounts[workingIndex].need_to_spend) : parseFloat(amountDiscounts[workingIndex].need_to_spend) - parseFloat(subTotalArgument)
                    const amountText = <span>Spend <strong>{getCountryCurrencySymbol()}{parseFloat(getAmountDiscountDifference).toFixed(2)}</strong> more to get <strong>{(amountDiscounts[workingIndex].discount_type === "M") && getCountryCurrencySymbol()} {amountDiscounts[workingIndex].value} {(amountDiscounts[workingIndex].discount_type === "P") && "%"} off</strong></span>
                    setAmountDiscountMessage(amountText)
                    setDiscountValue(0)
                }
            }
        } catch (error) {
            console.log("Error data:", error);
        }
    }

    useEffect(() => {
      if(parseInt(cartdata?.length) > parseInt(0))
      {
        // Calculate Items Total Order Value.
        let totalValue = 0

        for(const total of cartdata)
        {
            totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount)
        }
        
        // setLocalStorage('sub_order_total_local',JSON.stringify(getAmountConvertToFloatWithFixed(totalValue,2)))
        setSessionStorage('sub_order_total_local',JSON.stringify(getAmountConvertToFloatWithFixed(totalValue,2)))

        setSubtotalOrderAmount(getAmountConvertToFloatWithFixed(totalValue,2))
        
        // Calculate the Delivery Fee
        // console.log("Inside the cart:", selectedFilter);
        // If the User select the delivery, then delivery fee will be charge.
        
        if(selectedFilter?.id === DELIVERY_ID)
        {
            if(parseFloat(totalValue) >= parseFloat(deliverymatrix?.order_value))
                {
    
                if(deliverymatrix?.above_order_value === null)
                {
                    const textMessage = <strong>Free Delivery</strong>
                    setDeliverymessage(textMessage)
                    const fee = getAmountConvertToFloatWithFixed(0,2)
                    setDeliveryfee(fee)
                }
                else
                {
                    const fee = getAmountConvertToFloatWithFixed(deliverymatrix?.above_order_value, 2)
                    setDeliveryfee(fee)
                }
    
                if(parseFloat(deliverymatrix?.delivery_matrix_row_values) > parseFloat(0))
                {
                    for(const deliveryMatrixRowValues of deliverymatrix?.delivery_matrix_row_values)
                    {
                        if(parseFloat(totalValue) >= parseFloat(deliveryMatrixRowValues?.min_order_value))
                        {
                            if(deliveryMatrixRowValues?.above_minimum_order_value === null)
                            {
                                const textMessage = <strong>Free Delivery</strong>
                                setDeliverymessage(textMessage)
                                const fee = getAmountConvertToFloatWithFixed(0,2)
                                setDeliveryfee(fee)
                            }
                            else
                            {
                                const fee = parseFloat(deliveryMatrixRowValues?.above_minimum_order_value).toFixed(2)
                                setDeliveryfee(fee)
                            }
                        }
                        else
                        {
                            const getDifference = parseFloat(deliveryMatrixRowValues?.min_order_value) - parseFloat(totalValue)
                            const textMessage = <span >Spend <strong>{getCountryCurrencySymbol()}{parseFloat(getDifference).toFixed(2)}</strong> more to get <strong>Free Delivery</strong></span>
                            setDeliverymessage(textMessage)
                        }
                    }
                }
            }
            else
            {
                // const textMessage = <span>Minimum order is <strong>{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(deliverymatrix?.order_value, 2)}</strong> to your postcode <strong>{postcode}</strong></span>
                const textMessage = <span style={{color: "red", background: "#eda7a7", textAlign: "center", padding:"10px"}}>Minimum order is <strong>{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(deliverymatrix?.order_value, 2)}</strong> to your postcode</span>
                setDeliverymessage(textMessage)
                const fee = getAmountConvertToFloatWithFixed(deliverymatrix?.above_order_value, 2)
                setDeliveryfee(fee)
                setIsordersubtotallessthanordervalue(false)
            }
        }
        else
        {
            setDeliveryfee(0)
            setIsordersubtotallessthanordervalue(true)
        }

        
        setTotalOrderAmount(getAmountConvertToFloatWithFixed(totalValue,2))
        // Order Amount Calculate
        getOrderAmount(getAmountConvertToFloatWithFixed(totalValue,2))
      }
    //   setLocalStorage('cart',cartdata)
        setSessionStorage('cart',cartdata)
    }, [cartdata])
    
    const handlePromoCodeToggle = () =>
    {
        setIsaddpromocodebtntoggle(!isaddpromocodebtntoggle)
    }

    const handleCheckoutBtn = () =>
    {
        setIscheckoutclicked(true)
    }

    const handleAddItems = () =>
    {
        route.push("/")
        setIscartbtnclicked(false)
    }

    const handleDotedBtn = (id) =>
    {
        const updateIsCartModalFlag = cartdata?.map((cart,index) =>
        {
            if(id === index)
            {
                return{
                    ...cart,
                    is_cart_modal_clicked: !cart?.is_cart_modal_clicked
                }
            }
            return cart
        })
        setCartdata(updateIsCartModalFlag)
    }

    const removeItem = (id) =>
    {
        const filterItems = cartdata?.filter((cart,index) => index !== id)
        setCartdata(filterItems)
    }

    // Handle Coupon Code functionality
    const handleCopuonCode = (event) =>
    {
        setCoupon(event.target.value)
        setIsappliedbtnactive(!isappliedbtnactive)
    }

    const handleFindCouponCode = () =>
    {
        setIsaddpromocodebtntoggle(!isaddpromocodebtntoggle)
    }

    useEffect(() => {
        // setLocalStorage('total_order_value_storage',JSON.stringify((getAmountConvertToFloatWithFixed((parseFloat(subtotalOrderAmount) + parseFloat(deliveryfee)) - parseFloat(discountvalue),2))))
        // setLocalStorage('delivery_fee',getAmountConvertToFloatWithFixed(deliveryfee,2))

        setSessionStorage('total_order_value_storage',(getAmountConvertToFloatWithFixed((parseFloat(subtotalOrderAmount) + parseFloat(deliveryfee)) - parseFloat(discountvalue),2)))
        setSessionStorage('delivery_fee',getAmountConvertToFloatWithFixed(deliveryfee,2))

        settotalOrderAmountValue(getAmountConvertToFloatWithFixed((parseFloat(subtotalOrderAmount) + parseFloat(deliveryfee)) - parseFloat(discountvalue),2))
    }, [subtotalOrderAmount,deliveryfee,discountvalue])
    

    const handleEditItem = (findByIndex,storeName, categorySlug, itemSlug) =>
    {
        // setLocalStorage("set_index",findByIndex)
        setSessionStorage("set_index",findByIndex)
        const updateCartModal = cartdata?.map((cart, index) =>
        {
            if(findByIndex === index)
            {
                return{
                    ...cart,
                    is_cart_modal_clicked: false
                }
            }
            return cart
        })
        setCartdata(updateCartModal)
        setIscartbtnclicked(false)
        route.push(`${storeName}/${categorySlug}/${itemSlug}/edit`)
    }

    return (
        <>
            <div className="cart-level-one-div">
                <div className="cart-level-one-div-screen-one"></div>
                <div className="cart-level-one-div-screen-two">
                    <div className="cart jp">
                        <div className="cart-close-btn-div-level-one">
                            <button className="cart-close-btn" onClick={() => setIscartbtnclicked(false)}>
                                <div className="cart-close-btn-div">
                                    <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" fill="currentColor"></path></svg>
                                </div>
                            </button>    
                        </div>
                        {
                        (parseInt(cartdata?.length) > parseInt(0)) ?
                            <>
                                <div className="afcart">
                                    <div className="">
                                        
                                        <div className="dtcxcyczd0d1checkout">
                                            <div className="alaqcheckout">
                                                <h3 className="dualbcheckout-order-summary">
                                                    <span className="cjcheckout">Cart summary</span>
                                                </h3>
                                            </div>

                                            <div className="dze0checkout"></div>

                                            <div className="alame1e2checkout">
                                                <div className="b7avfpfqcheckout-details">
                                                    {
                                                        cartdata?.map((cart, index) =>
                                                        {
                                                            return(
                                                                <div className="esetcheckout" key={index}>
                                                                    <a className="ald5egbhddeteud1checkout-edit-item d1">
                                                                        <div className="bodgdfcheckout-qty">
                                                                            {parseInt(cart?.quantity)}
                                                                        </div>
                                                                        <div className="alamcjewcheckout">
                                                                            <span className="bobpdfcvcheckout-item-header">{cart?.title}</span>
                                                                            <ul className="excheckout">
                                                                                {
                                                                                    cart?.modifier_group?.map((modifier) =>
                                                                                    {
                                                                                        return(
                                                                                            modifier?.modifier_secondary_items?.map((item,index) =>
                                                                                            {
                                                                                                return(
                                                                                                    (item?.item_select_to_sale) &&
                                                                                                    <>
                                                                                                        <li className="bheyezebalf0checkout-item-li ez" key={index}>
                                                                                                            <span className="bodgdfcvcheckout-li-modi-title">{modifier?.title}:</span>
                                                                                                            <div className="spacer _4"></div>
                                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">{item?.title} ({item?.country_price_symbol}{item?.price})<div></div></span>
                                                                                                        </li>

                                                                                                        {
                                                                                                            parseInt(item?.secondary_item_modifiers.length) > parseInt(0) &&
                                                                                                            item?.secondary_item_modifiers?.map((secondaryModifierItems, indexSecondModifier) =>
                                                                                                            {
                                                                                                                return(
                                                                                                                    secondaryModifierItems?.secondary_items_modifier_items?.map((secondItem, indexSecondItem) =>
                                                                                                                    {
                                                                                                                        return(
                                                                                                                            <li className="bheyezebalf0checkout-item-li ez" key={index + indexSecondModifier + indexSecondItem}>
                                                                                                                                <span className="bodgdfcvcheckout-li-modi-title">{secondaryModifierItems?.title}:</span>
                                                                                                                                <div className="spacer _4"></div>
                                                                                                                                {
                                                                                                                                    (secondItem.counter > 0) ?
                                                                                                                                    <>
                                                                                                                                        <div class="bodgdfcheckout-qty">{ secondItem.counter}</div>
                                                                                                                                        <span className="albodgbqcvcheckout-li-modi-detail">{secondItem?.title} ({secondItem?.country_price_symbol}{getAmountConvertToFloatWithFixed(parseFloat(secondItem.counter) * parseFloat(secondItem?.price_info),2)})<div></div></span>
                                                                                                                                    </>
                                                                                                                                    :
                                                                                                                                    <span className="albodgbqcvcheckout-li-modi-detail">{secondItem?.title} ({secondItem?.country_price_symbol}{secondItem?.price_info})<div></div></span>
                                                                                                                                }
                                                                                                                                
                                                                                                                            </li>
                                                                                                                        )
                                                                                                                    })
                                                                                                                )
                                                                                                            })
                                                                                                        }
                                                                                                    </>

                                                                                                )
                                                                                            })
                                                                                        )
                                                                                    })
                                                                                }
                                                                            
                                                                            </ul>
                                                                        </div>
                                                                        <div className="f1alamcheckout-item-qty">
                                                                            <span className="gye2gzcheckout-item-qty-span">{cart?.country_price_symbol}{cart?.total_order_amount}</span>
                                                                        </div>
                                                                    </a>

                                                                    <div className="checkout-item-edit-delete">
                                                                    <button className="cart-header-dotted-btn cp" onClick={() => handleDotedBtn(index)}><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" style={{transform: "rotate(90deg)"}} className="c8c7cccdcheckout"><g><path d="M17 12a1.667 1.667 0 103.333 0A1.667 1.667 0 0017 12zM10.333 12a1.667 1.667 0 103.334 0 1.667 1.667 0 00-3.334 0zM5.333 13.667a1.667 1.667 0 110-3.333 1.667 1.667 0 010 3.333z"></path></g></svg></button>
                                                                    {
                                                                        cart?.is_cart_modal_clicked && 
                                                                        <div className="cart-item-clear-or-add-modal">
                                                                            <a className="cart-add-item-btn" onClick={() => handleEditItem(index,storeName, cart?.category_slug, cart?.slug)}>
                                                                                <div className="cart-add-item-svg-div">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="cart-add-item-svg">
                                                                                        <path d="m46.84 5.32-4.16-4.16a4 4 0 0 0-5.58 0C1.7 36.55 3.65 34.52 3.53 34.88S3 36.78 0 46.72A1 1 0 0 0 1 48c.21 0 12.08-3.45 12.39-3.68s-2.75 2.79 33.45-33.42a4 4 0 0 0 0-5.58zM35 6.05 42 13l-1.37 1.37-6.97-6.95zM10.45 38.91l-1-.34-.34-1L35 11.61 36.39 13zm21.8-30.08 1.36 1.37L7.79 36l-1.71-1zM3.32 42.67a7.68 7.68 0 0 1 2 2l-2.85.84zm4 1.42a9.88 9.88 0 0 0-3.43-3.43l1.16-3.94 2 1.23c.88 2.62.38 2.08 2.94 2.94l1.23 2zM13 41.92l-1-1.71 25.8-25.82 1.37 1.36zM45.43 9.49l-2.07 2.07-6.92-6.92 2.07-2.07a1.94 1.94 0 0 1 2.75 0l4.17 4.17a1.94 1.94 0 0 1 0 2.75z"/>
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="cart-item-btn-text">
                                                                                    Edit item
                                                                                </div>
                                                                            </a>
                                                                        
                                                                            <li className="cart-remove-item-list" onClick={() => removeItem(index)}>
                                                                                <div className="cart-remove-item-svg-div">
                                                                                    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cart-remove-item-svg">
                                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path>
                                                                                    </svg>
                                                                                </div>
                                                                                
                                                                                <div className="cart-remove-item-btn-text">Remove item</div>
                                                                            </li>
                                                                        </div>
                                                                    }
                                                                    </div>
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className="cjdchkout">
                                                <div className="alddbccheckout">
                                                    <div className="f9checkout">
                                                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c7c6cacbcheckout-pin">
                                                            <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                                                        </svg>
                                                    </div>

                                                    <div className="alamcjdcheckout">
                                                        <span className="bobpdfcvb1checkout">Add promo code</span>
                                                    </div>

                                                    {
                                                        isaddpromocodebtntoggle ?
                                                            <button className="bodgdfdhcheckout-btn" disabled={isappliedbtnactive} onClick={handleFindCouponCode}>Apply</button>
                                                        :
                                                            <button className="bodgdfdhcheckout-btn" onClick={handlePromoCodeToggle}>Add</button>
                                                    }

                                                </div>
                                                {
                                                    isaddpromocodebtntoggle &&
                                                    <div className="btaucheckout-window">
                                                        <input type="text" placeholder="Add promo code...." value={coupon} className="email-checkout" onChange={handleCopuonCode}/>
                                                        <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                                                    </div>
                                                }
                                                <div className="alcheckout">
                                                    <div className="drdsbscjcheckout"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Order Amount Discount */}
                                            {/* {
                                                amountdiscount?.map((discount, index) =>
                                                {
                                                    return(
                                                        (parseFloat(discount?.need_to_spend) >= parseFloat(subtotalOrderAmount)) &&
                                                        <div key={index}>
                                                            <div className="dxc6checkout"></div>
                                                            <p>Spend <strong>{getCountryCurrencySymbol()} {getAmountConvertToFloatWithFixed(discount?.need_to_spend - subtotalOrderAmount,2)}</strong> more to get <strong>{discount?.name}</strong></p>
                                                            <div className="dxc6checkout"></div>
                                                            <div className='drdsbscjcheckout'></div>
                                                        </div>
                                                    )
                                                })
                                            } */}
                                            
                                            <div>
                                                <div className="dxc6checkout"></div>
                                                {amountdiscountmessage}
                                                <div className="dxc6checkout"></div>
                                                <div className='drdsbscjcheckout'></div>
                                            </div>

                                            {/* Order Amount Discount End */}
                                            <div className="dxc6checkout"></div>
                                                {deliverymessage}
                                            
                                            <div className="dxc6checkout"></div>
                                            <div className='drdsbscjcheckout'></div>
                                            <ul>
                                                <li className="bobpcheckout-sutotals">
                                                    <div className="albcaqcheckout">
                                                    <div className="bobpbqbrb1checkout">Subtotal</div>
                                                    </div>
                                                    
                                                    <div className="bobpbqbrb1checkout">
                                                    <span className="">{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(subtotalOrderAmount,2)}</span>
                                                    </div>
                                                </li>
                                                
                                                <li className="dxgvcheck"></li>
                                                
                                                <li className="dxgvcheck"></li>
                                                
                                                <li className="bobpcheckout-sutotals">
                                                    <div className="albcaqcheckout">
                                                        <div className="bobpbqbrb1checkout">Discount</div>
                                                    </div>
                                                    
                                                    <div className="bobpbqbrb1checkout">
                                                        <span className="">({getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(discountvalue,2)})</span>
                                                    </div>
                                                </li>
                                            
                                                <li className="dxgvcheck"></li>
                                                
                                                <li className="bobpcheckout-sutotals">
                                                    <div className="albcaqcheckout">
                                                    <div className="bobpbqbrb1checkout">{selectedFilter?.name}</div>
                                                    </div>
                                                    
                                                    <div className="bobpbqbrb1checkout">
                                                        <span className="">{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(deliveryfee,2)}</span>
                                                    </div>
                                                </li>
                                            </ul>

                                            <div className="bkgfbmggalcheckout">
                                                <div className="albcaqcheckout-total">Total</div>{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed((parseFloat(subtotalOrderAmount) + parseFloat(deliveryfee)) - parseFloat(discountvalue),2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dtcxcybgd0d1checkout">
                                        <div className="bocubqcve9checkout">
                                            <div className="bocubqcvb1checkout">
                                            <span className="bocubqcvgycheckout">
                                                <span className="bocudfdhgy">ALLERGIES:</span> 
                                                If you or someone you’re ordering for has an allergy, please contact the merchant directly to let them know.
                                            </span>
                                            </div>
                                        </div>
                                        <div className="dxgvcheck"></div>

                                        <div className="bocubqcve9checkout">
                                            <div className="bocubqcvb1checkout">
                                                <span className="bocubqcvgycheckout">
                                                    If you’re not around when the delivery person arrives, they’ll leave your order at the door. By placing your order, you agree to take full responsibility for it once it’s delivered. Orders containing alcohol or other restricted items may not be eligible for leave at door and will be returned to the store if you are not available.
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dxgvcheck"></div>

                                        <div className="bocubqcve9checkout">
                                            <div className="bocubqcvb1checkout">
                                                <span className="bocubqcvgycheckout">
                                                    Whilst we, and our restaurant partners, have safety measures to mitigate food safety risk, couriers may be delivering more than one order so we cannot eliminate the risk of cross-contamination from allergens.
                                                </span>
                                            </div>
                                        </div>
                                    <div className="dxgvcheck"></div>
                                    </div>

                                    <div className="">
                                        <div className="akgzcheckout">
                                            <div className="atbaagcheckout">
                                                <div className="">
                                                    {
                                                        isordersubtotallessthanordervalue &&
                                                        <Link className="fwbrbocheckout-place-order" href='/place-order'>Checkout</Link>
                                                    }
                                                    <div style={{height: "10px"}}></div>

                                                    <button className="fwbrbocheckout-add" onClick={handleAddItems} >
                                                        <div className="c7c6crcheckout">
                                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                            <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="currentColor">
                                                                </path>
                                                            </svg>
                                                        </div>
                                                        <div className="spacer _4"></div>
                                                        <div className="bodgdfdhcheckout-add-div">Add items</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        :
                            <div className="cart-content">
                                <img alt="" role="presentation" src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/a023a017672c2488.svg" className="cart-icon" />
                                <span className="cart-span-title-one">Add items to start a cart</span>

                                <span className="cart-span-title-two">Once you add items from a restaurant or store, your cart will appear here.</span>
                                <button className="cart-shopping-start-button" onClick={() => setIscartbtnclicked(false)}>Start shopping</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}