import React, {useEffect, useState} from 'react';
import {PaymentRequestButtonElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Loader from '../modals/Loader';
import { getAmountConvertToFloatWithFixed } from '@/app/global/Store';
// import StatusMessages, {useMessages} from './StatusMessages';

const GooglePay = ({orderTotal}) => {

    const [loader, setLoader] = useState(false)

    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    // const [messages, addMessage] = useMessages();
    const [messages, setaddMessage] = useState("")

    useEffect(() => {
        if(parseInt(orderTotal) > parseInt(0))
        {

            if (!stripe || !elements) {
            return;
            }
            console.log("Total value:", orderTotal * 100);
    
            const pr = stripe.paymentRequest({
            country: 'GB',
            currency: 'gbp',
            total: {
                label: 'Total',
                amount: (orderTotal * 100),
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
                    currency: 'gbp',
                }),
                }
            ).then((r) => r.json());
    
            if (backendError) {
                setaddMessage(backendError.message);
                return;
            }
    
            setaddMessage('Client secret returned');
    
            const {
                error: stripeError,
                paymentIntent,
            } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: e.paymentMethod.id,
            }, { handleActions: false });
    
            if (stripeError) {
                // Show error to your customer (e.g., insufficient funds)
                setaddMessage(stripeError.message);
                return;
            }
    
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.
            setaddMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
            });
        }
    }, [orderTotal]);

    return (
        <>
            {/* <h1>Google Pay</h1> */}

            {/* <p>
                Before you start, you need to:
                <ul>
                <li><a href="https://stripe.com/docs/stripe-js/elements/payment-request-button#html-js-testing" target="_blank">Add a payment method to your browser.</a> For example, add a card to your Google Pay settings.</li>
                <li>Serve your application over HTTPS. This is a requirement both in development and in production. One way to get up and running is to use a service like <a href="https://ngrok.com/" target="_blank" rel="noopener noreferrer">ngrok</a>.</li>
                </ul>
            </p>

            <a href="https://stripe.com/docs/stripe-js/elements/payment-request-button" target="_blank">Stripe Documentation</a> */}

            {paymentRequest && <PaymentRequestButtonElement options={{paymentRequest}} />}

            {/* <StatusMessages messages={messages} /> */}

        </>
    );
};

export default GooglePay;