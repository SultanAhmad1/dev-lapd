"use client";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID, BRAND_GUID, axiosPrivate } from "@/global/Axios";
import { find_matching_postcode, setLocalStorage } from "@/global/Store";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { usePostMutationHook } from "../reactquery/useQueryHook";
import Loader from "./Loader";

function PostcodeModal() {
  // use Next Navigation Router to navigate on home page
  const router = useRouter();

  // React Context
  const {
    setIsDeliveryBtnClicked,
    setPostCodeForOrderAmount,
    deliveryMatrix,
    setPostcode,
    dayName,
    dayNumber,
    setStoreName,
    setStreet1,
    setStreet2,
    setDeliveryMatrix,
    setIsCartBtnClicked,
    setLoader
  } = useContext(HomeContext);

  // Boolean States
  const [isGoBtnClickAble, setIsGoBtnClickAble] = useState(false);

  // Get Value States
  const [updatedValidPostcode, setUpdatedValidPostcode] = useState("");
  const [availableStores, setAvailableStores] = useState([]);
  const [tempAddress, setTempAddress] = useState([]);
  // Get Error States
  const [postcodeerror, setPostcodeerror] = useState("");

  const handleValidPostcode = (event) => {
    const getLength = event.target.value.length;
    setUpdatedValidPostcode(event.target.value.toUpperCase().trim());
    setIsGoBtnClickAble(parseInt(getLength) > parseInt(3) ? true : false);
    setPostcodeerror("");
  };

  const handleGoBtnClicked = (e) => {
    e.preventDefault()

    if(parseInt(updatedValidPostcode?.length) > parseInt(3))
    {
      setLoader(true)
      let filterPostcode = updatedValidPostcode.replace(/\s/g, "");

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
      
      const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      const postcodeData = {
        postcode: updatedValidPostcode,
        brand_guid: BRAND_GUID,
        dayName: dayName,
        dayNumber: dayNumber,
        outwardString: grabPostcodeOutWard,
        visitorGUID: visitorInfo.visitorId
      }

      ukPostcodePostMutation(postcodeData)
      return
    }
    setLoader(false)
    setPostcodeerror("Invalid postcode.")
  };

  const onUkPostcodeSuccess = (data) => {
    setLoader(false)
    const matrix = data.data?.data?.deliveryMartix?.delivery_matrix_rows;
    
    find_matching_postcode(matrix, updatedValidPostcode, setDeliveryMatrix);

    setTempAddress(data?.data?.data);
    setAvailableStores(data.data?.data?.availableStore);

    setIsGoBtnClickAble(!isGoBtnClickAble);
  }

  const onUkPostcodeError = (error) => {
    setLoader(false)
    setPostcodeerror(error?.response?.data?.postcode);
    setIsGoBtnClickAble(!isGoBtnClickAble);
  }


  const {mutate: ukPostcodePostMutation, isLoading, isError, isSuccess, reset} = usePostMutationHook("ukpostcodes", `/ukpostcode-website`, onUkPostcodeSuccess, onUkPostcodeError)

  if(isSuccess)
  {
    setTimeout(() => {
      reset()
    }, 2000);
    return
  }

  const handleLocationSelect = (storeGUID, storeName, storeTelephone) => {
    setStoreName(storeName);
    if (parseInt(availableStores.length) > parseInt(0)) {
      for (const store of availableStores) {
        if (storeGUID === store?.location_guid) {
          setStreet1(store?.user_street1);
          setStreet2(store?.user_street2);
        }
      }
    }

    setLocalStorage(`${BRAND_SIMPLE_GUID}address`, tempAddress);
    setLocalStorage(
      `${BRAND_SIMPLE_GUID}user_valid_postcode`,
      updatedValidPostcode
    );

    setPostCodeForOrderAmount(deliveryMatrix?.postcode);
    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`, deliveryMatrix);

    setPostcode(updatedValidPostcode);

    const selectedStoreData = {
      display_id: storeGUID,
      store: storeName,
      telephone: storeTelephone,
    };
    setLocalStorage(`${BRAND_SIMPLE_GUID}user_selected_store`, selectedStoreData);
    router.push("/");
    setIsCartBtnClicked(true);
    setIsDeliveryBtnClicked(false);
  };

  

  return (
    <>
      <div className="deliver-to-body-content">
        <h1 className="deliver-to-body-content-h1">Order Food Now</h1>
        <div className="deliver-to-body-content-nested-div-level-one">
          
          <form onSubmit={handleGoBtnClicked}>
            <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label">
              When autocomplete results are available, use up and down arrows to
              review and enter to select. Touch device users, explore by touch or
              with swipe gestures.
            </label>
            <div className="deliver-to-body-content-nested-div-level-one-nested">
              <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                  <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>

              <div className="spacer _16"></div>
                <input
                  type="text"
                  autoComplete="off"
                  className="deliver-to-input"
                  placeholder="Enter postcode"
                  value={updatedValidPostcode}
                  onChange={handleValidPostcode}
                />
              <div className="spacer _8"></div>
            </div>
            <div className="availabe_stores"></div>

            {/* Display Postcode Error. */}
            {
              parseInt(postcodeerror.length) > parseInt(0) && 
              <p style={{ color: "red", background: "#eda7a7", textAlign: "center",padding: "10px" }}>
                {postcodeerror}
              </p>
            }

            {/* Find Postcode related information via Go button. */}
            {
              isGoBtnClickAble && 
              <button type="submit" className="deliver-to-done-button" >
                Go
              </button> 
            }
          </form>

          {/* All the Available Stores */}
          {parseInt(availableStores.length) > parseInt(0) && (
            <>
              <h2 className="available-store-h2"> Available Stores </h2>
              <div className="deliver-to-body-content-nested-div-level-one">
                <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label" >
                  When autocomplete results are available, use up and down arrows
                  to review and enter to select. Touch device users, explore by
                  touch or with swipe gestures.
                </label>

                {
                  availableStores?.map((stores, index) => {
                    return (
                      <div className="available-stores-show" style={{ cursor: "pointer" }} key={index} onClick={() => handleLocationSelect(stores.location_guid,stores.location_name,stores.telephone)} >
                        <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                          <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" >
                              <g data-name="Building Store">
                                <path d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z" style={{ fill: "#232328" }}/>
                                <path style={{ fill: "#232328" }} d="M29.87 10h4.45l1.2-3h-6.08l.43 3z"/>
                                <path d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z" style={{ fill: "#232328" }}/>
                                <path d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z" style={{ fill: "#232328" }}/>
                              </g>
                            </svg>
                          </div>
                        </div>

                        <div className="spacer _16"></div>

                        <div className="available-stores">
                          {stores?.location_name}
                        </div>
                        <div className="spacer _8"></div>
                      </div>
                    );
                  })
                }
              </div>
            </>
          )}

        </div>
      </div>
      {isLoading && <Loader loader={isLoading}/>}
    </>
  );
}

export default PostcodeModal;
