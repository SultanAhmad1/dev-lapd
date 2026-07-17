// PaymentForm.js
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';

import moment from 'moment-timezone';
import { CardCvcElement, CardExpiryElement, CardNumberElement, PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BRAND_SIMPLE_GUID, BRAND_GUID, axiosPrivate, DELIVERY_ID } from '@/global/Axios';
import HomeContext from '@/contexts/HomeContext';
import { useRouter } from "next/navigation";
import { getAmountConvertToFloatWithFixed, setLocalStorage } from '@/global/Store';
import { useWebsite } from '@/app/providers/context/WebsiteContext';
// import stripePromise from './stripe';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const PaymentForm = ({orderId}) => 
{

  const router = useRouter()
  const {layoutWebsiteModification} = useWebsite()

  const {
    setSelectedStoreDetails,
    setOrderGuid,
    setLoader,
    paymentLoader,
    setPaymentLoader,
    setCartData,
    totalOrderAmountValue,
    dayOpeningClosingTime,
    setTotalOrderAmountValue,
    isLocationBrandOnline,
    setIsLocationBrandOnline,
    setAtFirstLoad,
    setBooleanObj,
  } = useContext(HomeContext)

  const addDoorNumberRef = useRef(null);
  const [customerDetailObj, setCustomerDetailObj] = useState({
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    PayNowBottomError: "",
    saveMyDetailsError: "",
    emailError: "Email is required",
    fullNameError: "Full name is required",
  });

  const [isHover, setIsHover] = useState(false);
  
  const [isPaymentButtonReady, setIsPaymentButtonReady] = useState(false)
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const [iIsCardDetailShow, setIsCardDetailShow] = useState(true);
  
  const [isGetErrorFromDatabase, setIsGetErrorFromDatabase] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentFormObject, setPaymentFormObject] = useState({
    orderType: 0,
    orderMessage: "Invalid or expired url",
    orderConfidentialID: "",
  });

  const handleInputs = (event) => {
    const {value, name } = event.target
    setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
  }
  
  /**
   * Check the Brand is active for a location.
  */
  useEffect(() => {
    if(orderId)
    {
      setLoader(false)
      if(addDoorNumberRef.current)
      {
        addDoorNumberRef.current.focus();
      }

      const forceFullyCheckBrandLocationTrue  = async() =>{
        try {
          const response = await axiosPrivate.get(`/location-brand-status/${orderId}`)
          
          const { brandExists, isExpired,order, location } = response?.data?.data
          
          console.log("location brand status:", response);
          
          setLocalStorage(`${BRAND_SIMPLE_GUID}sub_order_total_local`, parseFloat(order.order_total).toFixed(2))
          setTotalOrderAmountValue(parseFloat(order.order_total).toFixed(2))
          setIsGetErrorFromDatabase(isExpired)
          setIsLocationBrandOnline(brandExists)
          
          setCustomerDetailObj((prevData) => ({
            ...prevData,
            firstName: order?.order_detail?.first_name,
            lastName: order?.order_detail?.last_name,
            email: order?.order_detail?.email,
            emailError: order?.order_detail?.email ? "" : "Email is required",
            fullNameError: order?.order_detail?.first_name && order?.order_detail?.last_name ? "" : "Full name is required.",
          }))
          // let orderType = parseInt(order.order_type_filter_id) === parseInt(4) ? "delivery" : "collection"
  
          setPaymentFormObject((prevData) => ({
            ...prevData,
            orderType: order.order_type_filter_id,
            orderMessage: response?.data?.message ?? paymentFormObject?.orderMessage,
            orderConfidentialID: order.external_order_number,
          }))
  
          const selectedStoreData = {
            display_id: location.location_guid,
            store: location.name,
            telephone: location.telephone,
            email: null,
            address: location.address,
            storeDoor: location.door_house_name,
          };
  
          setSelectedStoreDetails(selectedStoreData)
        } catch (error) {
          if(error.response.status === 419)
          {
            setIsGetErrorFromDatabase(true)
            return
          }
        }
      }
  
      setAtFirstLoad(false)
      const dayNumber = moment().day();
      const dateTime  = moment().format('HH:mm')
      const dayName = moment().format('dddd');
      setPaymentLoader(false)
  
      if(dayOpeningClosingTime?.day_of_week?.toLowerCase().includes(dayName.toLowerCase()))
      {
        const timePeriods = dayOpeningClosingTime?.time_periods
        if(timePeriods)
        {
          if(timePeriods?.[0]?.start_time >=dateTime && dateTime <= timePeriods?.[0]?.end_time )
          {
            return
          }
        }
      }
      forceFullyCheckBrandLocationTrue()
    }
  }, [orderId])
  
  // useEffect(() => {
  //   // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
  //   const timeoutId = setTimeout(() => {
  //     // Clear all items in localStorage
  //     localStorage.clear();
  //     router.push("/")
  //     setTimeout(() => {
  //       setPaymentLoader(false);
  //     }, 3000);
  //   }, 60 * 60 * 1000); 

  //   // Clear the timeout if the component is unmounted before 20 minutes
  //   return () => clearTimeout(timeoutId);
  // });

  // This method will hit when payment successfully done, to send sms and email to user.
  const afterPaymentSavedOrderUpdate = async (paymentIntent) =>
  {
    try 
    {
      setPaymentLoader(true)
      const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      const data = {
        guid: orderId,
        amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
        stripeid: paymentIntent.id,
        visitorGUID: visitorInfo.visitorId,
        placed: moment().tz("Europe/London").format("YYYY-MM-DD HH:mm:ss"),
      }  

      const response = await axiosPrivate.post(`/update-till-payment`, data)
      // Here need to hit sms and email call.
      const orderData = response?.data?.data?.order

      // if(response?.data?.status === "success")
      // {
        // here check the order type
        
        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        setOrderGuid(null)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        setCartData([])
        // window.alert("Your order has been received.")
        setPaymentLoader(false)
        const orderType = Number(orderData?.order_type_filter_id);
        // setBooleanObj((prevData) => ({...prevData, isUnableToSendSms: 1, orderGuid: orderId, isPlaceOrderButtonClicked: false, isDeliveryOrder: parseInt(orderType) === parseInt(4) ? 1 : 2}))
        setLocalStorage(`${BRAND_SIMPLE_GUID}isValidNumber`,0)
        // 0 mean valid number
        if(parseInt(orderType) === parseInt(4)) {
          // window.location.href = `/track-order/${orderId}`
          router.push(`/track-order/${orderId}`)
        }
        else
        {
          // window.location.href = `/thank-you/${orderId}`
          router.push(`/thank-you/${orderId}`)
        }
      // }
    } 
    catch (error) 
    {
      window.alert("Your payment has been failed. Please try again or contact support.")
      setPaymentLoader(false)
      // const unableToSendMessage = error?.response?.data?.error;
      
      // if(unableToSendMessage && unableToSendMessage.toLowerCase().includes("unable to send you sms"))
      // {
      //   setLocalStorage(`${BRAND_SIMPLE_GUID}isValidNumber`,1)
      //   if(parseInt(paymentFormObject?.orderType) === parseInt(4)) {
      //     // window.location.href = `/track-order/${orderId}`
      //     router.push(`/track-order/${orderId}`)
      //   }
      //   else
      //   {
      //     // window.location.href = `/thank-you/${orderId}`
      //     router.push(`/thank-you/${orderId}`)
      //   }
      // } 
    }
  }

  const stripeCard = async () => {
    const cardElement = elements.getElement(CardNumberElement);
    // setMyCardElement(cardElement);
    return cardElement;
  };
  
  const createStripePaymentMethod = async (card, payload) => {
    return await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
      },
    });
  };
  
  const createPaymentIntent = async (
    payload,
    paymentMethod,
    type = "card"
  ) => {
    const response =
    await axiosPrivate.post(
        "/payment-form-payment-intent",
        {
          order: 
            payload.order_guid,

          brand:
            BRAND_GUID,

          payment_method:
            paymentMethod,

          type:
            type,

          email: 
            payload.email,

          firstName: 
            payload.firstName,

        }
    );

    return response.data;

  };
  
  /**
   * 
   * @param {Payload method} event 
   * @returns 
  */
  
  const buildCustomerPayload = async (isCard, ev = null) => {
    const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))

    const getTotalFromLocalStorage = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)

    let orderTotalToSend = totalOrderAmountValue

    if(getTotalFromLocalStorage)
    {
      orderTotalToSend = JSON.parse(getTotalFromLocalStorage)
    }
    const city = getCustomerInformation?.street2?.split(',')[0].trim();
  
    return {
      city,
      orderTotalToSend,
      order_total: getAmountConvertToFloatWithFixed(orderTotalToSend,2) * 100, // replace with your desired amount
      order: orderId,
      order_guid: orderId,
      brand: BRAND_GUID,
      email: isCard ? customerDetailObj?.email : ev.payerName,
      firstName: isCard ? customerDetailObj?.firstName : ev.payerEmail,
      lastName: customerDetailObj?.lastName
    }
  }

  const verifyPayment = async (
    orderGuid,
    paymentIntentId,
    amountPaid
  ) => {
    
    try {

      const { data } = await axiosPrivate.post(
        "/update-order-after-successfully-payment-save",
        {
          guid: orderGuid,
          stripeid: paymentIntentId,
          amount_paid: amountPaid / 100,
          placed: moment()
              .tz("Europe/London")
              .format("YYYY-MM-DD HH:mm:ss"),
        }
      );

      return {
        success: true,
        data,
      };

    } catch (error) {

      console.log("verify payment data error: ", error);
      
      return {
        success: false,
        data: error?.response?.data,
        message:
          error?.response?.data?.error?.message ??
          "Payment verification failed.",
        status:
          error?.response?.status ?? 500,
      };
    }
  };

  const mapStripeError = (error) => {
    
    const message =
        error?.response?.data?.error ??
        error?.message ??
        "";

    const text = message.toLowerCase();

    if (text.includes("insufficient"))
        return "Your bank declined the payment because there are insufficient funds available.";

    if (text.includes("expired"))
        return "Your card has expired. Please use another card.";

    if (text.includes("incorrect cvc"))
        return "The security code (CVC) is incorrect.";

    if (text.includes("authentication"))
        return "Your bank could not authenticate this payment.";

    if (text.includes("declined"))
        return "Your bank declined the payment. Please try another card.";

    if (text.includes("processing"))
        return "Your bank is still processing the payment. Please wait.";

    if (text.includes("minimum"))
        return "The payment amount is below the minimum allowed.";

    return "Unable to process your payment. Please try again.";
  };


  const handleConfirmCardPayment = async (card,
    clientSecret,
    paymentIntent
  ) => {
        
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: customerDetailObj.email,
          name: customerDetailObj.firstName,
          // lastName: customerDetailObj?.lastName
        },
      },
    });
   

    if(result.error)
    throw result.error;

    if(result.paymentIntent.status!=="succeeded")
    throw new Error(
      "Payment was not successful."
    );

    return result;
  };

  // This submit send request to Database and stripe. /update-order-after-successfully-payment-save
  const handleSubmit = async (event) => 
  {
    event.preventDefault();
    setPaymentLoader(true)

    // first check the email is valid, first and last name is exists.

    const { email , firstName, lastName } = customerDetailObj

    if(!validateEmail(email) || parseInt(firstName?.length) === parseInt(0))
    {
      setCustomerDetailObj((prevData) => ({
        ...prevData,
        emailError: "Please enter a valid email address.",
        fullNameError: "Please enter full name."
      }))
      setPaymentLoader(false)
      return 
    }
    if(isLocationBrandOnline === null)
    {
      return
    }

    if (!stripe || !elements) 
    {
      setPaymentLoader(false)
      return;
    }

    const payload = await buildCustomerPayload(true)
    const  card  = await stripeCard()

    /** New payment controll way. */
    const { paymentMethod, error } = await createStripePaymentMethod(card, payload);
    
    const paymentIntent = await createPaymentIntent(
      payload,
      paymentMethod.id
    );

    console.log("payment intent check here:", paymentIntent);
    
    try 
    {
      const confirmation = await handleConfirmCardPayment(
        card,
        paymentIntent.clientSecret,
        paymentMethod.id
      );

      console.log("handle confirm amount:", confirmation);

      const verifyResponse = await verifyPayment(
        payload.order_guid,
        paymentIntent.paymentIntentId,
        getAmountConvertToFloatWithFixed(totalOrderAmountValue,2)
      );

      if(!verifyResponse?.success)
      {
        setPaymentLoader(false)
        setIsPaymentButtonReady(true)
        return
      }

      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      setOrderGuid(null)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      setCartData([])
      // window.alert("Your order has been received.")
      
      setLocalStorage(`${BRAND_SIMPLE_GUID}isValidNumber`,0)
      // 0 mean valid number

      if (Number(4) === Number(paymentIntent?.order?.order_type_filter_id)) {

        window.location.href = `/track-order/${payload?.order_guid}`
        return
      }

      window.location.href = `/thank-you/${payload?.order_guid}`
    } catch (error) {
      await axiosPrivate.post("/wallet-payment-failed", {
        order: payload.order_guid,
        payment_intent: paymentIntent.paymentIntentId,
        message: error.message,
        code: error.code,
        decline_code: error.decline_code,
        type: error.type,
      });

      // throw error;
      setPaymentError(mapStripeError(error));
    } finally {
      setPaymentLoader(false);
    }
  };

  /**
   * Wallet payment start
  */
  const [wallets, setWallets] = useState(null);
  const paymentLock = useRef(false);
  const [walletBusy, setWalletBusy] = useState(false);

  const confirmWalletPayment = async (
    clientSecret,
    ev
  ) => {

    const result =
      await stripe.confirmCardPayment(
          clientSecret,
          {
              payment_method:
                  ev.paymentMethod.id
          }
      );

    if(result.error)
    throw result.error;

    if(result.paymentIntent.status!=="succeeded")
    throw new Error(
        "Payment was not successful."
    );

    return result;

  };

  const handleWalletPayment = async (ev) => {
    // Prevent duplicate Apple Pay / Google Pay submissions
    if (paymentLock.current) {
      ev.complete("fail");
      return;
    }

      paymentLock.current = true;
      setWalletBusy(true);

    try {
      setPaymentLoader(true);

      const payload = await buildCustomerPayload(false,ev);
     
      console.log("wallet payload:", payload);
      
      const paymentIntent = await createPaymentIntent(
          payload,
          ev.paymentMethod.id,
          "wallet"
      );

      try{
        const confirmation = await confirmWalletPayment(
          paymentIntent.clientSecret,
          ev
        );

        const verifyResponse = await verifyPayment(
          payload.order_guid,
          paymentIntent.paymentIntentId,
          getAmountConvertToFloatWithFixed(totalOrderAmountValue,2)
        );

        if(!verifyResponse?.success)
        {
          ev.complete("fail");
          return
        }

        ev.complete("success");

        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        setOrderGuid(null)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        setCartData([])
        // window.alert("Your order has been received.")
        
        setLocalStorage(`${BRAND_SIMPLE_GUID}isValidNumber`,0)
        // 0 mean valid number
        if (Number(4) === Number(paymentIntent?.order?.order_type_filter_id)) {
          window.location.href = `/track-order/${payload?.order_guid}`
        }
        else
        {
          window.location.href = `/thank-you/${payload?.order_guid}`
        }
      } catch (error) {

        await axiosPrivate.post("/wallet-payment-failed", {
          order: payload.order_guid,
          payment_intent: paymentIntent.paymentIntentId,
          message: error.message,
          code: error.code,
          decline_code: error.decline_code,
          type: error.type,
        });

        throw error;
    }
    

    } catch (error) {

      console.log("payment intent erro:", error);
      
        ev.complete("fail");

        setPaymentError(mapStripeError(error));

    } finally {
      setPaymentLoader(false);
      paymentLock.current = false;
      setWalletBusy(false);
    }
  };

  useEffect(() => {
    if (stripe &&   totalOrderAmountValue && paymentRequest === null)
    {
      /** Wallet Payment started */
      const pr = stripe.paymentRequest({
        country: "GB",
        currency: "gbp",
        total: {
            label: "Total",
            amount: Math.round(parseFloat(totalOrderAmountValue) * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        // requestBillingAddress: true,
        requestShipping: false,
      });
    

      pr.canMakePayment().then((result) => {
        // if (!result) return;
        
        setWallets(result);

        // if (result.applePay || result.googlePay) {
          setPaymentRequest(pr);
        // }
      });

      const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))

      const city = getCustomerInformation?.street2?.split(',')[0].trim();

      pr.on("paymentmethod", handleWalletPayment);
    }
  }, [stripe, totalOrderAmountValue]);
  
  /**
   * Wallet payment end
  */
  const handleCardNumberChange = (event) => {
    if (event.complete) {
      const expiryElement = elements?.getElement(CardExpiryElement)
      expiryElement?.focus()
    }
  }

  const handleCardExpiryChange = (event) => {
    if (event.complete) {
      const cvcElement = elements?.getElement(CardCvcElement)
      cvcElement?.focus()
      setIsPaymentButtonReady(true)
    }
  }
  
  return(
    <>
      <div className="flex justify-center items-center min-h-[80vh] px-2 bg-gray-300">
        <div className="max-w-3xl w-full text-center bg-white rounded-lg py-3 px-3 mt-10 mb-6">
          <h1 className='text-xl font-bold text-left'>Payment Window</h1>
          <hr />
          {
            isGetErrorFromDatabase ?
              <div className="space-y-1">
                <h2 className="m-4 text-xl font-semibold text-black">{paymentFormObject.orderMessage}</h2>
                {
                  paymentFormObject.orderConfidentialID &&
                  <p className='mb-5'>
                    Confidential Key: <span className='font-semibold'>{paymentFormObject.orderConfidentialID}</span><br></br>
                    Order Total: <span className='font-semibold'>&pound;{parseFloat(totalOrderAmountValue).toFixed(2)}</span>
                  </p>
                }
                <a
                  href="/"
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className="px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center block"
                  style={{
                    backgroundColor: isHover
                      ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor
                      : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,

                    color: isHover
                      ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor
                      : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor,

                    border: isHover
                      ? `1px solid ${layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`
                      : `1px solid ${layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                  }}
                >
                  Continue to menu
                </a>

              </div>
            :
            
              isLocationBrandOnline !== null &&
              <>
                  {paymentError && (
                    <div className="flex items-center justify-center bg-red-400 mb-4">
                      <p className="text-white text-sm">{paymentError}</p>
                    </div>
                  )}

                <div className="flex items-center my-3">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-600 font-semibold">Express Checkout</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {
                  // (paymentRequest && wallets) && (wallets.applePay || wallets.googlePay) && (
                  (paymentRequest) && (
                    <PaymentRequestButtonElement options={{ paymentRequest }} />
                  )
                }

                <div className="flex items-center my-3">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-600 font-semibold">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                {
                  iIsCardDetailShow ?
                  <button
                    type="button"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                    onClick={() => setIsCardDetailShow(false)}
                  >
                    Credit/Debit Card
                  </button>
                  :
                    // {/* Credit Card Details */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="email"
                        className="w-full lg:w-80 text-md font-semibold text-gray-900 text-start"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full flex gap-2">
                        <input
                          required
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter email address."
                          value={customerDetailObj?.email}
                          ref={addDoorNumberRef}
                          onChange={handleInputs}
                          className={`text-[16px] w-full px-4 py-2 rounded-md text-gray-700 border bg-gray-200 focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.emailError?.length) === 0
                              ? "border-green-500 focus:ring-green-300"
                              : parseInt(customerDetailObj?.emailError?.length) > 0
                              && "border-red-500 focus:ring-red-300"
                          }`}
                        />

                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="firstName"
                        className="w-full lg:w-80 text-md font-semibold text-gray-900 text-start"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full flex flex-col lg:flex-row gap-2">
                        <input
                          required
                          type="text"
                          value={customerDetailObj?.firstName}
                          id="firstName"
                          name="firstName"
                          onChange={handleInputs}
                          placeholder="Enter first name"
                          className={`text-[16px] w-full px-4 py-2 rounded-md text-gray-700 border bg-gray-200 focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.fullNameError?.length) === 0
                              ? "border-green-500 focus:ring-green-300"
                              : parseInt(customerDetailObj?.fullNameError?.length) > 0
                              && "border-red-500 focus:ring-red-300"
                          }`}
                        />

                        {/* <input
                          required
                          type="text"
                          value={customerDetailObj?.lastName}
                          name="lastName"
                          id="lastName"
                          onChange={handleInputs}
                          placeholder="Enter last name"
                          className={`text-[16px] w-full px-4 py-2 rounded-md text-gray-700 border bg-gray-200 focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.fullNameError?.length) === 0
                              ? "border-green-500 focus:ring-green-300"
                              : parseInt(customerDetailObj?.fullNameError?.length) > 0
                              && "border-red-500 focus:ring-red-300"
                          }`}
                        /> */}
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="creditCard"
                        className="w-full lg:w-80 text-md font-semibold text-gray-900 text-start"
                      >
                        Credit Card <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col md:flex-row gap-2">
                          {/* Card Number */}
                          <div className="w-full md:w-1/2 px-4 py-2 border rounded-md bg-gray-200">
                            <CardNumberElement
                              onChange={handleCardNumberChange}
                              options={{
                                hidePostalCode: true,
                                style: {
                                  base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": { color: "#aab7c4" },
                                  },
                                },
                              }}
                            />
                          </div>

                          {/* Expiry */}
                          <div className="w-full md:w-1/4 px-4 py-2 border rounded-md bg-gray-200">
                            <CardExpiryElement
                              onChange={handleCardExpiryChange}
                              options={{
                                hidePostalCode: true,
                                style: {
                                  base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": { color: "#aab7c4" },
                                  },
                                },
                              }}
                            />
                          </div>

                          {/* CVC */}
                          <div className="w-full md:w-1/4 px-4 py-2 border rounded-md bg-gray-200">
                            <CardCvcElement
                              options={{
                                hidePostalCode: true,
                                style: {
                                  base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": { color: "#aab7c4" },
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Error */}
                    {paymentError && (
                      <div className="flex items-center justify-center bg-red-500 rounded-md py-2 px-4">
                        <p className="text-white text-sm">{paymentError}</p>
                      </div>
                    )}

                    {/* Submit */}
                    {
                      isPaymentButtonReady ?
                        <button
                          type="submit"
                          disabled={!stripe}
                          className="mt-5 mb-10 inline-block bg-green-700 text-white px-6 py-3 rounded-md shadow hover:bg-green-800 transition disabled:opacity-50"
                        >
                          {
                            paymentLoader ? "Processing" : "Pay Now"
                          }
                        </button>
                      :
                        <button
                          type='button'
                          className="mt-5 mb-10 inline-block bg-gray-700 text-white px-6 py-3 rounded-md shadow hover:bg-green-800 transition disabled:opacity-50"
                        >
                          Submit Payment
                        </button>
                    }
                  </form>
                }


              </>
          }
        </div>
      </div>
    </>

  )
};

export default PaymentForm;
