"use client";
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import HomeContext from "../contexts/HomeContext";
import Link from "next/link";
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
  IMAGE_URL_Without_Storage,
  PARTNER_ID,
  axiosPrivate,
} from "../global/Axios";
import { useRouter } from "next/navigation";
import { useGetQueryAutoUpdate } from "./reactquery/useQueryHook";

export default function Cart() {
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
            <span>Spend &nbsp; <strong>&pound;{parseFloat(getAmountDiscountDifference).toFixed(2)}</strong> &nbsp; more to get &nbsp;
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

  useEffect(() => {

    if (parseInt(cartData?.length) > parseInt(0)) {
      // Calculate Items Total Order Value.
      deliveryRefetch()
    }
    setItemIndividuallyUpdate(false)
    // setLoader(false)
  }, [cartData]);

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
          <span style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",}}>
            Minimum order is &nbsp; <strong>&pound;{getAmountConvertToFloatWithFixed(selectedMatrix?.order_value,2)}</strong> &nbsp; to your postcode
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

  const districtPostcode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))

  const selectedPostcode = districtPostcode?.postcode

  const userLocation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
  const selectedLocation = userLocation?.display_id
  const {refetch: deliveryRefetch} = useGetQueryAutoUpdate('district-delivery-matrix-data',`/district-delivery-matrix/${selectedLocation}/${selectedPostcode}`,onDeliverySuccess, onDeliveryError, false)

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
      // console.warn("Error:", error);
    }
  }

  useEffect(() => {

    setLocalStorage(`${BRAND_SIMPLE_GUID}total_order_value_storage`,getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) +parseFloat(deliveryFee) -parseFloat(discountValue),2));
    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,getAmountConvertToFloatWithFixed(deliveryFee, 2));

    // {getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) + parseFloat(deliveryFee) - parseFloat(discountValue),2)}

    setTotalOrderAmountValue(getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) +parseFloat(deliveryFee) -parseFloat(discountValue),2)
    );
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

  const decrementQuantity = (index) =>
  {
    setItemIndividuallyUpdate(true)
    const updateCartQuantity = cartData?.map((deccartItemQuantity,indexcartItem) =>
    {
      if(parseInt(index) === parseInt(indexcartItem))
      {
        return{
          ...deccartItemQuantity,
          quantity: deccartItemQuantity.quantity - 1,
          total_order_amount: parseFloat(deccartItemQuantity.quantity - 1) * parseFloat(deccartItemQuantity.price_total_without_quantity)
        }
      }

      return deccartItemQuantity
    })
    
    setCartData(updateCartQuantity)
  }

  const incrementQuantity = (index) =>
  {
    setItemIndividuallyUpdate(true)
    const updateCartQuantity = cartData?.map((inccartItemQuantity,indexcartItem) =>
    {
      if(parseInt(index) === parseInt(indexcartItem))
      {
        return{
          ...inccartItemQuantity,
          quantity: inccartItemQuantity.quantity + 1,
          total_order_amount: parseFloat(inccartItemQuantity.quantity + 1) * parseFloat(inccartItemQuantity.price_total_without_quantity)
        }
      }

      return inccartItemQuantity
    })

    setCartData(updateCartQuantity)
  }

  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };
  
  return (
    <div className="cart-level-one-div">
      <div className="cart-level-one-div-screen-one"></div>
      <div className="cart-level-one-div-screen-two" ref={asideRef}>
        <div className="cart jp">
          <div className="cart-close-btn-div-level-one">
            <button className="cart-close-btn" onClick={() => setIsCartBtnClicked(false)}>
              <div className="cart-close-btn-div">
                <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" fill={websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor} ></path>
                </svg>
              </div>
            </button>
          </div>
          {/* {
            parseInt(cartData?.length) > parseInt(0) ?
            <div className="afCart">
              <div className="">
                <div className="dtCx-Cy-Cz-D-0-d1-Checkout">
                  <div className="alaqcheckout">
                    <h3 className="dualbcheckout-order-summary">
                      <span className="cjcheckout">My Order</span>
                    </h3>
                  </div>
                  <div className="cart-header">
                    <div className="cid3ckd4d1">items</div>
                    <div className=""></div>
                    <div className="cart-price-header">Price</div>
                    <div className=""></div>
                  </div>  

                  <div className="ex-cart-width"></div>
                  <ul>
                    {
                      cartData?.map((cartItem,indexItem) =>
                      {
                        return(
                          <Fragment  key={indexItem}>
                            <li className="bl-mc-cart-item-display">
                              <div className="cart-qty-item">
                                <a className="c3-ci-c5-ch-fe-cart-item-display" href={`/${storeName?.toLowerCase()}/${cartItem?.category_slug}/${cartItem?.slug}/edit`}>{cartItem?.quantity} x {cartItem?.category_name}</a>

                                <a className="cart-item-with-modifiers" href={`/${storeName?.toLowerCase()}/${cartItem?.category_slug}/${cartItem?.slug}/edit`}>
                                  <div className="cart-item-title">{cartItem?.quantity} x {cartItem?.title}</div>
                                  <ul className="ib-cv-cart-item-display">
                                    {
                                      cartItem?.modifier_group?.map((modifier,indexItemModifier) =>
                                      {
                                          if(modifier?.select_single_option === 1 && modifier?.max_permitted === 1){
                                            return modifier?.modifier_secondary_items?.map((secondItem,indexSecondItem) =>
                                            {
                                              return(
                                                (secondItem?.item_select_to_sale && modifier?.defaultOption === false) &&
                                                <Fragment key={indexItem + indexItemModifier + indexSecondItem}>
                                                  <div >
                                                    <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{modifier?.title}: </span>
                                                    <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondItem?.title} {parseInt(secondItem?.price) > parseInt(0) && `(${secondItem?.country_price_symbol}${parseFloat(secondItem?.price).toFixed(2)})`}</span>
                                                  </div>
                                                  {
                                                    secondItem?.secondary_item_modifiers?.map((secondModifier,indexSecondModifier) =>
                                                    {
                                                      return secondModifier?.secondary_items_modifier_items?.map((secondNestItems, indexSecondNestItem) =>
                                                      {
                                                        if(secondModifier?.select_single_option === 1 && secondModifier?.max_permitted === 1)
                                                        {
                                                          return(
                                                            secondNestItems?.item_select_to_sale &&
                                                            <div key={indexItem + indexItemModifier + indexSecondItem + indexSecondModifier + indexSecondNestItem}>
                                                              <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondModifier?.title}: </span>
                                                              <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondNestItems?.title} {parseInt(secondNestItems?.price) > parseInt(0) && `(${secondNestItems?.country_price_symbol}${parseFloat(secondNestItems?.price_info).toFixed(2)})`}</span>
                                                            </div>
                                                          )
                                                        }
                                                        else if(secondModifier?.select_single_option === 1 && secondModifier?.max_permitted > 1)
                                                        {
                                                          return(
                                                            secondNestItems?.item_select_to_sale &&
                                                            <div key={indexItem + indexItemModifier + indexSecondItem + indexSecondModifier + indexSecondNestItem}>
                                                              <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondModifier?.title}: </span>
                                                              <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondNestItems?.title} {parseInt(secondNestItems?.price) > parseInt(0) && `(${secondNestItems?.country_price_symbol}${parseFloat(secondNestItems?.price_info).toFixed(2)})`}</span>
                                                            </div>
                                                          )
                                                        }
                                                        else if(secondModifier?.select_single_option > 1 && secondModifier?.max_permitted >= 1)
                                                        {
                                                          return(
                                                            parseInt(secondNestItems?.counter) > parseInt(0) &&
                                                            <div key={indexItem + indexItemModifier + indexSecondItem + indexSecondModifier + indexSecondNestItem}>
                                                              <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{parseInt(secondNestItems?.counter)} x {secondModifier?.title}: </span>
                                                              <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondNestItems?.title} {parseFloat(secondNestItems?.price).toFixed(2) > parseFloat(0).toFixed(2) && `(${secondNestItems?.country_price_symbol}${parseFloat(secondNestItems?.counter * secondNestItems?.price_info).toFixed(2)})`}</span>
                                                            </div>
                                                          )
                                                        }
                                                      })
                                                    })
                                                  }
                                                </Fragment>
                                              )
                                            })
                                          }
                                          else if(modifier?.select_single_option === 1 && modifier?.max_permitted > 1)
                                          {
                                            return modifier?.modifier_secondary_items?.map((secondItem,indexSecondItem) =>
                                            {
                                              return(
                                                (secondItem?.item_select_to_sale && modifier?.defaultOption === false) &&
                                                <Fragment key={indexItem + indexItemModifier + indexSecondItem}>
                                                  <div >
                                                    <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{modifier?.title}: </span>
                                                    <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondItem?.title} {parseInt(secondItem?.price) > parseInt(0) && `(${secondItem?.country_price_symbol}${parseFloat(secondItem?.price).toFixed(2)})`}</span>
                                                  </div>
                                                  {
                                                    secondItem?.secondary_item_modifiers?.map((secondModifier,indexSecondModifier) =>
                                                    {
                                                      return secondModifier?.secondary_items_modifier_items?.map((secondNestItems, indexSecondNestItem) =>
                                                      {
                                                        return(
                                                          secondNestItems?.item_select_to_sale &&
                                                          <div key={indexItem + indexItemModifier + indexSecondItem + indexSecondModifier + indexSecondNestItem}>
                                                            <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondModifier?.title}: </span>
                                                            <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondNestItems?.title} {parseInt(secondNestItems?.price) > parseInt(0) && `(${secondNestItems?.country_price_symbol}${parseFloat(secondNestItems?.price).toFixed(2)})`}</span>
                                                          </div>
                                                        )
                                                      })
                                                    })
                                                  }
                                                </Fragment>
                                              )
                                            })
                                          }
                                          else if(modifier?.select_single_option > 1 && modifier?.max_permitted >= 1)
                                          {
                                           return modifier?.modifier_secondary_items?.map((secondItem,indexSecondItem) =>
                                            {
                                              return(
                                                secondItem?.item_select_to_sale &&
                                                <Fragment key={indexItem + indexItemModifier + indexSecondItem}>
                                                  <div >
                                                    <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{parseInt(secondItem?.counter)} x {modifier?.title}: </span>
                                                    <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondItem?.title} {parseInt(secondItem?.price) > parseInt(0) && `(${secondItem?.country_price_symbol}${parseFloat(secondItem?.counter * secondItem?.price).toFixed(2)})`}</span>
                                                  </div>
                                                  {
                                                    secondItem?.secondary_item_modifiers?.map((secondModifier,indexSecondModifier) =>
                                                    {
                                                      return secondModifier?.secondary_items_modifier_items?.map((secondNestItems, indexSecondNestItem) =>
                                                      {
                                                        return(
                                                          secondNestItems?.item_select_to_sale &&
                                                          <div key={indexItem + indexItemModifier + indexSecondItem + indexSecondModifier + indexSecondNestItem}>
                                                            <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondModifier?.title}: </span>
                                                            <span className="fd-fe-ff-c3-c4-cg-ch-j9-cart-item-display">{secondNestItems?.title} {parseInt(secondNestItems?.price) > parseInt(0) && `(${secondNestItems?.country_price_symbol}${parseFloat(secondNestItems?.price).toFixed(2)})`}</span>
                                                          </div>
                                                        )
                                                      })
                                                    })
                                                  }
                                                </Fragment>
                                              )
                                            })
                                          }
                                      })
                                    }
                                  </ul>
                                </a>
                                

                                <div className="md-cart-item-display">
                                  &pound;{parseFloat(cartItem?.total_order_amount)?.toFixed(2)}
                                </div>
                                
                                <div className="cart-delete-btn">
                                  <button className="ec-br-bo-c1-by-fc-en-al-bc-cm-af-eo-df-fd-de-fe-ff-fg-fh-fi-fj-del" onClick={() => removeItem(indexItem)}>
                                    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cw-cx-bj-bk-del"><path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path></svg>
                                  </button>
                                </div>

                              </div>
                            </li>
                            <div className="ex-cart-width"></div>
                          </Fragment>
                        )
                      })
                    }
                    {
                      amountDiscountApplied !== null &&
                      <>
                        <li className="bl-mc-cart-item-display">
                          <div className="cart-qty-item">
                            <div className="c3-ci-c5-ch-fe-cart-item-display">Amount Discount:</div>
                            
                            <div className="cart-item-with-modifiers">
                              <div className="cart-item-title">{amountDiscountApplied?.name}</div>
                              <ul></ul>
                            </div>
                            

                            <div className="md-cart-item-display">
                              -&pound;{getAmountConvertToFloatWithFixed(subtotalOrderAmount * (amountDiscountApplied.value / 100),2)}
                            </div>
                            <div className="cart-delete-btn">
                            </div>
                          </div>
                        </li>
                        <div className="ex-cart-width"></div>
                      </>
                    }
                    {
                      couponDiscountApplied?.map((coupon, index) => {
                        return(
                          <div className="es-et-checkout" key={index}>
                            <a className="al-d5-eg-bh-dd-et-eu-d1-checkout-edit-item d1">
                              <div className="bo-dg-df-checkout-amountDiscount">
                                Discount:
                              </div>
                              <div className="al-am-cj-ew-checkout">
                                <span className="bo-bp-df-cv-checkout-item-header">{coupon?.name}</span>
                              </div>
                              <div className="f1-al-am-checkout-item-qty">
                                <span className="gy-e2-gz-checkout-item-qty-span">-(&pound;{getAmountConvertToFloatWithFixed(coupon.discount,2)})</span>
                              </div>
                            </a>

                            <div className="checkout-item-edit-delete">
                              <button className="cart-header-dotted-btn cp" onClick={() => handleCouponRemoveToggleBtn(index)}>
                                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" style={{ transform: "rotate(90deg)" }} className="c8-c7-cc-cd-checkout">
                                  <g>
                                    <path d="M17 12a1.667 1.667 0 103.333 0A1.667 1.667 0 0017 12zM10.333 12a1.667 1.667 0 103.334 0 1.667 1.667 0 00-3.334 0zM5.333 13.667a1.667 1.667 0 110-3.333 1.667 1.667 0 010 3.333z"></path>
                                  </g>
                                </svg>
                              </button>
                              {
                                coupon?.is_coupon_remove &&
                                <div className="cart-item-clear-or-add-modal">
                                  <li className="cart-remove-item-list" onClick={() => handleDeleteCouponCode(coupon?.id)}>
                                    <div className="cart-remove-item-svg-div">
                                      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cart-remove-item-svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path>
                                      </svg>
                                    </div>

                                    <div className="cart-remove-item-btn-text">
                                      Remove item
                                    </div>
                                  </li>
                                </div>
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </ul>
                  
                
                  <div className="cj-d-checkout">
                    <div className="al-dd-bc-checkout">
                      <div className="f9checkout">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c7-c6-ca-cb-checkout-pin">
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="al-am-cj-d-checkout">
                        <span className="bo-bp-df-cv-b1-checkout">
                          Add discount code
                        </span>
                      </div>

                      {
                        isAddPromoCodeBtnToggle ? 
                        <button className="bo-dg-df-dh-checkout-btn" disabled={isAppliedBtnActive} onClick={handleFindCouponCode}>
                          Apply
                        </button>
                        : 
                        <button className="bo-dg-df-dh-checkout-btn" onClick={handlePromoCodeToggle}>
                          Add
                        </button>
                      }
                    </div>
                    {
                      isAddPromoCodeBtnToggle && 
                      <div className="bt-au-checkout-window" style={{marginBottom: "10px"}}>
                        <input type="text" placeholder="Add promo code...." value={coupon} className="email-checkout" onChange={handleCouponCode} />
                        <div style={{position: "relative !important",height: "0px !important",width: "0px !important",float: "left !important",}}></div>
                        {
                          couponCodeError !== "" &&
                          <p style={{color: "red", background: "#eda7a7", textAlign: "center", padding:"10px", marginBottom: "10px", marginTop: "10px"}}>{couponCodeError}</p>
                        }
                      </div>
                    }
                    <div className="al-checkout">
                      <div className="drdsbscjcheckout"></div>
                    </div>
                  </div>
                  {
                    amountDiscountMessage !== "" &&
                    <div>
                      <div className="dxc6checkout"></div>
                      {amountDiscountMessage}
                      <div className="dxc6checkout"></div>
                      <div className="drdsbscjcheckout"></div>
                    </div>
                  }
                  {
                    deliveryMessage !== "" &&
                    <>
                      <div className="dxc6checkout"></div>
                      {deliveryMessage}
                      <div className="dxc6checkout"></div>
                      <div className="drdsbscjcheckout"></div>
                    </>
                  }

                  <ul>
                    <li className="bobpcheckout-sutotals" style={{marginTop:"10px"}}>
                      <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">Subtotal</div>
                      </div>

                      <div className="bobpbqbrb1checkout">
                        <span className="">
                          &pound;{getAmountConvertToFloatWithFixed(subtotalOrderAmount,2)}
                        </span>
                      </div>
                    </li>

                    <li className="dxgvcheck"></li>

                    <li className="dxgvcheck"></li>

                    <li className="bobpcheckout-sutotals">
                      <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">Discount</div>
                      </div>

                      <div className="bobpbqbrb1checkout">
                        <span className="">
                          &pound;{getAmountConvertToFloatWithFixed(discountValue,2)}
                        </span>
                      </div>
                    </li>

                    <li className="dxgvcheck"></li>

                    <li className="bobpcheckout-sutotals">
                      <div className="albcaqcheckout">
                        <div className="bobpbqbrb1checkout">
                          {selectedFilter?.name}
                        </div>
                      </div>

                      <div className="bobpbqbrb1checkout">
                        <span className="">
                          &pound;{getAmountConvertToFloatWithFixed(deliveryFee, 2)}
                        </span>
                      </div>
                    </li>
                  </ul>

                  <div className="bkgfbmggal-checkout">
                    <div className="albcaqcheckout-total">Total</div>
                    &pound;{totalOrderAmountValue}
                  </div>
                </div>
              </div>

              <div className="dtcxcybgd0d1checkout">
                <div className="bocubqcve9checkout">
                  <div className="bocubqcvb1checkout">
                    <span className="bocubqcvgycheckout">
                      <span className="bocudfdhgy">ALLERGIES:</span>
                      If you or someone you’re ordering for has an allergy,
                      please contact the merchant directly to let them know.
                    </span>
                  </div>
                </div>
                <div className="dxgvcheck"></div>

                <div className="bocubqcve9checkout">
                  <div className="bocubqcvb1checkout">
                    <span className="bocubqcvgycheckout">
                      If you’re not around when the delivery person arrives,
                      they’ll leave your order at the door. By placing your
                      order, you agree to take full responsibility for it
                      once it’s delivered. Orders containing alcohol or
                      other restricted items may not be eligible for leave
                      at door and will be returned to the store if you are
                      not available.
                    </span>
                  </div>
                </div>
                <div className="dxgvcheck"></div>

                <div className="bocubqcve9checkout">
                  <div className="bocubqcvb1checkout">
                    <span className="bocubqcvgycheckout">
                      Whilst we, and our restaurant partners, have safety
                      measures to mitigate food safety risk, couriers may be
                      delivering more than one order so we cannot eliminate
                      the risk of cross-contamination from allergens.
                    </span>
                  </div>
                </div>
                <div className="dxgvcheck"></div>
              </div>

              <div className="review-mobile-btn">
                <div className="akgzcheckout">
                  <div className="atbaagcheckout">
                    <div className="">
                      {isOrderSubtotalLessThanOrderValue && <a className="fwbrbocheckout-place-order" href="/place-order">Checkout</a>}
                      <div style={{ height: "10px" }}></div>

                      <button type="submit" className="fwbrbocheckout-add" onClick={handleAddItems}>
                        <div className="c7c6crcheckout">
                          <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                            <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="currentColor"></path>
                          </svg>
                        </div>
                        <div className="spacer _4"></div>
                        <div className="bodgdfdhcheckout-add-div">
                          Add items
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          : 
            <div className="cart-content">
              <img loading="lazy" alt="Start Shopping" role="presentation" src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/a023a017672c2488.svg" className="cart-icon" />
              <span className="cart-span-title-one">
                Add items to start a cart
              </span>

              <span className="cart-span-title-two">
                Once you add items from a restaurant or store, your cart will
                appear here.
              </span>
              <button 
                type="submit" 
                className="cart-shopping-start-button"
                style={{
                  '--cart-start-shopping-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
                  '--cart-start-shopping-font': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                  '--cart-start-shopping-hover-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor, 
                  '--cart-start-shopping-hover-font': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor, 
                  '--cart-start-shopping-hover-border': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
                }}
                onClick={() => setIsCartBtnClicked(false)}
              >
                Start shopping
              </button>
            </div>
          } */}
          
        </div>
      </div>
    </div>
  );
}
