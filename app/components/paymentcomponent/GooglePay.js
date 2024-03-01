import React, {useState, useEffect} from 'react';
import {CardElement, PaymentRequestButtonElement, useStripe} from '@stripe/react-stripe-js';
import { country, currency, getAmountConvertToFloatWithFixed } from '@/app/global/Store';

const GooglePay = (props) => {
  const{
    orderTotal
  } = props
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  
  console.log("Out Side Check the amount from database:", getAmountConvertToFloatWithFixed(orderTotal,2) * 100);

  const [message, setMessage] = useState("")
  useEffect(() => {
    if (stripe) {

  console.log("Check the amount from database:", getAmountConvertToFloatWithFixed(orderTotal,2) * 100);

      const orderTotalSimpleForm = getAmountConvertToFloatWithFixed(orderTotal,2) * 100
      const pr = stripe.paymentRequest({
        country: country,
        currency: currency,
        total: {
          label: 'Total',
          amount: orderTotalSimpleForm,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
      });

      console.log("Payment Request:", pr);
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        console.log("Result from Google Pay:", result);
        if (result) {
          setPaymentRequest(pr);
        }
      });
      
      pr.on("token", async function(e)
      {
        try {

          const response = await axiosPrivate.post('/create-payment-intent', {
            order_total: getAmountConvertToFloatWithFixed(orderTotal,2) * 100, // replace with your desired amount
          });
  
          const { clientSecret } = response.data;
          setMessage('Client secret returned');

          console.log("Payment method:",e.paymentMethod);

          const {error: stripeError,paymentIntent} = await stripe.confirmCardPayment(
            clientSecret, 
            {payment_method: e.paymentMethod.id}, { handleActions: false }
          );

          console.log("Confirm card payment response from google pay component:", stripeError, "Payment intent:", paymentIntent);
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
  }, [stripe,orderTotal]);

  console.log("Google pay has message:", message);
  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }
}

export default GooglePay