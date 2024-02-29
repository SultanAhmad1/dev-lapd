import React, {useEffect, useState} from 'react';
import {PaymentRequestButtonElement, useStripe, useElements} from '@stripe/react-stripe-js';
// import StatusMessages, {useMessages} from './StatusMessages';

const GooglePay = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [messages, setAddMessage] = useState();

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    var pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    console.log("Payment request instance:", pr);
    // Check the availability of the Payment Request API.
    pr.canMakePayment().then(result => {
        console.log("REturn the result:", result);
        // const updateResult = {
        //     ...result,
        //     googlePay: true
        // }

        // console.log("Updated result:", updateResult);
      if (result) {
        setPaymentRequest(result);
      }
    });

    // paymentRequest.on('paymentmethod', async (e) => {
    //   const {error: backendError, clientSecret} = await fetch(
    //     '/create-payment-intent',
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         paymentMethodType: 'card',
    //         currency: 'usd',
    //       }),
    //     }
    //   ).then((r) => r.json());

    //   if (backendError) {
    //     setAddMessage(backendError.message);
    //     return;
    //   }

    //   setAddMessage('Client secret returned');

    //   const {
    //     error: stripeError,
    //     paymentIntent,
    //   } = await stripe.confirmCardPayment(clientSecret, {
    //     payment_method: e.paymentMethod.id,
    //   }, { handleActions: false });

    //   if (stripeError) {
    //     // Show error to your customer (e.g., insufficient funds)
    //     setAddMessage(stripeError.message);
    //     return;
    //   }

    //   // Show a success message to your customer
    //   // There's a risk of the customer closing the window before callback
    //   // execution. Set up a webhook or plugin to listen for the
    //   // payment_intent.succeeded event that handles any business critical
    //   // post-payment actions.
    //   setAddMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    // });
  }, [stripe, elements, setAddMessage]);

  console.log("Payment request handle:", paymentRequest);
  
  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }

  // Use a traditional checkout form.
  return 'Insert your form or button component here.';
};

export default GooglePay;