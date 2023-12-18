// PaymentForm.js
import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { axiosPrivate } from '@/app/global/Axios';
import HomeContext from '@/app/contexts/HomeContext';
import { getAmountConvertToFloatWithFixed } from '@/app/global/Store';
import { useRouter } from 'next/navigation';
// import stripePromise from './stripe';

const PaymentForm = ({orderId}) => 
{
  const router = useRouter()
  const {
    totalOrderAmountValue,
    settotalOrderAmountValue
  } = useContext(HomeContext)

  const [loader, setLoader] = useState(true)   
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  // console.log("Stripe: ", stripe);
  useEffect(() => {
    const orderTotalFromLocalStorage = JSON.parse(window.localStorage.getItem('total_order_value_storage'))
    settotalOrderAmountValue(orderTotalFromLocalStorage === null ? getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) : getAmountConvertToFloatWithFixed(JSON.parse(orderTotalFromLocalStorage),2))
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

      // console.log("Data: ", data);
      const response = await axiosPrivate.post(`/send-sms-and-email`, data)
      // console.log("Success response:", response);
      setLoader(false)
      // if(response?.data?.status === "success")
      // {
        router.push(`/track-order/${orderId}`)
      // }

    } 
    catch (error) 
    {
      console.log("Handle Error:", error);
      window.alert(error?.response?.data?.error)
      setLoader(false)
      router.push(`/track-order/${orderId}`)
    }
  }

  const afterPaymentSavedOrderUpdate = async (amount) =>
  {
    try 
    {
      const data = {
          guid: orderId,
          amount_paid: getAmountConvertToFloatWithFixed(amount / 100,2)
      }  
      const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)

      
      // console.log('Order is updated:', response);

      // Here need to hit sms and email call.

      if(response?.data?.status === "success")
      {
        hitSmsAndEmailCall()
        // router.push(`/track-order/${response?.data?.data?.order?.external_order_id}`)
      }
    } 
    catch (error) 
    {
      console.log("There is something went wrong please refresh and try again!.");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true)
    // console.log("Order total amount:", getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100);
    if (!stripe || !elements) 
    {
      setLoader(false)
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);

      const { token, error,type } = await stripe.createToken(cardElement);

      if (error) {
        setPaymentError(error.message);
      } else {
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

        if (result.error) {
          setPaymentError(result.error.message);
        } else {
          // console.log('Payment successful:', result.paymentIntent);
          afterPaymentSavedOrderUpdate(result.paymentIntent.amount)
        }
      }
    } catch (error) {
      console.error(error);
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
                        <span className="chd2cjd3b1payment-desk">Credit or debit card</span>
                      </div>
                    </a>

                    <div className="btaupayment-window">
                      {/* <input type="email" placeholder="Enter your card" defaultValue="" className="payment_card" /> */}
                      <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
                      {paymentError && <div style={{background: "#ed5858", color: "white", padding: "12px", borderRadius: "1px", marginTop: "10px"}}>{paymentError}</div>}
                    </div>
                  </div>
                </div>
            </div>
            <div></div>
          </div>

          <div className="d1g1payment-desk subpayment-desk">
            <div className='gmgngoalamgppayment-desk'>
              <div className="gqpayment-desk">
                <div className='boh7bqh8payment-desk'>
                  <button className="h7brboe1payment-btn" disabled={!stripe} onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="sbpayment">
            <div className="akgzcheckout">
              <div className="atbaagcheckout">
                <div className="">
                  <button className="fwbrbocheckout-place-order" disabled={!stripe} onClick={handleSubmit}>Submit Payment</button>
                  <div style={{height: "10px"}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default PaymentForm;
