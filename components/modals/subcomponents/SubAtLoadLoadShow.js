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
} from "@/global/Axios";
import {
  setAtFirstLoadModalShow,
  setLocalStorage,
  setNextCookies,
} from "@/global/Store";
import AvailableStore from "@/components/AvailableStore";
import moment from "moment";
import { NextResponse } from "next/server";
import FilterLocationTime from "@/components/FilterLocationTime";
import { useSearchParams } from "next/navigation";

function SubAtLoadLoadShow({ setLoader }) {
  
  const searchParams = useSearchParams()

  const locationFiltered = searchParams.get('location')
  
  const locationDetails = locationFiltered ? locationFiltered.replace(/^"+|"+$/g, '') : '';

  const responseNext = NextResponse.next()

  const postCodeRef = useRef(null)

  const {
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
   
  } = useContext(HomeContext);

  useEffect(() => {
    if(postCodeRef.current)
    {
      postCodeRef.current.focus();
    }
  }, []);
  
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

      const data = {
        postcode: filterPostcode,
        brand_guid: BRAND_GUID,
        dayName: dayName,
        dayNumber: dayNumber,
        outwardString: grabPostcodeOutWard,
      };

      const response = await axiosPrivate.post(`/ukpostcode-website`, data);
      
      console.log("uk postcode website:", response);
      
      const matrix = response.data?.data?.deliveryMartix?.delivery_matrix_rows;

      const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

      const isViaQr = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}via_qr`))

      const availableStores = response?.data?.data?.availableStore || [];
      const orderTypeFilters = response?.data?.data?.orderTypeFilters || [];

      // make cart empty.
      // now make sure store is selected, and matched with already selected store. isChangePostcodeButtonClicked
      if(isChangePostcodeButtonClicked)
      {
        const userSelectedStore = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
        if(userSelectedStore)
        {
          const filterStore = availableStores.find((store) => store.location_guid === userSelectedStore.display_id)
  
          if(filterStore)
          {
            setLocalStorage(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
            setLocalStorage(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);    
            setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)
  
            responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
            responseNext.cookies.set(`${BRAND_SIMPLE_GUID}address`, response?.data?.data)
            responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)
            setAtFirstLoad(false)
            setLoader(false)
            return
          }
        }
      }

      if((isViaQr !== null && isViaQr !== undefined) && parseInt(isViaQr) === parseInt(0))
      {
        
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
            setLoader(false);
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
      }
      else if((isViaQr !== null && isViaQr !== undefined) && parseInt(isViaQr) === parseInt(1))
      {
        setAtFirstLoad(false)
        handleBoolean(true, "isPlaceOrderButtonClicked")
      }

    
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      return responseNext
    } 
    catch (error) 
    {
      setAvailableStores([])
      if(error?.code === "ERR_NETWORK")
      {
        setPostcodeerror("There is something went wrong!. Please try again.");

      }
      else
      {
        setPostcodeerror(error?.response?.data?.postcode);
      }
      setIsStoreAvailable(true);
      setIsGoBtnClickAble(false);
      setTimeout(() => {
        setLoader(false);
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
      setLoader(true);
      fetchPostcodeData();
      return 
    } 
    
    setPostcodeerror("Invalid postcode.")
  } 

  useEffect(() => {

    console.log("location details sub at load show:", locationDetails);
    
    if(parseInt(locationDetails?.length) > parseInt(0))
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}via_qr`,1)
      async function fetchQueryParamLocation() {
        try {
            setLoader(true)
          
          const data = {
            
            brand_guid: BRAND_GUID,
            dayName: dayName,
            dayNumber: dayNumber,
            location: locationDetails,
          };
    
          const response = await axiosPrivate.post(`/qr-code-website`, data);
          
          const matrix = response.data?.data?.deliveryMartix?.delivery_matrix_rows;
          
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
              setLoader(false);
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
            setLoader(false);
          }, 1000);
          return responseNext
        } 
        catch (error) 
        {
          setAvailableStores([])
          if(error?.code === "ERR_NETWORK")
          {
            setPostcodeerror("There is something went wrong!. Please try again.");
    
          }
          else
          {
            setPostcodeerror(error?.response?.data?.postcode);
          }
          setIsStoreAvailable(true);
          setIsGoBtnClickAble(false);
          setTimeout(() => {
            setLoader(false);
          }, 1000);
        }
      }

      fetchQueryParamLocation()
    }
  }, [locationDetails]);
  

  return (
    <div className="modal-delivery-details">
      <div className="modal-delivery-details-level-one-div">

        <div className="modal-delivery-details-level-one-div-dialog" style={{ marginTop: "15px"}}>
          <div className="deliver-to-body-content">
            <div>
              <h1 className="deliver-to-body-content-h1">Order Food Now</h1>
              {
                isChangePostcodeButtonClicked &&
                <button 
                  class="at-first-cross-btn"
                  onClick={handleFormCross}
                >
                  <div class="cart-close-btn-div">
                    <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path 
                        d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" 
                        fill="#000"
                      >
                      </path>
                    </svg>
                  </div>
                </button>
              }
            </div>
            <div className="deliver-to-body-content-nested-div-level-one">

              <form onSubmit={handleGoBtn}>
                <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label" >
                  When autocomplete results are available, use up and down arrows
                  to review and enter to select. Touch device users, explore by
                  touch or with swipe gestures.
                </label>

                <div className="deliver-to-body-content-nested-div-level-one-nested">
                  <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                    <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                      <svg 
                        width="24px" 
                        height="24px" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg" 
                        aria-hidden="true" 
                        focusable="false"
                      >
                        <path 
                          d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z" 
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="spacer _16"></div>

                  <input
                    type="text"
                    autoComplete="off"
                    ref={postCodeRef}
                    value={validPostcode}
                    onChange={handlePostCode}
                    className="deliver-to-input"
                    placeholder="Enter postcode"
                  />
                  <div className="spacer _8"></div>
                </div>

                <div className="availabe_stores"></div>
                {
                  postcodeerror !== "" && 
                  <p style={{color: "red",background: "#eda7a7",textAlign: "center",marginTop: "10px", padding: "10px",}}>
                    {postcodeerror}
                  </p>
                }

                {
                  isGoBtnClickAble && 
                  <button type="submit" className="deliver-to-done-button" style={{
                    '--go-btn-background-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR,
                    '--go-btn-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR, 
                    '--go-hover-btn-background-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR,
                    '--go-hover-btn-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR,
                    '--go-hover-border': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR, 
                  }}>
                    Go
                  </button>
                }
              </form>

            </div>

            {/* All the Available Stores */}
            {isStoreAvailable === false && (
              <div className="available-stores-show" style={{cursor: "pointer",textAlign: "center",marginTop: "10px",fontWeight: "bold",}}>
                <div className="available-stores">
                  Your are out of radius.
                </div>
                <div className="spacer _8"></div>
              </div>
            )}

            {
              parseInt(availableStores.length) > parseInt(0) && 
              
                <AvailableStore {...{availableStores, setAvailableStores, validPostcode, locationDetails}} />
            }
          </div>
        </div>

      </div>
    </div>
  );
}

export default SubAtLoadLoadShow;
