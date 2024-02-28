import React, {useEffect, useState} from 'react';
import {PaymentRequestButtonElement, useStripe, useElements} from '@stripe/react-stripe-js';

const GooglePay = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [messages, setAddMessage] = useState();

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

    pr.on('paymentmethod', async (e) => {
      const {error: backendError, clientSecret} = await fetch(
        '/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodType: 'card',
            currency: 'usd',
          }),
        }
      ).then((r) => r.json());

      if (backendError) {
        setAddMessage(backendError.message);
        return;
      }

      setAddMessage('Client secret returned');

      const {
        error: stripeError,
        paymentIntent,
      } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: e.paymentMethod.id,
      }, { handleActions: false });

      if (stripeError) {
        // Show error to your customer (e.g., insufficient funds)
        setAddMessage(stripeError.message);
        return;
      }

      // Show a success message to your customer
      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
      setAddMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    });
    console.log("Google payment intent Inside useEffect:",paymentRequest);
  }, [stripe, elements, setAddMessage]);

  console.log("Google payment intent outside useEffect:",paymentRequest);
  return (
    <>
      <h1>Google Pay</h1>

      {/* <p>
        Before you start, you need to:
        <ul>
          <li><a href="https://stripe.com/docs/stripe-js/elements/payment-request-button#html-js-testing" target="_blank">Add a payment method to your browser.</a> For example, add a card to your Google Pay settings.</li>
          <li>Serve your application over HTTPS. This is a requirement both in development and in production. One way to get up and running is to use a service like <a href="https://ngrok.com/" target="_blank" rel="noopener noreferrer">ngrok</a>.</li>
        </ul>
      </p> */}

      {/* <a href="https://stripe.com/docs/stripe-js/elements/payment-request-button" target="_blank">Stripe Documentation</a> */}

      {/* {paymentRequest && <PaymentRequestButtonElement options={{paymentRequest}} />} */}
      <PaymentRequestButtonElement options={{paymentRequest}} />
      {/* <StatusMessages messages={messages} /> */}
    </>
  );
};

export default GooglePay;