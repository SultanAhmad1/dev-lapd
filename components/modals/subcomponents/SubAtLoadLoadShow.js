import React, { useContext, useEffect, useState } from "react";

import HomeContext from "@/contexts/HomeContext";
import {
  BRANDSIMPLEGUID,
  BRAND_GUID,
  axiosPrivate,
} from "@/global/Axios";
import {
  find_matching_postcode,
  setAtFirstLoadModalShow,
  setLocalStorage,
} from "@/global/Store";
import AvailableStore from "@/components/AvailableStore";

function SubAtLoadLoadShow({ setLoader }) {
  
  const {
    dayname,
    daynumber,
    setPostcode,
    setPostcodefororderamount,
    deliverymatrix,
    setDeliverymatrix,
  } = useContext(HomeContext);

  const [validpostcode, setValidpostcode] = useState("");
  const [postcodeerror, setPostcodeerror] = useState("");

  const [isgobtnclickable, setIsgobtnclickable] = useState(false);

  const [availablestores, setAvailablestores] = useState([]);

  const [isstoreavailable, setIsstoreavailable] = useState(true);

  function handlePostCode(event) {

    event.preventDefault()

    const { value } = event.target

    const countPostcodeLength = value.toUpperCase().trim();
    setValidpostcode(countPostcodeLength);
    setPostcodeerror("");

    if (parseInt(countPostcodeLength.length) > parseInt(3)) 
    {
      setIsgobtnclickable(true)
      setAtFirstLoadModalShow(true)
    } 
    else 
    {
      setIsgobtnclickable(false)
    }
  }

  async function fetchPostcodeData() {
    try {
      let filterPostcode = validpostcode.replace(/\s/g, "");

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
        dayname: dayname,
        daynumber: daynumber,
        outwardString: grabPostcodeOutWard,
      };

      const response = await axiosPrivate.post(`/ukpostcode-website`, data);
      const matrix = response.data?.data?.deliveryMartix?.delivery_matrix_rows;
      find_matching_postcode(matrix, validpostcode, setDeliverymatrix);

      setLocalStorage(`${BRANDSIMPLEGUID}address`, response?.data?.data);
      setLocalStorage(`${BRANDSIMPLEGUID}user_valid_postcode`, validpostcode);

      setAvailablestores(response.data?.data?.availableStore);

      setIsgobtnclickable(false);
      setPostcode(validpostcode);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
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
      setIsstoreavailable(true);
      setIsgobtnclickable(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    }
  }

  useEffect(() => {
    if (deliverymatrix !== null) 
    {
      setPostcodefororderamount(deliverymatrix?.postcode);
      window.localStorage.setItem(`${BRANDSIMPLEGUID}delivery_matrix`,JSON.stringify(deliverymatrix));
    }
  }, [deliverymatrix]);

  const handleGoBtn = (e) => 
  {
    e.preventDefault()
    if (parseInt(validpostcode?.length) > parseInt(3)) 
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
                      <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="spacer _16"></div>

                  <input
                    type="text"
                    autoComplete="off"
                    value={validpostcode}
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
                  isgobtnclickable && 
                  <button type="submit" className="deliver-to-done-button">
                    Go
                  </button>
                }
              </form>

            </div>

            {/* All the Available Stores */}
            {isstoreavailable === false && (
              <div className="available-stores-show" style={{cursor: "pointer",textAlign: "center",marginTop: "10px",fontWeight: "bold",}}>
                <div className="available-stores">
                  Your are out of radius.
                </div>
                <div className="spacer _8"></div>
              </div>
            )}

            {
              parseInt(availablestores.length) > parseInt(0) && 
              <AvailableStore {...{availablestores}} />
            }
          </div>
        </div>

        <div className="modal-delivery-details-level-one-div-height"></div>
      </div>
    </div>
  );
}

export default SubAtLoadLoadShow;
