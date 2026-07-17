"use client";
import HomeContext from "@/contexts/HomeContext";
import { usePostMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_SIMPLE_GUID, BRAND_GUID, PARTNER_ID, axiosPrivate, DELIVERY_ID } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, removeLocalStorageAfterOrderPlaced, setLocalStorage } from "@/global/Store";
import moment from "moment-timezone";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { CardNumberElement, PaymentRequestButtonElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function WrapWallet({deliveryTime,customerDetailObj,due,setPaymentError})
{
  const paymentLock = useRef(false);
  const [walletBusy, setWalletBusy] = useState(false);
  const {
    asapOrRequested,
    setPaymentLoader,
    booleanObj,
    dayOpeningClosingTime,
    couponDiscountApplied,
    totalOrderAmountValue,
    setTotalOrderAmountValue,
    storeGUID,
    cartData,
    postcode,
    street1,
    street2,
    setCartData,
    handleBoolean,
    selectedFilter,
    isScheduleClicked,
    isScheduleIsReady,
    scheduleMessage,
    isScheduleForToday,
    orderGuid,
    setOrderGuid,
    setBooleanObj
  } = useContext(HomeContext);

  const stripe = useStripe()
  const elements = useElements();

  const [walletCompleted, setWalletCompleted] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);
      
  // This method will hit when payment successfully done, to send sms and email to user.
  
  const { 
    mutateAsync: storeMutation 
  } 
  = 
  usePostMutationHook(
    'customer-store',
    `/store-customer-details`,
    (data) => {
      const orderGUID = data?.data?.data?.order?.external_order_id
      setOrderGuid(orderGUID)
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
    }, 
    (error) => {
      console.log("store amount error:", error);
    }
  )
  
  const {
    mutateAsync: postMutation
  } 
  = 
  usePostMutationHook(
    'customer-update',
    `/update-customer-details`,
     (data) => {
      const orderGUID = data?.data?.data?.order?.external_order_id
      setOrderGuid(orderGUID)
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
     }, 
    (error) => {
      console.log("patch amount error:", error);
      
    }
  )
  const [wallets, setWallets] = useState(null);

  const buildCustomerPayload = (ev) => {

    const subTotalOrderLocal =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`));

    const localStorageTotal =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`));

    const orderAmountDiscountValue =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_number`));

    const orderFilter =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`));

    const deliveryFee =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_fee`));

    const couponLocal =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`));

    const coupons =
        couponLocal?.length
            ? couponLocal
            : couponDiscountApplied;

    const orderGuidLocal =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`));

    const customerAuth =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`));

    const customer =
        JSON.parse(localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`));

    const address =
        customer?.addresses?.find(a => a.is_default_address === 1);

    const names = ev.payerName.trim().split(" ");

    const firstName = names.shift();

    const lastName = names.join(" ");

    let baseDate = moment().format("YYYY-MM-DD");

    if (isScheduleForToday === 2)
        baseDate = moment().add(1, "day").format("YYYY-MM-DD");

    const cleanedTime =
        deliveryTime.replace(/ PM| AM/i, "");

    const deliveryEstimate =
        moment(
            `${baseDate} ${cleanedTime}`,
            "YYYY-MM-DD HH:mm"
        ).format("YYYY-MM-DD HH:mm:ss");

    return {

        customer: customerAuth ? customer?.id : 0,

        address: customerAuth ? address?.id : 0,

        due,

        asapOrRequested,

        email: ev.payerEmail,

        phone: ev.payerPhone,

        firstName,

        lastName,

        street1,

        street2,

        postcode,

        password: null,

        store: storeGUID,

        brand: BRAND_GUID,

        order: cartData,

        filterId:
            orderFilter?.id ?? selectedFilter.id,

        filterName:
            orderFilter?.name ?? selectedFilter.name,

        partner: PARTNER_ID,

        total_order:
            localStorageTotal ??
            getAmountConvertToFloatWithFixed(totalOrderAmountValue,2),

        deliveryTime,

        doorHouseName:
            customerDetailObj?.doorHouseName,

        driverInstruction:
            customerDetailObj?.driverInstruction ?? "",

        sub_total_order:
            subTotalOrderLocal,

        orderAmountDiscount_guid:
            orderAmountDiscountValue,

        delivery_fee:
            deliveryFee,

        coupons,

        is_schedule_order:
            isScheduleForToday > 0,

        delivery_estimate_time:
            deliveryEstimate,

        order_guid:
            orderGuidLocal ?? orderGuid,

        is_verified:
            booleanObj.isCustomerVerified,

        is_paid_via_wallet:1,

        type:"wallet"

    };

  };

  const createPaymentIntent = async (
    payload,
    paymentMethod
  ) => {

      const response =
          await axiosPrivate.post(
              "/create-payment-intent",
              {

                  order:
                      payload.order_guid,

                  brand:
                      BRAND_GUID,

                  payment_method:
                      paymentMethod,

                  type:"wallet"

              }
          );

      return response.data;

  };

  
  /**
   * First Heler
   * @returns 
   */
  const mapStripeError = (error) => {

    const message =
        error?.response?.data?.error ??
        error?.message ??
        "";

    const text = message.toLowerCase();

    if (text.includes("insufficient"))
        return "Your bank declined the payment because there are insufficient funds available.";

    if (text.includes("expired"))
        return "Your card has expired. Please use another card.";

    if (text.includes("incorrect cvc"))
        return "The security code (CVC) is incorrect.";

    if (text.includes("authentication"))
        return "Your bank could not authenticate this payment.";

    if (text.includes("declined"))
        return "Your bank declined the payment. Please try another card.";

    if (text.includes("processing"))
        return "Your bank is still processing the payment. Please wait.";

    if (text.includes("minimum"))
        return "The payment amount is below the minimum allowed.";

    return "Unable to process your payment. Please try again.";
  };

  const validateCheckout = () => {
    if (!cartData.length) throw new Error("Your basket is empty.");

    if (!isScheduleClicked && isScheduleIsReady)
    throw new Error(
        `We are currently closed. To schedule your order for ${scheduleMessage}, please return to checkout.`
    );

    return true;
  };

  const confirmWalletPayment = async (
    clientSecret,
    ev
  ) => {

    const result =
      await stripe.confirmCardPayment(
          clientSecret,
          {
              payment_method:
                  ev.paymentMethod.id
          }
      );

    if(result.error)
    throw result.error;

    if(result.paymentIntent.status!=="succeeded")
    throw new Error(
        "Payment was not successful."
    );

    return result;

  };
  
  const verifyPayment = async (
    orderGuid,
    paymentIntentId,
    amountPaid
  ) => {
    try {

        const { data } = await axiosPrivate.post(
            "/update-order-after-successfully-payment-save",
            {
                guid: orderGuid,
                stripeid: paymentIntentId,
                amount_paid: amountPaid / 100,
                placed: moment()
                    .tz("Europe/London")
                    .format("YYYY-MM-DD HH:mm:ss"),
            }
        );

        return {
            success: true,
            data,
        };

    } catch (error) {
      return {
        success: false,
        data: error?.response?.data,
        message:
            error?.response?.data?.error?.message ??
            "Payment verification failed.",
        status:
            error?.response?.status ?? 500,
      };
    }
  };

  const saveCustomerOrder = async (
      payload
  ) => {
      if(payload.order_guid){
        await postMutation(payload);
      }
      else{
        await storeMutation(payload);
      }

  };

  const handleWalletPayment = async (ev) => {
    // Prevent duplicate Apple Pay / Google Pay submissions
    if (paymentLock.current) {
      ev.complete("fail");
      return;
    }

      paymentLock.current = true;
      setWalletBusy(true);

    try {
      validateCheckout();

      setPaymentLoader(true);

      const payload = buildCustomerPayload(ev);
      
      await saveCustomerOrder(
        payload
      );

      const paymentIntent = await createPaymentIntent(
          payload,
          ev.paymentMethod.id
      );

      try{
        const confirmation = await confirmWalletPayment(
          paymentIntent.clientSecret,
          ev
        );

        const verifyResponse = await verifyPayment(
          payload.order_guid,
          paymentIntent.paymentIntentId,
          confirmation.paymentIntent.amount_received
        );

        if(!verifyResponse?.success)
        {
          ev.complete("fail");
          return
        }

        ev.complete("success");

        // redirect to track-order page
        setCartData([])
        removeLocalStorageAfterOrderPlaced()
      
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        setOrderGuid(null)
        setLocalStorage(`${BRAND_SIMPLE_GUID}isValidNumber`,0)

        if (String(DELIVERY_ID) === String(payload?.filterId)) {
          window.location.href = `/track-order/${payload?.order_guid}`
        }
        else
        {
          window.location.href = `/thank-you/${payload?.order_guid}`
        }
      } catch (error) {

        await axiosPrivate.post("/wallet-payment-failed", {
            order: payload.order_guid,
            payment_intent: paymentIntent.paymentIntentId,
            message: error.message,
            code: error.code,
            decline_code: error.decline_code,
            type: error.type,
        });

        throw error;
    }
    

    } catch (error) {

        ev.complete("fail");

        setPaymentError(mapStripeError(error));

    } finally {
      setPaymentLoader(false);
      paymentLock.current = false;
      setWalletBusy(false);
    }
  };

  useEffect(() => {
    if (!stripe || !totalOrderAmountValue || paymentRequest) return;


    const pr = stripe.paymentRequest({
        country: "GB",
        currency: "gbp",
        total: {
            label: "Total",
            amount: Math.round(parseFloat(totalOrderAmountValue) * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        // requestBillingAddress: true,
        requestShipping: false,
    });
    

    pr.canMakePayment().then((result) => {
        if (!result) return;

        setWallets(result);

        if (result.applePay || result.googlePay) {
            setPaymentRequest(pr);
        }
    });

    pr.on("paymentmethod", handleWalletPayment);

    // return () => {
    //     pr.off?.("paymentmethod", handleWalletPayment);
    // };

  }, [
      stripe,
      totalOrderAmountValue,
      paymentRequest,
      isScheduleClicked,
      isScheduleIsReady,
      scheduleMessage,
  ]);

  return(
    <Fragment>

      { 
        // ((paymentRequest && !walletCompleted) && wallets) && (wallets.applePay || wallets.googlePay) && (
        // (!walletBusy && paymentRequest) && (
        
        //   <PaymentRequestButtonElement options={{ paymentRequest }} />
        // )
        <div
            style={{
                opacity: walletBusy ? 0.5 : 1,
                pointerEvents: walletBusy ? "none" : "auto",
            }}
        >
          {
            ((paymentRequest && !walletCompleted) && wallets) && (wallets.applePay || wallets.googlePay) &&
            <>
              <PaymentRequestButtonElement
                  options={{ paymentRequest }}
              />
            </>
          }
        </div>
      }
    </Fragment>
  )
}
