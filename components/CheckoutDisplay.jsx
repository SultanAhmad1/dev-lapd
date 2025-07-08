"use client";
import React, { Fragment, useContext, useEffect, useReducer, useRef, useState } from "react";
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
import { useGetQueryForDeliveryFee, usePostMutationHook } from "./reactquery/useQueryHook";
import { NextResponse } from "next/server";

const initialStates = {
  messagesObject: {
    minimumOrderMessage: "",
    deliveryMessage: "",
  },
}

const reducer = (state, action) => {
  switch (action.type) {  
    case "SET_MINIMUM_ORDER_MESSAGE":
      return {
        ...state,
        messagesObject: {
          ...state.messagesObject,
          minimumOrderMessage: action.payload,
        },
      }; 
    case "SET_DELIVERY_MESSAGE":
      return {
        ...state,
        messagesObject: {
          ...state.messagesObject,
          deliveryMessage: action.payload,
        },
      };
    default:  
      return state; 
  }
};


export default function CheckoutDisplay()
{
  const [state, dispatch] = useReducer(reducer, initialStates);

  const route = useRouter();
  const {
    setIsCouponCodeApplied,
    setLoader,
    storeGUID,
    totalOrderAmountValue,
    setTotalOrderAmountValue,
    selectedFilter,
    storeName,
    cartData,
    setCartData,
  
    setIsCartBtnClicked,

    postCodeForOrderAmount,
    amountDiscountApplied,
    setAmountDiscountApplied,
    couponDiscountApplied,
    setCouponDiscountApplied,
    handleBoolean,
    cutOffSchedule,
    isScheduleIsReady,
    setIsScheduleClicked,

    scheduleMessage,
    selectedPostcode,
    selectedLocation,
  } = useContext(HomeContext);

  const [isMinimumOrderErrorThere, setIsMinimumOrderErrorThere] = useState(false);
  
  const [subtotalOrderAmount, setSubtotalOrderAmount] = useState(0);

  const [deliveryFee, setDeliveryFee] = useState(0);

  const [discountValue, setDiscountValue] = useState(0);

  const [amountDiscountMessage, setAmountDiscountMessage] = useState("");
  // Boolean States
  const [ isOrderSubtotalLessThanOrderValue, setIsOrderSubtotalLessThanOrderValue] = useState(true);
  // Coupon Code States
  const [coupon, setCoupon] = useState("");
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

  const onDeliveryError = (error) => {}

  const onDeliverySuccess = (data) => {
    
    const {deliveryMatrix, collectionMatrix} = data?.data
    
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
    
    const appliedCoupon = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))

    if(appliedCoupon)
    {
      const sortedCoupon = appliedCoupon?.sort((a, b) => {
        return parseFloat(b.id) - parseFloat(a.id);
      });

      const findCouponIsMinimumDetailsTrue = sortedCoupon?.find((findCoupon) => parseInt(findCoupon.override_minimum_spend) === parseInt(0))
  
      const totalDiscount = appliedCoupon?.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue?.discount);
      }, 0);

      if(findCouponIsMinimumDetailsTrue)
      {
        totalValue = parseFloat(totalValue) - parseFloat(totalDiscount);
      }
    }

    const getSelectedFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))

    if (getSelectedFilter?.id === DELIVERY_ID) 
    {
      if (parseFloat(totalValue) >= parseFloat(selectedMatrix?.order_value)) 
      {
        if (selectedMatrix?.above_order_value === null || selectedMatrix?.above_order_value === 0) 
        {
          const textMessage = <strong>Free Delivery</strong>;
          dispatch({ type: "SET_DELIVERY_MESSAGE", payload: textMessage });
          const fee = getAmountConvertToFloatWithFixed(0, 2);
          setDeliveryFee(fee);
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        } 
        else 
        {
          dispatch({ type: "SET_DELIVERY_MESSAGE", payload: "" });
          const fee = getAmountConvertToFloatWithFixed(selectedMatrix?.above_order_value,2);
          setDeliveryFee(fee);
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
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
                dispatch({ type: "SET_DELIVERY_MESSAGE", payload: textMessage });
                const fee = getAmountConvertToFloatWithFixed(0, 2);
                setDeliveryFee(fee);
                setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
              } 
              else 
              {
                const textMessage = <strong>Free Delivery</strong>;
                dispatch({ type: "SET_DELIVERY_MESSAGE", payload: (deliveryMatrixRowValues?.above_minimum_order_value === 0) ? "" : textMessage });

                const fee = parseFloat(deliveryMatrixRowValues?.above_minimum_order_value ?? 0 ).toFixed(2);
                setDeliveryFee(fee);
                setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
              }
            }
          }
        }
        setIsMinimumOrderErrorThere(false)
        dispatch({type: "SET_MINIMUM_ORDER_MESSAGE", payload: ""});
      } else {
        const textMessage = (
          // <span style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",}}>
          <span style={{color: "red"}}>
            Minimum order is <strong>&pound;{getAmountConvertToFloatWithFixed(selectedMatrix?.order_value,2)}</strong> to your postcode.
          </span>
        );
        setIsMinimumOrderErrorThere(true)
        dispatch({type: "SET_MINIMUM_ORDER_MESSAGE", payload: textMessage});

        if(selectedMatrix?.below_order_value !== null)
        {
          const fee = getAmountConvertToFloatWithFixed(selectedMatrix?.below_order_value,2);
          setDeliveryFee(fee);
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        }
        else if(selectedMatrix?.above_order_value !== null)
        {
          const fee = getAmountConvertToFloatWithFixed(selectedMatrix?.above_order_value,2);
          setDeliveryFee(fee);
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        }
        setIsOrderSubtotalLessThanOrderValue(false);
      }
    } 
    else 
    {
      // if(isMinimumOrderErrorThere === true)
      // {
      //   setIsOrderSubtotalLessThanOrderValue(false)
      // }
      // else
      // {
        const fee = getAmountConvertToFloatWithFixed(0, 2);
        setDeliveryFee(fee);
        setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere);
      // }

      const selectedCollectionMatrix = collectionMatrix.collection_matrix_rows?.[0]
      
      if (parseFloat(totalValue) >= parseFloat(selectedCollectionMatrix?.collection_order_value))
      {
        if (selectedCollectionMatrix?.collection_above_order_value === null || selectedCollectionMatrix?.collection_above_order_value === 0)
        {
          if(isMinimumOrderErrorThere === false){
            const fee = getAmountConvertToFloatWithFixed(0, 2);
            setDeliveryFee(fee);
            setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
          }
        } 
        else 
        {
          if(isMinimumOrderErrorThere === false)
          {
            dispatch({ type: "SET_DELIVERY_MESSAGE", payload: "" });
            const fee = getAmountConvertToFloatWithFixed(selectedCollectionMatrix?.collection_above_order_value,2);
            setDeliveryFee(fee);
            setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
            setIsOrderSubtotalLessThanOrderValue(true)
          }
        }

        if (parseInt(selectedCollectionMatrix?.collection_matrix_row_values?.length) > parseInt(0)) 
        {
          for (const deliveryMatrixRowValues of selectedCollectionMatrix?.collection_matrix_row_values) 
          {
            // Min order value is greater than totalValue then.
            if (parseFloat(totalValue) >= parseFloat(deliveryMatrixRowValues?.collection_min_order_value)) 
            {
              if (deliveryMatrixRowValues?.collection_above_minimum_order_value === null || deliveryMatrixRowValues?.collection_above_minimum_order_value === 0)  
              {
                // const textMessage = <strong>Free Collection</strong>;
                // dispatch({ type: "SET_DELIVERY_MESSAGE", payload: textMessage });
                // if(isMinimumOrderErrorThere === false)
                // {
                  const fee = getAmountConvertToFloatWithFixed(0, 2);
                  setDeliveryFee(fee);
                  setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
                  const textMessage = <strong>Free Collection</strong>;
                dispatch({ type: "SET_DELIVERY_MESSAGE", payload: textMessage });
                // }
              } 
              else 
              {
                // if(isMinimumOrderErrorThere === false)
                // {
                  const fee = parseFloat(deliveryMatrixRowValues?.collection_above_minimum_order_value ?? 0).toFixed(2);
                  setDeliveryFee(fee);
                  setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
                // }

              }
            } 
          }
        }
        setIsMinimumOrderErrorThere(false)
        dispatch({type: "SET_MINIMUM_ORDER_MESSAGE", payload: ""});
      } else if(selectedCollectionMatrix !== null && selectedCollectionMatrix !== undefined && parseInt(selectedCollectionMatrix.length) > parseInt(0)){
        const textMessage = (
          <span style={{color: "red"}}>
            Minimum order is <strong>&pound;{getAmountConvertToFloatWithFixed(selectedCollectionMatrix?.collection_order_value,2)}</strong> for collection.
          </span>
        );
        setIsMinimumOrderErrorThere(true)
        setIsOrderSubtotalLessThanOrderValue(false);
        dispatch({type: "SET_MINIMUM_ORDER_MESSAGE", payload: textMessage});
        dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  ""});

        if(selectedCollectionMatrix?.collection_below_order_value !== null)
        {
          const newFee = getAmountConvertToFloatWithFixed(selectedCollectionMatrix?.collection_below_order_value,2);
          setDeliveryFee(newFee);
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,newFee)
        }else if(selectedCollectionMatrix?.collection_above_order_value !== null){
          const newFee = getAmountConvertToFloatWithFixed(selectedCollectionMatrix?.collection_above_order_value,2);
          setDeliveryFee(newFee);
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,newFee)
        }
      }
    }

    // Set Delivery fee and other things for Coupon and its delivery fee related information.
    setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, couponDiscountApplied)

    if(couponDiscountApplied && parseInt(couponDiscountApplied.length) == parseInt(0))
    {
      getOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));
    }
    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`, cartData);

    if(couponDiscountApplied && parseInt(couponDiscountApplied.length) > parseInt(0))
    {
      let couponDiscountValue = 0
      
      for(let couponDiscount of couponDiscountApplied)
      {
        couponDiscountValue += parseFloat(couponDiscount?.discount)

        if(parseInt(couponDiscount.free_delivery) === parseInt(1))
        {
          const fee = getAmountConvertToFloatWithFixed(0, 2);
          setDeliveryFee(fee)
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
          setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
          
          let textMessage = "";
          if(getSelectedFilter.id === DELIVERY_ID)
          {
            textMessage = <strong>Free Delivery</strong>;
          }
          dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
        }
        else
        {
          if (getSelectedFilter?.id === DELIVERY_ID) 
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
                      setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
                      const textMessage = <strong>Free Delivery</strong>;
                      dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
                      const fee = getAmountConvertToFloatWithFixed(0, 2);
                      setDeliveryFee(fee);
                      setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
                    } 
                    else 
                    {
                      setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
                      const textMessage = <strong>Free Delivery</strong>;
                      dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  (deliveryMatrixRowValues?.above_minimum_order_value === 0) ? "" : textMessage});
                      const fee = parseFloat(deliveryMatrixRowValues?.above_minimum_order_value ?? 0).toFixed(2);
                      setDeliveryFee(fee);
                      setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
                    }
                  }
                }
              }
            }
          }
          else
          {
            setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
            dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  ""});
            setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,parseFloat(0).toFixed(2))
            setDeliveryFee(0)
          }
        }
      }
      
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      
      setAmountDiscountMessage("")
      setAmountDiscountApplied(null)

      // if(isMinimumOrderErrorThere === true)
      // {
      //   setIsOrderSubtotalLessThanOrderValue(false)
      // }
      // else
      // {
        setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
      // }
      setDiscountValue(getAmountConvertToFloatWithFixed(couponDiscountValue,2))
    }
  }
  
  const {
    refetch: deliveryRefetch
  } = useGetQueryForDeliveryFee(
    'district-delivery-matrix-data',
    `/district-delivery-matrix/${selectedLocation}/${selectedPostcode}`,
    onDeliverySuccess, 
    onDeliveryError,
    (!!cartData && !!selectedLocation && !!selectedPostcode)
  )

  function removeCartItem(id) 
  {
    setLoader(true)
    const filterItems = cartData?.filter((cart, index) => index !== id);
    if(filterItems && parseInt(filterItems.length) === parseInt(0))
    {
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      setCouponDiscountApplied([])
    }
    else if(parseInt(filterItems.length) > parseInt(0))
    {
      let totalValue = 0;
      for (const total of filterItems)
      {
        totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount);
      }

      if(parseInt(couponDiscountApplied.length) > parseInt(0))
      {
        
        const updateCouponDiscountApplied = couponDiscountApplied?.map((appliedDiscount) => {  
          let removeItemDiscountValue = 0;
          if (appliedDiscount.discount_type === "P") 
          {
            const getThePercentage = appliedDiscount.value / 100;
            removeItemDiscountValue = parseFloat(totalValue) * parseFloat(getThePercentage);
            setDiscountValue(getAmountConvertToFloatWithFixed(removeItemDiscountValue, 2));
          } 
          else 
          {
            removeItemDiscountValue = parseFloat(totalValue) - parseFloat(appliedDiscount.value);
            setDiscountValue(getAmountConvertToFloatWithFixed(removeItemDiscountValue, 2));
          }
          return {
            ...appliedDiscount,
            discount: removeItemDiscountValue
          }
        })

        setCouponDiscountApplied(updateCouponDiscountApplied)
        setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponDiscountApplied)
      }
    }

    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,filterItems)

    setCartData(filterItems);
    deliveryRefetch()
  }

  // Handle Coupon Code functionality
  function handleCouponCode(event) 
  {
    setCoupon(event.target.value);
    setCouponCodeError("")
  }

  async function handleFindCouponCode() 
  {
    try {
      setLoader(true)
      const checkCouponCodeIsAlreadyApplied = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))
  
      if(checkCouponCodeIsAlreadyApplied && parseInt(checkCouponCodeIsAlreadyApplied?.length) > parseInt(0))
      {
        // first check the same coupon is already applied or not
        const checkTheCouponIsAlreadyApplied = checkCouponCodeIsAlreadyApplied?.filter((check) => check.code.toLowerCase() === coupon.toLowerCase())

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
      
      // delivery fee
      if(parseInt(couponData?.free_delivery) === parseInt(1))
      {
        let textMessage = "";
        if(selectedFilter?.id === DELIVERY_ID)
        {
          textMessage = <strong>Free Delivery</strong>;
        }
        dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
        const couponFee = getAmountConvertToFloatWithFixed(0, 2);
        setDeliveryFee(couponFee)
        setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,couponFee)
        setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
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
                    setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
                    const textMessage = <strong>Free Delivery</strong>;
                    dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
                    const fee = getAmountConvertToFloatWithFixed(0, 2);
                    setDeliveryFee(fee);
                    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
                  } 
                  else 
                  {
                    setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
                    const textMessage = <strong>Free Delivery</strong>;
                    dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  (deliveryMatrixRowValues?.above_minimum_order_value === 0) ? "" : textMessage});
                    const couponFee = getAmountConvertToFloatWithFixed(deliveryMatrixRowValues?.above_minimum_order_value ?? 0, 2);
                    setDeliveryFee(couponFee)
                    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,couponFee)
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
          setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
          dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  ""});
        }
      }
      
      const totalOrderAmountValueUpdate = parseFloat(totalOrderAmountValue) - parseFloat(discountedCoupon)
      setTotalOrderAmountValue(getAmountConvertToFloatWithFixed(totalOrderAmountValueUpdate,2))

      const updateCouponToggle = {
        ...couponData,
        is_coupon_remove: false,
        discount: discountedCoupon
      }
      
      setCouponDiscountApplied((prev) => [...prev, updateCouponToggle]);
      
      const updateCouponExists = [...couponDiscountApplied, updateCouponToggle]

      setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponExists)
      setCoupon("")
      // if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession?.length) > parseInt(0))
      // {
      //   const updateLocalStorageCoupon = [...getCouponCodeFromSession, updateCouponToggle]
      //   setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateLocalStorageCoupon)
      // }
      // else
      // {

      //   // Ensure it's an array (wrap it if it's not already)
      //   const updateCouponArray = [updateCouponToggle];

      //   // Save to localStorage as a JSON string
      //   setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponArray)

      // }

      // setDiscountValue((prevData) => parseFloat(prevData) + parseFloat(discountedCoupon))
      // window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      // setAmountDiscountMessage("")
      // setIsOrderSubtotalLessThanOrderValue(!isMinimumOrderErrorThere)
      
      // setCouponCodeError("")
      // setAmountDiscountApplied(null)
      // setCoupon("")
      setIsCouponCodeApplied(true)

      setTimeout(() => {
        deliveryRefetch()
      }, 3000);
      // setTimeout(() => {
      //   setLoader(false)
      // }, 3000);
      
    } catch (error) {
      setTimeout(() => {
        setLoader(false)
      }, 3000);
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
    setIsScheduleClicked(isScheduleIsReady)
    setLoader(true)
    handleBoolean(true, "isPlaceOrderButtonClicked")

    async function storeCheckoutClicked() {
      try {
        const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'));

        const data = {
          visitorGUID: visitorInfo.visitorId
        }

        const response = await axiosPrivate.post('/store-checkout-clicked', data)

      } catch (error) {
        
      }
    }
    storeCheckoutClicked()
  }

  const handleRemoveCouponCode = (index) => {
    setLoader(true)
    const updateCouponCode = couponDiscountApplied?.filter((_, i) => i !== index);

    // calculate the total order amount after removing the coupon code.
    if(parseInt(updateCouponCode.length) === parseInt(0))
    {
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      setDiscountValue(0)
    }
    else
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponCode)
    }
    setCouponDiscountApplied(updateCouponCode)
    deliveryRefetch()
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

                        <div className="col-3 removeProduct" style={{cursor: "pointer"}} onClick={() => handleRemoveCouponCode(index)}>

                          <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cw-cx-bj-bk-del">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"></path>
                          </svg>

                        </div>
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
              <p>{state.messagesObject.deliveryMessage}</p>
              <p>{state.messagesObject.minimumOrderMessage}</p>
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
                  {/* <div style={{border: "1px solid red"}} onClick={handleIsScheduleClicked}>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke={`${isScheduleClicked ? "red" : ""}`} strokeWidth="2.5" strokeLinejoin="round"/>
                    </svg>
                  </div> */}
                  <div className="spacer _16"></div>
                  <div className="modifier-product-item-name-one-nested-div-one-nested">
                    <div className="modifier-product-item-name-one-nested-div-one-nested-div" style={{color: "red", marginLeft: '10px', marginBottom: "20px"}}>
                      {/* {scheduleMessage} */}
                      <p style={{fontSize: "15px"}}>To schedule your order for {scheduleMessage}, go to checkout.</p>
                    </div>
                  </div>
                </label>
              </div>
          }

          {
            // !isCheckoutReadyAfterSchedule && (
            // !isOrderSubtotalLessThanOrderValue ?
            state.messagesObject.minimumOrderMessage.length === undefined ?
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
