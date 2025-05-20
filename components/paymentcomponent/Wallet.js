"use client";
import HomeContext from '@/contexts/HomeContext';
import { axiosPrivate } from '@/global/Axios';
import { country, currency, getAmountConvertToFloatWithFixed } from '@/global/Store';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import React, {useState, useEffect, useContext} from 'react';


export default function Wallet(props){

  const{
    orderTotal,
    afterPaymentSavedOrderUpdate,
  } = props

  const { isScheduleClicked,
    isScheduleIsReady,
    scheduleMessage,} = useContext(HomeContext)
  const stripe = useStripe();
 
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) 
    {
      const orderTotalSimpleForm = parseFloat(totalOrderAmountValue) * 100

      const pr = stripe.paymentRequest({
        country: "GB",
        currency: "gbp",
        total: {
          label: 'Total',
          amount: parseInt(orderTotalSimpleForm),
        },
        requestPayerName: true, //👈 request wallet to send me customer name,
        requestPayerEmail: true, //👈 request wallet to send me email address,
        requestShipping: false, // 👈 this is the key to get physical address
        requestBillingAddress: true, //👈 ✅ ADD THIS
        requestPayerPhone: true,
      });

      pr.canMakePayment().then(result => {
        if (result) 
        {
          setPaymentRequest(pr);
        }
      });

      const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))

      const city = getCustomerInformation?.street2?.split(',')[0].trim();
      

      pr.on("paymentmethod", async (ev) => {
        try {
          const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`));
          const city = getCustomerInformation?.street2?.split(',')[0].trim();
          
          const customerName = ev.payerName || `${getCustomerInformation?.firstName} ${getCustomerInformation?.lastName}`;
          const customerEmail = ev.payerEmail || getCustomerInformation?.email;
          const customerPhone = ev.payerPhone
          
          const customerAddress = ev.billingDetails?.address || {
            line1: `${getCustomerInformation?.doorHouseName} ${getCustomerInformation?.street1}`,
            city,
            postal_code: getCustomerInformation?.postcode,
            country: "GB",
          };
      
          if(!isScheduleClicked && isScheduleIsReady)
          {
            window.alert(`We are currently closed. To schedule your order for << ${scheduleMessage} >>, go to checkout.`)
            window.location.href = "/"
            return
          }

          // ✅ Send all billing info to backend
          const response = await axiosPrivate.post("/create-payment-intent", {
            order_total: Math.round(parseFloat(totalOrderAmountValue) * 100),
            type: "wallet",
            payment_method: ev.paymentMethod.id,
            order: orderId,
            brand: BRAND_GUID,
            billing_details: {
              name: customerName,
              email: customerEmail,
              address: customerAddress,
              telephone: customerPhone,
              
            },
          });
      
          const { clientSecret } = response.data;
      
          // ✅ Finish wallet UI prompt
          ev.complete("success");
      
          // ✅ Confirm payment with Stripe
          const result = await stripe.confirmCardPayment(clientSecret); // No payment_method object needed
      
          if (result.error) {
            alert("Payment failed");
          } else {
            afterPaymentSavedOrderUpdate(result.paymentIntent);
          }
        } catch (err) {
          console.error(err);
          ev.complete("fail");
          alert("Payment failed");
        }
      });

      
    }
  }, [stripe, totalOrderAmountValue,
    isScheduleClicked,
    isScheduleIsReady,
    scheduleMessage,
  ]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }
}