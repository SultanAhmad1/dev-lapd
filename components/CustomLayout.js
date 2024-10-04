"use client";

import { useCallback, useEffect, useState } from "react";
import { useGetQueryAutoUpdate } from "./reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import AtLoadModalShow from "./modals/AtLoadModalShow";
import Cart from "./Cart";
import DeliveryModal from "./modals/DeliveryModal";
import StoreClosedModal from "./modals/StoreClosedModal";
import Loader from "./modals/Loader";
import { BRAND_GUID, BRANDSIMPLEGUID, PARTNER_ID } from "@/global/Axios";
import moment from "moment";
import { setLocalStorage } from "@/global/Store";
import CustomerPersonal from "./CustomerPersonal";
import MenuNotAvailableModal from "./modals/MenuNotAvailableModal";
// Initialize queryClient

export default function CustomLayout({ children }) 
{
  
  const [loader, setLoader] = useState(true);

  const [isLocationBrandOnline, setIsLocationBrandOnline] = useState(null);
  
  const [websiteModificationData, setWebsiteModificationData] = useState(null);
  // Header Bar buttons to be displayed.
  const [brandlogo, setBrandlogo] = useState(null);
  const [headerUserBtnDisplay, setHeaderUserBtnDisplay] = useState(true);
  const [headerPostcodeBtnDisplay, setHeaderPostcodeBtnDisplay] = useState(true);
  const [headerSearchBarDisplay, setHeaderSearchBarDisplay] = useState(false);
  const [headerCartBtnDisplay, setHeaderCartBtnDisplay] = useState(true);
  
  // FilterLocationTime Component States
  const [storeGUID, setStoreGUID] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [storetodaydayname, setStoretodaydayname] = useState("");
  const [storetodayopeningtime, setStoretodayopeningtime] = useState("");
  const [storetodayclosingtime, setStoretodayclosingtime] = useState("");

  const [iscartbtnclicked, setIscartbtnclicked] = useState(false);

  const [selectedcategoryid, setSelectedcategoryid] = useState(0);
  const [selecteditemid, setSelecteditemid] = useState(0);

  const [firstname, setFirstname] = useState("Sultan");
  const [lastname, setLastname] = useState("Ahmad");

  // Day Name and Day Number
  const [dayname, setDayname] = useState("");
  const [daynumber, setDaynumber] = useState(0);
  // HomeContext Data
  const [postcodefororderamount, setPostcodefororderamount] = useState("");
  const [postcode, setPostcode] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [deliverymatrix, setDeliverymatrix] = useState(null);
  const [totalOrderAmountValue, settotalOrderAmountValue] = useState(0);

  // Boolean States
  const [iscouponcodeapplied, setIscouponcodeapplied] = useState(false);

  const [dayOpeningClosingTime, setDayOpeningClosingTime] = useState(null);

  const [isTimeToClosed, setIsTimeToClosed] = useState(false);
  const [atfirstload, setAtfirstload] = useState(false);
  const [CommingSoon, setCommingSoon] = useState(false);
  

  const [isdeliverybtnclicked, setIsdeliverybtnclicked] = useState(false);
  const [isdeliverychangedbtnclicked, setIsdeliverychangedbtnclicked] = useState(false);

  const [iscartfull, setIscartfull] = useState(true);

  const [iscartitemdottedbtnclicked, setIscartitemdottedbtnclicked] = useState(false);
  const [isitemclicked, setIsitemclicked] = useState(false);
  // const [isquickviewclicked, setIsquickviewclicked] = useState(false)
  const [ischeckoutclicked, setIscheckoutclicked] = useState(false);
  const [isReviewPage, setIsReviewPage] = useState(false);
  
  // Button states
  const [isgobtnclicked, setIsgobtnclicked] = useState(false);

  const [Menu, setMenu] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filters, setFilters] = useState([]);

  const [navigationcategories, setNavigationcategories] = useState([]);
  const [navmobileindex, setNavmobileindex] = useState(0);
  const [ismenuavailable, setIsmenuavailable] = useState(true);

  const [cartdata, setCartdata] = useState([]);
  const [amountDiscountapplied, setAmountDiscountapplied] = useState(null);
  const [couponDiscountapplied, setCouponDiscountapplied] = useState([]);
  
  const [booleanObj, setBooleanObj] = useState({
    isCustomerCanvaOpen: false,
    isCustomerVerfied: false,
    isOTPModalShow: false,
  });
  
  const handleBoolean = useCallback((newValue, fiedlName) => {
    setBooleanObj((prevData) => ({...prevData, [fiedlName]: newValue}))
  }, [booleanObj]);

  useEffect(() => {
    
    const useAuth = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}websiteToken`))
    if(useAuth !== null)
    {
      handleBoolean(true, 'isCustomerVerfied')
    }

    const url = new URL(window.location.href);
    var pathnameArray = url.pathname.split("/").filter(segment => segment);

    const dayNumber = moment().day();

    // Get the current day name
    const dayName = moment().format("dddd");

    setDayname(dayName);
    setDaynumber(dayNumber);

    const afterReloadingGetCouponCode = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}applied_coupon`));
    setCouponDiscountapplied(afterReloadingGetCouponCode !== null ? afterReloadingGetCouponCode : []);

    const getSelectStore = window.localStorage.getItem(`${BRANDSIMPLEGUID}user_selected_store`);

    if (getSelectStore === null) 
    {
      if (pathnameArray[0] === "track-order" || pathnameArray[0] === "review-order" || pathnameArray[0] === "payment" || pathnameArray[0] === "place-order") 
      {
        setAtfirstload(false);
        setHeaderCartBtnDisplay(false);
        setHeaderPostcodeBtnDisplay(false);
      } 
      else 
      {
        setAtfirstload(true);
        setHeaderCartBtnDisplay(true);
        setHeaderPostcodeBtnDisplay(true);
      }
    } 
    else 
    {
      setPostcode(JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}user_valid_postcode`)));

      const parseToJSobj = JSON.parse(getSelectStore);
      // menuRefetch(parseToJSobj === null ? storeGUID : parseToJSobj.display_id);
      setStoreGUID(parseToJSobj === null ? storeGUID : parseToJSobj.display_id);
      setStoreName(parseToJSobj.store);

      const appliedAmountDiscount = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_amount_discount_applied`));
      const address = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}address`));
      const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_matrix`));

      setAmountDiscountapplied(appliedAmountDiscount);
      setDeliverymatrix(getDeliveryMatrix);
      setPostcodefororderamount(getDeliveryMatrix?.postcode);

      const parseToJSobjAvailableStore = address?.availableStore;
      if (parseInt(parseToJSobjAvailableStore.length) > parseInt(0)) {
        for (const store of parseToJSobjAvailableStore) {
          if (parseToJSobj.display_id === store?.location_guid) {
            setStreet1(store?.user_street1);
            setStreet2(store?.user_street2);
          }
        }
      }

      const cartDataFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}cart`));

      setCartdata(cartDataFromLocalStorage === null ? [] : cartDataFromLocalStorage);
      menuRefetch()
      colorRefetch()
    }
  }, []);
    
  const onMenuSuccess = (data) => 
  {
    setLoader(false)
    const { menu } = data?.data

    const convertToJSobj = menu?.menu_json_log;

    const dayNumber = moment().day();
    const dateTime = moment().format("HH:mm");
    const dayName = moment().format("dddd");

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
          setAtfirstload(false);
        }
        else{
          setIsTimeToClosed(false)
          
          setAtfirstload((atfirstload === false) ? false : true);
        }
      }
    }
    setMenu(convertToJSobj);

    const getFilterDataFromObj = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}filter`));
    if (getFilterDataFromObj === null) 
    {
      setLocalStorage(`${BRANDSIMPLEGUID}filter`, convertToJSobj?.filters?.[0]);
    }

    setSelectedFilter(getFilterDataFromObj === null ? convertToJSobj?.filters?.[0] : getFilterDataFromObj);
    setFilters(convertToJSobj?.filters);
    setNavigationcategories(convertToJSobj?.categories);
    setNavmobileindex(0);

    const getDayInformation = convertToJSobj.menus?.[0].service_availability?.find((dayinformation) => dayinformation.day_of_week === moment().format("dddd").toLowerCase());
    setStoretodaydayname(moment().format("dddd"));
    setStoretodayopeningtime(getDayInformation?.time_periods?.[0].start_time);
    setStoretodayclosingtime(getDayInformation?.time_periods?.[0].end_time);
  }

  const onMenuError = (error) => {
    console.error("Error fetching data:", error);
    setIsmenuavailable(false);
    setLoader(false)
  }

  const { isLoading: menuLoading, isError: menuError, refetch: menuRefetch } = useGetQueryAutoUpdate('website-menu', `/menu/${storeGUID}/${BRAND_GUID}`, onMenuSuccess, onMenuError, true)

  const onWebsiteModificationSucccess = (data) => {
    setLoader(false)
    
    if (data?.data?.websiteModificationLive !== null && data?.data?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl !== null) 
    {
      setBrandlogo(data?.data?.websiteModificationLive?.json_log?.[0]?.websiteLogoUrl);
    }
    setWebsiteModificationData(data?.data);
  }
  
  const onWebsiteModificationError = (error) => {
    setLoader(false)
  }

  const { isLoading, isError, refetch: colorRefetch} = useGetQueryAutoUpdate('website-color', `/website-modification-detail/${BRAND_GUID}/${PARTNER_ID}`, onWebsiteModificationSucccess, onWebsiteModificationError, true)

  useEffect(() => {
    if(booleanObj?.isCustomerVerfied === false)
    {
      /**
       * all the localStorage clear when 
       */
      
      // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
      const timeoutId = setTimeout(() => {
        // Clear all items in localStorage
        localStorage.clear();
        window.location.reload(true);
        setTimeout(() => {setLoader(false);}, 2000);
      }, 30 * 60 * 1000); 

      // Clear the timeout if the component is unmounted before 20 minutes
      return () => clearTimeout(timeoutId);
    }
  });
  
  // Context Data
  const contextData = {
    Menu,
    loader,
    filters,
    brandlogo,
    storeGUID,
    storeName,
    selecteditemid,
    totalOrderAmountValue,
    storetodaydayname,
    storetodayopeningtime,
    storetodayclosingtime,
    navigationcategories,
    navmobileindex,
    ismenuavailable,
    websiteModificationData,
    dayOpeningClosingTime,
    selectedFilter,
    selectedcategoryid,
    headerSearchBarDisplay,
    headerPostcodeBtnDisplay,
    headerCartBtnDisplay,
    headerUserBtnDisplay,
    dayname,
    daynumber,
    firstname,
    lastname,
    postcode,
    street1,
    street2,
    isdeliverychangedbtnclicked,
    ischeckoutclicked,
    iscartitemdottedbtnclicked,
    iscartfull,
    iscartbtnclicked,
    amountDiscountapplied,
    couponDiscountapplied,
    cartdata,
    deliverymatrix,
    postcodefororderamount,
    isReviewPage,
    isLocationBrandOnline,

    booleanObj,
    CommingSoon,

    setCommingSoon,
    handleBoolean,
    setIsLocationBrandOnline,
    setMenu,
    setLoader,
    setFilters,
    setBrandlogo,
    setStoreGUID,
    setStoreName,
    setIsTimeToClosed,
    setSelectedFilter,
    setSelecteditemid,
    setStoretodaydayname,
    setSelectedcategoryid,
    setIscouponcodeapplied,
    settotalOrderAmountValue,
    setDayOpeningClosingTime,
    setStoretodayopeningtime,
    setStoretodayclosingtime,
    
    setCartdata,
    setIsitemclicked,
    setDeliverymatrix,
    setIscartbtnclicked,
    setIsdeliverybtnclicked,
    setAmountDiscountapplied,
    setCouponDiscountapplied,
    setPostcodefororderamount,

    setAtfirstload,
    setIsReviewPage,
    setIsgobtnclicked,
    setNavmobileindex,
    setIsmenuavailable,
    setHeaderCartBtnDisplay,
    setNavigationcategories,
    setHeaderUserBtnDisplay,
    setHeaderSearchBarDisplay,
    setHeaderPostcodeBtnDisplay,
    
    setStreet1,
    setStreet2,
    setPostcode,
    setIscheckoutclicked,
    setIscartitemdottedbtnclicked,
    setIsdeliverychangedbtnclicked,
  }
  
  const loaderState = menuLoading || isLoading || loader
  
  return (
    <HomeContext.Provider value={contextData}>
      {children}
      {booleanObj?.isCustomerCanvaOpen && <CustomerPersonal />}

      {CommingSoon && <MenuNotAvailableModal />}

      {atfirstload && <AtLoadModalShow />}
      {iscartbtnclicked && <Cart />}
      {isdeliverybtnclicked && <DeliveryModal />}
      {isTimeToClosed && <StoreClosedModal />}

      {/* <OtpVerifyModal /> */}
      {
        loaderState &&
        <Loader loader={loaderState}/>
      }
    </HomeContext.Provider>
         
  );
}
