// stripe.js
"use client";
import { STRIPE_PK_KEY } from "@/global/Axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(STRIPE_PK_KEY); // replace with your actual publishable key

export default stripePromise;
