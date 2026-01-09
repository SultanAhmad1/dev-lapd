"use client";
import HomeContext from "@/contexts/HomeContext";

import { usePostMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_SIMPLE_GUID, BRAND_GUID, PARTNER_ID, axiosPrivate } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, setLocalStorage } from "@/global/Store";
import moment from "moment-timezone";
import { Fragment, useContext, useEffect, useState } from "react";
import { CardNumberElement, PaymentRequestButtonElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function WrapWallet({deliveryTime,customerDetailObj,due,setPaymentError})
{
    const {
      asapOrRequested,
      setPaymentLoader,
      booleanObj,
      dayOpeningClosingTime,
      couponDiscountApplied,
      totalOrderAmountValue,
      setTotalOrderAmountValue,
      setIsTimeToClosed,
      storeGUID,
      cartData,
      postcode,
      street1,
      street2,
      setCartData,
      handleBoolean,
      selectedFilter,
      isScheduleClicked,
      isScheduleIsReady,
      scheduleMessage,
      isScheduleForToday,
      orderGuid,
      setOrderGuid,
    } = useContext(HomeContext);

    const stripe = useStripe()
    const elements = useElements();

    const [paymentRequest, setPaymentRequest] = useState(null);
        
    // This method will hit when payment successfully done, to send sms and email to user.
    const afterPaymentSavedOrderUpdate = async (orderId,paymentIntent, paymentIntentAmountPaid) =>
    {
      try 
      {
        setPaymentLoader(true)
        const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const data = {
          guid: orderId,
          // amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
          amount_paid: getAmountConvertToFloatWithFixed(paymentIntentAmountPaid / 100,2),
          // stripeid: paymentIntent.id,
          stripeid: paymentIntent,
          visitorGUID: visitorInfo.visitorId,
          placed: moment().tz("Europe/London").format("YYYY-MM-DD HH:mm:ss"),
        }  

        const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)
        // return
        // Here need to hit sms and email call.
        const orderData = response?.data?.data?.order      
     
        
          // hitSmsAndEmailCall(orderId, orderData)

          setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
          setOrderGuid(null)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
          setCartData([])

          // window.alert("Your order has been received.")

          const orderType = Number(orderData?.order_type_filter_id);
          if (orderType === 4) {
            window.location.href = `/track-order/${orderId}`;
          } else {
            window.location.href = `/thank-you/${orderId}`;
          }

      } 
      catch (error) 
      {
        console.log("show error update amounts:", error);
        
        setPaymentLoader(false)
      }
    }

    const onStoreSuccess = async (data) => {
      // first check the order guid id in localStorage if it is null then store information then update them.
      const responseData = data?.data?.data?.order?.order_total;
      const { clientSecret, type, paymentIntentId, paymentIntentAmountPaid } = data?.data?.data;

      const orderGUID = data?.data?.data?.order?.external_order_id

      if (data?.data?.status === "success") 
      {
        setOrderGuid(orderGUID)
        setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
      }

      if(type === "card")
      {
      
      }
      else
      {
        try
        {
         
          afterPaymentSavedOrderUpdate(orderGuid, paymentIntentId, paymentIntentAmountPaid);
          // --- Fallback failure ---
          ev.complete("fail");
          setPaymentError(resp?.error || "Payment failed ");

        } catch (err) {
          const errorMessage = err.response.data.error
          if (errorMessage.toLowerCase().includes("minimum charge amount")) {
            setPaymentError("Amount is too low for this currency.");
          }
          else if (errorMessage.toLowerCase().includes("declined")) {
              setPaymentError("Your card was declined.");
          }
          else if (errorMessage.toLowerCase().includes("insufficient")) {
            setPaymentError("Your card has insufficient funds.");
          }
          else{
            window.alert("There is something went wrong. Please refresh and try again.")
          }
        }
      }
    }
    
    const onStoreError = (error) => {
      window.alert("There is something went wrong!. Please refresh and try again.")
      return
    }
    
    const { isLoading: storeLoading, isError: storeError, reset: storeReset, isSuccess: storeSuccess, mutate: storeMutation } = usePostMutationHook('customer-store',`/store-customer-details`,onStoreSuccess, onStoreError)

    const onPatchSuccess = async (data) => {
      const responseData = data?.data?.data?.order?.order_total;
      const { clientSecret, type,paymentIntentId, paymentIntentAmountPaid } = data?.data?.data;
      
      const orderGUID = data?.data?.data?.order?.external_order_id
      if (data?.data?.status === "success") 
      {
        setOrderGuid(orderGUID)
        setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
  
      }

      if(type === "card")
      {
      
      }
      else
      {
          try
          {
            afterPaymentSavedOrderUpdate(orderGUID, paymentIntentId, paymentIntentAmountPaid);
          } catch (err) {
              const errorMessage = err.response.data.error
              if (errorMessage.toLowerCase().includes("minimum charge amount")) {
                setPaymentError("Amount is too low for this currency.");
              }
              else if (errorMessage.toLowerCase().includes("declined")) {
                  setPaymentError("Your card was declined.");
              }
              else if (errorMessage.toLowerCase().includes("insufficient")) {
                setPaymentError("Your card has insufficient funds.");
              }
              else{
                window.alert("There is something went wrong. Please refresh and try again.")
              }
          }
      }
  }
  
  const onPatchError = (error) => {
    // console.error("patch error:", error);
    const errorMessage = err.response.data.error
    if (errorMessage.toLowerCase().includes("minimum charge amount")) {
      setPaymentError("Amount is too low for this currency.");
    }
    else if (errorMessage.toLowerCase().includes("declined")) {
        setPaymentError("Your card was declined.");
    }
    else if (errorMessage.toLowerCase().includes("insufficient")) {
      setPaymentError("Your card has insufficient funds.");
    }
    else{
      window.alert("There is something went wrong. Please refresh and try again.")
    }
  }
  
  const {isLoading: patchLoading, isError: postError, isSuccess: postSuccess, reset: postReset, mutate: postMutation} = usePostMutationHook('customer-update',`/update-customer-details`, onPatchSuccess, onPatchError)
          
  useEffect(() => {
    const checkTheCart = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}cart`))

    if(checkTheCart === null || checkTheCart === undefined || parseInt(checkTheCart.length) === parseInt(0))
    {
      window.location.reload(true);
      window.location.href = "/"
      return
    }
    // Check if the cart has not any item then back to home page.
    // Check the brand is active or not.
    const useAuthenticate = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))

    if(useAuthenticate !== null)
    {
      handleBoolean(true,'isCustomerVerified')
    }


    const dayNumber = moment().day();
    const dateTime = moment().format("HH:mm");
    const dayName = moment().format("dddd");

    if (dayOpeningClosingTime?.day_of_week?.toLowerCase().includes(dayName.toLowerCase())) 
    {
      const timePeriods = dayOpeningClosingTime?.time_periods;
      if (timePeriods) 
      {
        if (timePeriods?.[0]?.start_time >= dateTime && dateTime <= timePeriods?.[0]?.end_time) 
        {
          setIsTimeToClosed(true);
          return;
        }
      }
    }

    const placeOrderLocalStorageTotal = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`));
    setTotalOrderAmountValue(placeOrderLocalStorageTotal === null ? totalOrderAmountValue : getAmountConvertToFloatWithFixed(JSON.parse(placeOrderLocalStorageTotal),2));
  }, []);
        
      
  useEffect(() => {
      if (stripe &&   totalOrderAmountValue && paymentRequest === null)
      {
        const orderTotalSimpleForm = parseFloat(totalOrderAmountValue) * 100

        const pr = stripe.paymentRequest({
                country: "GB",
                currency: "gbp",
                total: {
                label: 'Total',
                amount: parseInt(orderTotalSimpleForm),
            },
            requestPayerName: true, //👈 request wallet to send me customer name,
            requestPayerEmail: true, //👈 request wallet to send me email address,
            requestShipping: false, // 👈 this is the key to get physical address
            requestBillingAddress: true, //👈 ✅ ADD THIS
            requestPayerPhone: true,
        });

        pr.canMakePayment().then(result => {
            if (result) 
            {
            setPaymentRequest(pr);
            }
        });

        // const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))

        pr.on("paymentmethod", async (ev) => {
            try {
                
                // store or update the data field
                if(!isScheduleClicked && isScheduleIsReady)
                {
                  window.alert(`We are currently closed. To schedule your order for << ${scheduleMessage} >>, go to checkout.`)
                  window.location.href = "/"
                  return
                }

                const subTotalOrderLocal        = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)) === null ? null: getAmountConvertToFloatWithFixed(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)),2);
                const localStorageTotal         = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`)) === null? null: JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`));
                const orderAmountDiscountValue  = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_number`)) === null ? null: JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_number`));
                const orderFilter               = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`));
                const deliveryFeeLocalStorage   = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_fee`)) === null ? null : getAmountConvertToFloatWithFixed(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_fee`)),2);
                const getCouponCode             = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`));
            
                const couponCodes               = parseInt(getCouponCode?.length) > parseInt(0) ? getCouponCode : couponDiscountApplied;

                // let cleanedTime = deliveryTime.replace(/ PM| AM/, ''); // remove AM/PM
                // let updatedDeliveryTime = moment(`${moment().format("YYYY-MM-DD")} ${cleanedTime}`, "YYYY-MM-DD HH:mm");
                // updatedDeliveryTime = updatedDeliveryTime.format("YYYY-MM-DD HH:mm:ss");

                let cleanedTime = deliveryTime.replace(/ PM| AM/i, ''); // remove AM/PM (case-insensitive)
                // Parse the current date
                let baseDate = moment().format("YYYY-MM-DD");
          
                // If isScheduleForToday === 2, add 1 day
                if (isScheduleForToday === 2) {
                  baseDate = moment().add(1, 'day').format("YYYY-MM-DD");
                }
          
                // Combine date and time
                let updatedDeliveryTime = moment(`${baseDate} ${cleanedTime}`, "YYYY-MM-DD HH:mm");
          
                // Format the final result
                updatedDeliveryTime = updatedDeliveryTime.format("YYYY-MM-DD HH:mm:ss");
                
                      
                let orderFromDatabaseGUID = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`));

                const customerAuth = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
                const customerTemp = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`))
            
                const filterAddress = customerTemp?.addresses?.find(address => address?.is_default_address === 1)

                const fullName = ev.payerName ;

                const [firstName, ...lastNameParts] = fullName.trim().split(' ');
                const lastName = lastNameParts.join(' ');

                // Split and trim
                const addressParts = ev.paymentMethod.billing_details.address.line1.split(',').map(part => part.trim());

                // Further split the first part (e.g., "123 Monmouth st")
                const firstPart = addressParts[0] || "";
                const firstPartWords = firstPart.split(' ');

                let houseNameOrNumber = ev.paymentMethod.billing_details.address.line1;
                let myStreet1 = "";
                
                if (firstPartWords.length > 1) {
                    houseNameOrNumber = firstPartWords[0]; // Assume first word is house no
                    myStreet1 = firstPartWords.slice(1).join(' '); // Rest is the street name
                } else {
                    myStreet1 = firstPart; // Only street name available
                }

                const cardElementNumber = elements.getElement(CardNumberElement)

                // Street2 can be made from the rest of addressParts (city, state, etc.)
                const stripeStreet2 = addressParts.slice(1).join(', '); // Join back the rest

                const data = {
                  customer:           customerAuth === null ? 0 : customerTemp?.id,
                  address:            customerAuth === null ? 0 : filterAddress?.id,
                  due:                due,
                  asapOrRequested:    asapOrRequested,
                  email:              ev.payerEmail,
                  phone:              ev.payerPhone,
                  street1:            street1,
                  street2:            street2,
                  postcode:           postcode,

                  lastName:           lastName,
                  firstName:          firstName,
                  password:           null,
                  store:              storeGUID,
                  brand:              BRAND_GUID,
                  order:              cartData,
                  filterId:           orderFilter === null ? selectedFilter?.id : orderFilter.id,
                  filterName:         orderFilter === null ? selectedFilter?.name : orderFilter.name,
                  partner:            PARTNER_ID,
                  total_order:        localStorageTotal === null? getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2): getAmountConvertToFloatWithFixed(JSON.parse(localStorageTotal),2),
                  deliveryTime:       deliveryTime,
                  doorHouseName:      customerDetailObj?.doorHouseName,
                  isBySmsClicked:     0,
                  
                  isByEmailClicked:   0,
                  driverInstruction:  customerDetailObj?.driverInstruction ?? "",
                  sub_total_order:    subTotalOrderLocal,
                  
                  
                  orderAmountDiscount_guid: orderAmountDiscountValue,
                  is_schedule_order: parseInt(isScheduleForToday) > parseInt(0) ? true : false,
                  delivery_estimate_time: updatedDeliveryTime,
                  
                  delivery_fee:             deliveryFeeLocalStorage,
                  coupons:                  couponCodes,
                  order_guid:               orderFromDatabaseGUID ?? orderGuid,
                  is_verified:              booleanObj?.isCustomerVerified,
          
                  
                  order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
                  // order: orderId,
                  brand: BRAND_GUID,

                  // for wallet,
                  type: "wallet",
                  payment_method: ev.paymentMethod.id,
                  is_paid_via_wallet: 1,
                };
                
                setLocalStorage(`${BRAND_SIMPLE_GUID}customer_storage_data_from_wallet`,data)
                if (orderFromDatabaseGUID ?? orderGuid) { 
                  postMutation(data) 
                  return
                }
        
                storeMutation(data)
            
            } catch (err) {
                console.error("Show wallet error here:",err);
                ev.complete("fail");
                const errorMessage = err.response.data.error
                if (errorMessage.toLowerCase().includes("minimum charge amount")) {
                  setPaymentError("Amount is too low for this currency.");
                }
                else if (errorMessage.toLowerCase().includes("declined")) {
                    setPaymentError("Your card was declined.");
                }
                else if (errorMessage.toLowerCase().includes("insufficient")) {
                  setPaymentError("Your card has insufficient funds.");
                }    
                else{
                  window.alert("There is something went wrong. Please refresh and try again.")
                }
            }
        });
      }
  }, [stripe,
    totalOrderAmountValue, 
    paymentRequest,
    isScheduleClicked,
    isScheduleIsReady,
    scheduleMessage,
  ]);

  return(
    <Fragment>
      {paymentRequest && (
      
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}
    </Fragment>
  )
}
