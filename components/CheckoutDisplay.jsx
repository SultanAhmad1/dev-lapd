"use client";
import React, { Fragment, useContext, useEffect, useReducer, useRef, useState } from "react";
import HomeContext from "../contexts/HomeContext";
import {
  find_collection_matching_postcode,
  find_matching_postcode,
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
import { useGetQueryForDeliveryFee, usePostMutationHook } from "./reactquery/useQueryHook";
import { useWebsite } from "@/app/providers/context/WebsiteContext";
import Link from "next/link";

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
  const {layoutWebsiteModification} = useWebsite()

  const [state, dispatch] = useReducer(reducer, initialStates);

  const {
    setPauseState,
    setPostCodeForOrderAmount,
    setSelectedLocation,
    setSelectedPostcode,
    setOrderGuid,
    orderGuid,
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
    isScheduleIsReady,
    setIsScheduleClicked,

    scheduleMessage,
    selectedPostcode,
    selectedLocation,
    setDeliveryMatrix,
    isScheduleEnabled,
    setPaymentLoader,
  } = useContext(HomeContext);
  
  const [isMinimumOrderErrorThere, setIsMinimumOrderErrorThere] = useState(false);
  
  const [subtotalOrderAmount, setSubtotalOrderAmount] = useState(0);

  const [deliveryFee, setDeliveryFee] = useState(0);

  const [discountValue, setDiscountValue] = useState(0);

  const [amountDiscountMessage, setAmountDiscountMessage] = useState("");
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
    setPaymentLoader(false)
    return () => {
      // Cleanup the event listener on unmount
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const onDeliveryMatrixSuccess = (data) => {

    const {deliveryMatrix, collectionMatrix, orderExistOrNot} = data?.data?.data

    setOrderGuid(orderExistOrNot.external_order_id)
    setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`, orderExistOrNot.external_order_id)

    const selectedMatrix = deliveryMatrix?.delivery_matrix_rows?.[0]
    let totalValue = 0;
    
    for (const total of cartData) 
    {
      totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount);
    }
    
    setLocalStorage(`${BRAND_SIMPLE_GUID}sub_order_total_local`,getAmountConvertToFloatWithFixed(totalValue, 2));
    setSubtotalOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));

    const getSelectedFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))

    if (getSelectedFilter?.id === DELIVERY_ID) 
    {
      if (parseFloat(totalValue) >= parseFloat(selectedMatrix?.order_value)) 
      {
        if (selectedMatrix?.above_order_value === null || selectedMatrix?.above_order_value === 0) 
        {
          // const textMessage = <strong>Free Delivery</strong>;
          const textMessage = ""
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
        }

        if (parseInt(selectedMatrix?.delivery_matrix_row_values?.length) > parseInt(0)) 
        {
          for (const deliveryMatrixRowValues of selectedMatrix?.delivery_matrix_row_values) 
          {
            // Min order value is greater than totalValue then.
            if (parseFloat(totalValue) >= parseFloat(deliveryMatrixRowValues?.min_order_value)) 
            {
              // if (deliveryMatrixRowValues?.above_minimum_order_value === null || deliveryMatrixRowValues?.above_minimum_order_value === 0)  
              // {
              //   // const textMessage = <strong>Free Delivery</strong>;
              //   const textMessage = ""
              //   dispatch({ type: "SET_DELIVERY_MESSAGE", payload: textMessage });
              //   const fee = getAmountConvertToFloatWithFixed(0, 2);
              //   setDeliveryFee(fee);
              //   setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
              // } 
              // else 
              if (deliveryMatrixRowValues?.above_minimum_order_value !== null && deliveryMatrixRowValues?.above_minimum_order_value !== undefined)
              {
                // const textMessage = <strong>Free Delivery</strong>;
                const textMessage = ""
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
      }

      if(deliveryMatrix && deliveryMatrix?.delivery_matrix_rows)
      {
        // setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`,deliveryMatrix?.delivery_matrix_rows?.[0])
        const getThePostcodeMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));
        find_matching_postcode(deliveryMatrix?.delivery_matrix_rows, getThePostcodeMatrix?.postcode, setDeliveryMatrix);
      }
    } 
    else 
    {
      const fee = getAmountConvertToFloatWithFixed(0, 2);
      setDeliveryFee(fee);
      setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        

      const selectedCollectionMatrix = collectionMatrix.collection_matrix_rows?.[0]
      
      if(collectionMatrix && collectionMatrix?.collection_matrix_rows)
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`,collectionMatrix?.collection_matrix_rows?.[0])
        const getCollectionThePostcodeMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));
        find_collection_matching_postcode(collectionMatrix?.collection_matrix_rows, getCollectionThePostcodeMatrix?.postcode, setDeliveryMatrix);
      }
      
      if (parseFloat(totalValue) >= parseFloat(selectedCollectionMatrix?.collection_order_value))
      {
        // if (selectedCollectionMatrix?.collection_above_order_value === null || selectedCollectionMatrix?.collection_above_order_value === 0)
        // {
        //   if(isMinimumOrderErrorThere === false){
        //     const fee = getAmountConvertToFloatWithFixed(0, 2);
        //     setDeliveryFee(fee);
        //     setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        //   }
        // } 
        // else 
        if (selectedCollectionMatrix?.collection_above_order_value !== null && selectedCollectionMatrix?.collection_above_order_value !== undefined)
        {
          if(isMinimumOrderErrorThere === false)
          {
            dispatch({ type: "SET_DELIVERY_MESSAGE", payload: "" });
            const fee = getAmountConvertToFloatWithFixed(selectedCollectionMatrix?.collection_above_order_value,2);
            setDeliveryFee(fee);
            setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
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
                const fee = getAmountConvertToFloatWithFixed(0, 2);
                setDeliveryFee(fee);
                setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
                const textMessage = <strong>Free Collection</strong>;
                dispatch({ type: "SET_DELIVERY_MESSAGE", payload: textMessage });
              } 
              else 
              {
                const fee = parseFloat(deliveryMatrixRowValues?.collection_above_minimum_order_value ?? 0).toFixed(2);
                setDeliveryFee(fee);
                setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
              }
            } 
          }
        }
        setIsMinimumOrderErrorThere(false)
        dispatch({type: "SET_MINIMUM_ORDER_MESSAGE", payload: ""});
      } 
      else 
      if(selectedCollectionMatrix !== null && selectedCollectionMatrix !== undefined)
      {
        const textMessage = (
          <span style={{color: "red"}}>
            Minimum order is <strong>&pound;{getAmountConvertToFloatWithFixed(selectedCollectionMatrix?.collection_order_value,2)}</strong> for collection.
          </span>
        );
        setIsMinimumOrderErrorThere(true)
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
    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`, cartData);
    if(couponDiscountApplied && parseInt(couponDiscountApplied.length) > parseInt(0))
    {
      let couponDiscountValue = 0
      
      const updateCouponDetails = couponDiscountApplied?.map((couponDiscount) => {
        let newTotalAfterCoupon = totalValue
        if (couponDiscount.discount_type === "P")
        {
          const getThePercentage = couponDiscount.value / 100;
          couponDiscountValue = parseFloat(newTotalAfterCoupon) * parseFloat(getThePercentage);
          newTotalAfterCoupon -= couponDiscountValue
        }
        else
        {
          couponDiscountValue = parseFloat(newTotalAfterCoupon) - parseFloat(couponDiscount.value);
          newTotalAfterCoupon -= couponDiscountValue
        }

        // check is delivery free selected.
        if(parseInt(couponDiscount.free_delivery) === parseInt(1))
        {
          const fee = getAmountConvertToFloatWithFixed(0, 2);
          setDeliveryFee(fee)
          setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
          
          let textMessage = "";
          if(getSelectedFilter.id === DELIVERY_ID)
          {
            // textMessage = <strong>Free Delivery</strong>;
            textMessage = "";
          }
          dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
        }
        else
        {
          // if delivery fee added then check is customer's selected delivery
          // if (getSelectedFilter?.id === DELIVERY_ID) 
          // {
          //   const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
          //   const subTotal = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`))
  
          //   if(getDeliveryMatrix && parseInt(getDeliveryMatrix?.delivery_matrix_row_values?.length) > parseInt(0))
          //   {
          //     if(subTotal)
          //     {
          //       const findExactDeliveryFee = getDeliveryMatrix?.delivery_matrix_row_values?.find((findDelivery) => parseFloat(findDelivery.min_order_value))
          //       for(let deliveryMatrixRowValues of getDeliveryMatrix?.delivery_matrix_row_values)
          //       {
          //         if (parseFloat(subTotal) >= parseFloat(deliveryMatrixRowValues?.min_order_value)) 
          //         {
          //           if (deliveryMatrixRowValues?.above_minimum_order_value === null || deliveryMatrixRowValues?.above_minimum_order_value === 0)  
          //           {
          //             // const textMessage = <strong>Free Delivery</strong>;
          //             const textMessage = ""
          //             dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
          //             const fee = getAmountConvertToFloatWithFixed(0, 2);
          //             setDeliveryFee(fee);
          //             setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
          //           } 
          //           else 
          //           {
          //             // const textMessage = <strong>Free Delivery</strong>;
          //             const textMessage = ""
          //             dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  (deliveryMatrixRowValues?.above_minimum_order_value === 0) ? "" : textMessage});
          //             const fee = parseFloat(deliveryMatrixRowValues?.above_minimum_order_value ?? 0).toFixed(2);
          //             setDeliveryFee(fee);
          //             setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          // else
          // {
          //   dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  ""});
          //   setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,parseFloat(0).toFixed(2))
          //   setDeliveryFee(0)
          // }
        }

        return {
          ...couponDiscount,
          discount: couponDiscountValue
        }
      })
      
      setCouponDiscountApplied(updateCouponDetails)
      setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCouponDetails)

      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      
      setAmountDiscountMessage("")
      setAmountDiscountApplied(null)
      setDiscountValue(getAmountConvertToFloatWithFixed(couponDiscountValue,2))
    }
    else
    {
      async function getOrderAmount(subTotalArgument)
      {
        try {
          const getLocalStorageDetail = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
          const getAvailableStore = getLocalStorageDetail ? getLocalStorageDetail.display_id : selectedLocation
          const getPostCode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`))

          let filterPostcode = postCodeForOrderAmount
          
          // let grabPostcodeOutWard = "";
          // if (getPostCode && parseInt(getPostCode.length) === parseInt(7)) 
          // {
          //   filterPostcode = getPostCode.replace(/\s/g, "");
          //   grabPostcodeOutWard = filterPostcode.substring(0, 4);
          // } 
          // else if (getPostCode && parseInt(getPostCode.length) === parseInt(6)) 
          // {
          //   filterPostcode = getPostCode.replace(/\s/g, "");
          //   grabPostcodeOutWard = filterPostcode.substring(0, 3);
          // } 
          // else 
          // {
          //   grabPostcodeOutWard = filterPostcode.substring(0, 2);
          // }

          const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));

          let grabPostcodeOutWard = getDeliveryMatrix?.postcode


          const getSelectedFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))

          const filterData = {
            endData: moment().format("YYYY-MM-DD"),
            active: 1,
            partner: 2,
            brand: BRAND_GUID,
            postcode: grabPostcodeOutWard,
            location: getAvailableStore,
            orderType: getSelectedFilter?.id,
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

            if (parseFloat(subTotalArgument) >= parseFloat(amountDiscounts[workingIndex].need_to_spend)) 
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
              // if index is greater than zero then get the previous index and show the amount discount related to it.
              if(workingIndex > 0)
              {
                let previousIndex = workingIndex - 1;
  
                if (parseFloat(subTotalArgument) >= parseFloat(amountDiscounts[previousIndex].need_to_spend)) 
                {
                  setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,amountDiscounts[previousIndex].amount_guid);
                  setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`,amountDiscounts[previousIndex])
                  setAmountDiscountApplied(amountDiscounts[previousIndex])
                  if (amountDiscounts[previousIndex].discount_type === "P") 
                  {
                    const getThePercentage = amountDiscounts[previousIndex].value / 100;
                    const getDiscount = parseFloat(subTotalArgument) * parseFloat(getThePercentage);
                    setDiscountValue(getAmountConvertToFloatWithFixed(getDiscount, 2));
                  } 
                  else 
                  {
                    const getDiscount = parseFloat(subTotalArgument) - parseFloat(amountDiscounts[previousIndex].value);
                    setDiscountValue(getAmountConvertToFloatWithFixed(getDiscount, 2));
                  }
                } 
              }else {
                window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
                setAmountDiscountApplied(null)
              }
            }

          }
        } catch (error) {
          // window.alert("There is something went wrong, please refresh and try again.")
        }
      };
      getOrderAmount(getAmountConvertToFloatWithFixed(totalValue, 2));
    }

    setTimeout(() => {
      setPaymentLoader(false)
    }, 3000);
  }
  
  const onDeliveryMatrixError = (error) => {
    setTimeout(() => {
      setPaymentLoader(false)
    }, 3000);
    console.log("delivery matrix error:", error);
  }

  const removeCartItem = (id)  =>
  {
    setPaymentLoader(true)
    const checkOrderGuidExistsOrNot = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`)
    const sharedGUID = (checkOrderGuidExistsOrNot) ? JSON.parse(checkOrderGuidExistsOrNot) : orderGuid

    const filterItems = cartData?.filter((cart, index) => index !== id);

    // setIsCartBtnClicked((parseInt(filterItems?.length) > 0) ? true : false)
    setCartData(filterItems);
    setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,filterItems)
    
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
    
    const getDeliveryThePostcodeMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));

    deliveryMatrixMutate({
      selectedLocation,
      selectedPostcode: getDeliveryThePostcodeMatrix?.postcode,
      brandGuid: BRAND_GUID,
      orderId: sharedGUID,
    })
  }

  console.log("checkout display selectedPostcode: ", selectedPostcode)
  // Handle Coupon Code functionality
  function handleCouponCode(event) 
  {
    setCoupon(event.target.value);
    setCouponCodeError("")
  }
  
  async function handleFindCouponCode() 
  {
    try {
      setPaymentLoader(true)
      
      if(parseInt(coupon?.length) === parseInt(0) || coupon === "")
      {
        setCouponCodeError("Please enter coupon code!")
        setTimeout(() => {
          setPaymentLoader(false)
        }, 3000);
  
        return 
      }
      const checkCouponCodeIsAlreadyApplied = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`))
    
      if(checkCouponCodeIsAlreadyApplied && parseInt(checkCouponCodeIsAlreadyApplied?.length) > parseInt(0))
      {
        // first check the same coupon is already applied or not
        const checkTheCouponIsAlreadyApplied = checkCouponCodeIsAlreadyApplied?.filter((check) => check.code.toLowerCase() === coupon.toLowerCase())
    
        if(checkCouponCodeIsAlreadyApplied && parseInt(checkTheCouponIsAlreadyApplied?.length) > parseInt(0))
        {
          setCouponCodeError("Code already applied!")
          setTimeout(() => {
            setPaymentLoader(false)
          }, 3000);
          return      
        }
        for(let appliedCoupon of checkCouponCodeIsAlreadyApplied)
        {
          if(parseInt(appliedCoupon.user_in_conjuction) === parseInt(0))
          {
            setCouponCodeError("You can not use other coupons with previous one!")
            setTimeout(() => {
              setPaymentLoader(false)
            }, 3000);
            return
          }
        }
      }

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
        setCouponCodeError("Coupon code not found")
        setTimeout(() => {
          setPaymentLoader(false)
        }, 3000);
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
            setPaymentLoader(false)
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
            discountedCoupon = parseFloat(couponData?.value).toFixed(2)
          }
          else
          {
            discountedCoupon = parseFloat(couponData?.value).toFixed(2)
          }
        }
        else
        {
          if(getCouponCodeFromSession && parseInt(getCouponCodeFromSession.length) > parseInt(0))
          {
            // first get difference of discount and subtotal
            discountedCoupon = parseFloat(couponData?.value).toFixed(2)
          }
          else
          {
            discountedCoupon = parseFloat(couponData?.value).toFixed(2)
          }
        }
      }
      
      // delivery fee
      if(parseInt(couponData?.free_delivery) === parseInt(1))
      {
        let textMessage = "";
        if(selectedFilter?.id === DELIVERY_ID)
        {
          // textMessage = <strong>Free Delivery</strong>;
          textMessage = ""
        }
        dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
        const couponFee = getAmountConvertToFloatWithFixed(0, 2);
        setDeliveryFee(couponFee)
        setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,couponFee)
      }
      else 
      {
        // if (selectedFilter?.id === DELIVERY_ID)
        // {
        //   const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))
        //   const subTotal = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`))

        //   if(getDeliveryMatrix && parseInt(getDeliveryMatrix?.delivery_matrix_row_values?.length) > parseInt(0))
        //   {
        //     // if(subTotal)
        //     // {
        //     //   const findExactDeliveryFee = getDeliveryMatrix?.delivery_matrix_row_values?.find((findDelivery) => parseFloat(findDelivery.min_order_value))
        //     //   for(let deliveryMatrixRowValues of getDeliveryMatrix?.delivery_matrix_row_values)
        //     //   {
        //     //     if (parseFloat(subTotal) >= parseFloat(deliveryMatrixRowValues?.min_order_value)) 
        //     //     {
        //     //       if (deliveryMatrixRowValues?.above_minimum_order_value === null || deliveryMatrixRowValues?.above_minimum_order_value === 0)  
        //     //       {
        //     //         // const textMessage = <strong>Free Delivery</strong>;
        //     //         const textMessage = ""
        //     //         dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  textMessage});
        //     //         const fee = getAmountConvertToFloatWithFixed(0, 2);
        //     //         setDeliveryFee(fee);
        //     //         setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,fee)
        //     //       } 
        //     //       else 
        //     //       {
        //     //         // const textMessage = <strong>Free Delivery</strong>;
        //     //         const textMessage = ""
        //     //         dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  (deliveryMatrixRowValues?.above_minimum_order_value === 0) ? "" : textMessage});
        //     //         const couponFee = getAmountConvertToFloatWithFixed(deliveryMatrixRowValues?.above_minimum_order_value ?? 0, 2);
        //     //         setDeliveryFee(couponFee)
        //     //         setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,couponFee)
        //     //       }
        //     //     }
        //     //   }
        //     // }
        //   }
        // }
        // else
        // {
        //   setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_fee`,parseFloat(0).toFixed(2))
        //   setDeliveryFee(0)
        //   dispatch({ type: "SET_DELIVERY_MESSAGE", payload:  ""});
        // }
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

      setTimeout(() => {
        // setPaymentLoader(false)
          const checkOrderGuidExistsOrNot = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`)
          const sharedGUID = (checkOrderGuidExistsOrNot) ? JSON.parse(checkOrderGuidExistsOrNot) : orderGuid
          deliveryMatrixMutate({
            selectedLocation,
            selectedPostcode,
            brandGuid: BRAND_GUID,
            orderId: sharedGUID,
          })
      }, 3000);
      
    } catch (error) {
      setTimeout(() => {
        setPaymentLoader(false)
      }, 3000);
      setCouponCodeError(error?.response?.data?.message)
      // window.alert("Please refresh and apply again coupon code.")
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

  // const onStoreSuccess = async (data) => {
  //   // first check the order guid id in localStorage if it is null then store information then update them.
  //   const responseData = data?.data?.data?.order?.order_total;
  //   const { clientSecret, type } = data?.data?.data;

  //   const externalGUID = data?.data?.data?.order?.external_order_id

  //   // setTimeout(() => {
  //   //   setPaymentLoader(false)
  //   // }, 3000);
  //   if (data?.data?.status === "success") 
  //   {
  //     setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,externalGUID);
  //     handleBoolean(true, "isPlaceOrderButtonClicked")
  //   }

  // }

  // const onStoreError = (error) => {
    
  //   // setTimeout(() => {
  //   //   setIsLoading(false)
  //   // }, 3000);
  //   // if(error?.response?.data?.status.includes("success"))
  //   // {
  //   //   route.push(`/payment/${data?.data?.data?.order?.external_order_id}`);
  //   // }
  //   // setErrormessage("There is something went wrong!. Please refresh and try again.")
  //   window.alert("There is something went wrong!. Please refresh and try again.")
  //   return
  // }

  // const { isLoading: storeLoading, isError: storeError, reset: storeReset, isSuccess: storeSuccess, mutate: createOrderMutation } = usePostMutationHook('create-customer-order-guid',`/create-order-guid`,onStoreSuccess, onStoreError)

  const handleCheckoutClicked = () => {

    setIsScheduleClicked(isScheduleIsReady)
    setPaymentLoader(true)

    async function storeCheckoutClicked() {
      try {
         const placeOrderGetStoreGUID = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`));
  
        const data = {
          location_guid: placeOrderGetStoreGUID === null ? storeGUID : placeOrderGetStoreGUID?.display_id,
        }

        const response = await axiosPrivate.post('/store-pause-details', data)

        const { pauseStore } = response?.data?.data

        if(pauseStore !== null && pauseStore !== undefined)
        {
          // if kitchen staff make it pause then set to default condition.
          setPauseState({
            id: pauseStore?.uuid,
            isShowModal: true,
            dateTime: pauseStore.datetime
          })
          // setBooleanObj((prevData) => ({
          //   ...prevData,
          //   isPlaceOrderButtonClicked: false,
          // }))
          handleBoolean(false, "isPlaceOrderButtonClicked")
        }
        else
        {
          // if kitchen staff do not make it pause then set to default condition.
          setPauseState({
            id: 0,
            isShowModal: false,
            dateTime: ""
          })
          // setBooleanObj((prevData) => ({
          //   ...prevData,
          //   isPlaceOrderButtonClicked: true,
          // }))

          handleBoolean(true, "isPlaceOrderButtonClicked")
        }

      } catch (error) {
        console.log("ïs clicked error:", error);
        setPaymentLoader(false)
        
      }
    }
    storeCheckoutClicked()
  }

  const handleRemoveCouponCode = (index) => {
    setPaymentLoader(true)
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
    const checkOrderGuidExistsOrNot = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`)
    const sharedGUID = (checkOrderGuidExistsOrNot) ? JSON.parse(checkOrderGuidExistsOrNot) : orderGuid
    deliveryMatrixMutate({
      selectedLocation,
      selectedPostcode,
      brandGuid: BRAND_GUID,
      orderId: sharedGUID,
    })
  }
 
  const {mutate: deliveryMatrixMutate} = usePostMutationHook('deliveryMatrixData',`/district-delivery-matrix`,onDeliveryMatrixSuccess, onDeliveryMatrixError)

  useEffect(() => {
    if((cartData && parseInt(cartData.length) > parseInt(0)))
    {
      const getSelectStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`);
      const parseToJSobj = JSON.parse(getSelectStore);
      let location = parseToJSobj?.display_id
      setSelectedLocation(parseToJSobj?.display_id)

      const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));

      let postcode = getDeliveryMatrix?.postcode
      const getFilters = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))

      if(getFilters !== null && getFilters !== undefined)
      {
        if(getFilters?.id?.includes(DELIVERY_ID))
        {
          setPostCodeForOrderAmount(getDeliveryMatrix?.postcode);
          setSelectedPostcode(getDeliveryMatrix?.postcode)
        }
        else
        {
          postcode = getDeliveryMatrix?.collection_postcode
          setPostCodeForOrderAmount(getDeliveryMatrix?.collection_postcode);
          setSelectedPostcode(getDeliveryMatrix?.collection_postcode)
        }
      }

      const checkOrderGuidExistsOrNot = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`)
      const sharedGUID = (checkOrderGuidExistsOrNot) ? JSON.parse(checkOrderGuidExistsOrNot) : orderGuid

      deliveryMatrixMutate({
        selectedLocation:location,
        selectedPostcode: postcode,
        brandGuid: BRAND_GUID,
        orderId: sharedGUID,
      })
    }
  }, [cartData,deliveryMatrixMutate,orderGuid, selectedFilter]);

//   if(isLoading)
//   {
//     return(
//       <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
//   <div className="relative h-20 w-20">
//     <div className="absolute inset-0 rounded-full border-4 border-red-100"></div>

//     <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600 border-r-red-500"></div>
//   </div>
// </div>
//     )
//   }

  return(
    <>
      
      {
        cartData?.length > 0 ?
        <>
          <h5 className="text-lg font-semibold">My Order</h5>
          
          <div className="w-full max-h-[60vh] overflow-y-auto rounded border border-gray-200">
            {/* Header Row */}
            <div className="flex border-b border-gray-300 text-sm font-semibold text-gray-700 px-4 py-3">
              <div className="flex-[6] space-y-1 font-semibold text-medium">Item</div>
              <div className="flex-[1] text-right font-semibold text-medium">Price</div>
              <div className="flex-[1] text-right font-semibold text-medium"></div>
            </div>

            <ul className="w-full">
              {
                cartData?.map((data, index) => {
                  const hasNotExtras = {
                    ...data,
                    modifier_group: data?.modifier_group?.filter(x => !x?.isExtras),
                  };
                  const hasExtras = {
                    ...data,
                    modifier_group: data?.modifier_group?.filter(x => x?.isExtras),
                  };

                  // display

                  return(
                    <li key={index} className="flex justify-between items-start px-2 py-3 border-b border-gray-300 text-sm text-gray-700">
                      {/* Left Section: Item Description */}
                      <div className="flex-[6] space-y-1">
                        <Link  className="block space-y-1" href={`/${data?.category_slug}/${data?.slug}/edit`}>
                          <div className="flex flex-wrap sm:flex-nowrap gap-1">
                            <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">
                              <b>{parseInt(data?.quantity)} x </b> {data?.category_name}:
                            </div>

                            {/* Right detail (e.g., “2 x Classic Chicken Burger”) */}
                            <div className="flex-1 font-semibold break-words">
                              {parseInt(data?.quantity)} x {data?.title}
                            </div>
                          </div>
                          {
                            hasNotExtras?.modifier_group?.map((modifier, modifierIndex) =>
                              (modifier?.is_modifier_selected && modifier?.modifier_secondary_items?.length > 0) &&
                              modifier?.modifier_secondary_items?.map((secondItem, secondItemIndex) =>
                                (!secondItem?.default_option && secondItem?.item_select_to_sale) && (
                                  <Fragment key={`${index}.${modifierIndex}.${secondItemIndex}`}>
                                  
                                    <div className="flex flex-wrap sm:flex-nowrap gap-1">
                                      <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">
                                        {`${modifier?.title}:`}
                                      </div>
                                      <div className="flex-1 font-semibold break-words">
                                        {modifier?.select_single_option > 1 && modifier?.max_permitted >= 1 ? `${parseInt(secondItem?.counter)} x ` : ''}
                                        {secondItem?.title}
                                        {parseInt(secondItem?.price) > 0 && ` + ${secondItem?.country_price_symbol}${parseFloat(secondItem?.price).toFixed(2)}`}
                                      </div>
                                    </div>

                                    {/* Secondary Modifiers */}
                                    {secondItem?.secondary_item_modifiers?.map((secModifier, secModifierIndex) =>
                                      (secModifier?.is_modifier_selected && secModifier?.secondary_items_modifier_items?.length > 0) &&
                                      secModifier?.secondary_items_modifier_items?.map((secItem, secItemIndex) =>
                                        secItem?.item_select_to_sale && (
                                           <div key={`${index}.${modifierIndex}.${secondItemIndex}.${secModifierIndex}.${secItemIndex}`} className="flex flex-wrap sm:flex-nowrap gap-1">
                                                <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">
                                              {secModifier.isExtras ? `${modifier?.title}:` : ''}
                                            </div>
                                            <div className="flex-1 font-semibold break-words">
                                              {secModifier?.select_single_option > 1 && secModifier?.max_permitted >= 1 ? `${parseInt(secItem?.counter)} x ` : ''}
                                              {secItem?.title}
                                              {parseInt(secItem?.price_info) > 0 && ` + ${secItem?.country_price_symbol}${parseFloat(secItem?.price_info).toFixed(2)}`}
                                            </div>
                                          </div>
                                        )
                                      )
                                    )}
                                  </Fragment>
                                )
                              )
                            )
                          }
                          
                          {/* Extras */}
                          {
                            hasExtras?.modifier_group?.map((modifier, modifierIndex) =>
                            (modifier?.is_modifier_selected && modifier?.modifier_secondary_items?.length > 0) &&
                            modifier?.modifier_secondary_items?.map((secondItem, secondItemIndex) =>
                              (!secondItem?.default_option && secondItem?.item_select_to_sale) && (
                                <Fragment key={`${index}.${modifierIndex}.${secondItemIndex}`}>

                                  <div className="flex flex-wrap sm:flex-nowrap gap-1">
                                        <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">
                                      {`${modifier?.title}:`}
                                    </div>
                                    <div className="flex-1 font-semibold break-words">
                                      {modifier?.select_single_option > 1 && modifier?.max_permitted >= 1 ? `${parseInt(secondItem?.counter)} x ` : ''}
                                      {secondItem?.title}
                                      {parseInt(secondItem?.price) > 0 && ` + ${secondItem?.country_price_symbol}${parseFloat(secondItem?.price).toFixed(2)}`}
                                    </div>
                                  </div>

                                  {/* Secondary Modifiers for Extras */}
                                  {secondItem?.secondary_item_modifiers?.map((secModifier, secModifierIndex) =>
                                    (secModifier?.is_modifier_selected && secModifier?.secondary_items_modifier_items?.length > 0) &&
                                    secModifier?.secondary_items_modifier_items?.map((secItem, secItemIndex) =>
                                      secItem?.item_select_to_sale && (

                                        <div key={`${index}.${modifierIndex}.${secondItemIndex}.${secModifierIndex}.${secItemIndex}`} className="flex flex-wrap sm:flex-nowrap gap-1">
                                          
                                        <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">

                                            {secModifier.isExtras ? `${modifier?.title}:` : ''}
                                          </div>
                                          <div className="flex-1 font-semibold break-words">
                                            {secModifier?.select_single_option > 1 && secModifier?.max_permitted >= 1 ? `${parseInt(secItem?.counter)} x ` : ''}
                                              {secItem?.title}
                                              {parseInt(secItem?.price_info) > 0 && ` + ${secItem?.country_price_symbol}${parseFloat(secItem?.price_info).toFixed(2)}`}
                                          </div>
                                        </div>

                                      )
                                    )
                                  )}
                                </Fragment>
                              )
                            )
                            )
                          }
                        </Link>
                      </div>

                      {/* Right Section: Price & Delete Icon */}
                      <div className="flex-[1] text-right font-semibold text-gray-700 pt-1">
                        &pound;{parseFloat(data?.total_order_amount).toFixed(2)}
                      </div>

                      <div className="flex-[1] text-right pt-1">
                        <button className="text-gray-500 hover:text-red-600 transition" onClick={() => removeCartItem(index)}>
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            viewBox="0 0 16 16"
                            className="w-4 h-4 inline-block"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </li>
                  )
                })
              }

                {/* Amount Discount */}
              {amountDiscountApplied !== null && (
                <li className="flex justify-between items-start px-2 py-3 border-b border-gray-300 text-sm text-gray-700">
                  <div className="flex-[6] space-y-1">
                    <div className="flex flex-wrap sm:flex-nowrap gap-1">
                      <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">
                        {amountDiscountApplied?.name}:
                      </div>

                      {/* Right detail (e.g., “2 x Classic Chicken Burger”) */}
                      <div className="flex-1 font-semibold break-words">
                        {parseFloat(amountDiscountApplied?.value).toFixed(2)} {amountDiscountApplied?.discount_type === "P" ? "%" : "£"}
                      </div>
                    </div>
                  </div>

                  <div className="flex-[1] text-right font-semibold text-gray-700 pt-1">
                    (&pound;{parseFloat(discountValue).toFixed(2)})
                  </div>

                  <div className="flex-[1] text-right pt-1">
                    {/* <button className="d-none text-gray-500 hover:text-red-600 transition" onClick={() => handleRemoveCouponCode(index)}>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 16 16"
                        className="w-4 h-4 inline-block"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"
                        ></path>
                      </svg>
                    </button> */}
                  </div>

                </li>
              )}

              {/* Coupons */}
              {couponDiscountApplied?.map((coupon, index) => (
                <li key={index} className="flex justify-between items-start px-2 py-3 border-b border-gray-300 text-sm text-gray-700">
                  <div className="flex-[6] space-y-1">
                    <div className="flex flex-wrap sm:flex-nowrap gap-1">
                      <div className="w-[80px] flex-shrink-0 text-gray-500 font-medium break-words">
                        {coupon?.name}:
                     </div>

                      {/* Right detail (e.g., “2 x Classic Chicken Burger”) */}
                      <div className="flex-1 font-semibold break-words">
                        {coupon?.discount_type === "M" && "£"} {parseFloat(coupon?.value).toFixed(2)} {coupon?.discount_type === "P" && "%"}
                      </div>
                    </div>
                  </div>

                  <div className="flex-[1] text-right font-semibold text-gray-700 pt-1">
                    (&pound;{parseFloat(coupon?.discount).toFixed(2)})
                  </div>

                  <div className="flex-[1] text-right pt-1">
                    <button className="text-gray-500 hover:text-red-600 transition" onClick={() => handleRemoveCouponCode(index)}>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 16 16"
                        className="w-4 h-4 inline-block"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.667.667V2H14v2H2V2h3.333V.667h5.334zM3.333 5.333h9.334v10H3.333v-10z"
                        ></path>
                      </svg>
                    </button>
                  </div>

                </li>
              ))}

            </ul>

          </div>

          <div className="mt-[2vh] space-y-4">
            {/* Coupon Input Section */}
            {couponCodeError !== "" && (
              <p className="text-red-600 text-sm">{couponCodeError}</p>
            )}

            <div className="flex w-full sm:w-auto rounded-md overflow-hidden border border-gray-900">
              <input
                type="text"
                value={coupon}
                onChange={handleCouponCode}
                placeholder="Enter Discount Code"
                className="flex-1 px-4 py-2 bg-[#eaeaea] text-[16px] outline-none border-none focus:ring-0"
              />
              <button
                type="button"
                onClick={handleFindCouponCode}
                className="bg-black hover:bg-gray-900 text-white font-semibold px-4 py-2 text-sm transition whitespace-nowrap"
                style={{
                  backgroundColor:
                    layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                      ?.buttonBackgroundColor || 'black',
                  color:
                    layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                      ?.buttonColor || 'white',
                }}
              >
                Apply
              </button>
            </div>

          </div>


          <div className="flex mt-4">
            {/* Messages */}
            <div className="w-40 text-sm text-gray-600 space-y-1">
              {/* Success or info message */}
              {amountDiscountMessage && (
                <p className="text-green-600 font-medium">{amountDiscountMessage}</p>
              )}
              {state.messagesObject.deliveryMessage && (
                <p className="font-semibold text-medium">{state.messagesObject.deliveryMessage}</p>
              )}
              {state.messagesObject.minimumOrderMessage && (
                <p className="font-semibold text-medium">{state.messagesObject.minimumOrderMessage}</p>
              )}
            </div>

            {/* Checkout Details */}
            <div className="w-60 text-sm">
              {/* Subtotal */}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <div className="w-20 text-right">Subtotal</div>
                <div className="">
                  &pound;<span>{getAmountConvertToFloatWithFixed(subtotalOrderAmount, 2)}</span>
                </div>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <div className="w-20 text-right">{selectedFilter?.name}</div>
                <div className="">
                  &pound;{getAmountConvertToFloatWithFixed(deliveryFee, 2)}
                </div>
              </div>

              {/* Discount */}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <div className="w-20 text-right">Discount</div>
                <div className="">
                  (&pound;<span>{getAmountConvertToFloatWithFixed(discountValue, 2)}</span>)
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <div className="w-20 text-right">Total</div>
                <div className="">&pound;{totalOrderAmountValue}</div>
              </div>

            </div>
          </div>
        
          {
            isScheduleIsReady &&
            <div className="ml-2.5 mb-1 mt-3 text-red-600">
              {isScheduleEnabled > 0 ? (
                <p className="text-warning text-sm">
                  {/* Schedule {selectedFilter?.id === DELIVERY_ID ? "delivery" : "collection"} is available on {scheduleMessage}. */}
                  {/* Please note that scheduled {selectedFilter?.id === DELIVERY_ID ? "delivery" : "collection"} will be available as usual on {scheduleMessage}. */}
                  Please note that scheduled {selectedFilter?.id === DELIVERY_ID ? "delivery" : "collection"} orders will continue to be available as usual on {scheduleMessage}.
                </p>
              ) : (
                <p className="text-sm">
                  To schedule your order for {scheduleMessage}, go to checkout.
                </p>
              )}
            </div>
          }

          {
            state.messagesObject.minimumOrderMessage.length === undefined || isScheduleEnabled > 0 ?
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-[150px] bg-black mt-3 text-white font-semibold text-lg py-1 rounded-xl hover:bg-gray-800 duration-200"
                >
                  Checkout
                </button>
              </div>
            :
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-[150px] bg-green-700 mt-3 text-white font-semibold text-lg py-1 rounded-xl hover:bg-green-800 duration-200"
                  onClick={handleCheckoutClicked}
                >
                  Checkout
                </button>
              </div>
          }
          <div style={{marginBottom: "50px"}}></div>
        </>
        :
        <>
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 my-10">
            {/* Icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-5-4a1 1 0 11-2 0 1 1 0 012 0zm-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-lg font-bold text-gray-800 uppercase">
              Your cart is empty
            </h2>

            <p className="mt-1 text-sm text-gray-500 max-w-xs">
              Looks like you haven’t added anything yet.
            </p>
          </div>
        </>
      }
    </>
  )
}
