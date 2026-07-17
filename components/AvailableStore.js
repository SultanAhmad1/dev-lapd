"use client";
import HomeContext from "@/contexts/HomeContext";
import { axiosPrivate, BLACK_COLOR, BRAND_GUID, BRAND_SIMPLE_GUID, DELIVERY_ID, LIGHT_BLACK_COLOR, PARTNER_ID, WHITE_COLOR } from "@/global/Axios";
import { check_is_delivery_available, find_collection_matching_postcode, find_matching_postcode, setLocalStorage, splitAddress } from "@/global/Store";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { useWebsite } from "@/app/providers/context/WebsiteContext";

export default function AvailableStore({availableStores, setAvailableStores,validPostcode, locationDetails}) 
{
  const {layoutWebsiteModification} = useWebsite()
  const {
    setLoader,
    setDayOpeningClosingTime,
    setMenu,
    setSelectedStoreDetails,
    setSelectedFilter,
    filters,
    setFilters,
    setNavigationCategories,
    setNavMobileIndex,
    setStoreToDayName,
    setStoreToDayOpeningTime,
    setStoreToDayClosingTime,
    setStoreCurrentOrNextDayOpeningTime,
    setStoreCurrentOrNextDayClosingTime,
    setStoreGUID,
    setStoreName,
    setAtFirstLoad,
    setDeliveryMatrix,
    setCustomDoorNumberName,
    setStreet1,
    setStreet2,
    setComingSoon,
    setErrorMessage,
    handleBoolean,
  } = useContext(HomeContext);

  const route = useRouter();

  async function fetchMenu(storeGUID, selectedOrderId) {
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

      // now check the time to store open and close.
      // if the store is closed. then show opening and closing time of next day for collection.
      
      let addedTime = (selectedOrderId === DELIVERY_ID) ? getdayInformation.time_periods[0].time_to : getdayInformation.time_periods[0].collection_after_opening_from;
      const updatedCloseTime = moment.utc(getdayInformation.time_periods[0].end_time,'HH:mm','Europe/London').add(addedTime, 'minutes').format('HH:mm');
      // if it is delivery then  delivery time otherwise collection time.

      // const db = new Dexie('storeDatabase');

      // db.version(1).stores({
      //   'time': getdayInformation
      // })

      setStoreToDayOpeningTime(getdayInformation.time_periods[0].start_time);
      setStoreToDayClosingTime(getdayInformation.time_periods[0].end_time);
      // setStoreCurrentOrNextDayClosingTime(updatedCloseTime);
      // setStoreCurrentOrNextDayOpeningTime(getdayInformation.time_periods[0].start_time);
      // console.log("avaiable at 6: ",getdayInformation.time_periods[0].start_time);
      

      setTimeout(() => {
        setLoader(false)
      }, 3000);
    } 
    catch (error) 
    {
    //  setIsMenuAvailable(false)
      setLoader(false)
      setMenu([])
      setComingSoon(true)
    }
  }

  function handleLocationSelect(selectedOrderId,storeGUID, storeName, storeTelephone, storeEmail, storeDoor,storeAddress) 
  {
    setStoreName(storeName);
    setLoader(true)
    setAtFirstLoad(false);

    setStoreGUID(storeGUID);

    if(selectedOrderId === DELIVERY_ID)
    {
      /**
       * Only if when order is delivery then customer address will be shown.
      */
      const getAddressFromLocalStorage = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`)
      if(getAddressFromLocalStorage)
      {
        const filterAddress = JSON.parse(getAddressFromLocalStorage)
        console.log("get the delivery details:", filterAddress, "google:", filterAddress?.google?.destination_addresses?.[0]);

        const getUkPostcodes = filterAddress?.ukpostcode
        if(getUkPostcodes !== null && getUkPostcodes !== undefined && getUkPostcodes !== "")
        {
          setStreet1(getUkPostcodes?.street1);
          setStreet2(getUkPostcodes?.street2);
        }
        else
        {
          const {street1, street2} = splitAddress(filterAddress?.google?.destination_addresses?.[0])
          setStreet1(street1)
          setStreet2(street2)
        }
      }
    }
    else
    {
      /**
       * Only if when order is collection then store address will be shown.
      */
      const findStore = availableStores?.find((store) => store.location_guid === storeGUID)

      const filterAddress = findStore.address.replace(findStore.house_no_name, '').trim();
      const [street1, ...rest] = filterAddress.split(',');
      const street2 = rest.join(',').trim();
      setCustomDoorNumberName(findStore.house_no_name)
      setStreet1(street1.trim());
      setStreet2(street2);
    }

    fetchMenu(storeGUID, selectedOrderId);
    const selectedStoreData = {
      display_id: storeGUID,
      store: storeName,
      telephone: storeTelephone,
      email: storeEmail,
      address: storeAddress,
      storeDoor: storeDoor,
    };

    setSelectedStoreDetails(selectedStoreData)

    setLocalStorage(`${BRAND_SIMPLE_GUID}user_selected_store`, selectedStoreData);

    const checkIsJoinClicked = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}isJoinModalClickedAtFirstLoad`) || 'false')

    if(checkIsJoinClicked)
    {
      route.push('/join-us')
      return
    }
    // route.push("/");
    window.location.href = "/"
  }

   const handleOrderType = (storeId, id) => 
  {
    try {
      console.log("handle order type: ",storeId, id);
      
      // first check available store delivery matrix matched.
      document.cookie = `cookieSelectedLocation=${storeId}; path=/`;

      const findStore = availableStores?.find((store) => store?.location_guid === storeId)

      /**
       * Reset everything when store is changed.
      */
      
      const getTheStore = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))

      if(getTheStore && (getTheStore?.display_id !== storeId))
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      }

      const bkUserPostcode = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}bk_user_postcode_time`)
      if(bkUserPostcode)
      {
        const userPostcode = JSON.parse(bkUserPostcode)
        setLocalStorage(`${BRAND_SIMPLE_GUID}bk_user_postcode_time`, userPostcode)
        setLocalStorage(`${BRAND_SIMPLE_GUID}user_postcode_time`, userPostcode)
      }

      const getAddress = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}bk_address`)
    
      if(getAddress)
      {
        const jsObjAddress = JSON.parse(getAddress)
        setLocalStorage(`${BRAND_SIMPLE_GUID}address`, jsObjAddress);
        setLocalStorage(`${BRAND_SIMPLE_GUID}bk_address`, jsObjAddress);
      }

      const UserValidPostcode = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}bk_user_valid_postcode`)
      
      if(UserValidPostcode)
      {
        const jsObjValidPostcode = JSON.parse(UserValidPostcode)
        setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, jsObjValidPostcode)
        setLocalStorage(`${BRAND_SIMPLE_GUID}bk_user_valid_postcode`, jsObjValidPostcode)
      }
     
      /** Reset everything when store is changed ended. */

      //  at first customer selected the delivery 
      
      // This block of code only available for delivery one
      if(findStore && findStore?.orderType?.length > 0)
      {
        const findDelivery = findStore?.orderType?.find((order) => order?.id === id)

        const findDeliveryMatrix = availableStores?.find((stores) => stores?.location_guid === storeId)


        if(findDelivery?.id?.includes(DELIVERY_ID))
        {
          // now check the matrix
          const matrixFind = findStore?.deliveryMatrixes?.delivery_matrix_rows?.filter((matchPostcode) => matchPostcode?.postcode.toUpperCase().startsWith(validPostcode.toUpperCase()) || matchPostcode?.postcode?.toUpperCase().startsWith("STANDARD"))
          
          if(! matrixFind)
          {
            setComingSoon(true)
            setErrorMessage("Sorry, we do not deliver to your postcode from this store at the moment.")
            return
          }
          // This block for delivery depend on customer order type selection.
          find_matching_postcode(findDeliveryMatrix.deliveryMatrixes.delivery_matrix_rows, validPostcode, setDeliveryMatrix);
        }
        else
        {
          // This block for collection depend on customer order type selection.
          find_collection_matching_postcode(findDeliveryMatrix.deliveryMatrixes.collection_matrix_rows, validPostcode, setDeliveryMatrix);
        }
      }
      else
      {
        setComingSoon(true)
        setErrorMessage("At least one order type must be selected.")
        return
      }
      // This block of code only available for delivery one End

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
      }

      // copy from subAtLoadLoadShow

      handleLocationSelect(id,findAvailableStores?.location_guid, findAvailableStores?.location_name, findAvailableStores?.telephone, findAvailableStores?.email, findAvailableStores?.house_no_name,findAvailableStores?.address)   
    } catch (error) {
      console.log("handle order type: ", error);
      
    }
   
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
      <h2 className="text-lg font-semibold mb-2 mt-3 text-center border-t border-b pb-2">
        Available Stores
      </h2>

      <div className="overflow-y-auto h-[60vh] space-y-4 px-0">

        {availableStores?.map((store, index) => (
          <div
            key={index}
            className="bg-gray-100/90 border border-gray-300 rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="flex justify-between items-center text-blue-700 font-semibold">
              <h6>
                {store?.location_name} ({store?.postcode})
              </h6>
            </div>

            <p className="text-sm text-gray-700 break-words mt-1">
              {store?.address} ({parseFloat(store?.ConvertDataPostFound?.[0]).toFixed(1)} miles)
            </p>

            <p className="text-xs text-gray-600 text-right mt-2">
              {store?.storeTiming?.[0]?.day_name.slice(0, 3)}{" "}
              {moment(store?.storeTiming?.[0]?.start_time, "HH:mm A").format("HH:mm A")} -{" "}
              {moment(store?.storeTiming?.[0]?.end_time, "HH:mm A").format("HH:mm A")}
            </p>

            <div className="flex gap-2 mt-3">
              {store?.orderType?.map((order, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="flex-1 text-sm font-medium py-2 rounded border text-center transition-all duration-200 hover:scale-105"
                  style={{
                    background: order?.isClicked
                      ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                          ?.buttonHoverBackgroundColor || WHITE_COLOR
                      : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                          ?.buttonBackgroundColor || LIGHT_BLACK_COLOR,

                    color: order?.isClicked
                      ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                          ?.buttonHoverColor || BLACK_COLOR
                      : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor ||
                        WHITE_COLOR,

                    borderColor: order?.isClicked
                      ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                          ?.buttonBackgroundColor || LIGHT_BLACK_COLOR
                      : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                          ?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR,
                  }}
                  onClick={() => handleOrderType(store?.location_guid, order?.id)}
                >
                  {order?.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-red-700 mt-3">
              {store.storeDeliveryMessage}
            </p>
          </div>
        ))}
      </div>
    </>

  )
}
