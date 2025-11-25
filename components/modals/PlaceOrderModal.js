"use client"

import { axiosPrivate, BLACK_COLOR, BRAND_GUID, BRAND_SIMPLE_GUID, DELIVERY_ID, PARTNER_ID } from "@/global/Axios";
import PlaceOrderForm from "./subcomponents/PlaceOrderForm";
import { useContext, useEffect, useState } from "react";
import HomeContext from "@/contexts/HomeContext";
import { Elements } from '@stripe/react-stripe-js';
import WrapWallet from "../paymentcomponent/WrapWallet";
import stripePromise from "../paymentcomponent/Stripe";
import moment from "moment-timezone";
import { listtime } from "@/global/Time";

export default function PlaceOrderModal() 
{
  const {
    selectedFilter,
    setIsLocationBrandOnline,
    scheduleTime,
    isScheduleForToday,
    websiteModificationData,
    handleBoolean,
    storeGUID,
    customDoorNumberName
  } = useContext(HomeContext)

  const [paymentError, setPaymentError] = useState(null);

  const [modalObject, setModalObject] = useState({
    isPaymentReady: false,
    orderGUI: "7DFF394B-B37A-433E-8107-96B1395ABDDC",
    sectionNumber: 1,
    isNextButtonReadyToClicked: false,
    isCreditCardButtonClicked: false,
  });
  
  const handleObject = (newValue, newField) => {
    setModalObject((prevData) => ({...prevData, [newField]: newValue}))
  }

  const [deliveryTime, setDeliveryTime] = useState("");
  const [due, setDue] = useState("due");
  const [asapOrRequested, setAsapOrRequested] = useState('ASAP');
  
  const [customerDetailObj, setCustomerDetailObj] = useState({
    id: 0,
    email: "",
    phone: "",
    password: "",
    lastName: "",
    firstName: "",
    doorHouseName: "",
    driverInstruction: "",
    openingTime: "",
    closingTime: "",
    deliveryTimeFrom: "",
    deliveryTimeEnd: "",

    phoneError: "",
    PayNowBottomError: "",
    saveMyDetailsError: "",
  });

  useEffect(() => {
    async function fetchLocationDeliveryEstimate() {
      // Get the current day name
      try {
        const placeOrderGetStoreGUID = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`));
  
        const data = {
          location_guid: placeOrderGetStoreGUID === null ? storeGUID : placeOrderGetStoreGUID?.display_id,
          brand_guid: BRAND_GUID,
          day_number: moment().isoWeekday(),
          partner: PARTNER_ID,
        };
  
        const response = await axiosPrivate.post(`/website-delivery-time`, data);
  
        const { brandExists } = response?.data?.data
        
        setIsLocationBrandOnline(brandExists)

        var startTime   = moment.utc(response?.data?.data?.brandDeliveryEstimatePartner?.start_time,"HH:mm","Europe/London").format("HH:mm") ;
        var deliveryTo  = response?.data?.data?.brandDeliveryEstimatePartner?.time_to;
        var collectionAfter = response?.data?.data?.brandDeliveryEstimatePartner?.collection_after_opening_from;
        
        var currentTime = moment().tz("Europe/London").format("HH:mm");

        let placeUpdateAddMinutes = (selectedFilter?.id === DELIVERY_ID) ? deliveryTo : collectionAfter
        let placedUpdateEndTime = moment.utc(currentTime, "HH:mm", "Europe/London").add(placeUpdateAddMinutes, 'minutes').format("HH:mm");
        
        if(startTime >= currentTime)
        {
          placeUpdateAddMinutes = (selectedFilter?.id === DELIVERY_ID) ? deliveryTo : collectionAfter
          placedUpdateEndTime = moment.utc(startTime, "HH:mm", "Europe/London").add(placeUpdateAddMinutes, 'minutes').format("HH:mm");
        }
        
        const getTheExactTime = parseInt(isScheduleForToday) > parseInt(0) ? scheduleTime : placedUpdateEndTime
        
        const nextAvailableTime = listtime.find(item => 
          moment(item.time, "HH:mm").isSameOrAfter(moment(getTheExactTime, "HH:mm"))
        );
        
        setDeliveryTime(nextAvailableTime?.time);


    
      } catch (error) {
        
      }
    }
    fetchLocationDeliveryEstimate()

    // check the order type, 
    if(selectedFilter?.id !== DELIVERY_ID)
    {
      setCustomerDetailObj((prevData) => ({
        ...prevData,
        doorHouseName: customDoorNumberName
      }))
    }
  },[]);
  
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 bg-opacity-60">
      <div className="relative w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-[90vh] flex flex-col">

        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-lg font-bold">Checkout Window</h4>
          {
            modalObject.sectionNumber === 2 ?
              <button
                type="button"
                onClick={() => handleObject(1,"sectionNumber")}
                className="text-gray-500 hover:text-gray-700"
              >
                {/* back arrow svg */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7M8 12h13"
                  />
                </svg>

              </button>
            :
              <button
                type="button"
                onClick={() => handleBoolean(false, "isPlaceOrderButtonClicked")}
                className="text-gray-500 hover:text-gray-700"
              >
                {/* Close cross button */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>

              </button>
          }
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Elements stripe={stripePromise}>
            {modalObject.sectionNumber === 2 && (
              <>
                {paymentError && (
                  <div className="flex items-center justify-center bg-red-400 mb-4">
                    <p className="text-white text-sm">{paymentError}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="mx-4 text-gray-500 text-sm">Express Checkout</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>

                <WrapWallet {...{
                  asapOrRequested,
                  deliveryTime,
                  customerDetailObj,
                  due,
                  setPaymentError,
                }}/>

                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="mx-4 text-gray-500 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>
              </>
            )}

            {modalObject.sectionNumber === 2 && !modalObject.isCreditCardButtonClicked && (
              <button
                type="button"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                onClick={() => handleObject(true, "isCreditCardButtonClicked")}
              >
                Credit Card
              </button>
            )}

            <PlaceOrderForm
              {...{                
                deliveryTime,
                setDeliveryTime,
                due,
                setDue,
                asapOrRequested,
                setAsapOrRequested,
                customerDetailObj,
                setCustomerDetailObj,
                setModalObject,
                handleBoolean,
                sectionNumber: modalObject.sectionNumber,
                isNextButtonReadyToClicked: modalObject.isNextButtonReadyToClicked,
                isCreditCardButtonClicked: modalObject.isCreditCardButtonClicked,
                handleObject,
                paymentError,
                setPaymentError
              }}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}
