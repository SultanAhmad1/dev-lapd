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
import { useGetQueryAutoUpdate, useGetQueryForDeliveryFee, usePostMutationHook } from "./reactquery/useQueryHook";
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
    storeToDayClosingTime,
    handleBoolean,
    cutOffSchedule,
    isScheduleIsReady,
    setIsScheduleIsReady,
    isScheduleClicked,
    setIsScheduleClicked,

    scheduleMessage,
    setScheduleMessage,

    isCheckoutReadyAfterSchedule,
    setIsCheckoutReadyAfterSchedule,

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
      const getLocalStorageDetail = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))

      const getPostCode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`))

      const getAvailableStore = getLocalStorageDetail?.display_id

      let filterPostcode = postCodeForOrderAmount

      
      let grabPostcodeOutWard = "";
      if (getPostCode && parseInt(getPostCode.length) === parseInt(7)) 
      {
        filterPostcode = getPostCode.replace(/\s/g, "");
        grabPostcodeOutWard = filterPostcode.substring(0, 4);
      } 
      else if (getPostCode && parseInt(getPostCode.length) === parseInt(6)) 
      {
        filterPostcode = getPostCode.replace(/\s/g, "");
        grabPostcodeOutWard = filterPostcode.substring(0, 3);
      } 
      else 
      {
        grabPostcodeOutWard = filterPostcode.substring(0, 2);
      }

      const filterData = {
        endData: moment().format("YYYY-MM-DD"),
        active: 1,
        partner: 2,
        brand: BRAND_GUID,
        postcode: grabPostcodeOutWard,
        location: getAvailableStore,
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
    
    if(deliveryMatrix && deliveryMatrix?.delivery_matrix_rows)
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`,deliveryMatrix?.delivery_matrix_rows?.[0])
    }
    const selectedMatrix = deliveryMatrix?.delivery_matrix_rows?.[0]
    let totalValue = 0;
    
    for (const total of cartData) 
    {
      totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount);
    }
    setLocalStorage(`${BRAND_SIMPLE_GUID}sub_order_total_local`,getAmountConvertToFloatWithFixed(totalValue, 2));
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
            Minimum order is <strong>&pound;{getAmountConvertToFloatWithFixed(selectedMatrix?.order_value,2)}</strong> to your postcode
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
    
    if(couponDiscountApplied && parseInt(couponDiscountApplied.length) == parseInt(0))
    {
      getOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));
    }
    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`, cartData);
  }


  const {refetch: deliveryRefetch} = useGetQueryForDeliveryFee('district-delivery-matrix-data',`/district-delivery-matrix/${selectedLocation}/${selectedPostcode}`,onDeliverySuccess, onDeliveryError)

  
  useEffect(() => {
   
    try {
      if(parseInt(cartData?.length) > parseInt(0))
      {
        const districtPostcode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
        setSelectedPostcode(districtPostcode?.postcode)
        
        const userLocation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
        setSelectedLocation(userLocation?.display_id)
      }
      setItemIndividuallyUpdate(false)
      
    } catch (error) {
      window.alert("There is something went wrong. Please refresh and try again 1.")
      return
    }
    
  }, [cartData, cutOffSchedule]);

  useEffect(() => {
    if(parseInt(selectedLocation?.length) > parseInt(0) && parseInt(selectedPostcode?.length) > parseInt(0))
    {
      deliveryRefetch()
    }
  },[selectedLocation, selectedPostcode]);


  function removeCartItem(id) 
  {
    const filterItems = cartData?.filter((cart, index) => index !== id);
    if(filterItems && parseInt(filterItems.length) === parseInt(0))
    {
      // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, [])
      // setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`, [])
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
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
    try {
      setLoader(true)

      // if (selectedFilter?.id === DELIVERY_ID)
      // {
      //   setCouponCodeError("You can apply coupon only for collection orders.")
      //   setLoader(false)
      //   return
      // }
      const checkCouponCodeIsAlreadyApplied = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))
  
      if(checkCouponCodeIsAlreadyApplied && parseInt(checkCouponCodeIsAlreadyApplied?.length) > parseInt(0))
      {
        // first check the same coupon is already applied or not
        const checkTheCouponIsAlreadyApplied = checkCouponCodeIsAlreadyApplied?.filter((check) => check.code.includes(coupon))

        if(checkCouponCodeIsAlreadyApplied && parseInt(checkTheCouponIsAlreadyApplied?.length) > parseInt(0))
        {
          setCouponCodeError("Code already applied!")
          setLoader(false)
          return      
        }
        for(let appliedCoupon of checkCouponCodeIsAlreadyApplied)
        {
          if(parseInt(appliedCoupon.user_in_conjuction) === parseInt(0))
          {
            setCouponCodeError("You can not use other coupons with previous one!")
            setLoader(false)
            return
          }
        }
      }
      
    } catch (error) {
      window.alert("There is something went wrong. Please refresh and try again 2.")
      return
    }

    try {
      const data = {
        coupon:   coupon,
        brand:    BRAND_GUID,
        partner:  PARTNER_ID,
        location: storeGUID,
        selectedOrderType: selectedFilter?.id,
      };
      const response = await axiosPrivate.post(`/apply-coupon`, data);
      
      if(response?.data?.data?.coupon === null)
      {
        setCouponCodeError("Coupon not found")
        setLoader(false)
        return
      }
      const couponData = response?.data?.data?.coupon

      const getCouponCodeFromSession = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))
      
      // if conjuction is zero then don't go to next
      if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession?.length) > parseInt(0))
      {
        if(couponData)
        {
          if(parseInt(couponData.user_in_conjuction) === parseInt(0))
          {
            setCouponCodeError("You can not use other coupons with previous one!")
            setLoader(false)
            return
          }
        }
      }

      
      let discountedCoupon = 0;
      if(couponData?.discount_type === "P")
      {
        if(parseInt(couponData?.user_in_conjuction) === parseInt(0))
        {
          // discountValue

          // check already discount applied and then apply discount on remaining amount
          if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession?.length) > parseInt(0))
          {
            // first get difference of discount and subtotal
            
            const differenceDiscountAndSubtotal = parseFloat(subtotalOrderAmount) - parseFloat(discountValue)

            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(differenceDiscountAndSubtotal) * (couponData?.value / 100),2)
          }
          else
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) * (couponData?.value / 100),2)
          }
        }
        else
        {
          if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession.length) > parseInt(0))
          {
            
            const differenceDiscountAndSubtotal = parseFloat(subtotalOrderAmount) - parseFloat(discountValue)
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(differenceDiscountAndSubtotal) * (couponData?.value / 100),2)
          }
          else
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) * (couponData?.value / 100),2)
          }
        }
      }
      else if(couponData?.discount_type === "M")
      {
        if(parseInt(couponData?.user_in_conjuction) === parseInt(0))
        {
          // check already discount applied and then apply discount on remaining amount
          if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession?.length) > parseInt(0))
          {
            // first get difference of discount and subtotal
            const differenceDiscountAndSubtotal = parseFloat(subtotalOrderAmount) - parseFloat(discountValue)
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(differenceDiscountAndSubtotal) - parseFloat(couponData?.value),2)
          }
          else
          {
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) - parseFloat(couponData?.value),2)
          }
        }
        else
        {
          if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession.length) > parseInt(0))
          {
            // first get difference of discount and subtotal
            const differenceDiscountAndSubtotal = parseFloat(subtotalOrderAmount) - parseFloat(discountValue)
            discountedCoupon = getAmountConvertToFloatWithFixed(parseFloat(differenceDiscountAndSubtotal) - parseFloat(couponData?.value),2)
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

      // if(parseInt(updateCouponToggle?.user_in_conjuction) === parseInt(0))
      // {
      //   // console.warn("User conjuction 0:", updateCouponToggle?.user_in_conjuction);
      //   // setCouponDiscountApplied([])setCouponDiscountApplied

      //   // const couponDiscountAppliedMerge = [...couponDiscountApplied, updateCouponToggle]

      //   // setCouponDiscountApplied(couponDiscountAppliedMerge)
        setCouponDiscountApplied((prev) => [...prev, updateCouponToggle]);
        
        if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession?.length) > parseInt(0))
        {
          const updateLocalStorageCoupon = [...getCouponCodeFromSession, updateCouponToggle]
          setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateLocalStorageCoupon)
        }
        else
        {

          // Ensure it's an array (wrap it if it's not already)
          const updateCouponArray = [updateCouponToggle];

          // Save to localStorage as a JSON string
          setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponArray)

        }
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        setAmountDiscountMessage("")

        setIsOrderSubtotalLessThanOrderValue(false)
      //  // setCouponDiscountApplied(updateCouponToggle)
      // }
      // else
      // {
      //   // console.warn("User conjuction 1:", updateCouponToggle?.user_in_conjuction);
      //   // const couponDiscountAppliedMerge = [...couponDiscountApplied, updateCouponToggle]
      //   // setCouponDiscountApplied(couponDiscountAppliedMerge)
      //   setCouponDiscountApplied((prev) => [...prev, updateCouponToggle]);
      //   // setCouponDiscountApplied(updateCouponToggle)
      // }
      
      // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponToggle)


      if(parseInt(updateCouponToggle?.free_delivery) === parseInt(1))
      {
        setDeliveryFee(0)
        setDeliveryMessage("Free Delivery")
      }
      else 
      {
        if (selectedFilter?.id === DELIVERY_ID) 
        {
          const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
          const subTotal = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`))

          if(getDeliveryMatrix && parseInt(getDeliveryMatrix?.delivery_matrix_row_values?.length) > parseInt(0))
          {
            if(subTotal)
            {
              const findExactDeliveryFee = getDeliveryMatrix?.delivery_matrix_row_values?.find((findDelivery) => parseFloat(findDelivery.min_order_value))
              for(let deliveryMatrixRowValues of getDeliveryMatrix?.delivery_matrix_row_values)
              {
                if (parseFloat(subTotal) >= parseFloat(deliveryMatrixRowValues?.min_order_value)) 
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
              }
            }
          }
        }
        else
        {
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,parseFloat(0).toFixed(2))
          setDeliveryFee(0)
          setDeliveryMessage("")
        }
      }
      setCouponCodeError("")
      setAmountDiscountApplied(null)
      setIsAppliedBtnActive(true)
      setCoupon("")
      setIsAddPromoCodeBtnToggle(false)
      
      setTimeout(() => {
        setLoader(false)
      }, 3000);
      setIsCouponCodeApplied(true)
    } catch (error) {
      setCouponCodeError(error?.response?.data?.message)
      window.alert("Please refresh and apply again coupon code.")
      return
    }
  }
  
  useEffect(() => {

    setLocalStorage(`${BRAND_SIMPLE_GUID}total_order_value_storage`,getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) +parseFloat(deliveryFee) -parseFloat(discountValue),2));
    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,getAmountConvertToFloatWithFixed(deliveryFee, 2));

    // {getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) + parseFloat(deliveryFee) - parseFloat(discountValue),2)}

    setTotalOrderAmountValue(getAmountConvertToFloatWithFixed(parseFloat(subtotalOrderAmount) +parseFloat(deliveryFee) -parseFloat(discountValue),2));
  }, [subtotalOrderAmount, deliveryFee, discountValue]);

  useEffect(() => {
    // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, couponDiscountApplied)
    if(couponDiscountApplied && parseInt(couponDiscountApplied.length) > parseInt(0))
    {
      
      let couponDiscountValue = 0
      
      for(let couponDiscount of couponDiscountApplied)
      {
        couponDiscountValue += parseFloat(couponDiscount?.discount)

        if(parseInt(couponDiscount.free_delivery) === parseInt(1))
        {
          setDeliveryFee(0)
          setDeliveryMessage("Free Delivery")
        }
        else
        {

          if (selectedFilter?.id === DELIVERY_ID) 
            {
              const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
              const subTotal = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`))
    
              if(getDeliveryMatrix && parseInt(getDeliveryMatrix?.delivery_matrix_row_values?.length) > parseInt(0))
              {
                if(subTotal)
                {
                  const findExactDeliveryFee = getDeliveryMatrix?.delivery_matrix_row_values?.find((findDelivery) => parseFloat(findDelivery.min_order_value))
                  for(let deliveryMatrixRowValues of getDeliveryMatrix?.delivery_matrix_row_values)
                  {
                    if (parseFloat(subTotal) >= parseFloat(deliveryMatrixRowValues?.min_order_value)) 
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
                  }
                }
              }
          }
          else
          {
            setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,parseFloat(0).toFixed(2))
            setDeliveryFee(0)
            setDeliveryMessage("")
          }
        }
      }
      
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      setAmountDiscountMessage("")
      setAmountDiscountApplied(null)
      setIsOrderSubtotalLessThanOrderValue(true)
      setDiscountValue(getAmountConvertToFloatWithFixed(couponDiscountValue,2))
    }
  }, [couponDiscountApplied])

  // When click on handleCheckoutClicked button, create new order_guid, with status awaiting, payment_option_awaiting.

  const onStoreSuccess = async (data) => {
    // first check the order guid id in localStorage if it is null then store information then update them.
    const responseData = data?.data?.data?.order?.order_total;
    const { clientSecret, type } = data?.data?.data;

    const orderGUID = data?.data?.data?.order?.external_order_id

    setTimeout(() => {
      setLoader(false)
    }, 3000);
    if (data?.data?.status === "success") 
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
      handleBoolean(true, "isPlaceOrderButtonClicked")
    }

  }

  const onStoreError = (error) => {
    
    setTimeout(() => {
      setLoader(false)
    }, 3000);
    // if(error?.response?.data?.status.includes("success"))
    // {
    //   route.push(`/payment/${data?.data?.data?.order?.external_order_id}`);
    // }
    setErrormessage("There is something went wrong!. Please refresh and try again.")
    window.alert("There is something went wrong!. Please refresh and try again.")
    return
  }

  const { isLoading: storeLoading, isError: storeError, reset: storeReset, isSuccess: storeSuccess, mutate: createOrderMutation } = usePostMutationHook('create-customer-order-guid',`/create-order-guid`,onStoreSuccess, onStoreError)

  const handleCheckoutClicked = () => {

    if(isScheduleIsReady && !isScheduleClicked)
    {
      return
    }
    setLoader(true)
    handleBoolean(true, "isPlaceOrderButtonClicked")
    // const orderFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`));

    // createOrderMutation({
    //   store: storeGUID,
    //   brand: BRAND_GUID,
    //   filterId:           orderFilter === null ? selectedFilter?.id : orderFilter.id,
    //   filterName:         orderFilter === null ? selectedFilter?.name : orderFilter.name,
    // })
  }

  const handleIsScheduleClicked = () => {
    setIsScheduleClicked(! isScheduleClicked)
    setIsCheckoutReadyAfterSchedule(! isCheckoutReadyAfterSchedule)
  }

  return(
    <div className="display-cart scrollable-container" style={{ maxHeight: '75vh', minHeight: '60vh', overflowY: 'auto'}}>
      {
        cartData?.length > 0 &&
        <div className="receipt-menu">
          <h5>My Order</h5>

          <div style={{ maxHeight: '45vh', minHeight: '40vh', overflowY: 'auto', marginTop: '0px' }}>

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
                {
                  cartData?.map((data, index) => {

                    // hasNotExtras
                    const hasNotExtras = {
                      ...data,
                      modifier_group: data?.modifier_group?.filter((findTheExtras) => findTheExtras?.isExtras === false)
                    };
                    const hasExtras = {
                        ...data,
                        modifier_group: data?.modifier_group?.filter((findTheExtras) => findTheExtras?.isExtras === true)
                      };
                    // hasExtras
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
                                  hasNotExtras?.modifier_group?.map((modifier, modifierIndex) => (
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

                                {
                                  hasExtras?.modifier_group?.map((modifier, modifierIndex) => (
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
                            <div style={{cursor: "pointer"}} onClick={(() => removeCartItem(index))} className="col-3 removeProduct" data-index="0"><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cw-cx-bj-bk-del"><path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path></svg></div>
                        {/* </a> */}
                      </li>
                    )   
                  })
                }

                {
                  amountDiscountApplied !== null &&
                    <li className="order-detail-li">
                      <div className="col-1">
                        
                          <div className="order-detail-div">
                            <div className="or-cat-name"><b>{amountDiscountApplied?.name}</b>: </div>
                            <div className="or-pro-name">{parseFloat(amountDiscountApplied?.value).toFixed(2)} {amountDiscountApplied?.discount_type === "P" ? "%" : "£"}</div>
                          </div>

                      </div>

                      <div className="col-2" >(&pound;<span className="productPrice0">{parseFloat(discountValue).toFixed(2)})</span></div>
                      <div style={{cursor: "pointer"}} className="col-3 removeProduct" data-index="0"></div>
                    </li>
                }

                {
                  couponDiscountApplied?.map((coupon, index) => {
                    return(
                      <li key={index} className="order-detail-li">
                        <div className="col-1">
                          
                            <div className="order-detail-div">
                              <div className="or-cat-name"><b>{coupon?.name}</b>: </div>
                              <div className="or-pro-name">{parseFloat(coupon?.value).toFixed(2)} {coupon?.discount_type === "P" ? "%" : "£"}</div>
                            </div>

                        </div>
                        <div className="col-2" >(&pound;<span className="productPrice0">{parseFloat(coupon?.discount).toFixed(2)})</span></div>
                        <div style={{cursor: "pointer"}} className="col-3 removeProduct" data-index="0"></div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          
          </div>

          <div className="coupon-more" style={{marginTop: "2vh"}}>
            <div>
             <p>{amountDiscountMessage && amountDiscountMessage}</p>
            </div>

            <div>
              <div className="input-btn-gather">
                <input type="text" name="" id="" value={coupon} onChange={handleCouponCode}  placeholder="Enter Discount Code"/>
                <button type="button" className="apply-coupon-btn" onClick={handleFindCouponCode}>Apply</button>
              </div>
              {
                couponCodeError !== "" &&
                <p style={{color: "red",maxWidth: "18vw"}}>{couponCodeError}</p>
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
          
          {/* <a
            // type="button" 
            className={` ${!isOrderSubtotalLessThanOrderValue ? "checkout-btn-not-clickable" : "checkout-btn"}`} 
            // disabled={!isOrderSubtotalLessThanOrderValue}  onClick={() => route.push('/place-order')} 
            aria-disabled={!isOrderSubtotalLessThanOrderValue}
            href='/place-order'
          >
              Checkout
            </a> */}
          {/* 
            1.-) First check the, order is delivery.
              and store is not open yet,
              then show today delivery time details with schedule.
            2.-) If order is collection then perform same way,
              and store is not open yet,
              then show today collection details with schedule.
            3.-) if someone click on schedule then allow to click on checkout button.
            4.-) When the current time is between the store open and close time. 
            then
              Store is closed, you can choose schedule, next day with time details.
          */}
          {
            isScheduleIsReady &&
            
              <div>
                <label className={`modifier-product-item-name-checkbox`}>
                  <div style={{border: "1px solid red"}} onClick={handleIsScheduleClicked}>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${isScheduleClicked ? "red" : ""}`} strokeWidth="2.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                    <div className="spacer _16"></div>
                    <div className="modifier-product-item-name-one-nested-div-one-nested">
                        <div className="modifier-product-item-name-one-nested-div-one-nested-div" style={{color: "red", marginLeft: '10px', marginBottom: "20px"}}>
                            {/* {scheduleMessage} */}
                            <h6>We are currently closed. </h6>
                            <p>To schedule your order for &lt;&lt; {scheduleMessage} &gt;&gt;, go to checkout</p>
                        </div>
                    </div>
                </label>
              </div>
          }

          {
            // !isCheckoutReadyAfterSchedule && (
            !isOrderSubtotalLessThanOrderValue ?
              <button
                type="button" 
                className={`checkout-btn-not-clickable`} 
              >
                  Checkout
                </button>

            :
              <button
                type="button" 
                className={`checkout-btn`} 
                aria-disabled={!isOrderSubtotalLessThanOrderValue}
                onClick={handleCheckoutClicked}
              >
                Checkout
              </button>
            // )
          }
          <div style={{marginBottom: "50px"}}></div>

        </div>
      }
    </div>
  )
}
