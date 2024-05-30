// App.js

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('your-publishable-key');

const PaymentElement = () => {
  return (
    <Elements stripe={stripePromise}>
        <PaymentForm />
    </Elements>
  );
};

export default PaymentElement;
