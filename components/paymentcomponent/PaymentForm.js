// PaymentForm.js
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';

import moment from 'moment-timezone';
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BRAND_SIMPLE_GUID, BRAND_GUID, IMAGE_URL_Without_Storage, axiosPrivate } from '@/global/Axios';
import HomeContext from '@/contexts/HomeContext';
import { useRouter } from "next/navigation";
import { getAmountConvertToFloatWithFixed, setLocalStorage } from '@/global/Store';
import { ContextCheckApi } from '@/app/layout';
// import stripePromise from './stripe';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const PaymentForm = ({orderId}) => 
{

  const router = useRouter()
  
  const {
    setSelectedStoreDetails,
    setOrderGuid,
    setPaymentLoader,
    setCartData,
    setIsTimeToClosed,
    totalOrderAmountValue,
    dayOpeningClosingTime,
    setTotalOrderAmountValue,
    isLocationBrandOnline,
    setIsLocationBrandOnline,
    websiteModificationData,
    setAtFirstLoad,
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
  
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const [iIsCardDetailShow, setIsCardDetailShow] = useState(true);
  
  const [isGetErrorFromDatabase, setIsGetErrorFromDatabase] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentFormObject, setPaymentFormObject] = useState({
    orderType: "",
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
          let orderType = order.order_type_filter_id
          if(order.source_id === 1)
          {
            orderType = order.order_type_filter_id === 4 ? "delivery" : "collection"
          } 
          else
          {
            orderType = order.website_order_filter_id === 1 ? "delivery" : "collection"
          }
  
          setPaymentFormObject((prevData) => ({
            ...prevData,
            orderType: orderType,
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
  
      // Fetch Order Price related to Order GUID.
      // const forceFullyGetOrderPriceFromDatabase = async () =>
      // {
      //   try 
      //   {
      //     const data = {guid: orderId,}  
      //     const response = await axiosPrivate.post(`/order-price-to-payable-get`, data)
          
      //     setIsGetErrorFromDatabase(response.data.data?.orderAmountDetails === null ? true : false)
  
      //     setTotalOrderAmountValue(response.data.data?.orderAmountDetails === null ? 0 : response.data.data?.orderAmountDetails?.order_total)
  
      //   } 
      //   catch (error) 
      //   {
      //   }
      // }
  
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
            setIsTimeToClosed(true)
            return
          }
        }
      }
  
      // const orderTotalFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`))
  
      // if(orderTotalFromLocalStorage)
      // {
      //   setTotalOrderAmountValue(orderTotalFromLocalStorage === null ? 
      //     getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) 
      //   : 
      //     getAmountConvertToFloatWithFixed(JSON.parse(orderTotalFromLocalStorage),2))
      // }
      // else
      // {
        forceFullyCheckBrandLocationTrue()
        // forceFullyGetOrderPriceFromDatabase()
      // }/
    }
  }, [orderId])
  
  useEffect(() => {
    // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
    const timeoutId = setTimeout(() => {
      // Clear all items in localStorage
      localStorage.clear();
      window.location.reload(true);
      window.location.href = "/"
      setTimeout(() => {
        setPaymentLoader(false);
      }, 3000);
    }, 30 * 60 * 1000); 

    // Clear the timeout if the component is unmounted before 20 minutes
    return () => clearTimeout(timeoutId);
  });

  const hitSmsAndEmailCall = async () =>
  {
    setPaymentLoader(true)
    const url = window.location.origin
    const pathname = "track-order"
    try 
    {
      const data = {
        guid: orderId,
        url: url,
        pathname: pathname,
        brandGuid: BRAND_GUID,
      } 

      const response = await axiosPrivate.post(`/send-sms-and-email`, data)

      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      setOrderGuid(null)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      setCartData([])

      setPaymentLoader(false)
      if(paymentFormObject.orderType === "delivery")
      {
        router.push(`/track-order/${orderId}`)
        return
      }

      router.push(`/thank-you/${orderId}`)
    } 
    catch (error) 
    {
      setPaymentLoader(false)
      window.alert(error?.response?.data?.error)
      
      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      setOrderGuid(null)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      setCartData([])

      setCartData([])
      if(paymentFormObject.orderType === "delivery")
      {
        router.push(`/track-order/${orderId}`)
        return
      }
      router.push(`/thank-you/${orderId}`)
    }
  }

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

      if(response?.data?.status === "success")
      {
        hitSmsAndEmailCall(orderId)
        // router.push(`/track-order/${response?.data?.data?.order?.external_order_id}`)
      }
    } 
    catch (error) 
    {
      
    }
  }

  // This submit send request to Database and stripe.
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
    try 
    {
      // const cardElement = elements.getElement(CardElement);\
      const cardElement = elements.getElement(CardNumberElement);

      const { token, error,type } = await stripe.createToken(cardElement);

      if (error) 
      {
        setPaymentError(error.message);
        setPaymentLoader(false)
        return
      } 
      
      setPaymentLoader(true)

      const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))

      const getTotalFromLocalStorage = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)

      let orderTotalToSend = totalOrderAmountValue

      if(getTotalFromLocalStorage)
      {
        orderTotalToSend = JSON.parse(getTotalFromLocalStorage)
      }
      const city = getCustomerInformation?.street2?.split(',')[0].trim();
      const response = await axiosPrivate.post('/payment-form-payment-intent', 
        {
          order_total: getAmountConvertToFloatWithFixed(orderTotalToSend,2) * 100, // replace with your desired amount
          token: token.id,
          order: orderId,
          brand: BRAND_GUID,
          email: customerDetailObj?.email,
          firstName: customerDetailObj?.firstName,
          lastName: customerDetailObj?.lastName
        }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerDetailObj?.firstName} ${customerDetailObj?.lastName}`,
            email: customerDetailObj?.email,
            address: {
              line1: `${getCustomerInformation?.doorHouseName} ${getCustomerInformation?.street1} ${getCustomerInformation?.street1}`,
              city: city,
              postal_code: getCustomerInformation?.postcode,
              country: 'GB',
            },
          },
        },
      });
      if (result.error) 
      {
        setPaymentLoader(false)
        setPaymentError(result.error.message);
        return
      } 
      else 
      {
        setPaymentLoader(true)
        afterPaymentSavedOrderUpdate(result.paymentIntent)
      }
    } catch (error) {

      
      setPaymentLoader(false)
      const errorMessage = error.response.data.error
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
  };
  
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
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
        requestBillingAddress: true, // ✅ ADD THIS
      });

      pr.canMakePayment().then(result => {
        if (result) 
        {
          setPaymentRequest(pr);
        }
      });

      const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))

      const city = getCustomerInformation?.street2?.split(',')[0].trim();

      pr.on("paymentmethod", async (ev) => {
        try {
          const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`));
          const city = getCustomerInformation?.street2?.split(',')[0].trim();
      
          const customerName = ev.payerName || `${customerDetailObj?.firstName} ${customerDetailObj?.lastName ?? ""}`;
          const customerEmail = ev.payerEmail || customerDetailObj?.email;
      
          const customerAddress = ev.billingDetails?.address || {
            line1: `${getCustomerInformation?.doorHouseName} ${getCustomerInformation?.street1}`,
            city,
            postal_code: getCustomerInformation?.postcode,
            country: "GB",
          };
      
          // ✅ Send all billing info to backend
          
          const getTotalFromLocalStorage = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)

          let orderTotalToSend = totalOrderAmountValue

          if(getTotalFromLocalStorage)
          {
            orderTotalToSend = JSON.parse(getTotalFromLocalStorage)
          }

          const response = await axiosPrivate.post("/payment-form-payment-intent", {
            order_total: Math.round(parseFloat(orderTotalToSend) * 100),
            type: "wallet",
            payment_method: ev.paymentMethod.id,
            order: orderId,
            brand: BRAND_GUID,
            billing_details: {
              name: customerName,
              email: customerEmail,
              address: customerAddress,
            },
          });
      
          const { clientSecret } = response.data;
      
          // ✅ Finish wallet UI prompt
          ev.complete("success");
      
          // ✅ Confirm payment with Stripe
          const result = await stripe.confirmCardPayment(clientSecret); // No payment_method object needed
      
          if (result.error || result.paymentIntent?.status !== "succeeded") 
          {
            setPaymentLoader(false)
            setPaymentError(result.error.message);
            return
          } else {
            afterPaymentSavedOrderUpdate(result.paymentIntent);
          }
        } catch (err) {
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
  }, [stripe, totalOrderAmountValue]);

  
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
                      ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor
                      : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,

                    color: isHover
                      ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor
                      : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,

                    border: isHover
                      ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}`
                      : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
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
                  paymentRequest && (
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
                    Credit Card
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
                          className={`w-full px-4 py-2 rounded-md text-gray-700 border bg-gray-200 focus:outline-none focus:ring-2 transition ${
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
                          className={`w-full px-4 py-2 rounded-md text-gray-700 border bg-gray-200 focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.fullNameError?.length) === 0
                              ? "border-green-500 focus:ring-green-300"
                              : parseInt(customerDetailObj?.fullNameError?.length) > 0
                              && "border-red-500 focus:ring-red-300"
                          }`}
                        />

                        <input
                          required
                          type="text"
                          value={customerDetailObj?.lastName}
                          name="lastName"
                          id="lastName"
                          onChange={handleInputs}
                          placeholder="Enter last name"
                          className={`w-full px-4 py-2 rounded-md text-gray-700 border bg-gray-200 focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.fullNameError?.length) === 0
                              ? "border-green-500 focus:ring-green-300"
                              : parseInt(customerDetailObj?.fullNameError?.length) > 0
                              && "border-red-500 focus:ring-red-300"
                          }`}
                        />
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
                    <button
                      type="submit"
                      disabled={!stripe}
                      className="mt-5 mb-10 inline-block bg-green-700 text-white px-6 py-3 rounded-md shadow hover:bg-green-800 transition disabled:opacity-50"
                    >
                      Submit Payment
                    </button>
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
