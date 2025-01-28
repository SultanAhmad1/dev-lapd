"use client";
import React, { useContext, useEffect, useRef, useState } from "react";

import HomeContext from "@/contexts/HomeContext";
import {
  BRAND_SIMPLE_GUID,
  BRAND_GUID,
  axiosPrivate,
} from "@/global/Axios";
import {
  find_matching_postcode,
  setAtFirstLoadModalShow,
  setLocalStorage,
  setNextCookies,
} from "@/global/Store";
import AvailableStore from "@/components/AvailableStore";
import moment from "moment";
import { NextResponse } from "next/server";

function SubAtLoadLoadShow({ setLoader }) {
  
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
      const matrix = response.data?.data?.deliveryMartix?.delivery_matrix_rows;
      find_matching_postcode(matrix, validPostcode, setDeliveryMatrix);

      const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

      // make cart empty.
      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[]);
      setLocalStorage(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
      setLocalStorage(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);
      setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)

      responseNext.cookies.set("theme","dark")
      setNextCookies("theme", "dark")
      responseNext.cookies.set(`${BRAND_SIMPLE_GUID}cart`,[]);
      responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_postcode_time`, currentDateTime)
      responseNext.cookies.set(`${BRAND_SIMPLE_GUID}address`, response?.data?.data);
      responseNext.cookies.set(`${BRAND_SIMPLE_GUID}user_valid_postcode`, validPostcode)

      setAvailableStores(response.data?.data?.availableStore);

      setIsGoBtnClickAble(false);
      setPostcode(validPostcode);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      return responseNext
    } 
    catch (error) 
    {
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

  return (
    <div className="modal-delivery-details">
      <div className="modal-delivery-details-level-one-div">
        <div className="modal-delivery-details-level-one-div-height"></div>

        <div className="modal-delivery-details-level-one-div-dialog">
          <div className="deliver-to-body-content">
            <h1 className="deliver-to-body-content-h1">Order Food Now</h1>
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
                    '--go-btn-background-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
                    '--go-btn-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor, 
                    '--go-hover-btn-background-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor, 
                    '--go-hover-btn-font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor, 
                    '--go-hover-border': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor, 
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
              <AvailableStore {...{availableStores}} />
            }
          </div>
        </div>

        <div className="modal-delivery-details-level-one-div-height"></div>
      </div>
    </div>
  );
}

export default SubAtLoadLoadShow;
