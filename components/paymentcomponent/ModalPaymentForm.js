// PaymentForm.js
'use client';

import React, { useContext, useEffect, useState } from 'react';

import moment from 'moment';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BRAND_SIMPLE_GUID, BRAND_GUID, IMAGE_URL_Without_Storage, axiosPrivate } from '@/global/Axios';
import HomeContext from '@/contexts/HomeContext';
import { useRouter } from "next/navigation";
import { WalletMemo } from './Wallet';
import Loader from '../modals/Loader';
import { getAmountConvertToFloatWithFixed, setLocalStorage } from '@/global/Store';
import { ContextCheckApi } from '@/app/layout';
// import stripePromise from './stripe';

const ModalPaymentForm = ({orderId}) => 
{
  const router = useRouter()
  
  const {
    setCartData,
    setIsTimeToClosed,
    totalOrderAmountValue,
    dayOpeningClosingTime,
    setTotalOrderAmountValue,
    isLocationBrandOnline,
    setIsLocationBrandOnline,
    websiteModificationData,
    handleBoolean,
    setLoader,
    loader
  } = useContext(HomeContext)

  const { setMetaDataToDisplay} = useContext(ContextCheckApi)

  const [isSubmitButtonCLicked, setIsSubmitButtonCLicked] = useState(false);
  
  useEffect(() => {
    if(websiteModificationData)
    {
      const metaHeadingData = {
        title: websiteModificationData?.brand?.name,
        contentData: websiteModificationData?.brand?.name,
        iconImage: IMAGE_URL_Without_Storage+"/"+websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon,
        singleItemsDetails: {
          title: "",
          description: "",
          itemImage: "",
          keywords: "",
          url: ""
        }
      }
      setMetaDataToDisplay(metaHeadingData)
    }
  }, [websiteModificationData]);

  const [isHover, setIsHover] = useState(false);
  
  // const [loader, setLoader] = useState(true)   
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const [isGetErrorFromDatabase, setIsGetErrorFromDatabase] = useState(false)

  /**
   * Check the Brand is active for a location.
  */


  useEffect(() => {
    
    const forceFullyCheckBrandLocationTrue  = async() =>{
      try {
        const response = await axiosPrivate.get(`/location-brand-status/${orderId}`)
        
        const { brandExists, isExpired } = response?.data?.data
        
        setIsGetErrorFromDatabase(isExpired)
        setIsLocationBrandOnline(brandExists)
        
      } catch (error) {
        if(error.response.status === 419)
        {
          setIsGetErrorFromDatabase(true)
          return
        }
      }
    }

    // Fetch Order Price related to Order GUID.
    const forceFullyGetOrderPriceFromDatabase = async () =>
    {
      try 
      {
        const data = {guid: orderId,}  
        const response = await axiosPrivate.post(`/order-price-to-payable-get`, data)
        
        setIsGetErrorFromDatabase(response.data.data?.orderAmountDetails === null ? true : false)

        setTotalOrderAmountValue(response.data.data?.orderAmountDetails === null ? 0 : response.data.data?.orderAmountDetails?.order_total)

      } 
      catch (error) 
      {
      }
    }

    const dayNumber = moment().day();
    const dateTime  = moment().format('HH:mm')
    const dayName = moment().format('dddd');
    setLoader(false)

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

    const orderTotalFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`))
    forceFullyCheckBrandLocationTrue()
    if(orderTotalFromLocalStorage !== null || orderTotalFromLocalStorage !== undefined)
    {
      setTotalOrderAmountValue(orderTotalFromLocalStorage === null ? 
        getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) 
      : 
        getAmountConvertToFloatWithFixed(JSON.parse(orderTotalFromLocalStorage),2))
    }
    else
    {
      forceFullyGetOrderPriceFromDatabase()
    }
    // setTimeout(() => {
    // }, 3000);
  }, [])
  
  useEffect(() => {
    // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
    const timeoutId = setTimeout(() => {
      // Clear all items in localStorage
      localStorage.clear();
      window.location.reload(true);
      window.location.href = "/"
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    }, 30 * 60 * 1000); 

    // Clear the timeout if the component is unmounted before 20 minutes
    return () => clearTimeout(timeoutId);
  });

  const hitSmsAndEmailCall = async () =>
  {
    setLoader(true)
    const url = window.location.origin
    const pathname = "track-order"
    try 
    {
      const data = {
        guid: orderId,
        url: url,
        pathname: pathname
      } 

      const response = await axiosPrivate.post(`/send-sms-and-email`, data)
      
      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,null)
      // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`,[])
      setLocalStorage(`${BRAND_SIMPLE_GUID}customer_information`,null)
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,null)
      setCartData([])
      
      // if(response?.data?.status === "success")
      // {
        router.push(`/track-order/${orderId}`)
        
      // }

    } 
    catch (error) 
    {
      console.log("modal payment form 1:");
      
      window.alert(error?.response?.data?.error)
      setLoader(false)
      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,null)
      // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`,[])
      setLocalStorage(`${BRAND_SIMPLE_GUID}customer_information`,null)
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,null)
      setCartData([])
      router.push(`/track-order/${orderId}`)
    }
  }

  // This method will hit when payment successfully done, to send sms and email to user.
  const afterPaymentSavedOrderUpdate = async (paymentIntent) =>
  {
    try 
    {
      const data = {
        guid: orderId,
        amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
        stripeid: paymentIntent.id,
      }  

      const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)
      // Here need to hit sms and email call.

      if(response?.data?.status === "success")
      {
        setIsSubmitButtonCLicked(false)
        handleBoolean(false, "isPlaceOrderButtonClicked")
        setLoader(true)
        hitSmsAndEmailCall()
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
    setIsSubmitButtonCLicked(true)
    setLoader(true)

    if(isLocationBrandOnline === null)
    {
      return
    }

    if (!stripe || !elements) 
    {
      setLoader(false)
      return;
    }

    try 
    {
      const cardElement = elements.getElement(CardElement);

      const { token, error,type } = await stripe.createToken(cardElement);

      if (error) 
      {
        setPaymentError(error.message);
        setLoader(false)
        return
      } 
      
      setLoader(true)

      const response = await axiosPrivate.post('/create-payment-intent', 
        {
          order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
          token: token.id,
          order: orderId,
          brand: BRAND_GUID,
        }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          // billing_details: {
          //   name: 'John Doe', // replace with user's name
          // },
        },
      });

      if (result.error) 
      {
        setLoader(false)
        setPaymentError(result.error.message);
        return
      } 
      else 
      {
        afterPaymentSavedOrderUpdate(result.paymentIntent)
      }
    } catch (error) {
      setLoader(false)
      console.error("Payment form error:",error);
    }
  };

  return(
    <>
      {
        !isGetErrorFromDatabase ?
          <form onSubmit={handleSubmit}>
            <div className="hmg1payment-desk">
                <div className="hmg1mhb0payment-desk">
                    

                    <hr className='edfhmthtpayment-desk'></hr>
                    <div className='mimjepmkmlmmpayment-desk'>
                  
                    <div className='d1g1payment-desk'>
                    
                        
                        {
                        isLocationBrandOnline !== null &&
                        <>
                            <a className="allzc5payment-desk">
                                
                              <div className="alamd1g1payment-desk">
                                  <h5 className="chd2cjd3b1payment-desk">Credit or debit card</h5>
                              </div>
                            </a>
                            <div className="btaupayment-window">
                              <CardElement options={{hidePostalCode: true, style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
                              {paymentError && <div style={{background: "#ed5858", color: "white", padding: "12px", borderRadius: "1px", marginTop: "10px"}}>{paymentError}</div>}
                            </div>
                        </>
                        }
                    </div>
                    </div>
                </div>
                <div></div>
            </div>
          
            <div className="d1g1payment-desk">
                <div className='gmgngoalamgppayment-desk'>
                <div className="gqpayment-desk">
                    <div className='boh7bqh8payment-desk'>
                    {
                        isLocationBrandOnline !== null ?
                        <>
                            <button 
                              type='submit' 
                              style={{marginBottom: "15px"}}
                              className="h7brboe1payment-btn" 
                              // style={{
                              //   background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                              //   color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                              //   border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                              //   marginBottom: "10px"
                              // }}
      
                              onMouseEnter={() => setIsHover(true)}
                              onMouseLeave={() => setIsHover(false)}
                              disabled={!stripe}
                            >
                              {
                                isSubmitButtonCLicked ?
                                  "Submitting..."
                                : 
                                  "Submit Payment"
                              }
                            </button>
                            <WalletMemo 
                            {
                                ...{
                                setLoader,
                                afterPaymentSavedOrderUpdate,
                                }
                            }
                            orderTotal={totalOrderAmountValue}
                            />
                        </>
                        :
                        <button 
                        type='submit' 
                        className="h7brboe1payment-btn" 
                        // style={{background: "rgb(125,125,125)",marginBottom: "10px"}} 
                        style={{
                            background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                            color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                            border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                            marginBottom: "10px"
                        }}

                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        disabled={!stripe}
                        >
                        Submit Payment
                        </button>
                    }
                    </div>
                </div>
                </div>
            </div>
          </form>
        :
            <>
            <div className="hmg1payment-desk">
                <div className="hmg1mhb0payment-desk">
                <div className='mimjepmkmlmmpayment-desk'>
                    <h3 className="eik5ekk6payment-desk">
                    <span className="d1payment-desk-span">Payment Window</span>
                    </h3>
                </div>

                <hr className='edfhmthtpayment-desk'></hr>
                <div className='mimjepmkmlmmpayment-desk'>
                    <h3 className="eik5ekk6payment-desk">
                    <span className="d1payment-desk-span">Payment</span>
                    </h3>
                    <div className='d1g1payment-desk'>
                    <a className="allzc5payment-desk">
                        <div className="f2payment-desk">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdpayment">
                            <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                        </div>
                            
                        <div className="alamd1g1payment-desk">
                        <span className="chd2cjd3b1payment-desk">Invalid or expired url</span>
                        </div>
                    </a>
                    </div>
                    </div>
                </div>
                <div></div>
            </div>

            <div className="d1g1payment-desk subpayment-desk">
                <div className='gmgngoalamgppayment-desk'>
                <div className="gqpayment-desk">
                    <div className='boh7bqh8payment-desk'>
                    <a 
                        className="h7brboe1payment-btn" 
                        href="/"
                        style={{
                        background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                        color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                        border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                        }}

                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        Continue Menu
                    </a>
                    </div>
                </div>
                </div>
            </div>

            <div className="sbpayment">
                <div className="akgzcheckout">
                <div className="atbaagcheckout">
                    <div className="">
                    
                    <a 
                        className="h7brboe1payment-btn" 
                        href="/"
                        style={{
                        background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                        color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                        border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                        }}

                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        Continue Menu
                    </a>

                    <div style={{height: "10px"}}></div>
                    </div>
                </div>
                </div>
            </div>
            </>
      }
        
      {
        loader &&
        <Loader loader={loader}/>
      }
    </>

  )
};

export default ModalPaymentForm;
