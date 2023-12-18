// stripe.js

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_HBUKty8jv8HLo4bryNclWvTQ00I77ki57r'); // replace with your actual publishable key

export default stripePromise;
