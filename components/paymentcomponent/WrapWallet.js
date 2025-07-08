"use client";
import HomeContext from "@/contexts/HomeContext";

import { ContextCheckApi } from "@/app/layout";
import { usePostMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_SIMPLE_GUID, BRAND_GUID, PARTNER_ID, axiosPrivate, DELIVERY_ID } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, setLocalStorage, validatePhoneNumber } from "@/global/Store";
import { round15 } from "@/global/Time";
import moment from "moment";
import { Fragment, useContext, useEffect, useState } from "react";
import { PaymentRequestButtonElement, useStripe } from "@stripe/react-stripe-js";

export default function WrapWallet()
{
    const {
        loader,
        setLoader,
        booleanObj,
        dayOpeningClosingTime,
        isTimeToClosed,
        couponDiscountApplied,
        totalOrderAmountValue,
        setTotalOrderAmountValue,
        setIsTimeToClosed,
        storeGUID,
        cartData,
        postcode,
        street1,
        street2,
        isLocationBrandOnline,
    
        setIsLocationBrandOnline,
        setAtFirstLoad,
        setIsCartBtnClicked,
        setHeaderCartBtnDisplay,
        setHeaderPostcodeBtnDisplay,
        websiteModificationData,
        setCartData,
        handleBoolean,
        selectedFilter,
        isScheduleClicked,
        isScheduleIsReady,
        scheduleMessage,
        isScheduleForToday,
        scheduleTime,
      } = useContext(HomeContext);

    const stripe = useStripe()
    const [paymentRequest, setPaymentRequest] = useState(null);

    const [deliveryTime, setDeliveryTime] = useState("");
    
    // This submit send request to Database and stripe.
    const hitSmsAndEmailCall = async (orderId) =>
    {
      const url = window.location.origin
      const pathname = "track-order"
      setLoader(true)
      try 
      {
        const data = {
          guid: orderId,
          url: url,
          pathname: pathname
        } 

        const response = await axiosPrivate.post(`/send-sms-and-email`, data)

        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        setCartData([])
        // setLoader(false)
        // if(response?.data?.status === "success")
        // {
        // first check this is delivery order or collection order.
        if (selectedFilter?.id === DELIVERY_ID)
          {
            window.location.href = `/track-order/${orderId}`
            return
          }
          window.location.href = `/thank-you/${orderId}`
        
        // }

      } 
      catch (error) 
      {
        // window.alert(error?.response?.data?.error)
        setLoader(false)
        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        setCartData([])

        if (selectedFilter?.id === DELIVERY_ID)
        {
          window.location.href = `/track-order/${orderId}`
          return
        }
        window.location.href = `/thank-you/${orderId}`
      }
    }
        
    // This method will hit when payment successfully done, to send sms and email to user.
    const afterPaymentSavedOrderUpdate = async (orderId,paymentIntent) =>
    {
      try 
      {
        const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const data = {
          guid: orderId,
          amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
          stripeid: paymentIntent.id,
          visitorGUID: visitorInfo.visitorId
        }  

        const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)
        // Here need to hit sms and email call.

        if(response?.data?.status === "success")
        {
          hitSmsAndEmailCall(orderId)
        }
      } 
      catch (error) 
      {
        setLoader(false)
      }
    }

    const onStoreSuccess = async (data) => {
      // first check the order guid id in localStorage if it is null then store information then update them.
      const responseData = data?.data?.data?.order?.order_total;
      const { clientSecret, type } = data?.data?.data;

      const orderGUID = data?.data?.data?.order?.external_order_id

      if (data?.data?.status === "success") 
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
      }

      if(type === "card")
      {
      
      }
      else
      {
        try
        {
          // ✅ Confirm payment with Stripe
          const result = await stripe.confirmCardPayment(clientSecret); // No payment_method object needed
          
          if (result.error) {
            alert("Payment failed");
          } else {
            afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent);
          }
        } catch (err) {
          alert("Payment failed");
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
        const { clientSecret, type } = data?.data?.data;
        
        const orderGUID = data?.data?.data?.order?.external_order_id
        if (data?.data?.status === "success") 
        {
        
            setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
    
        }

        if(type === "card")
        {
        
        }
        else
        {
            try
            {
              // ✅ Finish wallet UI prompt
          
              // ✅ Confirm payment with Stripe
              const result = await stripe.confirmCardPayment(clientSecret); // No payment_method object needed
          
              if (result.error) {
                alert("Payment failed");
              } else {
                afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent);
              }
            } catch (err) {
                alert("Payment failed");
            }
        }
    }
    
  const onPatchError = (error) => {
      console.error("patch error:", error);
      window.alert("There is something went wrong!. Please refresh and try again.")
      return
  }
  
  const {isLoading: patchLoading, isError: postError, isSuccess: postSuccess, reset: postReset, mutate: postMutation} = usePostMutationHook('customer-update',`/update-customer-details`, onPatchSuccess, onPatchError)
  
  const loadingState = patchLoading || storeLoading

  async function fetchLocationDeliveryEstimate() {
    // Get the current day name
    try {
      const placeOrderGetStoreGUID = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`));

      const data = {
        location_guid: placeOrderGetStoreGUID === null ? storeGUID : placeOrderGetStoreGUID?.display_id,
        brand_guid: BRAND_GUID,
        day_number: moment().isoWeekday(),
        partner: PARTNER_ID,
      };

      const response = await axiosPrivate.post(`/website-delivery-time`, data);

      const { brandExists } = response?.data?.data
      
      setIsLocationBrandOnline(brandExists)
      // Write logic if the closing is up or come closer than show information.brandDeliveryEstimatePartner
      var startTime   = response?.data?.data?.brandDeliveryEstimatePartner?.start_time;
      var endTime     = response?.data?.data?.brandDeliveryEstimatePartner?.end_time;

      var timeForm    = response?.data?.data?.brandDeliveryEstimatePartner?.time_from;
      var deliveryTo  = response?.data?.data?.brandDeliveryEstimatePartner?.time_to;
      var d = new Date();
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      if (startTime == "24:00:00") {
        startTime = "23:59:59";
      }
      var time_from_temp = months[d.getMonth()] +" " +d.getDate() +", " +d.getFullYear() +" " +startTime;
      var time_to_temp   = months[d.getMonth()] +" " +d.getDate() +", " +d.getFullYear() +" " +endTime;

      var time_from = new Date(time_from_temp);
      var time_to = new Date(time_to_temp);

      if (Date.parse(time_from) > Date.parse(d)) 
      {
        time_from.setMinutes(time_from.getMinutes() + parseInt(deliveryTo));
        var start_time = new Date(time_from);
        start_time = start_time.getHours() + ":" + round15(start_time.getMinutes());
      } 
      else 
      {
        d.setMinutes(d.getMinutes() + parseInt(deliveryTo));
        var start_time  = new Date(d);
        start_time      = start_time.getHours() + ":" + round15(start_time.getMinutes());
      }
      var current_date = new Date();
      // Changed to brand closing time + max delivery time at 4/6/2021

      if (Date.parse(time_to) < Date.parse(current_date)) {
        setIsTimeToClosed(true);
        return;
      }
      time_to.setMinutes(time_to.getMinutes() + parseInt(deliveryTo) - 1);
      let end_time = new Date(time_to);

      end_time = end_time.getHours() + ":" + end_time.getMinutes();
      if (start_time == "23:60") 
      {
        end_time = start_time;
      }

      if (parseFloat(end_time.split(":")[0]) == 0) 
      {
        end_time = "23:59";
      }

      if (start_time.split(":")[1].length == 1) 
      {
        start_time = start_time.split(":")[0] + ":" + start_time.split(":")[1] + "0";
      }

      if (parseFloat(start_time.split(":")[1]) == 60) {
        var temp_time = start_time.split(":")[0] + ":59";
      } else {
        var temp_time = start_time;
      }
      // temp_time = tConvert(temp_time);

      setDeliveryTime(temp_time);
  
    } catch (error) {
    
    }
  }
            
            
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

    fetchLocationDeliveryEstimate();
    
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
              const updatedDeliveryTime       = moment(`${moment().format("YYYY-MM-DD")} ${deliveryTime}`,"YYYY-MM-DD HH:mm:ss");

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

              // Street2 can be made from the rest of addressParts (city, state, etc.)
              const street2 = addressParts.slice(1).join(', '); // Join back the rest

              const data = {
                customer:           customerAuth === null ? 0 : customerTemp?.id,
                address:            customerAuth === null ? 0 : filterAddress?.id,
                due:                "due",
                
                email:              ev.payerEmail,
                phone:              ev.payerPhone,
                street1:            myStreet1 || street1,
                street2:            street2 || street2,
                postcode:           ev.paymentMethod.billing_details.address.postal_code || postcode,

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
                doorHouseName:      houseNameOrNumber,
                isBySmsClicked:     0,
                
                isByEmailClicked:   0,
                driverInstruction:  "",
                sub_total_order:    subTotalOrderLocal,
                
                
                orderAmountDiscount_guid: orderAmountDiscountValue,
                is_schedule_order: parseInt(isScheduleForToday) > parseInt(0) ? true : false,
                delivery_estimate_time: (parseInt(isScheduleForToday) > parseInt(0) ? scheduleTime : updatedDeliveryTime._i),
                
                // delivery_estimate_time: moment(deliveryTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
                delivery_fee:             deliveryFeeLocalStorage,
                coupons:                  couponCodes,
                order_guid:               orderFromDatabaseGUID !== null ? orderFromDatabaseGUID : null,
                is_verified:              booleanObj?.isCustomerVerified,
        
                
                order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
                // order: orderId,
                brand: BRAND_GUID,

                // for wallet,
                type: "wallet",
                payment_method: ev.paymentMethod.id,
                is_paid_via_wallet: 1,
              };
              
              if (orderFromDatabaseGUID !== null) { 
              postMutation(data) 
              return
              }
      
              storeMutation(data)
          
          } catch (err) {
              console.error(err);
              ev.complete("fail");
              alert("Payment failed");
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
