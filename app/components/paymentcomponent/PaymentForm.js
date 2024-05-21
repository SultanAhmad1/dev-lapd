// PaymentForm.js
import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { BRANDSIMPLEGUID, axiosPrivate } from '@/app/global/Axios';
import HomeContext from '@/app/contexts/HomeContext';
import { getAmountConvertToFloatWithFixed, setLocalStorage } from '@/app/global/Store';
import { useRouter } from 'next/navigation';
import Loader from '../modals/Loader';
import { WalletMemo } from './Wallet';
import moment from 'moment';
// import stripePromise from './stripe';

const PaymentForm = ({orderId}) => 
{
  const router = useRouter()
  
  const {setCartdata,totalOrderAmountValue,settotalOrderAmountValue,dayOpeningClosingTime,setIsTimeToClosed} = useContext(HomeContext)

  const [loader, setLoader] = useState(true)   
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const [isgeterrorfromdatabase, setIsgeterrorfromdatabase] = useState(false)
  const forceFullyGetOrderPriceFromDatabase = async () =>
  {
    try 
    {
      const data = {
        guid: orderId,
      }  
      const response = await axiosPrivate.post(`/order-price-to-payable-get`, data)
      setIsgeterrorfromdatabase(response.data.data?.orderAmountDetails === null ? true : false)

      settotalOrderAmountValue(response.data.data?.orderAmountDetails === null ? 0 : response.data.data?.orderAmountDetails?.order_total)

    } 
    catch (error) 
    {
    }
  }

  useEffect(() => {
    const dayNumber = moment().day();
    const dateTime  = moment().format('HH:mm')
    const dayName = moment().format('dddd');

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

    const orderTotalFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}total_order_value_storage`))
    if(orderTotalFromLocalStorage !== null)
    {
      settotalOrderAmountValue(orderTotalFromLocalStorage === null ? getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) : getAmountConvertToFloatWithFixed(JSON.parse(orderTotalFromLocalStorage),2))
    }
    else
    {
      forceFullyGetOrderPriceFromDatabase()
    }
    setTimeout(() => {
      setLoader(false)
    }, 3000);
  }, [])
  
  const hitSmsAndEmailCall = async () =>
  {
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
      setLoader(false)
      setLocalStorage(`${BRANDSIMPLEGUID}cart`,[])
      setLocalStorage(`${BRANDSIMPLEGUID}order_amount_number`,null)
      setLocalStorage(`${BRANDSIMPLEGUID}applied_coupon`,[])
      setLocalStorage(`${BRANDSIMPLEGUID}customer_information`,null)
      setLocalStorage(`${BRANDSIMPLEGUID}order_guid`,null)
      setCartdata([])
      // if(response?.data?.status === "success")
      // {
        router.push(`/track-order/${orderId}`)
      // }

    } 
    catch (error) 
    {
      window.alert(error?.response?.data?.error)
      setLoader(false)
      setLocalStorage(`${BRANDSIMPLEGUID}cart`,[])
      setLocalStorage(`${BRANDSIMPLEGUID}order_amount_number`,null)
      setLocalStorage(`${BRANDSIMPLEGUID}applied_coupon`,[])
      setLocalStorage(`${BRANDSIMPLEGUID}customer_information`,null)
      setLocalStorage(`${BRANDSIMPLEGUID}order_guid`,null)
      setCartdata([])
      router.push(`/track-order/${orderId}`)
    }
  }

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
        hitSmsAndEmailCall()
        // router.push(`/track-order/${response?.data?.data?.order?.external_order_id}`)
      }
    } 
    catch (error) 
    {
      // console.log("Update Order After successfully payment save:", error);
    }
  }

  const handleSubmit = async (event) => 
  {

    event.preventDefault();
    setLoader(true)

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
      } 
      else 
      {
        const response = await axiosPrivate.post('/create-payment-intent', {
          order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
          token: token.id,
        });

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
          setPaymentError(result.error.message);
        } 
        else 
        {
          afterPaymentSavedOrderUpdate(result.paymentIntent)
        }
      }
    } catch (error) {
      // console.error(error);
    }
  };

  return(
    <>
      <div className='e5ald0m1m2amc5payment-desk'>
        <div className="m3m4m5gim6payment-desk">
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
                        <span className="chd2cjd3b1payment-desk">{isgeterrorfromdatabase === false ? "Credit or debit card": "Invalid/expire url"}</span>
                      </div>
                    </a>
                    {
                      isgeterrorfromdatabase === false &&
                      <div className="btaupayment-window">
                        {/* <input type="email" placeholder="Enter your card" defaultValue="" className="payment_card" /> */}
                        <CardElement options={{hidePostalCode: true, style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
                        {paymentError && <div style={{background: "#ed5858", color: "white", padding: "12px", borderRadius: "1px", marginTop: "10px"}}>{paymentError}</div>}
                      </div>
                    }
                  </div>
                </div>
            </div>
            <div></div>
          </div>
          
          {
            isgeterrorfromdatabase === false
            ?
            <>
            
              <div className="d1g1payment-desk">
                <div className='gmgngoalamgppayment-desk'>
                  <div className="gqpayment-desk">
                    <div className='boh7bqh8payment-desk'>
                      <button className="h7brboe1payment-btn" style={{marginBottom: "10px"}} disabled={!stripe} onClick={handleSubmit}>Submit</button>
                      <WalletMemo orderTotal={totalOrderAmountValue} setLoader={setLoader} afterPaymentSavedOrderUpdate={afterPaymentSavedOrderUpdate}/>
                    </div>
                  </div>
                </div>
              </div>
            
            
              {/* <div className="sbpayment">
                <div className="akgzcheckout">
                  <div className="atbaagcheckout">
                    <div className="">
                      <button className="fwbrbocheckout-place-order" disabled={!stripe} onClick={handleSubmit}>Submit Payment</button>
                      <div style={{height: "10px"}}></div>
                      <GooglePay orderTotal={totalOrderAmountValue}/>
                    </div>
                  </div>
                </div>
              </div> */}

            </>
            

            :
            <>
              <div className="d1g1payment-desk subpayment-desk">
                <div className='gmgngoalamgppayment-desk'>
                  <div className="gqpayment-desk">
                    <div className='boh7bqh8payment-desk'>
                      <a className="h7brboe1payment-btn" style={{backgroundColor: "#000"}} href="/">Continue Menu</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sbpayment">
                <div className="akgzcheckout">
                  <div className="atbaagcheckout">
                    <div className="">
                      <a className="h7brboe1payment-btn" style={{backgroundColor: "#000"}} href="/">Continue Menu</a>
                      <div style={{height: "10px"}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }

      
        </div>
      </div>
      <Loader loader={loader} />
    </>
  )
};

export default PaymentForm;
