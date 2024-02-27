"use client";

import ApplePay from "@/app/components/paymentcomponent/ApplePay";
import GooglePay from "@/app/components/paymentcomponent/GooglePay";
import PaymentForm from "@/app/components/paymentcomponent/PaymentForm";
import stripePromise from "@/app/components/paymentcomponent/Stripe";
import { axiosPrivate } from "@/app/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/app/global/Store";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";


function Payment({params}) 
{
  const [ clientSecret, setClientSecret ] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // fetch("/create-payment-intent")
    //   .then((res) => res.json())
    //   .then(({clientSecret}) => setClientSecret(clientSecret));
    async function paymentIntent()
    {
      const response = await axiosPrivate.post('create-payment-intent',{
        order_total: getAmountConvertToFloatWithFixed(5.2,2) * 100,
      })
      setClientSecret(response?.data?.clientSecret)
      console.log("Payment intent:",response);
    }
    paymentIntent()
  }, []);

  return (
    // <Elements stripe={stripePromise}>
    //     <PaymentForm orderId={params?.order}/>
    //     {/* <ApplePay orderId={params?.order}/> */}
    //     {/* <GooglePay orderId={params?.order}/> */}
    // </Elements>
    <>
      <h1>Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, }}>
          <PaymentForm />
        </Elements>
      )}
    </>
  )
}

export default Payment