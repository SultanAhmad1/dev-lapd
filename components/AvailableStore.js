"use client";
import HomeContext from "@/contexts/HomeContext";
import { axiosPrivate, BLACK_COLOR, BRAND_GUID, BRAND_SIMPLE_GUID, DELIVERY_ID, LIGHT_BLACK_COLOR, PARTNER_ID, WHITE_COLOR } from "@/global/Axios";
import { find_matching_postcode, setLocalStorage } from "@/global/Store";
import React, { Fragment, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import FilterLocationTime from "./FilterLocationTime";
import FilterLocationTimeEdit from "./FilterLocationTimeEdit";

export default function AvailableStore({availableStores, setAvailableStores,validPostcode, locationDetails}) 
{

  const {
    setDayOpeningClosingTime,
    setIsTimeToClosed,
    setMenu,
    setSelectedFilter,
    filters,
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
    setErrorMessage,
    setDisplayFilterModal,
    websiteModificationData,
  } = useContext(HomeContext);

  const route = useRouter();

  async function fetchMenu(storeGUID) {
    try {

      const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      const data = {
        location: storeGUID,
        brand: BRAND_GUID,
        partner: PARTNER_ID,
        visitorGUID: visitorInfo.visitorId,
        landingPage: true,
        orderPage: false,
      };

      const response = await axiosPrivate.post(`/menu`, data);

      /**
       * Day
       * Current Time
       * here make sure to update the delivery postcodes.
       */
      const dayNumber = moment().day();
      const dateTime = moment().format("HH:mm");
      const dayName = moment().format("dddd");
      
      const convertToJSobj = response.data?.data?.menu.menu_json_log;
      
      if(response?.data?.data?.menu === null || response?.data?.data?.menu === undefined)
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
      // setFilters(convertToJSobj.filters);
      setNavigationCategories(convertToJSobj.categories);
      setNavMobileIndex(convertToJSobj.categories[0].id);

      const convertToJSObject = JSON.parse(convertToJSobj.menus)
      const getdayInformation = convertToJSObject[0].service_availability?.find((dayInformation) =>dayInformation.day_of_week === moment().format("dddd").toLowerCase());
      
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

  function handleLocationSelect(storeGUID, storeName, storeTelephone, storeEmail, storeAddress) 
  {
    setStoreName(storeName);
    
    setAtFirstLoad(false);
    setDisplayFilterModal(true)

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
      email: storeEmail,
      address: storeAddress,
    };
    setLocalStorage(`${BRAND_SIMPLE_GUID}user_selected_store`, selectedStoreData);
    route.push("/");
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (parseInt(availableStores.length) === parseInt(1)) {
  //       handleLocationSelect(
  //         availableStores[0]?.location_guid,
  //         availableStores[0]?.location_name,
  //         availableStores[0]?.telephone
  //       );
  //     }
  //   }, 2000);
  // }, [availableStores]);
  // code is working
  
   const handleOrderType = (storeId, id) => 
  {
    // first check available store delivery matrix matched.
    const findStore = availableStores?.find((store) => store?.location_guid === storeId)
    //  at first customer selected the delivery 
    
    if(findStore && findStore?.orderType?.length > 0)
    {
      const findDelivery = findStore?.orderType?.find((order) => order?.id === DELIVERY_ID)

      if(findDelivery)
      {
        // now check the matrix
        const matrixFind = findStore?.deliveryMatrixes?.delivery_matrix_rows?.find((matchPostcode) => matchPostcode?.postcode.toUpperCase().startsWith(validPostcode.toUpperCase()) || matchPostcode?.postcode?.toUpperCase().startsWith("STANDARD"))
        if(! matrixFind)
        {
          setComingSoon(true)
          setErrorMessage("We are currently unable to accept orders for delivery to your postcode from this store. Apologies for this. ")
          return
        }
        
      }
    }
    else
    {
      setComingSoon(true)
      setErrorMessage("There must be at least one order type available.")
      return
    }

    const updateAvailableStores = availableStores?.map((stores) => {
      if(stores?.location_guid === storeId)
      {
        return {
          ...stores,
          orderType: stores?.orderType?.map((order) => {
            if(order?.id === id)
            {
              return {
                ...order,
                isClicked: true
              }
            }

            return {
              ...order,
              isClicked: false
            }
          })
        }
      }
      return stores
    })

    setAvailableStores(updateAvailableStores)
    
    const findAvailableStores = updateAvailableStores?.find((checkStores) => checkStores?.location_guid === storeId)
    setLocalStorage(`${BRAND_SIMPLE_GUID}filtersList`, findAvailableStores?.orderType);

    const getSelectedFilter = findAvailableStores?.orderType?.find((findActiveType) => findActiveType?.isClicked)
    
    setSelectedFilter(getSelectedFilter)
    setLocalStorage(`${BRAND_SIMPLE_GUID}filter`,getSelectedFilter)

    setFilters(findAvailableStores?.orderType)
    const updateFilter = filters?.find((findFilter) => findFilter?.id === id && findFilter?.status)
    if(updateFilter)
    {
      setSelectedFilter(updateFilter)
      setLocalStorage(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
      setNextCookies(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
      document.cookie = `${BRAND_SIMPLE_GUID}filter=${updateFilter}`

      if(isDisplayFromModal)
      {
        setTimeout(() => {
          setDisplayFilterModal(false)
        }, 3000);
      }
    }

    const findDeliveryMatrix = availableStores?.find((stores) => stores?.location_guid === storeId)

    find_matching_postcode(findDeliveryMatrix?.deliveryMatrixes?.delivery_matrix_rows, validPostcode, setDeliveryMatrix);

    handleLocationSelect(findAvailableStores?.location_guid, findAvailableStores?.location_name, findAvailableStores?.telephone, findAvailableStores?.email, findAvailableStores?.address)
  }

  useEffect(() => {
    if(parseInt(locationDetails?.length) > parseInt(0))
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}via_qr`, 1)
      handleOrderType(availableStores?.[0]?.location_guid, "9BDF79F9-BD1E-4C77-A9E1-238DB7A59DC5")
    }
  }, [locationDetails]);

  
  return(
    <>
      <h2 className="available-store-h2"> Available Stores </h2>

      <div className="deliver-to-body-content-nested-div-level-one" style={{
          overflowY: "scroll",
          height: '60vh'
        }}
      >

        <label
          id="location-typeahead-location-manager-label"
          htmlFor="location-typeahead-location-manager-input"
          className="deliver-to-body-content-nested-div-level-one-label"
        >
          When autocomplete results are available, use up and down
          arrows to review and enter to select. Touch device users,
          explore by touch or with swipe gestures.
        </label>

        {
          availableStores?.map((stores, index) => {
            return (
              <div className="available-stores-show" style={{ cursor: "pointer" }} key={index} onClick={() => handleLocationSelect(stores.location_guid,stores.location_name,stores.telephone, stores.email, stores.address)}>

                <div className="spacer _16"></div>

                <div className="available-stores">
                  <div style={{display:"flex", justifyContent:"space-between", color: "blue"}}>
                    <h6>
                      {stores?.location_name}
                      &nbsp;({stores?.postcode})
                    </h6>
                  </div>

                  <p style={{ wordBreak: "break-word", overflowWrap: "break-word",}}>
                    {stores?.address} ({Math.round(parseInt(stores?.ConvertDataPostFound?.[0]))} miles)
                  </p>

                      
                  <p style={{float: "right", marginTop: "10px", marginBottom: "10px"}}>
                    {stores?.storeTiming?.[0].day_name.slice(0, 3)} {moment(stores?.storeTiming?.[0]?.start_time, "HH:mm A").format("HH:mm A")} - {moment(stores?.storeTiming?.[0]?.end_time,"HH:mm A").format("HH:mm A")}
                  </p>
                    
                  {/* order Type buttons */}
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "10px" }}>
                    {
                      stores?.orderType?.map((order, index) => (
                        <button 
                          key={index} 
                          type="button" 
                          style={{
                            background: order?.isClicked 
                              ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || WHITE_COLOR
                              : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                            
                            color: order?.isClicked 
                              ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR
                              : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,

                            border: order?.isClicked 
                              ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR}` 
                              : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR}`,

                            padding: "5px",
                            flexGrow: 1, // Makes buttons equal width
                            marginTop: "3px",
                            marginBottom: "3px"
                          }}
                          onClick={() => handleOrderType(stores?.location_guid, order?.id)}
                        >
                          {order?.name}
                        </button>
                      ))
                    }
                  </div>

                </div>

                <div className="spacer _8"></div>
                
              </div>
            );
          })
        }
      </div>
    </>
  )
}
