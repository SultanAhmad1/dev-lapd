"use client";

import { useCallback, useEffect, useState } from "react";
import { useGetQueryAutoUpdate } from "./reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import AtLoadModalShow from "./modals/AtLoadModalShow";
import Cart from "./Cart";
import Loader from "./modals/Loader";
import { axiosPrivate, BRAND_GUID, BRAND_SIMPLE_GUID, DEFAULT_LOCATION, DELIVERY_ID, PARTNER_ID } from "@/global/Axios";
import moment from "moment";
import { getAmountConvertToFloatWithFixed, setLocalStorage } from "@/global/Store";
import CustomerPersonal from "./CustomerPersonal";
import MenuNotAvailableModal from "./modals/MenuNotAvailableModal";
import PlaceOrderModal from "./modals/PlaceOrderModal";
import StoreClosedModal from "./modals/StoreClosedModal";
import { useSearchParams } from "next/navigation";
import { UAParser } from "ua-parser-js";

export default function CustomLayout({ children }) 
{
  const searchParams = useSearchParams()
  
  const customLayoutLocationFiltered = searchParams.get('location')
  
  const customerLocationDetails = customLayoutLocationFiltered ? customLayoutLocationFiltered.replace(/^"+|"+$/g, '') : '';

  // This block of code, will help in-case of customer used our site before qr-code,
  // Mean already type postcode selected store, order type collection or delivery.
  // but suddenly scan qr-code for collection order inside the store.
  // This block of code will help, to switch.
  useEffect(() => {
    if(parseInt(customerLocationDetails.length) > parseInt(0))
    {
      window.localStorage.clear()
    }
  }, [customerLocationDetails]);
  
  const [loader, setLoader] = useState(true);

  const [ipAddressDetails, setIpAddressDetails] = useState(null);
  
  const [isLocationBrandOnline, setIsLocationBrandOnline] = useState(null);
  
  const [websiteModificationData, setWebsiteModificationData] = useState(null);
  // Header Bar buttons to be displayed.
  const [brandLogo, setBrandLogo] = useState(null);
  const [headerUserBtnDisplay, setHeaderUserBtnDisplay] = useState(true);
  const [headerPostcodeBtnDisplay, setHeaderPostcodeBtnDisplay] = useState(true);
  const [headerSearchBarDisplay, setHeaderSearchBarDisplay] = useState(false);
  const [headerCartBtnDisplay, setHeaderCartBtnDisplay] = useState(true);
  
  // FilterLocationTime Component States
  const [storeGUID, setStoreGUID] = useState(null);
  const [menuRequestBoolean, setMenuRequestBoolean] = useState(true);
  
  const [storeName, setStoreName] = useState("");
  const [storeToDayName, setStoreToDayName] = useState("");
  const [storeToDayOpeningTime, setStoreToDayOpeningTime] = useState("");
  const [storeToDayClosingTime, setStoreToDayClosingTime] = useState("");

  const [isScheduleIsReady, setIsScheduleIsReady] = useState(false);
  const [isScheduleClicked, setIsScheduleClicked] = useState(false);
  
  const [scheduleMessage, setScheduleMessage] = useState("");
  // 0 for neutral, 1 for today, 2 for next day.
  const [isScheduleForToday, setIsScheduleForToday] = useState(0);
  const [scheduleTime, setScheduleTime] = useState("");
  
  

  const [cutOffSchedule, setCutOffSchedule] = useState(null);

  const [isCartBtnClicked, setIsCartBtnClicked] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const [firstName, setFirstName] = useState("Sultan");
  const [lastName, setLastName] = useState("Ahmad");

  // Day Name and Day Number
  const [dayName, setDayName] = useState("");
  const [dayNumber, setDayNumber] = useState(0);
  // HomeContext Data
  const [postCodeForOrderAmount, setPostCodeForOrderAmount] = useState("");
  const [postcode, setPostcode] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [deliveryMatrix, setDeliveryMatrix] = useState(null);
  const [totalOrderAmountValue, setTotalOrderAmountValue] = useState(0);

  // Boolean States
  const [isCouponCodeApplied, setIsCouponCodeApplied] = useState(false);

  const [dayOpeningClosingTime, setDayOpeningClosingTime] = useState(null);

  const [isTimeToClosed, setIsTimeToClosed] = useState(false);
  const [atFirstLoad, setAtFirstLoad] = useState(false);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Coming Soon");
  

  const [isDeliveryBtnClicked, setIsDeliveryBtnClicked] = useState(false);
  const [isDeliveryChangedBtnClicked, setIsDeliveryChangedBtnClicked] = useState(false);

  const [isCartFull, setIsCartFull] = useState(true);

  const [isCartItemDottedBtnClicked, setIsCartItemDottedBtnClicked] = useState(false);
  const [isItemClicked, setIsItemClicked] = useState(false);
  // const [isQuickViewClicked, setIsQuickViewClicked] = useState(false)
  const [isCheckOutClicked, setIsCheckOutClicked] = useState(false);
  const [isReviewPage, setIsReviewPage] = useState(false);
  
  // Button states
  const [isGoBtnClicked, setIsGoBtnClicked] = useState(false);

  const [Menu, setMenu] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filters, setFilters] = useState([]);

  const [navigationCategories, setNavigationCategories] = useState([]);
  const [navMobileIndex, setNavMobileIndex] = useState(0);
  const [isMenuAvailable, setIsMenuAvailable] = useState(true);

  const [cartData, setCartData] = useState([]);
  const [amountDiscountApplied, setAmountDiscountApplied] = useState(null);
  const [couponDiscountApplied, setCouponDiscountApplied] = useState([]);
  
  const [isCheckoutReadyAfterSchedule, setIsCheckoutReadyAfterSchedule] = useState(false);

  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [booleanObj, setBooleanObj] = useState({
    isCustomerCanvasOpen: false,
    isCustomerVerified: false,
    isOTPModalShow: false,
    isPlaceOrderButtonClicked: false,
    isChangePostcodeButtonClicked: false,
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
      
      if(afterReloadingGetCouponCode && parseInt(afterReloadingGetCouponCode?.length) > parseInt(0))
      {
        let totalValue = 0;

        const getCartData = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}cart`));

        for (const total of getCartData) 
        {
          totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount);
        }

        
        let firstCouponAppliedDiscount = 0
        let howManyTimeCouponApplied = 0

        const updateCoupon = afterReloadingGetCouponCode?.map((coupon) => {
  
          if(coupon?.discount_type === "P")
          {
            if(parseInt(howManyTimeCouponApplied) === parseInt(1))
            {
              const differenceDiscountAndSubtotal = parseFloat(totalValue) - parseFloat(firstCouponAppliedDiscount)
                              
              firstCouponAppliedDiscount = getAmountConvertToFloatWithFixed(parseFloat(differenceDiscountAndSubtotal) * (coupon?.value / 100),2)
            }
            else
            {
              // const differenceDiscountAndSubtotal = parseFloat(totalValue) - parseFloat(discountValue)
                
              firstCouponAppliedDiscount = getAmountConvertToFloatWithFixed(parseFloat(totalValue) * (coupon?.value / 100),2)
            }
            howManyTimeCouponApplied += 1
            
          }
          else
          {
            if(parseInt(howManyTimeCouponApplied) === parseInt(1))
              {
                const differenceDiscountAndSubtotal = parseFloat(totalValue) - parseFloat(firstCouponAppliedDiscount)
                                
                firstCouponAppliedDiscount = getAmountConvertToFloatWithFixed(parseFloat(differenceDiscountAndSubtotal) - parseFloat(couponData?.value),2)
              }
              else
              {
                // const differenceDiscountAndSubtotal = parseFloat(subtotalOrderAmount) - parseFloat(discountValue)
                firstCouponAppliedDiscount = getAmountConvertToFloatWithFixed(parseFloat(totalValue) - parseFloat(couponData?.value),2)
              }

            howManyTimeCouponApplied += 1
           
          }
  
          return{
            ...coupon,
            discount: firstCouponAppliedDiscount
          }
        })
  
        setCouponDiscountApplied(updateCoupon)
        setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`, updateCoupon)
      }

      const getSelectStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`);

      if (getSelectStore === null) 
      {
        // setStoreGUID(DEFAULT_LOCATION)
        setMenuRequestBoolean(true)
        setSelectedPostcode("")
        setSelectedLocation("")
        if (pathnameArray?.[0] === "track-order" || pathnameArray?.[0] === "review-order" || pathnameArray?.[0] === "payment" || pathnameArray?.[0] === "place-order") 
        {
          setAtFirstLoad(false);
          setHeaderCartBtnDisplay(false);
          setHeaderPostcodeBtnDisplay(false);
        } 
        else 
        {
       
          setAtFirstLoad(true)
          setHeaderCartBtnDisplay(true);
          setHeaderPostcodeBtnDisplay(true);
        }
      } 
      else 
      {
        setMenuRequestBoolean(true)
        setPostcode(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`)));

        const parseToJSobj = JSON.parse(getSelectStore);
        setStoreName(parseToJSobj.store);

        const appliedAmountDiscount = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`));
        const address = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`));
        const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));

        setSelectedPostcode(getDeliveryMatrix?.postcode)
        setSelectedLocation(parseToJSobj?.display_id)
        
        setAmountDiscountApplied(appliedAmountDiscount);
        setDeliveryMatrix(getDeliveryMatrix);
        setPostCodeForOrderAmount(getDeliveryMatrix?.postcode);

        const parseToJSobjAvailableStore = address?.availableStore;
        if (parseInt(parseToJSobjAvailableStore.length) > parseInt(0)) {
          for (const store of parseToJSobjAvailableStore) {
            if (parseToJSobj.display_id === store?.location_guid) {
              setStreet1(store?.user_street1);
              setStreet2(store?.user_street2);
            }
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
          // console.log("Full User Info:", updatedUser);
          // Save or send to backend
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        })
        .catch(err => console.error("Failed to fetch IP info:", err));
      }

    } catch (error) {
        window.alert("There is something went wrong. Please refresh and try again.")
        return
    }
  }, []);
  
  useEffect(() => {
    if(storeGUID !== null && storeGUID !== undefined)
    {
      setMenuRequestBoolean(true)
      menuRefetch()
      colorRefetch()

    }
    else{
      setMenuRequestBoolean(true)
    }

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

          // console.log("user store detail data run:");
          
          const filterResponse = getResponse.data.data

          const editUserInfoFromLocal = {
            ...userInfoFromLocal,
            visitorId: filterResponse.visitorInfo.visitor_guid
          }
          setIpAddressDetails(null)
          setLocalStorage('userInfo', editUserInfoFromLocal)
        } catch (error) {
        }
      }

      storeUserDetail()
    }
  }, [storeGUID, ipAddressDetails]);
  
  useEffect(() => {
    if(parseInt(cartData?.length) > parseInt(0))
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`, cartData)
    }
  }, [cartData]);
  
  const onMenuSuccess = (data) => 
  {
    setLoader(false)
    const { menu } = data?.data
    
    // console.log("response menu data:", data);
    
    const convertToJSobj = menu?.menu_json_log;

    const menuToParse = JSON.parse(convertToJSobj.menus)

    const getdayInformation = menuToParse?.[0].service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().format("dddd").toLowerCase());
    const getNextDayInformation = menuToParse?.[0].service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase());

    setStoreToDayName(moment().format("dddd"));
    
    setStoreToDayOpeningTime(getdayInformation?.time_periods?.[0].start_time);
    setStoreToDayClosingTime(getdayInformation?.time_periods?.[0].end_time);

    const mergedDayInfo = [getdayInformation, getNextDayInformation].filter(Boolean);
    setCutOffSchedule(mergedDayInfo)

    if (convertToJSobj?.menus) {
      const getDay = JSON.parse(convertToJSobj.menus);
      const dayName = moment().format("dddd").toLowerCase();
    
      // 1) Find today’s availability entry
      const findToday = getDay?.[0]?.service_availability?.find(day =>
        day.day_of_week.toLowerCase().includes(dayName)
      );
    
      const dayNumber = moment().day();
      const dateTime = moment().format("HH:mm");
      // const findToday = getDay?.[0]?.service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().format("dddd").toLowerCase());

      if (!findToday) {
        // No service today
        
        return;
      }
          
          
      const period = findToday.time_periods?.[0];
      if (!period) {
        // No defined time slot
        // setAtFirstLoad(false);
        // setIsTimeToClosed(true);
        return;
      }
          
      // 2) Build Moments for start/end **today** at those clock times:
      const now = moment(); // full date and time now

      const [startHour, startMinute] = period.start_time.split(":").map(Number);
      const [endHour, endMinute] = period.end_time.split(":").map(Number);

      let startTime = moment(now).set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
      let endTime = moment(now).set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

      const isBeforeStart = now.isBefore(startTime)
      
      const isAfterClose = now.isBefore(endTime)

      const getNextDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase());
      
      const minsUntilClose = endTime.diff(now, "minutes");

      const getFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))
      
      if(isBeforeStart)
      {
        const getTodayDetails = getDay?.[0]?.service_availability?.find((dayInformation) => {
          return dayInformation.day_of_week === moment().format("dddd").toLowerCase();
        });
        
        if (getTodayDetails) {
          const newDeliveryOrCollection = getTodayDetails.time_periods?.[0];
        
          // first check the order type is delivery or collection.

          if (newDeliveryOrCollection?.start_time && newDeliveryOrCollection?.time_to != null) {
            // const nextDayStartTime = moment(newDeliveryOrCollection.start_time, 'HH:mm');
            // const updatedTime = nextDayStartTime.clone().add(newDeliveryOrCollection.time_to, 'minutes');
            const today = moment().format('YYYY-MM-DD'); // Get today's date
            const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
            const timeToAdd = newDeliveryOrCollection.time_to; // e.g., 30

            // Combine date and time, then add minutes
            const todayStartTime = moment(`${today} ${startTime}`, 'YYYY-MM-DD HH:mm');
            
            const getFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))

            if(getFilter && getFilter?.id === DELIVERY_ID)
            {
              const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
              // Set only the time part
              setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'));
            }
            else
            {
              const updatedTime = todayStartTime.add(newDeliveryOrCollection.collection_after_opening_from, 'minutes');
              // Set only the time part
              setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'));
            }
          }
          else
          {
            const today = moment().format('YYYY-MM-DD'); // Get today's date
            const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
            const timeToAdd = newDeliveryOrCollection.time_from;

            // Combine date and time, then add minutes
            const todayStartTime = moment(`${today} ${startTime}`, 'YYYY-MM-DD HH:mm');
            const getFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))
            
            if(getFilter && getFilter?.id === DELIVERY_ID)
            {
              const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
              // Set only the time part
              setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'))
            }
            else
            {
              const updatedTime = todayStartTime.add(newDeliveryOrCollection.collection_after_opening_from, 'minutes');
              // Set only the time part
              setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        }

        setIsScheduleIsReady(true)
        setIsScheduleForToday(1)
        setIsCheckoutReadyAfterSchedule(true)
        setScheduleMessage("later today")
        
      }
      else if(! isAfterClose)
      {
        const getNextDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => {
          return dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase();
        });
        
        if (getNextDayDetail) {
          const newDeliveryOrCollection = getNextDayDetail.time_periods?.[0];
          setStoreToDayClosingTime(newDeliveryOrCollection?.end_time);

          if (newDeliveryOrCollection?.start_time && newDeliveryOrCollection?.time_to != null) {
            // const nextDayStartTime = moment(newDeliveryOrCollection.start_time, 'HH:mm');
            // const updatedTime = nextDayStartTime.clone().add(newDeliveryOrCollection.time_to, 'minutes');
        
            const nextDay = moment().add(1, 'days').format('YYYY-MM-DD'); // Get next day's date
            const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
            const timeToAdd = newDeliveryOrCollection.time_to; // e.g., 30

            // Combine date and time, then add minutes
            const todayStartTime = moment(`${nextDay} ${startTime}`, 'YYYY-MM-DD HH:mm');
            const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
            // Set only the time part
            setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'));
            
          }
          else
          {
            const nextDay = moment().add(1, 'days').format('YYYY-MM-DD'); // Get next day's date
            const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
            const timeToAdd = newDeliveryOrCollection.time_from; // e.g., 30

            // Combine date and time, then add minutes
            const todayStartTime = moment(`${nextDay} ${startTime}`, 'YYYY-MM-DD HH:mm');
            const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
            // Set only the time part
            setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'));

          }
        }

        setIsScheduleIsReady(true)
        setIsScheduleForToday(2)
        setIsCheckoutReadyAfterSchedule(true)
        setScheduleMessage(getNextDayDetail.day_of_week)
      }
      else if(getFilter?.id === DELIVERY_ID)
      {
        if(parseInt(minsUntilClose) <= parseInt(period.delivery_cut_off))
        {
          if(parseInt(getNextDayDetail.time_periods?.[0]?.is_delivery_schedule) === parseInt(1))
          {
            const getNextDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => {
              return dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase();
            });
            if (getNextDayDetail) {
              const newDeliveryOrCollection = getNextDayDetail.time_periods?.[0];
            
              if (newDeliveryOrCollection?.start_time && newDeliveryOrCollection?.time_to != null) {
                const nextDay = moment().add(1, 'days').format('YYYY-MM-DD'); // Get next day's date
                const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
                const timeToAdd = newDeliveryOrCollection.time_to; // e.g., 30
    
                // Combine date and time, then add minutes
                const todayStartTime = moment(`${nextDay} ${startTime}`, 'YYYY-MM-DD HH:mm');
                const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
                // Set only the time part
                setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'));
              }
              else
              {
                const nextDay = moment().add(1, 'days').format('YYYY-MM-DD'); // Get next day's date
                const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
                const timeToAdd = newDeliveryOrCollection.time_from; // e.g., 30
    
                // Combine date and time, then add minutes
                const todayStartTime = moment(`${nextDay} ${startTime}`, 'YYYY-MM-DD HH:mm');
                const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
                // Set only the time part
                setScheduleTime(updatedTime.format('YYYY-MM-DD HH:mm:ss'));
              }
            }

            setIsScheduleForToday(2)
            setIsScheduleIsReady(true)
            setIsCheckoutReadyAfterSchedule(true)
            setScheduleMessage(getNextDayDetail.day_of_week)
            setStoreToDayClosingTime(newDeliveryOrCollection?.end_time);
          }
          else
          {
            setIsScheduleForToday(0)
            setIsScheduleIsReady(false)
            setIsCheckoutReadyAfterSchedule(false)
            setScheduleMessage("")
            setScheduleTime("")
          }
        }
      }
      else {
        if(parseInt(minsUntilClose) <= parseInt(period.collection_cut_off))
        {
          if(parseInt(getNextDayDetail.time_periods?.[0]?.is_delivery_schedule) === parseInt(1))
          {
            const getNextDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => {
              return dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase();
            });
            
            if (getNextDayDetail) {
              const newDeliveryOrCollection = getNextDayDetail.time_periods?.[0];
            
              if (newDeliveryOrCollection?.start_time && newDeliveryOrCollection?.time_to != null) {
                const nextDay = moment().add(1, 'days').format('YYYY-MM-DD'); // Get next day's date
                const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
                const timeToAdd = newDeliveryOrCollection.time_to; // e.g., 30
    
                // Combine date and time, then add minutes
                const todayStartTime = moment(`${nextDay} ${startTime}`, 'YYYY-MM-DD HH:mm');
                const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
                // Set only the time part
                setScheduleTime(updatedTime);
              }
              else
              {
                const nextDay = moment().add(1, 'days').format('YYYY-MM-DD'); // Get next day's date
                const startTime = newDeliveryOrCollection.start_time; // e.g., "14:00"
                const timeToAdd = newDeliveryOrCollection.time_from; // e.g., 30
    
                // Combine date and time, then add minutes
                const todayStartTime = moment(`${nextDay} ${startTime}`, 'YYYY-MM-DD HH:mm');
                const updatedTime = todayStartTime.add(timeToAdd, 'minutes');
                // Set only the time part
                setScheduleTime(updatedTime);
              }
            }
            
            setIsScheduleForToday(2)
            setIsScheduleIsReady(true)
            setScheduleMessage(getNextDayDetail.day_of_week)
            setStoreToDayClosingTime(newDeliveryOrCollection?.end_time);
          }
          else
          {
            setIsScheduleForToday(0)
            setIsScheduleIsReady(false)
            setScheduleMessage("")
            setScheduleTime("")
          }
        }
      }
    }

    setMenu(convertToJSobj);

    const getFilterDataFromObj = (window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`) !== undefined ? JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`)) : null);
    if (getFilterDataFromObj === null) 
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}filter`, convertToJSobj?.filters?.[0]);
    }

    setSelectedFilter(getFilterDataFromObj === null ? convertToJSobj?.filters?.[0] : getFilterDataFromObj);
    // setFilters(convertToJSobj?.filters);

    setNavigationCategories(convertToJSobj?.categories);
    setNavMobileIndex(0);
  }
  const onMenuError = (error) => {
    setIsMenuAvailable(false);
    setComingSoon(true)
    setErrorMessage("There is no menu publish for that store yet.")
    setLoader(false)
  }

  const { 
    isLoading: menuLoading, 
    isError: menuError, 
    refetch: menuRefetch 
  } = useGetQueryAutoUpdate(['website-menu', storeGUID, BRAND_GUID], `/menu/${storeGUID}/${BRAND_GUID}`, onMenuSuccess, onMenuError, menuRequestBoolean )

  const onWebsiteModificationSuccess = (data) => {
    setLoader(false)
    
    if (data?.data?.websiteModificationLive !== null && data?.data?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl !== null) 
    {
      setBrandLogo(data?.data?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl);
    }
    setWebsiteModificationData(data?.data);
  }
  
  const onWebsiteModificationError = (error) => {
    setLoader(false)
  }

  const { isLoading, isError, refetch: colorRefetch} = useGetQueryAutoUpdate('website-color', `/website-modification-detail/${BRAND_GUID}/${PARTNER_ID}`, onWebsiteModificationSuccess, onWebsiteModificationError, true)

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
    websiteModificationData,
    dayOpeningClosingTime,
    selectedFilter,
    selectedCategoryId,
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
    isCartFull,
    isCartBtnClicked,
    amountDiscountApplied,
    couponDiscountApplied,
    cartData,
    deliveryMatrix,
    postCodeForOrderAmount,
    isReviewPage,
    isLocationBrandOnline,

    booleanObj,
    comingSoon,
    cutOffSchedule,

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
    scheduleTime,
    setScheduleTime,
    selectedPostcode,
    selectedLocation,
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
    setIsTimeToClosed,
    setSelectedFilter,
    setSelectedItemId,
    setStoreToDayName,
    setSelectedCategoryId,
    setIsCouponCodeApplied,
    setTotalOrderAmountValue,
    setDayOpeningClosingTime,
    setStoreToDayOpeningTime,
    setStoreToDayClosingTime,
    
    setCartData,
    setIsItemClicked,
    setDeliveryMatrix,
    setIsCartBtnClicked,
    setIsDeliveryBtnClicked,
    setAmountDiscountApplied,
    setCouponDiscountApplied,
    setPostCodeForOrderAmount,

    setAtFirstLoad,
    setDisplayFilterModal,
    setIsReviewPage,
    setIsGoBtnClicked,
    setNavMobileIndex,
    setIsMenuAvailable,
    setHeaderCartBtnDisplay,
    setNavigationCategories,
    setHeaderUserBtnDisplay,
    setHeaderSearchBarDisplay,
    setHeaderPostcodeBtnDisplay,
    
    setStreet1,
    setStreet2,
    setPostcode,
    setIsCheckOutClicked,
    setIsCartItemDottedBtnClicked,
    setIsDeliveryChangedBtnClicked,
  }
  
  const loaderState = menuLoading || isLoading || loader
  
  return (
    <HomeContext.Provider value={contextData}>
      {children}
      
      {booleanObj?.isCustomerCanvasOpen && <CustomerPersonal />}

      {comingSoon && <MenuNotAvailableModal {...{errorMessage}}/>}

      {atFirstLoad && <AtLoadModalShow />}
      {/* {displayFilterModal && <FilterModal />} */}

      {isCartBtnClicked && <Cart />}
      {booleanObj.isPlaceOrderButtonClicked && <PlaceOrderModal />}
      {/* {isDeliveryBtnClicked && <DeliveryModal />} */}
      {/* {isTimeToClosed && <StoreClosedModal />} */}

      {/* <OtpVerifyModal /> */}
      {loaderState && <Loader loader={loaderState}/>}
    </HomeContext.Provider>
         
  );
}
