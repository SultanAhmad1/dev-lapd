import React, {useState, useEffect} from 'react';
import {PaymentRequestButtonElement, useStripe} from '@stripe/react-stripe-js';
import { country, currency, getAmountConvertToFloatWithFixed } from '@/app/global/Store';

const GooglePay = (props) => {
  const{
    orderTotal
  } = props
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  const [message, setMessage] = useState("")
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: country,
        currency: currency,
        total: {
          label: 'Demo total',
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        console.log("Result from Google Pay:", result);
        if (result) {
          setPaymentRequest(pr);
        }
      });
      
      pr.on("", async function(e){
        try {
     
          const response = await axiosPrivate.post('/create-payment-intent', {
            order_total: getAmountConvertToFloatWithFixed(orderTotal,2) * 100, // replace with your desired amount
          });
  
          const { clientSecret } = response.data;
          setMessage('Client secret returned');

          const {
            error: stripeError,
            paymentIntent,
          } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: e.paymentMethod.id,
          }, { handleActions: false });

          if (stripeError) {
            // Show error to your customer (e.g., insufficient funds)
            setMessage(stripeError.message);
            return;
          }

          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          setMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);

        } catch (error) {
          console.log("Google pay console error:", error);
        }
      })
    }
  }, [stripe]);

  console.log("Google pay has message:", message);
  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }
}

export default GooglePay