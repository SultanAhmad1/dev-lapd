"use client";
import { axiosPrivate } from '@/global/Axios';
import { country, currency, getAmountConvertToFloatWithFixed } from '@/global/Store';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import React, {useState, useEffect} from 'react';


export default function Wallet(props){

  const{
    orderTotal,
    afterPaymentSavedOrderUpdate
  } = props

  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) 
    {
      const orderTotalSimpleForm = parseFloat(orderTotal) * 100

      const pr = stripe.paymentRequest({
        country: country,
        currency: currency,
        total: {
          label: 'Total',
          amount: parseInt(orderTotalSimpleForm),
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
      });

      pr.canMakePayment().then(result => {
        if (result) 
        {
          setPaymentRequest(pr);
        }
      });
   
      pr.on('paymentmethod', async function(ev) {
        
        const response = await axiosPrivate.post('/create-payment-intent', {order_total: getAmountConvertToFloatWithFixed(orderTotal,2) * 100,});
  
        const { clientSecret } = response.data;

        // Confirm the PaymentIntent without handling potential next actions (yet).
        stripe.confirmCardPayment(
          clientSecret,
          {payment_method: ev.paymentMethod.id},
          {handleActions: false}
        )
        .then(function(confirmResult) 
        {
          if (confirmResult.error) 
          {
            // Report to the browser that the payment failed, prompting it to
            // re-show the payment interface, or show an error message and close
            // the payment interface.
            ev.complete('fail');
          } 
          else 
          {
            // Report to the browser that the confirmation was successful, prompting
            // it to close the browser payment method collection interface.
            ev.complete('success');
            // Check if the PaymentIntent requires any actions and if so let Stripe.js
            // handle the flow. If using an API version older than "2019-02-11" instead
            // instead check for: `paymentIntent.status === "requires_source_action"`.
            if (confirmResult.paymentIntent.status === "requires_action") 
            {
              // Let Stripe.js handle the rest of the payment flow.
              stripe.confirmCardPayment(client).then(function(result) 
              {
                if (result.error) 
                {
                  // The payment failed -- ask your customer for a new payment method.
                } 
                else 
                {  
                  // The payment has succeeded.
                }
              });
            } 
            else 
            {
              // The payment has succeeded.
              afterPaymentSavedOrderUpdate(confirmResult.paymentIntent)
            }
          }
        });
      });
    }
  }, [stripe,orderTotal]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }
}