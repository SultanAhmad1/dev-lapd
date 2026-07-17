"use client";

import { useCallback, useEffect, useState } from "react";
import HomeContext from "@/contexts/HomeContext";
import AtLoadModalShow from "./modals/AtLoadModalShow";
import Cart from "./Cart";
import { axiosPrivate, BRAND_GUID, BRAND_SIMPLE_GUID, DELIVERY_ID, PARTNER_ID } from "@/global/Axios";
import moment from "moment";
import { setLocalStorage, splitAddress } from "@/global/Store";
import CustomerPersonal from "./CustomerPersonal";
import MenuNotAvailableModal from "./modals/MenuNotAvailableModal";
import PlaceOrderModal from "./modals/PlaceOrderModal";
import { UAParser } from "ua-parser-js";
import { listtime } from "@/global/Time";
import { getMenu } from "@/app/layoutActions/actions";
import Loader from "./modals/Loader";
import Footer from "./Footer";
import Header from "./Header";
import Banner from "./Banner";
import StoreBusyModal from "./PauseModal/StoreBusyModal";
import useStoreOpeningClosingTime from "./time/useStoreOpeningClosingTime";

export default function CustomLayout({ children }) 
{
  // const allEntries = useLiveQuery(() => db.time.toArray());

  // const searchParams = useSearchParams()
  
  // const customLayoutLocationFiltered = searchParams.get('location')
  
  // const customerLocationDetails = customLayoutLocationFiltered ? customLayoutLocationFiltered.replace(/^"+|"+$/g, '') : '';
  // // This block of code, will help in-case of customer used our site before qr-code,
  // // Mean already type postcode selected store, order type collection or delivery.
  // // but suddenly scan qr-code for collection order inside the store.
  // // This block of code will help, to switch.
  // useEffect(() => {
  //   if(parseInt(customerLocationDetails.length) > parseInt(0))
  //   {
  //     window.localStorage.clear()
  //   }
  // }, [customerLocationDetails]);
  
  // const searchParams = useSearchParams();

  // // Extract primitive value once
  // const locationParam = searchParams.get("location") || "";

  // useEffect(() => {
  //   const cleaned = locationParam.replace(/^"+|"+$/g, "");
  //   if (cleaned.length > 0) {
  //     localStorage.clear();
  //   }
  // }, [locationParam]);


  const [loader, setLoader] = useState(true);
  const [paymentLoader, setPaymentLoader] = useState(false);

  const [ipAddressDetails, setIpAddressDetails] = useState(null);
  
  const [isLocationBrandOnline, setIsLocationBrandOnline] = useState(null);
  
  // Header Bar buttons to be displayed.
  const [brandLogo, setBrandLogo] = useState(null);
  const [headerUserBtnDisplay, setHeaderUserBtnDisplay] = useState(true);
  const [headerPostcodeBtnDisplay, setHeaderPostcodeBtnDisplay] = useState(true);
  const [headerSearchBarDisplay, setHeaderSearchBarDisplay] = useState(false);
  const [headerCartBtnDisplay, setHeaderCartBtnDisplay] = useState(true);
  
  // FilterLocationTime Component States
  const [storeGUID, setStoreGUID] = useState("57237242-C91A-4C3F-BCF1-5DAF5FE65D6E");
  const [storeName, setStoreName] = useState("");
  const [storeToDayName, setStoreToDayName] = useState("");
  const [storeToDayOpeningTime, setStoreToDayOpeningTime] = useState("");
  const [storeToDayClosingTime, setStoreToDayClosingTime] = useState("");
  
  const [storeCurrentOrNextDayOpeningTime, setStoreCurrentOrNextDayOpeningTime] = useState("");
  const [storeCurrentOrNextDayClosingTime, setStoreCurrentOrNextDayClosingTime] = useState("");
  
  const [isScheduleIsReady, setIsScheduleIsReady] = useState(false);
  const [isScheduleClicked, setIsScheduleClicked] = useState(false);
  
  const [scheduleMessage, setScheduleMessage] = useState("");
  // 0 for neutral, 1 for today, 2 for next day.
  const [isScheduleForToday, setIsScheduleForToday] = useState(0);
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(0);
  
  const [selectedStoreDetails, setSelectedStoreDetails] = useState(null);
  

  const [cutOffSchedule, setCutOffSchedule] = useState(null);

  const [isCartBtnClicked, setIsCartBtnClicked] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [orderGuid, setOrderGuid] = useState("");
  
  const [firstName, setFirstName] = useState("Sultan");
  const [lastName, setLastName] = useState("Ahmad");

  // Day Name and Day Number
  const [dayName, setDayName] = useState("");
  const [dayNumber, setDayNumber] = useState(0);
  // HomeContext Data
  const [postCodeForOrderAmount, setPostCodeForOrderAmount] = useState("");
  const [postcode, setPostcode] = useState("");
  const [customDoorNumberName, setCustomDoorNumberName] = useState(null);
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [deliveryMatrix, setDeliveryMatrix] = useState(null);
  const [totalOrderAmountValue, setTotalOrderAmountValue] = useState(0);

  // Boolean States
  const [dayOpeningClosingTime, setDayOpeningClosingTime] = useState(null);

  const [atFirstLoad, setAtFirstLoad] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Coming Soon");
  

  const [isDeliveryChangedBtnClicked, setIsDeliveryChangedBtnClicked] = useState(false);

  const [isCartItemDottedBtnClicked, setIsCartItemDottedBtnClicked] = useState(false);
  // const [isQuickViewClicked, setIsQuickViewClicked] = useState(false)
  const [isCheckOutClicked, setIsCheckOutClicked] = useState(false);
  const [isReviewPage, setIsReviewPage] = useState(false);
  
  // Button states
  const [Menu, setMenu] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filters, setFilters] = useState([]);

  const [navigationCategories, setNavigationCategories] = useState([]);
  const [dealBanners, setDealBanners] = useState([]);
  const [navMobileIndex, setNavMobileIndex] = useState(0);
  const [isMenuAvailable, setIsMenuAvailable] = useState(true);

  const [cartData, setCartData] = useState([]);
  const [amountDiscountApplied, setAmountDiscountApplied] = useState(null);
  const [couponDiscountApplied, setCouponDiscountApplied] = useState([]);
  
  const [isCheckoutReadyAfterSchedule, setIsCheckoutReadyAfterSchedule] = useState(false);

  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [joinModal, setJoinModal] = useState(false)
  
  const [booleanObj, setBooleanObj] = useState({
    isCustomerCanvasOpen: false,
    isCustomerVerified: false,
    isOTPModalShow: false,
    isPlaceOrderButtonClicked: false,
    isChangePostcodeButtonClicked: false,
    isUnableToSendSms: 0,
    orderGuid: null,
    isDeliveryOrder: 1,
  });
  
  const handleBoolean = useCallback((newValue, fieldName) => {
    setBooleanObj((prevData) => ({...prevData, [fieldName]: newValue}))
  }, [booleanObj]);

  useEffect(() => {
    try {
      
      const getQr = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}via_qr`))
      
      if(getQr)
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}via_qr`, parseInt(getQr) === parseInt(1) ? 1 : 0)
      }
      else
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}via_qr`,0)
      }

      const useAuth = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
      if(useAuth !== null)
      {
        handleBoolean(true, 'isCustomerVerified')
      }

      const url = new URL(window.location.href);
      var pathnameArray = url.pathname.split("/").filter(segment => segment);

      const dayNumber = moment().isoWeekday();
      
      // Get the current day name
      const dayName = moment().format("dddd");

      setDayName(dayName);
      setDayNumber(dayNumber);

      const afterReloadingGetCouponCode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`));
      
      setCouponDiscountApplied(afterReloadingGetCouponCode || [])

      const getSelectStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`);
      if (getSelectStore === null) 
      {
        // setStoreGUID(DEFAULT_LOCATION)
        setSelectedPostcode("")
        setSelectedLocation("")
        if (pathnameArray?.[0] === "review" || pathnameArray?.[0] === "thank-you" || pathnameArray?.[0] === "track-order" || pathnameArray?.[0] === "review-order" || pathnameArray?.[0] === "payment" || pathnameArray?.[0] === "place-order") 
        {
          setAtFirstLoad(false);
          setHeaderCartBtnDisplay(false);
          setHeaderPostcodeBtnDisplay(false);
        } 
        else 
        {
          setAtFirstLoad(false) // reversing from true to false
          setHeaderCartBtnDisplay(true);
          setHeaderPostcodeBtnDisplay(true);
        }
      } 
      else 
      {
        setSelectedStoreDetails(JSON.parse(getSelectStore))
        setPostcode(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`)));

        const parseToJSobj = JSON.parse(getSelectStore);
        setStoreName(parseToJSobj.store);

        const appliedAmountDiscount = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`));
        const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));
        
        setSelectedLocation(parseToJSobj?.display_id)
        
        setAmountDiscountApplied(appliedAmountDiscount);
        setDeliveryMatrix(getDeliveryMatrix);
        const getFilters = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))

        if(getFilters?.id === DELIVERY_ID)
        {
          /**
           * Only if when order is delivery then show customer address.
          */
          const houseName = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`)

          const ukPostcode = JSON.parse(houseName)

          console.log("uk postcode details: ", ukPostcode);
          
          const getUkPostcodes = ukPostcode?.ukpostcode
          if(getUkPostcodes !== null && getUkPostcodes !== undefined && getUkPostcodes !== "")
          {
            setStreet1(getUkPostcodes?.street1);
            setStreet2(getUkPostcodes?.street2);
          }
          else
          {
            const {street1, street2} = splitAddress(ukPostcode?.google?.destination_addresses?.[0])
            
            setStreet1(street1);
            setStreet2(street2);
          }
        }
        else
        {
          /**
           * Only if when order is collection then show store address.
          */
          const parseToJSobjAvailableStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`)

          if (parseInt(parseToJSobjAvailableStore.length) > parseInt(0)) {
            for (const store of parseToJSobjAvailableStore) {
              if (parseToJSobj.display_id === store?.location_guid) {
                setCustomDoorNumberName(store?.house_no_name);
                setStreet1(store?.user_street1);
                setStreet2(store?.user_street2);
              }
            }
          }

          if(parseToJSobjAvailableStore)
          {
            const toObj = JSON.parse(parseToJSobjAvailableStore)
            
            const findStore = toObj?.availableStore.find((store) => (store.location_guid === parseToJSobj.display_id))
            setCustomDoorNumberName(findStore?.house_no_name);

            const filterAddress = findStore.address.replace(findStore.house_no_name, '').trim();
            const [street1, ...rest] = filterAddress.split(',');
            const street2 = rest.join(',').trim();

            setStreet1(street1.trim());
            setStreet2(street2);
            
          }
        }

        const cartDataFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}cart`));

        setCartData(cartDataFromLocalStorage === null ? [] : cartDataFromLocalStorage);
        // if(parseInt(storeGUID.length) > parseInt(0))
        // {
        setStoreGUID(parseToJSobj === null ? storeGUID : parseToJSobj.display_id);
      }
       
      // user device details
      const userInfoLocalStorage = JSON.parse(window.localStorage.getItem('userInfo'))
      if(! userInfoLocalStorage)
      {
        const referrer = document.referrer;
        const source =
          referrer.includes("facebook.com") ? "facebook" :
          referrer.includes("instagram.com") ? "instagram" :
          referrer.includes("google.") ? "google" :
          referrer === "" ? "direct" : "other";
  
        const parser = new UAParser();
        const uaResult = parser.getResult();
  
        
        const userInfo = {
          source,
          browser: uaResult.browser.name,
          browserVersion: uaResult.browser.version,
          os: uaResult.os.name,
          osVersion: uaResult.os.version,
          deviceType: uaResult.device.type || "desktop",
          deviceVendor: uaResult.device.vendor || "unknown",
          deviceModel: uaResult.device.model || "unknown",
          ip: ""
        };
  
        fetch("https://ipwho.is/")
        .then(response => response.json())
        .then(data => {
          setIpAddressDetails(data.ip)
          // userInfo.ip = data.ip;
              const updatedUser = {
            ...userInfo,
            ip: data.ip,
            country: data.country,
          };
          // Save or send to backend
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        })
        .catch(err => console.error("Failed to fetch IP info:", err));
      }
    } catch (error) {
      console.log("there is menu issue: ", error);
      
        window.alert("There is something went wrong!. Please refresh and try again 23.")
        return
    }
  }, []);
  
  useEffect(() => {
    if(deliveryMatrix)
    {
      const filtersData = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))
      if(filtersData !== null && filtersData !== undefined)
      {
        if(filtersData?.id?.includes(DELIVERY_ID))
        {
          setPostCodeForOrderAmount(deliveryMatrix?.postcode);
          setSelectedPostcode(deliveryMatrix?.postcode)
        }
        else
        {
          setPostCodeForOrderAmount(deliveryMatrix?.collection_postcode);
          setSelectedPostcode(deliveryMatrix?.collection_postcode)
        }
      }
    }
  }, [deliveryMatrix])
  
  const [pauseState, setPauseState] = useState({
    id: 0,
    isShowModal: false,
    dateTime: "",
  });

  

  // Fetch the ip Address details
  useEffect(() => {
    if(ipAddressDetails !== null && ipAddressDetails !== undefined)
    {
      async function storeUserDetail() {
        try {
          
          const userInfoFromLocal = JSON.parse(window.localStorage.getItem('userInfo'))

          const data = {
            brandId: BRAND_GUID,

            source: userInfoFromLocal.source,
            browser: userInfoFromLocal.browser,
            browserVersion: userInfoFromLocal.browserVersion,
            os: userInfoFromLocal.os,

            osVersion: userInfoFromLocal.osVersion,
            deviceType: userInfoFromLocal.deviceType,
            deviceVendor: userInfoFromLocal.deviceVendor,
            deviceModel: userInfoFromLocal.deviceModel,
            ip: userInfoFromLocal.ip,
            country: userInfoFromLocal.country,
          }
          const getResponse = await axiosPrivate.post(`/store-user-device-detail`, data)

          const filterResponse = getResponse.data.data

          const editUserInfoFromLocal = {
            ...userInfoFromLocal,
            visitorId: filterResponse.visitorInfo.visitor_guid
          }
          setLocalStorage('userInfo', editUserInfoFromLocal)
        } catch (error) {
        }
      }

      storeUserDetail()
    }
  }, [ipAddressDetails]);

  // menuRefetch()
  async function getServerMenu(storeGUID, BRAND_GUID) 
  {
    try {
      const menuData = await getMenu(storeGUID, BRAND_GUID)

      console.log('get server menu:', menuData)
      const { menu, orderExistOrNot, pauseStore} = menuData?.data
      
      if(pauseStore !== null && pauseState !== undefined)
      {
        // if kitchen staff make it pause then set to default condition.
        setPauseState({
          id: pauseStore?.uuid,
          isShowModal: true,
          dateTime: pauseStore.datetime
        })
      }
      else
      {
        // if kitchen staff do not make it pause then set to default condition.
        setPauseState({
          id: 0,
          isShowModal: false,
          dateTime: ""
        })
      }

      if(orderExistOrNot)
      {
        setOrderGuid(orderExistOrNot?.external_order_id)
        setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`, orderExistOrNot?.external_order_id)
      }

      const convertToJSobj = menu?.menu_json_log;

      const menuToParse = JSON.parse(convertToJSobj.menus)

      const customLayoutOrderGuid = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`)
      setOrderGuid(customLayoutOrderGuid ? JSON.parse(customLayoutOrderGuid) : "")

      const getdayInformation = menuToParse?.[0].service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().format("dddd").toLowerCase());
      const getNextDayInformation = menuToParse?.[0].service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase());

      setStoreToDayName(moment().format("dddd"));

      setStoreToDayOpeningTime(getdayInformation?.time_periods?.[0].start_time);
      setStoreToDayClosingTime(getdayInformation?.time_periods?.[0].end_time);

      let customUpdateAddMinutes = (selectedFilter?.id === DELIVERY_ID) ?  getdayInformation?.time_periods?.[0]?.time_to : getdayInformation?.time_periods?.[0]?.collection_after_opening_from;

      const customUpdateEndTime = moment.utc(getdayInformation?.time_periods?.[0].end_time, "HH:mm", "Europe/London").add(customUpdateAddMinutes,'minutes').format("HH:mm")
      const customUpdateOpeningTime = moment.utc(getdayInformation?.time_periods?.[0].start_time, "HH:mm", "Europe/London").add(customUpdateAddMinutes,'minutes').format("HH:mm")

      const getCurrentTime = moment().tz("Europe/London").format("HH:mm");
      
      setStoreCurrentOrNextDayOpeningTime(customUpdateOpeningTime >= getCurrentTime ? customUpdateOpeningTime : getCurrentTime )
      setStoreCurrentOrNextDayClosingTime(customUpdateEndTime);

      const mergedDayInfo = [getdayInformation, getNextDayInformation].filter(Boolean);
      setCutOffSchedule(mergedDayInfo)

      setLocalStorage(`${BRAND_SIMPLE_GUID}menus`, convertToJSobj);
      setMenu(convertToJSobj);

      const getFilterDataFromObj = (window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`) !== undefined ? JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`)) : null);
      if (getFilterDataFromObj === null) 
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}filter`, convertToJSobj?.filters?.[0]);
      }

      setSelectedFilter(getFilterDataFromObj === null ? convertToJSobj?.filters?.[0] : getFilterDataFromObj);
      // setFilters(convertToJSobj?.filters);

      setNavigationCategories(convertToJSobj?.categories);

      setDealBanners(convertToJSobj?.websiteDeals_Arr);
      setNavMobileIndex(0);
      setComingSoon(false)

    } catch (error) {

      console.log("there is no menu error:", error);
      
      setIsMenuAvailable(false);
      setComingSoon(true)
      setErrorMessage("There is no menu publish for that store yet.")
      setLoader(false)
    }
  }

  // Fetched The Menu
  useEffect(() => {

    console.log("use effect store guid: ", storeGUID, "brand guid: ", BRAND_GUID);
    if (storeGUID && BRAND_GUID)
    {
      getServerMenu(storeGUID, BRAND_GUID)
    }
  }, [storeGUID, BRAND_GUID])
  

  useEffect(() => {
    if(selectedFilter)
    {
      const {
        resultScheduleMessage,
        resultScheduleEnabled,
        resultScheduleIsReady,
        resultCheckoutReadyAfterSchedule,
        resultScheduleTime,
        resultStoreCurrentOrNextDayOpeningTime,
        resultStoreCurrentOrNextDayClosingTime,
        // resultStoreToDayClosingTime,
        resultIsScheduleForToday,
      }  = useStoreOpeningClosingTime()
      
      setScheduleMessage(resultScheduleMessage)
      setIsScheduleEnabled(resultScheduleEnabled)
      setIsScheduleIsReady(resultScheduleIsReady)
      setIsCheckoutReadyAfterSchedule(resultCheckoutReadyAfterSchedule)
      setScheduleTime(resultScheduleTime)
      setStoreCurrentOrNextDayOpeningTime(resultStoreCurrentOrNextDayOpeningTime)
      setStoreCurrentOrNextDayClosingTime(resultStoreCurrentOrNextDayClosingTime)
      // setStoreToDayClosingTime(resultStoreToDayClosingTime)
      setIsScheduleForToday(resultIsScheduleForToday)
    }
  },[selectedFilter])

  const [countMinutes, setCountMinutes] = useState(0);
  
  useEffect(() => {
    if(booleanObj?.isCustomerVerified === false)
    {
      const userSelectedTime = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_postcode_time`))
      if(userSelectedTime)
      {
        const firstDateString = moment().format('YYYY-MM-DD HH:mm:ss');

        const firstDate = moment(firstDateString, 'YYYY-MM-DD HH:mm:ss');

        const differenceMinutes = firstDate?.diff(userSelectedTime, 'minutes')

        setCountMinutes(differenceMinutes)
        if(differenceMinutes >= 30)
        {
          window.localStorage.clear();
          window.location.reload(true);
        }
      }
    }
  },[countMinutes, booleanObj]);
  
  useEffect(() => {
    // setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,"DFDE9B90-2A7B-4429-802C-EDF27A2AEB14")
    const checkOrderGuidExistsIsPaidStatusAwaiting = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`));
    if(checkOrderGuidExistsIsPaidStatusAwaiting)
    {
      async function checkOrderGuidIsPaidAndStatusIsAwaiting() {
        try {
          
          const getResponse = await axiosPrivate.get(`website-order-track/${checkOrderGuidExistsIsPaidStatusAwaiting}`)

          const filterResponse = getResponse.data.data
          if(!filterResponse)
          {
            return
          }
          
          const checkViaQr = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}via_qr`))
          
          if(checkViaQr && parseInt(checkViaQr) > parseInt(0))
          {
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
            setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
            window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
            setCartData([])
            window.location.href = `/thank-you/${filterResponse?.external_order_id}`
            return
          }
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
          setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
          window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
          setCartData([])
          window.location.href = `/track-order/${filterResponse?.external_order_id}`
        } catch (error) {
        }
      }

      checkOrderGuidIsPaidAndStatusIsAwaiting()
    }
  });
  
  // Context Data
  const contextData = {
    pauseState,
    setPauseState,
    isChangePostcodeButtonClicked: booleanObj?.isChangePostcodeButtonClicked,
    Menu,
    loader,
    filters,
    brandLogo,
    storeGUID,
    storeName,
    selectedItemId,
    totalOrderAmountValue,
    storeToDayName,
    storeToDayOpeningTime,
    storeToDayClosingTime,
    navigationCategories,
    navMobileIndex,
    isMenuAvailable,
    dayOpeningClosingTime,
    selectedFilter,
    selectedCategoryId,
    dealBanners,
    headerSearchBarDisplay,
    headerPostcodeBtnDisplay,
    headerCartBtnDisplay,
    headerUserBtnDisplay,
    dayName,
    dayNumber,
    firstName,
    lastName,
    postcode,
    street1,
    street2,
    isDeliveryChangedBtnClicked,
    isCheckOutClicked,
    isCartItemDottedBtnClicked,
    isCartBtnClicked,
    amountDiscountApplied,
    couponDiscountApplied,
    cartData,
    deliveryMatrix,
    postCodeForOrderAmount,
    isReviewPage,
    isLocationBrandOnline,

    booleanObj,
    setBooleanObj,
    comingSoon,
    cutOffSchedule,
    orderGuid,
    setOrderGuid,
    isCheckoutReadyAfterSchedule, 
    setIsCheckoutReadyAfterSchedule,
    isScheduleForToday,

    isScheduleIsReady,
    setIsScheduleIsReady,

    isScheduleClicked,
    setIsScheduleClicked,

    scheduleMessage,
    setScheduleMessage,

    isScheduleForToday,
    setIsScheduleForToday,
    isScheduleEnabled,
    setIsScheduleEnabled,
    scheduleTime,
    setScheduleTime,
    selectedPostcode,
    selectedLocation,
    storeCurrentOrNextDayClosingTime,
    selectedStoreDetails,
    setSelectedStoreDetails,
    storeCurrentOrNextDayOpeningTime,
    paymentLoader,
    setPaymentLoader,
    setStoreCurrentOrNextDayOpeningTime,
    setStoreCurrentOrNextDayClosingTime,
    setComingSoon,
    setErrorMessage,
    handleBoolean,
    setIsLocationBrandOnline,
    setMenu,
    setLoader,
    setFilters,
    setBrandLogo,
    setStoreGUID,
    setStoreName,
    setSelectedFilter,
    setSelectedItemId,
    setStoreToDayName,
    setSelectedCategoryId,
    setTotalOrderAmountValue,
    setDayOpeningClosingTime,
    setStoreToDayOpeningTime,
    setStoreToDayClosingTime,
    
    setCartData,
    setDeliveryMatrix,
    setIsCartBtnClicked,
    setAmountDiscountApplied,
    setCouponDiscountApplied,
    setPostCodeForOrderAmount,

    setAtFirstLoad,
    setIsReviewPage,
    setNavMobileIndex,
    setIsMenuAvailable,
    setHeaderCartBtnDisplay,
    setNavigationCategories,
    setHeaderUserBtnDisplay,
    setHeaderSearchBarDisplay,
    setHeaderPostcodeBtnDisplay,
    customDoorNumberName,
    setCustomDoorNumberName,
    setStreet1,
    setStreet2,
    setPostcode,
    setIsCheckOutClicked,
    setIsCartItemDottedBtnClicked,
    setIsDeliveryChangedBtnClicked,
    setSelectedLocation,
    setSelectedPostcode,
    setJoinModal,
    joinModal,
  }
  
  const loaderState = paymentLoader || loader

  console.log("payment loader: ", paymentLoader, "simple loader: ", loader);
  
  return (
    <HomeContext.Provider value={contextData}>
      <Header />
      <Banner />
      {children}
      
      {booleanObj?.isCustomerCanvasOpen && <CustomerPersonal />}

      {comingSoon && <MenuNotAvailableModal {...{errorMessage}}/>}
      {/* {displayFilterModal && <FilterModal />} */}

      {isCartBtnClicked && <Cart />}
      {booleanObj.isPlaceOrderButtonClicked && <PlaceOrderModal />}
      {/* {parseInt(booleanObj.isUnableToSendSms) === parseInt(2) && <SmsAlertOrderFailedModal />}
      {parseInt(booleanObj.isUnableToSendSms) === parseInt(1) && <OrderPlacedSuccessfully />} */}
      {/* {isDeliveryBtnClicked && <DeliveryModal />} */}
      {/* {isTimeToClosed && <StoreClosedModal />} */}
      {loaderState && <Loader />}
      {atFirstLoad && <AtLoadModalShow /> }
      {
        <StoreBusyModal
          isOpen={pauseState.isShowModal}
          endTime={pauseState.dateTime}
          onClose={() =>
            setPauseState({
              id: 0,
              isShowModal: false,
              dateTime: "",
            })
          }
          onExpired={async () => {
            try {
              const response = await axiosPrivate.patch(`/update-store-pause/${pauseState?.id}`);

              setPauseState({
                id: 0,
                isShowModal: false,
                dateTime: ""
              })
              
              // Refresh store status
              // getStoreStatus();
            } catch (error) {
              console.error("delete pause error:",error);
            }
          }}
        />
      }
      {/* <ShowExistsOrderDetailModal /> */}
      {/* <OtpVerifyModal /> */}
      <Footer />
    </HomeContext.Provider>
  );
}
