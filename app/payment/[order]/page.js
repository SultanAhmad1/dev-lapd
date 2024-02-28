"use client";

import ApplePay from "@/app/components/paymentcomponent/ApplePay";
import GooglePay from "@/app/components/paymentcomponent/GooglePay";
import PaymentForm from "@/app/components/paymentcomponent/PaymentForm";
import stripePromise from "@/app/components/paymentcomponent/Stripe";
import { Elements } from "@stripe/react-stripe-js";


function Payment({params}) 
{
  return (
    <Elements stripe={stripePromise}>
        {/* <PaymentForm orderId={params?.order}/> */}
        {/* <ApplePay orderId={params?.order}/> */}
        <GooglePay orderId={params?.order}/>
    </Elements>
  )
}

export default Payment