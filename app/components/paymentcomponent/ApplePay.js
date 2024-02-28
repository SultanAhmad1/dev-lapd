import React, {useEffect, useState} from 'react';
import {PaymentRequestButtonElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { axiosPrivate } from '@/app/global/Axios';
import { getAmountConvertToFloatWithFixed } from '@/app/global/Store';

const ApplePay = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [message, setMessage] = useState("")

  const [clientSecret, setClientSecret] = useState("")
  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1999,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    async function paymentMethod()
    {
      try {
        const response = await axiosPrivate.post('/create-payment-intent',{
          order_total: getAmountConvertToFloatWithFixed(133.2,2) / 100,
        })
        const { clientSecret } = response.data;

        console.log("Success for apple pay:", response);
        setClientSecret(clientSecret)
      } catch (error) {
        console.log("Error from apple pay:", error);
      }
    }
    pr.on('paymentmethod', async (e) => {
      paymentMethod()
      // const {error: backendError, clientSecret} = await fetch(
      //   '/create-payment-intent',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       paymentMethodType: 'card',
      //       currency: 'usd',
      //     }),
      //   }
      // ).then((r) => r.json());

      // if (backendError) {
      //   setMessage(backendError.message);
      //   return;
      // }

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
    });
    console.log("Payment requests inside useEffect:",paymentRequest);
  }, [stripe, elements, setMessage]);

  console.log("Payment requests:",paymentRequest);
  return (
    <>
      <h1>Apple Pay</h1>

      {paymentRequest && <PaymentRequestButtonElement options={{paymentRequest}} />}

    </>
  );
};

export default ApplePay;