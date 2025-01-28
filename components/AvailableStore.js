"use client";
import HomeContext from "@/contexts/HomeContext";
import { axiosPrivate, BRAND_GUID, BRAND_SIMPLE_GUID, PARTNER_ID } from "@/global/Axios";
import { setLocalStorage } from "@/global/Store";
import React, { Fragment, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";

export default function AvailableStore({availableStores}) 
{
  const {
    setDayOpeningClosingTime,
    setIsTimeToClosed,
    setMenu,
    setSelectedFilter,
    setFilters,
    setNavigationCategories,
    setNavMobileIndex,
    setStoreToDayName,
    setStoreToDayOpeningTime,
    setStoreToDayClosingTime,
    setIsMenuAvailable,
    storeGUID,
    setStoreGUID,
    setStoreName,
    dayName,
    dayNumber,
    postcode,
    setPostcode,
    setAtFirstLoad,
    setIsGoBtnClicked,
    setPostCodeForOrderAmount,
    deliveryMatrix,
    setDeliveryMatrix,
    setStreet1,
    setStreet2,
    setComingSoon,
  } = useContext(HomeContext);

  const route = useRouter();

  async function fetchMenu(storeGUID) {
    try {
      const data = {
        location: storeGUID,
        brand: BRAND_GUID,
        partner: PARTNER_ID,
      };

      const response = await axiosPrivate.post(`/menu`, data);

      /**
       * Day
       * Current Time
       */
      const dayNumber = moment().day();
      const dateTime = moment().format("HH:mm");
      const dayName = moment().format("dddd");
      
      const convertToJSobj = response.data?.data?.menu.menu_json_log;
      
      if(convertToJSobj === null || convertToJSobj === undefined)
      {
        setMenu([])
        setComingSoon(true)
        return
      }
      

      const currentDay = convertToJSobj?.menus?.[0]?.service_availability?.find((day) => day?.day_of_week?.toLowerCase().includes(dayName.toLowerCase()));
      setDayOpeningClosingTime(currentDay);

      if (currentDay) 
      {
        const timePeriods = currentDay?.time_periods;
        if (timePeriods) 
        {
          if (timePeriods?.[0]?.start_time >= dateTime && dateTime <= timePeriods?.[0]?.end_time) 
          {
            setIsTimeToClosed(true);
            setAtFirstLoad(false);
          }
        }
      }
      setMenu(convertToJSobj);

      const getFilterDataFromObj = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`));

      if (getFilterDataFromObj === null) 
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}filter`, convertToJSobj.filters[0]);
      }
      setSelectedFilter(getFilterDataFromObj === null? convertToJSobj.filters[0] : getFilterDataFromObj);
      setFilters(convertToJSobj.filters);
      setNavigationCategories(convertToJSobj.categories);
      setNavMobileIndex(convertToJSobj.categories[0].id);

      const getdayInformation = convertToJSobj.menus[0].service_availability?.find((dayInformation) =>dayInformation.day_of_week === moment().format("dddd").toLowerCase());
      setStoreToDayName(moment().format("dddd"));
      setStoreToDayOpeningTime(getdayInformation.time_periods[0].start_time);
      setStoreToDayClosingTime(getdayInformation.time_periods[0].end_time);
    } 
    catch (error) 
    {
    //  setIsMenuAvailable(false)
      setMenu([])
      setComingSoon(true)
    }
  }

  function handleLocationSelect(storeGUID, storeName, storeTelephone) 
  {
    setStoreName(storeName);
    setAtFirstLoad(false);
    setStoreGUID(storeGUID);
    if (parseInt(availableStores.length) > parseInt(0)) {
      for (const store of availableStores) {
        if (storeGUID === store?.location_guid) {
          setStreet1(store?.user_street1);
          setStreet2(store?.user_street2);
        }
      }
    }

    fetchMenu(storeGUID);
    const selectedStoreData = {
      display_id: storeGUID,
      store: storeName,
      telephone: storeTelephone,
    };
    setLocalStorage(`${BRAND_SIMPLE_GUID}user_selected_store`, selectedStoreData);
    route.push("/");
  }

  useEffect(() => {
    setTimeout(() => {
      if (parseInt(availableStores.length) === parseInt(1)) {
        handleLocationSelect(
          availableStores[0]?.location_guid,
          availableStores[0]?.location_name,
          availableStores[0]?.telephone
        );
      }
    }, 2000);
  }, [availableStores]);
  // code is working
  
  return(
    <Fragment>
      <>
        <h2 className="available-store-h2"> Available Stores </h2>
        <div className="deliver-to-body-content-nested-div-level-one">
            <label
            id="location-typeahead-location-manager-label"
            htmlFor="location-typeahead-location-manager-input"
            className="deliver-to-body-content-nested-div-level-one-label"
            >
            When autocomplete results are available, use up and down
            arrows to review and enter to select. Touch device users,
            explore by touch or with swipe gestures.
            </label>

            {availableStores?.map((stores, index) => {
            return (
                <div className="available-stores-show" style={{ cursor: "pointer" }} key={index} onClick={() => handleLocationSelect(stores.location_guid,stores.location_name,stores.telephone)}>
                <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                    <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                    >
                        <g data-name="Building Store">
                        <path
                            d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z"
                            style={{ fill: "#232328" }}
                        />
                        <path
                            style={{ fill: "#232328" }}
                            d="M29.87 10h4.45l1.2-3h-6.08l.43 3z"
                        />
                        <path
                            d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z"
                            style={{ fill: "#232328" }}
                        />
                        <path
                            d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z"
                            style={{ fill: "#232328" }}
                        />
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
            })}
        </div>
      </>
    </Fragment>
  )
}
