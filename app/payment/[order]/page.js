"use client";

import PaymentForm from "@/components/paymentcomponent/PaymentForm";
import stripePromise from "@/components/paymentcomponent/Stripe";
import { Elements } from "@stripe/react-stripe-js";

function Payment({params}) 
{
  return (
    <Elements stripe={stripePromise}>
        <PaymentForm orderId={params?.order}/>
    </Elements>
  )
}

export default Payment