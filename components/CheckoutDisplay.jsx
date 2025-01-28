"use client";
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import HomeContext from "../contexts/HomeContext";
import {
  getAmountConvertToFloatWithFixed,
  getCountryCurrencySymbol,
  setLocalStorage,
} from "../global/Store";
import moment from "moment";
import {
  BRAND_SIMPLE_GUID,
  BRAND_GUID,
  DELIVERY_ID,
  PARTNER_ID,
  axiosPrivate,
} from "../global/Axios";
import { useRouter } from "next/navigation";
import { useGetQueryAutoUpdate, useGetQueryForDeliveryFee } from "./reactquery/useQueryHook";
import { NextResponse } from "next/server";


export default function CheckoutDisplay()
{
  const route = useRouter();
  const {
    setIsCouponCodeApplied,
    loader,
    setLoader,
    storeGUID,
    totalOrderAmountValue,
    setTotalOrderAmountValue,
    selectedFilter,
    storeName,
    cartData,
    setCartData,
    isCartItemDottedBtnClicked,
    isCartFull,
    setIsCartBtnClicked,
    setIsCartItemDottedBtnClicked,
    setIsCheckOutClicked,
    deliveryMatrix,
    postcode,
    postCodeForOrderAmount,
    amountDiscountApplied,
    setAmountDiscountApplied,
    couponDiscountApplied,
    setCouponDiscountApplied,
    websiteModificationData,
  } = useContext(HomeContext);
  
  const [itemIndividuallyUpdate, setItemIndividuallyUpdate] = useState(false)
  const [subtotalOrderAmount, setSubtotalOrderAmount] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  const [deliveryFee, setDeliveryFee] = useState(0);

  const [deliveryMessage, setDeliveryMessage] = useState("");

  const [discountValue, setDiscountValue] = useState(0);

  const [amountDiscountMessage, setAmountDiscountMessage] = useState("");
  // Boolean States
  const [isAddPromoCodeBtnToggle, setIsAddPromoCodeBtnToggle] = useState(false);
  const [ isOrderSubtotalLessThanOrderValue, setIsOrderSubtotalLessThanOrderValue] = useState(true);
  // Coupon Code States
  const [coupon, setCoupon] = useState("");
  const [isAppliedBtnActive, setIsAppliedBtnActive] = useState(true);
  
  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [couponCodeError, setCouponCodeError] = useState("")

  const asideRef = useRef(null);

  // Function to close the canvas if clicked outside the aside
  const handleClickOutside = (event) => {
    if (asideRef.current && !asideRef.current.contains(event.target)) {
      setIsCartBtnClicked(false)
    }
  };
  
  // Adding event listener when the component mounts
  useEffect(() => {
  
    window.document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup the event listener on unmount
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function getOrderAmount(subTotalArgument)
  {
    try {
      const filterData = {
        endData: moment().format("YYYY-MM-DD"),
        active: 1,
        partner: 2,
        brand: BRAND_GUID,
        postcode: postCodeForOrderAmount,
      };

      const response = await axiosPrivate.post(`/apply-amount-discount`,filterData);
      const amountDiscounts = response?.data?.data?.applyAmountDiscount;
      let workingIndex = 0;

      if (parseInt(amountDiscounts.length) > parseInt(0)) 
      {
        // Stage - I get the Index.
        for (let index = 0; index < parseInt(amountDiscounts.length); index++) 
        {
          if ( parseInt(subTotalArgument) >= parseInt(amountDiscounts[index]?.need_to_spend)) 
          {
            if (parseInt(subTotalArgument) >=parseInt(amountDiscounts[++index]?.need_to_spend)) 
            {
              workingIndex = ++index;
              break;
            } 
            else 
            {
              workingIndex = index;
              break;
            }
          }
        }

        // Stage - II match the index and get related data.
        if (amountDiscounts[workingIndex] === undefined) 
        {
          workingIndex -= 1;
        }

        if (parseInt(subTotalArgument) >= parseInt(amountDiscounts[workingIndex].need_to_spend)) 
        {
          setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,amountDiscounts[workingIndex].amount_guid);
          setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`,amountDiscounts[workingIndex])
          setAmountDiscountApplied(amountDiscounts[workingIndex])
          if (amountDiscounts[workingIndex].discount_type === "P") 
          {
            const getThePercentage = amountDiscounts[workingIndex].value / 100;
            const getDiscount = parseFloat(subTotalArgument) * parseFloat(getThePercentage);
            setDiscountValue(getAmountConvertToFloatWithFixed(getDiscount, 2));
          } 
          else 
          {
            const getDiscount = parseFloat(subTotalArgument) - parseFloat(amountDiscounts[workingIndex].value);
            setDiscountValue(getAmountConvertToFloatWithFixed(getDiscount, 2));
          }
        } 
        else 
        {
          const getAmountDiscountDifference = parseInt(subTotalArgument) >= parseInt(amountDiscounts[workingIndex].need_to_spend) ? parseFloat(subTotalArgument) - parseFloat(amountDiscounts[workingIndex].need_to_spend) : parseFloat(amountDiscounts[workingIndex].need_to_spend) - parseFloat(subTotalArgument);
          const amountText = (
            <span>Spend <strong>&pound;{parseFloat(getAmountDiscountDifference).toFixed(2)}</strong> more to get &nbsp;
              <strong>
                {amountDiscounts[workingIndex].discount_type === "M" &&
                  getCountryCurrencySymbol()}
                {amountDiscounts[workingIndex].value}
                {amountDiscounts[workingIndex].discount_type === "P" && "%"} off
              </strong>
            </span>
          );
          setAmountDiscountMessage(amountText);
          setDiscountValue(0);
        }
      }
    } catch (error) {
      window.alert("There is something went wrong, please refresh and try again.")
    }
  };

  // const [selectedIdPostcode, setSelectedIdPostcode] = useState({
  //     selectedPostcode: "",
  //     selectedLocation: 0
  // });

  const onDeliveryError = (error) => {}

  const onDeliverySuccess = (data) => {

    const {deliveryMatrix} = data?.data
    
    const selectedMatrix = deliveryMatrix?.delivery_matrix_rows?.[0]
    let totalValue = 0;

    for (const total of cartData) 
    {
      totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount);
    }
    setLocalStorage(`${BRAND_SIMPLE_GUID}sub_order_total_local`,JSON.stringify(getAmountConvertToFloatWithFixed(totalValue, 2)));
    setSubtotalOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));
    
    if (selectedFilter?.id === DELIVERY_ID) 
    {
      if (parseFloat(totalValue) >= parseFloat(selectedMatrix?.order_value)) 
      {
        if (selectedMatrix?.above_order_value === null || selectedMatrix?.above_order_value === 0) 
        {
          const textMessage = <strong>Free Delivery</strong>;
          setDeliveryMessage(textMessage);
          const fee = getAmountConvertToFloatWithFixed(0, 2);
          setDeliveryFee(fee);
        } 
        else 
        {
          setDeliveryMessage("");
          const fee = getAmountConvertToFloatWithFixed(selectedMatrix?.above_order_value,2);
          setDeliveryFee(fee);
          setIsOrderSubtotalLessThanOrderValue(true)
        }

        if (parseInt(selectedMatrix?.delivery_matrix_row_values?.length) > parseInt(0)) 
        {
          for (const deliveryMatrixRowValues of selectedMatrix?.delivery_matrix_row_values) 
          {
            // Min order value is greater than totalValue then.
            if (parseFloat(totalValue) >= parseFloat(deliveryMatrixRowValues?.min_order_value)) 
            {
              if (deliveryMatrixRowValues?.above_minimum_order_value === null || deliveryMatrixRowValues?.above_minimum_order_value === 0)  
              {
                const textMessage = <strong>Free Delivery</strong>;
                setDeliveryMessage(textMessage);
                const fee = getAmountConvertToFloatWithFixed(0, 2);
                setDeliveryFee(fee);
              } 
              else 
              {
                const textMessage = <strong>Free Delivery</strong>;
                setDeliveryMessage((deliveryMatrixRowValues?.above_minimum_order_value === 0) ? "" : textMessage);

                const fee = parseFloat(deliveryMatrixRowValues?.above_minimum_order_value).toFixed(2);
                setDeliveryFee(fee);
              }
            } 
            // else 
            // {
            //   const getDifference = parseFloat(deliveryMatrixRowValues?.min_order_value) - parseFloat(totalValue);
            //   const textMessage = (<span> Spend &nbsp; <strong>&pound;{parseFloat(getDifference).toFixed(2)}</strong> &nbsp; more to get &nbsp;  <strong>Free Delivery</strong></span>);
            //   setDeliveryMessage(textMessage);

            //   const fee = getAmountConvertToFloatWithFixed(deliveryMatrixRowValues?.below_minimum_order_value === null ? deliveryMatrixRowValues?.above_minimum_order_value : deliveryMatrixRowValues?.below_minimum_order_value,2);
            //   setDeliveryFee(fee);
            // }
          }
        }
      } else {
        const textMessage = (
          // <span style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",}}>
          <span style={{color: "red"}}>
            Minimum order is <strong>&pound;{getAmountConvertToFloatWithFixed(selectedMatrix.order_value,2)}</strong> to your postcode
          </span>
        );
        setDeliveryMessage(textMessage);
        const fee = getAmountConvertToFloatWithFixed(selectedMatrix?.below_order_value === null ? selectedMatrix?.above_order_value : selectedMatrix?.below_order_value,2);
        setDeliveryFee(fee);
        setIsOrderSubtotalLessThanOrderValue(false);
      }
    } 
    else 
    {
      setDeliveryFee(0);
      setIsOrderSubtotalLessThanOrderValue(true);
    }

    setTotalOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));
    if(parseInt(couponDiscountApplied.length) == parseInt(0))
    {
      getOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));
    }
    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`, cartData);
  }

  // const districtPostcode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
  // const selectedPostcode = districtPostcode?.postcode

  // const userLocation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
  // const selectedLocation = userLocation?.display_id

  const {refetch: deliveryRefetch} = useGetQueryForDeliveryFee('district-delivery-matrix-data',`/district-delivery-matrix/${selectedLocation}/${selectedPostcode}`,onDeliverySuccess, onDeliveryError)

  
  useEffect(() => {
   
    if(parseInt(cartData?.length) > parseInt(0))
    {
      const districtPostcode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
      setSelectedPostcode(districtPostcode?.postcode)
      
      const userLocation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
      setSelectedLocation(userLocation?.display_id)
    }
    setItemIndividuallyUpdate(false)
    // setLoader(false)
  }, [cartData]);

  useEffect(() => {
    if(parseInt(selectedLocation.length) > parseInt(0) && parseInt(selectedPostcode.length) > parseInt(0))
    {
      deliveryRefetch()
    }
  },[selectedLocation, selectedPostcode]);

  function handlePromoCodeToggle() 
  {
    setIsAddPromoCodeBtnToggle(!isAddPromoCodeBtnToggle);
  }
  
  function handleCheckoutBtn() 
  {
    setIsCheckOutClicked(true);
  }
  
  function handleAddItems() 
  {
    route.push("/");
    setIsCartBtnClicked(false);
  }

  function handleDotedBtn(id) 
  {
    const updateIsCartModalFlag = cartData?.map((cart, index) => 
    {
      if (id === index) 
      {
        return {
          ...cart,
          is_cart_modal_clicked: !cart?.is_cart_modal_clicked,
        };
      }
      return cart;
    });

    setCartData(updateIsCartModalFlag);
  }

  function removeItem(id) 
  {
    const filterItems = cartData?.filter((cart, index) => index !== id);
    if(parseInt(filterItems.length) === parseInt(0))
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, [])
      setCouponDiscountApplied([])
    }

    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,filterItems)
    setCartData(filterItems);
    deliveryRefetch()
  }

  // Handle Coupon Code functionality
  function handleCouponCode(event) 
  {
    setCoupon(event.target.value);
    setIsAppliedBtnActive(false);
    setCouponCodeError("")
  }

  async function handleFindCouponCode() 
  {
    // setIsAddPromoCodeBtnToggle(!isAddPromoCodeBtnToggle);
    setLoader(true)
    const checkCouponCodeIsAlreadyApplied = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))

    if(parseInt(checkCouponCodeIsAlreadyApplied.length) > parseInt(0))
    {
      const findMatchCouponCode = checkCouponCodeIsAlreadyApplied?.filter((check) => check.code.includes(coupon))
      if(parseInt(findMatchCouponCode.length) > parseInt(0))
      {
        setCouponCodeError("Code already applied!")
        setLoader(false)
        return
      }
      else if(checkCouponCodeIsAlreadyApplied[0].user_in_conjuction === 0)
      {
        setCouponCodeError("You can not use other coupons with previous one!")
        setLoader(false)
        return
      }
    }

    try {
      const data = {
        coupon:   coupon,
        brand:    BRAND_GUID,
        partner:  PARTNER_ID,
        location: storeGUID,
      };
      const response = await axiosPrivate.post(`/apply-coupon`, data);

      // const updateCouponToggle = response?.data?.data?.coupon?.map((coupon) =>
      // {
      //   return{
      //     ...coupon,
      //     is_coupon_remove: false
      //   }
      // })
      
      if(response?.data?.data?.coupon === null)
      {
        setCouponCodeError("Coupon has expired")
        setLoader(false)
        return
      }
      const couponData = response?.data?.data?.coupon

      const getCouponCodeFromSession = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))
      
      let discountedCoupon = 0;
      if(couponData?.discount_type === "P")
      {
        if(couponData?.user_in_conjuction === 0)
        {
          discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) * (couponData?.value / 100),2)
        }
        else
        {
          if(parseInt(getCouponCodeFromSession.length) > parseInt(0))
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(totalOrderAmountValue - deliveryFee) * (couponData?.value / 100),2)
          }
          else
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) * (couponData?.value / 100),2)
          }
        }
      }
      else if(couponData?.discount_type === "M")
      {
        if(couponData?.user_in_conjuction === 0)
        {
          discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) - parseFloat(couponData?.value),2)
        }
        else
        {
          if(parseInt(getCouponCodeFromSession.length) > parseInt(0))
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(totalOrderAmountValue - deliveryFee) - (couponData?.value),2)
          }
          else
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) - parseFloat(couponData?.value0),2)
          }
        }
      }
      
      
      const totalOrderAmountValueUpdate = parseFloat(totalOrderAmountValue) - parseFloat(discountedCoupon)
      setTotalOrderAmountValue(getAmountConvertToFloatWithFixed(totalOrderAmountValueUpdate,2))

      const updateCouponToggle = {
        ...couponData,
        is_coupon_remove: false,
        discount: discountedCoupon
      }

      if(updateCouponToggle?.user_in_conjuction === 0)
      {
        // console.warn("User conjuction 0:", updateCouponToggle?.user_in_conjuction);
        setCouponDiscountApplied([])
        setCouponDiscountApplied((prevData) => [...prevData, updateCouponToggle])
      }
      else
      {
        // console.warn("User conjuction 1:", updateCouponToggle?.user_in_conjuction);
        setCouponDiscountApplied((prevData) => [...prevData, updateCouponToggle])
      }
      
      if(updateCouponToggle?.free_delivery === 1)
      {
        setDeliveryFee(0)
      }
      setAmountDiscountApplied(null)
      setIsAppliedBtnActive(true)
      setCoupon("")
      setIsAddPromoCodeBtnToggle(false)
      
      setTimeout(() => {
        setLoader(false)
      }, 3000);
      setIsCouponCodeApplied(true)
    } catch (error) {
      console.warn("Coupon data Error:", error);
      setCouponCodeError(error?.response?.data?.message)
    }
  }
  
  useEffect(() => {

    setLocalStorage(`${BRAND_SIMPLE_GUID}total_order_value_storage`,getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) +parseFloat(deliveryFee) -parseFloat(discountValue),2));
    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,getAmountConvertToFloatWithFixed(deliveryFee, 2));

    // {getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) + parseFloat(deliveryFee) - parseFloat(discountValue),2)}

    setTotalOrderAmountValue(getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) +parseFloat(deliveryFee) -parseFloat(discountValue),2));
  }, [subtotalOrderAmount, deliveryFee, discountValue]);

  useEffect(() => {
    setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, couponDiscountApplied)
    if(parseInt(couponDiscountApplied.length) > parseInt(0))
    {
      let couponDiscountValue = 0
      for(let couponDiscount of couponDiscountApplied)
      {
        couponDiscountValue += parseFloat(couponDiscount?.discount)
        if(couponDiscount.free_delivery === 1)
        {
          setDeliveryFee(0)
        }
      }
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,null)
      setAmountDiscountApplied(null)
      setDiscountValue(getAmountConvertToFloatWithFixed(couponDiscountValue,2))
    }
  }, [couponDiscountApplied])
    
  // function handleEditItem(findByIndex, storeName, categorySlug, itemSlug) 
  // {
  //   setLoader(true)
  //   setLocalStorage(`${BRAND_SIMPLE_GUID}set_index`, findByIndex);
  //   setIsCartBtnClicked(false);
  //   route.push(`/${storeName}/${categorySlug}/${itemSlug}/edit`);
  //   return
  // }

  function handleCouponRemoveToggleBtn(indexNumber)
  {
    const openCouponToggle = couponDiscountApplied?.map((coupon,index) =>
    {
      if(parseInt(indexNumber) === parseInt(index))
      {
        return{
          ...coupon,
          is_coupon_remove: !coupon?.is_coupon_remove
        }
      }
      return coupon
    })
    setCouponDiscountApplied(openCouponToggle)
  }

  function handleDeleteCouponCode(id)
  {
    const removeCoupon = couponDiscountApplied?.filter((filterCoupon) => filterCoupon?.id !== id)
    setCouponDiscountApplied(removeCoupon)

    const removeFromSessionTooo = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))
    const removeFromSessionToooCoupon = removeFromSessionTooo?.filter((sessionCoupon) => sessionCoupon?.id !== id)
    setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`,removeFromSessionToooCoupon)
    if(parseInt(removeCoupon.length) === parseInt(0))
    {
      const getTotalOrderValue = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`))
      getOrderAmount(JSON.parse(getTotalOrderValue))
    }
  }

  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
    
  return(
    <div className="display-cart scrollable-container" style={{ maxHeight: '85vh', minHeight: '76vh', overflowY: 'auto'}}>
      {
        cartData?.length > 0 &&
        <div className="receipt-menu">
          <h5>My Order</h5>

          <div style={{ maxHeight: '60vh', minHeight: '40vh', overflowY: 'auto', marginTop: '0px' }}>

            <div className="column">
              <ul className="order-li-head">
                <li className="order-header">
                    <div className="order-header-div">

                    <div className="col-1">Items</div>
                    <div className="col-2">Price</div>
                    <div className="col-3"></div>

                    </div>
                </li>
              </ul>

              <ul className="order-detail-ul">
                {/* <li className="order-detail-li">
                    <div className="col-1">
                    
                        <div className="order-detail-div">
                            <div className="or-cat-name"><b>1 x </b> Burgers: </div>
                            <div className="or-pro-name">1 x Nashville Chicken Burger</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name"><b>1 x </b> Deal: </div>
                            <div className="or-pro-name">1 x Make a deal - U</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name">Dips:</div>
                            <div className="or-pro-name">1 x Code 8 hot sauce</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name">Desserts:</div>
                            <div className="or-pro-name">1 x Chocolate Cookie Dough with White Chips</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name"></div>
                            <div className="or-pro-name">1 x Signature Hot Sauce + £1.00</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name"></div>
                            <div className="or-pro-name">Extra Cheese Slice + &pound;0.50</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name"></div>
                            <div className="or-pro-name">No Lettuce</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name">Sides:</div>
                            <div className="or-pro-name">Regular Fries</div>
                        </div>

                        <div className="order-detail-div">
                            <div className="or-cat-name">Soft Drinks:</div>
                            <div className="or-pro-name">Water 500ml</div>
                        </div>

                    </div>

                    <div className="col-2">£<span className="productPrice0">12.85</span></div>
                    <div className="col-3 removeProduct" data-index="0"><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cw-cx-bj-bk-del"><path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path></svg></div>

                </li> */}

                {
                  cartData?.map((data, index) => {
                    return(
                      <li key={index} className="order-detail-li">
                        {/* <a href={`/${storeName?.toLowerCase()}/${data?.category_slug}/${data?.slug}/edit`}> */}
                            {/* <div className="col-1" style={{cursor: "pointer"}} onClick={() => route.push(`/${storeName?.toLowerCase()}/${data?.category_slug}/${data?.slug}/edit`)}> */}
                            <div className="col-1">
                              <a href={`/${storeName?.toLowerCase()}/${data?.category_slug}/${data?.slug}/edit`}>
                                <div className="order-detail-div">
                                  <div className="or-cat-name"><b>{parseInt(data?.quantity)} x </b> {data?.category_name}: </div>
                                  <div className="or-pro-name">{parseInt(data?.quantity)} x {data?.title}</div>
                                </div>

                                {/* Display Modifiers */}
                                {
                                  parseInt(data?.modifier_group?.length) > parseInt(0) &&
                                  data?.modifier_group?.map((modifier, modifierIndex) => (
                                    // This condition check the modifier is selected and modifier item length is greater than zero.
                                    (modifier?.is_modifier_selected && parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0)) &&
                                    modifier?.modifier_secondary_items?.map((secondItem, secondItemIndex) => {
                                      return(
                                        (!secondItem?.default_option && secondItem?.item_select_to_sale) &&
                                        
                                        <Fragment>
                                          <div key={`${index}.${modifierIndex}.${secondItemIndex}`} className="order-detail-div">
                                            <div className="or-cat-name">{`${modifier?.title} :`}</div>

                                            <div className="or-pro-name">{modifier?.select_single_option > 1 && modifier?.max_permitted >= 1 ? parseInt(secondItem?.counter) + " x ": ""} {secondItem?.title} {parseInt(secondItem?.price) > parseInt(0) ? `+ ${secondItem?.country_price_symbol}${parseFloat(secondItem?.price).toFixed(2)}`: ""}</div>
                                          </div>
                                          {
                                            // Secondary Modifiers with the items
                                            (parseInt(secondItem?.secondary_item_modifiers?.length) > parseInt(0)) && 
                                            secondItem?.secondary_item_modifiers?.map((secModifier, secModifierIndex) => {
                                                return(
                                                    (secModifier?.is_modifier_selected && parseInt(secModifier?.secondary_items_modifier_items?.length) > parseInt(0)) &&

                                                    secModifier?.secondary_items_modifier_items?.map((secItem, secItemIndex) => {
                                                        return(
                                                            secItem?.item_select_to_sale && 
                                                            <div key={`${index}.${modifierIndex}.${secondItemIndex}.${secModifierIndex}.${secItemIndex}`} className="order-detail-div">
                                                                <div className="or-cat-name">{secModifier.isExtras ? `${modifier?.title} :` : ""}</div>

                                                                <div className="or-pro-name">{secModifier?.select_single_option > 1 && secModifier?.max_permitted >= 1 ? parseInt(secItem?.counter) + " x ": ""} {secItem?.title} {parseInt(secItem?.price_info) > parseInt(0) ? `+ ${secItem?.country_price_symbol}${parseFloat(secItem?.price_info).toFixed(2)}`: ""}</div>
                                                            </div>
                                                        )
                                                    })

                                                )
                                            })
                                          }
                                        </Fragment>
                                      )
                                    })
                                  ))
                                }
                              </a>
                            </div>

                            <div className="col-2" style={{cursor: "pointer"}} onClick={() => route.push(`/${storeName?.toLowerCase()}/${data?.category_slug}/${data?.slug}/edit`)}>&pound;<span className="productPrice0">{parseFloat(data?.total_order_amount).toFixed(2)}</span></div>
                            <div style={{cursor: "pointer"}} onClick={(() => removeItem(index))} className="col-3 removeProduct" data-index="0"><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cw-cx-bj-bk-del"><path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path></svg></div>
                        {/* </a> */}
                      </li>
                    )   
                  })
                }
              </ul>
            </div>
          
          </div>

          <div className="coupon-more" style={{marginTop: "2vh"}}>
            <div>
              {/* <p >Spend &pound;7.15 more to get 10% off.</p> */}
              <p>{amountDiscountMessage}</p>
            </div>

            <div>
              <div className="input-btn-gather">
                <input type="text" name="" id="" value={coupon} onChange={handleCouponCode}  placeholder="Enter Discount Code"/>
                <button type="button" className="apply-coupon-btn" onClick={handleFindCouponCode}>Apply</button>
              </div>
              {
                couponCodeError !== "" &&
                <p style={{color: "red",}}>{couponCodeError}</p>
              }
            </div>
          
          </div>

          <div className="coupon-more">
            <div>
              {/* <p> <b>Free Delivery</b></p> */}
              <p>{deliveryMessage}</p>
            </div>

            <div>
              <div className="order-detail-checkout">
                <div className="checkout-detail-text">Subtotal</div>
                <div className="checkout-detail-price">&pound;<span>{getAmountConvertToFloatWithFixed(subtotalOrderAmount,2)}</span></div>
              </div>

              <div className="order-detail-checkout">
                <div className="checkout-detail-text">{selectedFilter?.name}</div>
                <div className="checkout-detail-price">&pound;{getAmountConvertToFloatWithFixed(deliveryFee, 2)}</div>
              </div>

              <div className="order-detail-checkout">
                <div className="checkout-detail-text">Discount</div>
                <div className="checkout-detail-price">(&pound;<span>{getAmountConvertToFloatWithFixed(discountValue,2)}</span>)</div>
              </div>

              <div className="order-detail-checkout">
                <div className="checkout-detail-text"><strong>Total</strong></div>
                <div className="checkout-detail-price"><strong>&pound;{totalOrderAmountValue}</strong></div>
              </div>
                
            </div>

          </div>
          
          <a
            // type="button" 
            className={` ${!isOrderSubtotalLessThanOrderValue ? "checkout-btn-not-clickable" : "checkout-btn"}`} 
            // disabled={!isOrderSubtotalLessThanOrderValue}  onClick={() => route.push('/place-order')} 
            aria-disabled={!isOrderSubtotalLessThanOrderValue}
            href='/place-order'
          >
              Checkout
            </a>
          <div style={{marginBottom: "50px"}}></div>

        </div>
      }
    </div>
  )
}
