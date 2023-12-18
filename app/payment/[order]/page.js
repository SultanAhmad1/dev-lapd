"use client";

import PaymentHTML from "@/app/components/PaymentHTML";
import PaymentForm from "@/app/components/paymentcomponent/PaymentForm";
import stripePromise from "@/app/components/paymentcomponent/Stripe";
import { axiosPrivate } from "@/app/global/Axios";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect } from "react";


function Payment({params}) 
{
  return (
    <Elements stripe={stripePromise}>
        <PaymentForm orderId={params?.order}/>
    </Elements>
  )
}

export default Payment