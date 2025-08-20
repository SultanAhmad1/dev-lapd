"use client";
import React, { useContext, useEffect, useRef, useState } from "react";

import HomeContext from "@/contexts/HomeContext";
import {
  BRAND_SIMPLE_GUID,
  BRAND_GUID,
  axiosPrivate,
  BLACK_COLOR,
  WHITE_COLOR,
  LIGHT_BLACK_COLOR,
  DELIVERY_ID,
} from "@/global/Axios";
import {
  check_is_delivery_available,
  setAtFirstLoadModalShow,
  setLocalStorage,
  setNextCookies,
} from "@/global/Store";
import AvailableStore from "@/components/AvailableStore";
import moment from "moment";
import { NextResponse } from "next/server";
import { useSearchParams } from "next/navigation";

function SubAtLoadLoadShow() {
  
  const searchParams = useSearchParams()

  const locationFiltered = searchParams.get('location')
  
  const locationDetails = locationFiltered ? locationFiltered.replace(/^"+|"+$/g, '') : '';
  
  const responseNext = NextResponse.next()

  const postCodeRef = useRef(null)

  const {
    setLoader,
    dayName,
    dayNumber,
    setPostcode,
    setPostCodeForOrderAmount,
    deliveryMatrix,
    setDeliveryMatrix,
    websiteModificationData,
    setFilters,
    isChangePostcodeButtonClicked,
    handleBoolean,
    setAtFirstLoad,
    setCartData,
    setOrderGuid,
  } = useContext(HomeContext);

  useEffect(() => {
    if(postCodeRef.current)
    {
      postCodeRef.current.focus();
    }
  }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [validPostcode, setValidPostcode] = useState("");
  const [postcodeerror, setPostcodeerror] = useState("");

  const [isGoBtnClickAble, setIsGoBtnClickAble] = useState(false);

  const [availableStores, setAvailableStores] = useState([]);

  const [isStoreAvailable, setIsStoreAvailable] = useState(true);

  
  const handleFormCross = () => {
    handleBoolean(false, "isChangePostcodeButtonClicked")
    handleBoolean(true, "isPlaceOrderButtonClicked")
    setAtFirstLoad(false)
  }

  function handlePostCode(event) {

    event.preventDefault()

    const { value } = event.target

    const countPostcodeLength = value.toUpperCase().trim();
    setValidPostcode(countPostcodeLength);
    setPostcodeerror("");

    if (parseInt(countPostcodeLength.length) > parseInt(3)) 
    {
      setIsGoBtnClickAble(true)
      setAtFirstLoadModalShow(true)
    } 
    else 
    {
      setIsGoBtnClickAble(false)
    }
  }

  async function fetchPostcodeData() {
    try {
      let filterPostcode = validPostcode.replace(/\s/g, "");

      let grabPostcodeOutWard = "";
      if (parseInt(filterPostcode.length) === parseInt(7)) 
      {
        grabPostcodeOutWard = filterPostcode.substring(0, 4);
      } 
      else if (parseInt(filterPostcode.length) === parseInt(6)) 
      {
        grabPostcodeOutWard = filterPostcode.substring(0, 3);
      } 
      else 
      {
        grabPostcodeOutWard = filterPostcode.substring(0, 2);
      }

      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

      const data = {
        postcode: filterPostcode,
        brand_guid: BRAND_GUID,
        dayName: dayName,
        dayNumber: dayNumber,
        outwardString: grabPostcodeOutWard,
        visitorGUID: userInfo?.visitorId
      };

      const response = await axiosPrivate.post(`/ukpostcode-website`, data);

    
      const orderGuid = response?.data?.data?.order?.external_order_id
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`, orderGuid)
      setOrderGuid(orderGuid)
      const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

      const isViaQr = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}via_qr`))

      const availableStores = response?.data?.data?.availableStore || [];
      const orderTypeFilters = response?.data?.data?.orderTypeFilters || [];

     
      // make cart empty.
      // now make sure store is selected, and matched with already selected store. isChangePostcodeButtonClicked       
      
      // if(isChangePostcodeButtonClicked)
      // {
      //   const userSelectedStore = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
      //   if(userSelectedStore)
      //   {
      //     const filterStore = availableStores.find((store) => store.location_guid === userSelectedStore.display_id)
  
      //     if(filterStore)
      //     {
      //       setLocalStorage(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
      //       setLocalStorage(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);    
      //       setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)
  
      //       responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
      //       responseNext.cookies.set(`${BRAND_SIMPLE_GUID}address`, response?.data?.data)
      //       responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)
      //       setAtFirstLoad(false)
      //       setIsLoading(!true)
      //       return
      //     }
      //   }
      // }
      
      if((isViaQr !== null && isViaQr !== undefined) && parseInt(isViaQr) === parseInt(0))
      {
        // setLoader(true)
        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[]);
        setCartData([])
        setLocalStorage(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
        setLocalStorage(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);
        setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)
  
        responseNext.cookies.set("theme","dark")
        setNextCookies("theme", "dark")
  
        responseNext.cookies.set(`${BRAND_SIMPLE_GUID}cart`,[]);
        responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
        responseNext.cookies.set(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);
        responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)
      }

      setFilters(response?.data?.data?.orderTypeFilters)

      setIsGoBtnClickAble(false);
      setPostcode(validPostcode);
      
      if((isViaQr !== null && isViaQr !== undefined) && parseInt(isViaQr) === parseInt(0))
      {
        if(parseInt(availableStores?.length) === parseInt(0) || parseInt(orderTypeFilters?.length) === parseInt(0))
        {
  
          setPostcodeerror("There is no store available.");
          setIsGoBtnClickAble(false);
          setPostcode(validPostcode);
          setTimeout(() => {
            setIsLoading(!true)
          }, 1000);
          
          return
        }
        
        const availableStoreUpdate = availableStores?.map((store) => {
          // matching the delivery matrix code.
          const finalResult = check_is_delivery_available(store.deliveryMatrixes.delivery_matrix_rows ?? [], validPostcode)
          // Find matching locationalStatus from orderTypeFilters
          const matchingFilters = orderTypeFilters
            ?.map((filter, filterIndex) => {
              const matchedLocationalStatus = filter.locationalStatus?.filter(
                (status) => parseInt(status.id) === parseInt(store.id) && status.isChecked === true
              );
        
              return {
                ...filter,
                locationalStatus: matchedLocationalStatus,
                status: matchedLocationalStatus.length > 0 ? true : false, // Update status based on matched locations,
                // isClicked: filterIndex === 0 ? true : false,
                isClicked: false,
              };
            })
            .filter((filter) => filter.locationalStatus.length > 0); // Keep only filters that have matching locations
          
          const ifDeliveryMatrixHasNotMatchedDistrictCodeThenRemoveDelivery = finalResult ? matchingFilters : matchingFilters.filter((filter) => filter?.id !== DELIVERY_ID)

          return {
            ...store,
            storeDeliveryMessage: finalResult ? "" : "Delivery is not available at your postcode.",
            orderType: ifDeliveryMatrixHasNotMatchedDistrictCodeThenRemoveDelivery.length > 0 ? ifDeliveryMatrixHasNotMatchedDistrictCodeThenRemoveDelivery : null, // Attach matched filters or null
          };
        });
        
        setAvailableStores(availableStoreUpdate);
      }
      else if((isViaQr !== null && isViaQr !== undefined) && parseInt(isViaQr) === parsefInt(1))
      {
        setAtFirstLoad(false)
        handleBoolean(true, "isPlaceOrderButtonClicked")
      }

    
      setTimeout(() => {
        setIsLoading(!true)
      }, 1000);
      return responseNext
    } 
    catch (error) 
    {
      setAvailableStores([])
      if(error?.code === "ERR_NETWORK")
      {
        setPostcodeerror("Please check your internet connection and try again.");

      }
      else
      {
        setPostcodeerror(error?.response?.data?.postcode);
      }
      setIsStoreAvailable(true);
      setIsGoBtnClickAble(false);
      setTimeout(() => {
        setIsLoading(!true)
      }, 1000);
    }
  }

  
  useEffect(() => {
    if (deliveryMatrix !== null) 
    {
      setPostCodeForOrderAmount(deliveryMatrix?.postcode);
      setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`,deliveryMatrix)
    }
  }, [deliveryMatrix, responseNext, setPostCodeForOrderAmount]);

  const handleGoBtn = (e) => 
  {
    e.preventDefault()
    
    if (parseInt(validPostcode?.length) > parseInt(3)) 
    {
      setAvailableStores([])
      setIsLoading(true)
      fetchPostcodeData();
      return 
    } 
    
    setPostcodeerror("Invalid postcode.")
  } 

  useEffect(() => {

    if(parseInt(locationDetails?.length) > parseInt(0))
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}via_qr`,1)
      async function fetchQueryParamLocation() {
        try {
          setIsLoading(true)
          
          const data = {
            
            brand_guid: BRAND_GUID,
            dayName: dayName,
            dayNumber: dayNumber,
            location: locationDetails,
          };
    
          const response = await axiosPrivate.post(`/qr-code-website`, data);
          
          const matrix = response.data?.data?.deliveryMartix?.collection_matrix_rows;
          
          const availableStores = response?.data?.data?.availableStore || [];
          const orderTypeFilters = response?.data?.data?.orderTypeFilters || [];
          
          const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    
          
          // make cart empty.
          setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[]);
          setCartData([])
          setPostcode(availableStores?.[0]?.user_postcode)
          
          setLocalStorage(`${BRAND_SIMPLE_GUID}via_qr`, 1)
          setLocalStorage(`${BRAND_SIMPLE_GUID}house_no_name`, availableStores?.[0]?.house_no_name)
          setLocalStorage(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
          setLocalStorage(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);
          setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, availableStores?.[0]?.user_postcode)
    
          responseNext.cookies.set("theme","dark")
          setNextCookies("theme", "dark")
    
          responseNext.cookies.set(`${BRAND_SIMPLE_GUID}cart`,[]);
          responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
          responseNext.cookies.set(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);
          responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_valid_postcode`, availableStores?.[0].user_postcode)
    
          if(parseInt(availableStores?.length) === parseInt(0) || parseInt(orderTypeFilters?.length) === parseInt(0))
          {
    
            setPostcodeerror("There is no store available.");
            setIsGoBtnClickAble(false);
            setPostcode(validPostcode);
            setTimeout(() => {
              setIsLoading(!true)
            }, 1000);
            
            return
          }
          const availableStoreUpdate = availableStores?.map((store) => {
            // Find matching locationalStatus from orderTypeFilters
            const matchingFilters = orderTypeFilters
              ?.map((filter, filterIndex) => {
                const matchedLocationalStatus = filter.locationalStatus?.filter(
                  (status) => parseInt(status.id) === parseInt(store.id) && status.isChecked === true
                );
          
                return {
                  ...filter,
                  locationalStatus: matchedLocationalStatus,
                  status: matchedLocationalStatus.length > 0 ? true : false, // Update status based on matched locations,
                  // isClicked: filterIndex === 0 ? true : false,
                  isClicked: false,
                };
              })
              .filter((filter) => filter.locationalStatus.length > 0); // Keep only filters that have matching locations
          
            return {
              ...store,
              orderType: matchingFilters.length > 0 ? matchingFilters : null, // Attach matched filters or null
            };
          });
          
          setAvailableStores(availableStoreUpdate);
    
    
          setFilters(response?.data?.data?.orderTypeFilters)
    
          setIsGoBtnClickAble(false);
          setPostcode(validPostcode);
          setTimeout(() => {
            setIsLoading(!true)
          }, 1000);
          return responseNext
        } 
        catch (error) 
        {
          setAvailableStores([])
          if(error?.code === "ERR_NETWORK")
          {
            setPostcodeerror("There is something went wrong!. Please try again 6.");
    
          }
          else
          {
            setPostcodeerror(error?.response?.data?.postcode);
          }
          setIsStoreAvailable(true);
          setIsGoBtnClickAble(false);
          setTimeout(() => {
            setIsLoading(!true)
          }, 1000);
        }
      }

      fetchQueryParamLocation()
    }
  }, [locationDetails]);
  
  return (
    <>
      {
        <div className={`fixed inset-0 bg-black/90 z-40  justify-center px-2 overflow-y-auto pt-10 pb-10 ${locationDetails ? "hidden" : "flex"}`}>

          <div
            className={`bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative flex flex-col transition-all duration-300 ${
              isStoreAvailable && availableStores.length > 0
                ? 'max-h-screen'
                : isGoBtnClickAble
                ? 'max-h-[200px]'
                : 'max-h-[150px]'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Order Food Now</h1>

              {isChangePostcodeButtonClicked && (
                <button
                  onClick={handleFormCross}
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="m19.58 6.25-1.83-1.83-5.75 5.83-5.75-5.83-1.83 1.83 5.83 5.75-5.83 5.75 1.83 1.83 5.75-5.83 5.75 5.83 1.83-1.83-5.83-5.75z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleGoBtn} className="space-y-4">
              <div className="flex items-center rounded border-2 border-black overflow-hidden" 
                  style={{
                    borderColor:
                      websiteModificationData?.websiteModificationLive?.json_log?.[0]
                        ?.buttonBackgroundColor,
                  }}>
                <div className="px-3 flex items-center bg-white">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="text-gray-600"
                  >
                    <path
                      d="M17.58 5.17C14.5 2.08 9.5 2.08 6.42 5.17 3.33 8.25 3.33 13.33 6.42 16.42L12 22l5.58-5.67c3.09-3.09 3.09-8.17 0-11.16ZM12 12.42c-.92 0-1.67-.75-1.67-1.67s.75-1.67 1.67-1.67 1.67.75 1.67 1.67-.75 1.67-1.67 1.67Z"
                      style={{
                        fill:
                          websiteModificationData?.websiteModificationLive?.json_log?.[0]
                            ?.buttonBackgroundColor,
                      }}
                    />
                  </svg>
                </div>

                <input
                  id="postcode-input"
                  type="text"
                  ref={postCodeRef}
                  value={validPostcode}
                  onChange={handlePostCode}
                  placeholder="Enter postcode"
                  className={`flex-1 text-lg px-3 py-2 text-sm outline-none bg-white rounded placeholder-opacity-100`}
                />



              </div>

              {postcodeerror && (
                <p className="text-red-600 bg-red-100 text-center text-sm rounded p-2">
                  {postcodeerror}
                </p>
              )}

              {isGoBtnClickAble && (
                <button
                  type="submit"
                  className="w-full py-2 rounded text-white font-medium transition flex justify-center items-center gap-2"
                  style={{
                    backgroundColor:
                      websiteModificationData?.websiteModificationLive?.json_log?.[0]
                        ?.buttonBackgroundColor || 'black',
                    color:
                      websiteModificationData?.websiteModificationLive?.json_log?.[0]
                        ?.buttonColor || 'white',
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Go'
                  )}
                </button>
              )}
            </form>

            {/* Feedback */}
            {isStoreAvailable === false && (
              <div className="text-center text-sm font-medium text-red-600 mt-4">
                You are out of radius.
              </div>
            )}

            {/* Available Stores */}
            {availableStores.length > 0 && (
              <div className="mt-4 flex-1 overflow-y-auto max-h-90">
                <AvailableStore
                  {...{
                    availableStores,
                    setAvailableStores,
                    validPostcode,
                    locationDetails,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
}

export default SubAtLoadLoadShow;
