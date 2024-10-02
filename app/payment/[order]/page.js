"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PaymentForm from "@/components/paymentcomponent/PaymentForm";
import stripePromise from "@/components/paymentcomponent/Stripe";
import { Elements } from "@stripe/react-stripe-js";
import { Fragment } from "react";

function Payment({params}) 
{
  return (
    <Fragment>
      <Header />
      <Elements stripe={stripePromise}>
          <PaymentForm orderId={params?.order}/>
      </Elements>
      <Footer />
    </Fragment>
  )
}

export default Payment