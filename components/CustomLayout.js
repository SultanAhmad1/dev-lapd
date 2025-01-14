"use client";

import { useCallback, useEffect, useState } from "react";
import { useGetQueryAutoUpdate } from "./reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import AtLoadModalShow from "./modals/AtLoadModalShow";
import Cart from "./Cart";
import DeliveryModal from "./modals/DeliveryModal";
import Loader from "./modals/Loader";
import { BRAND_GUID, BRAND_SIMPLE_GUID, PARTNER_ID } from "@/global/Axios";
import moment from "moment";
import { setLocalStorage } from "@/global/Store";
import CustomerPersonal from "./CustomerPersonal";
import MenuNotAvailableModal from "./modals/MenuNotAvailableModal";

export default function CustomLayout({ children }) 
{
  
  const [loader, setLoader] = useState(true);

  const [isLocationBrandOnline, setIsLocationBrandOnline] = useState(null);
  
  const [websiteModificationData, setWebsiteModificationData] = useState(null);
  // Header Bar buttons to be displayed.
  const [brandLogo, setBrandLogo] = useState(null);
  const [headerUserBtnDisplay, setHeaderUserBtnDisplay] = useState(true);
  const [headerPostcodeBtnDisplay, setHeaderPostcodeBtnDisplay] = useState(true);
  const [headerSearchBarDisplay, setHeaderSearchBarDisplay] = useState(false);
  const [headerCartBtnDisplay, setHeaderCartBtnDisplay] = useState(true);
  
  // FilterLocationTime Component States
  const [storeGUID, setStoreGUID] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [storeToDayName, setStoreToDayName] = useState("");
  const [storeToDayOpeningTime, setStoreToDayOpeningTime] = useState("");
  const [storeToDayClosingTime, setStoreToDayClosingTime] = useState("");

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
  const [comingSoon, setComingSoon] = useState(false);
  

  const [isDeliveryBtnClicked, setIsDeliveryBtnClicked] = useState(false);
  const [isDeliveryChangedBtnClicked, setIsDeliveryChangedBtnClicked] = useState(false);

  const [isCartFull, setIsCartFull] = useState(true);

  const [iscartItemDottedBtnClicked, setIscartItemDottedBtnClicked] = useState(false);
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
  
  const [booleanObj, setBooleanObj] = useState({
    isCustomerCanvasOpen: false,
    isCustomerVerified: false,
    isOTPModalShow: false,
  });
  
  const handleBoolean = useCallback((newValue, fieldName) => {
    setBooleanObj((prevData) => ({...prevData, [fieldName]: newValue}))
  }, [booleanObj]);

  useEffect(() => {
    
    const useAuth = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
    if(useAuth !== null)
    {
      handleBoolean(true, 'isCustomerVerified')
    }

    const url = new URL(window.location.href);
    var pathnameArray = url.pathname.split("/").filter(segment => segment);

    const dayNumber = moment().day();

    // Get the current day name
    const dayName = moment().format("dddd");

    setDayName(dayName);
    setDayNumber(dayNumber);

    const afterReloadingGetCouponCode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`));
    setCouponDiscountApplied(afterReloadingGetCouponCode !== null ? afterReloadingGetCouponCode : []);

    const getSelectStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`);

    if (getSelectStore === null) 
    {
      if (pathnameArray?.[0] === "track-order" || pathnameArray?.[0] === "review-order" || pathnameArray?.[0] === "payment" || pathnameArray?.[0] === "place-order") 
      {
        setAtFirstLoad(false);
        setHeaderCartBtnDisplay(false);
        setHeaderPostcodeBtnDisplay(false);
      } 
      else 
      {
        setAtFirstLoad(true);
        setHeaderCartBtnDisplay(true);
        setHeaderPostcodeBtnDisplay(true);
      }
    } 
    else 
    {
      setPostcode(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`)));

      const parseToJSobj = JSON.parse(getSelectStore);
      // menuRefetch(parseToJSobj === null ? storeGUID : parseToJSobj.display_id);
      setStoreGUID(parseToJSobj === null ? storeGUID : parseToJSobj.display_id);
      setStoreName(parseToJSobj.store);

      const appliedAmountDiscount = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`));
      const address = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`));
      const getDeliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`));

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
      menuRefetch()
      colorRefetch()
    }
  }, []);
  
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

    const convertToJSobj = menu?.menu_json_log;

    const dayNumber = moment().day();
    const dateTime = moment().format("HH:mm");
    const dayName = moment().format("dddd");

    const currentDay = convertToJSobj?.menus?.[0]?.service_availability?.find((day) => day?.day_of_week?.toLowerCase().includes(dayName.toLowerCase()));

    setDayOpeningClosingTime(currentDay);
    // if (currentDay) 
    // {
    //   const timePeriods = currentDay?.time_periods;
    //   if (timePeriods) 
    //   {
    //     if (timePeriods?.[0]?.start_time >= dateTime && dateTime <= timePeriods?.[0]?.end_time) 
    //     {
    //       setIsTimeToClosed(true);
    //       setAtFirstLoad(false);
    //     }
    //     else{
    //       setIsTimeToClosed(false)
          
    //       setAtFirstLoad((atFirstLoad === false) ? false : true);
    //     }
    //   }
    // }

    setMenu(convertToJSobj);

    const getFilterDataFromObj = (window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`) !== undefined ? JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`)) : null);
    if (getFilterDataFromObj === null) 
    {
      setLocalStorage(`${BRAND_SIMPLE_GUID}filter`, convertToJSobj?.filters?.[0]);
    }

    setSelectedFilter(getFilterDataFromObj === null ? convertToJSobj?.filters?.[0] : getFilterDataFromObj);
    setFilters(convertToJSobj?.filters);
    setNavigationCategories(convertToJSobj?.categories);
    setNavMobileIndex(0);

    const getdayInformation = convertToJSobj.menus?.[0].service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().format("dddd").toLowerCase());
    setStoreToDayName(moment().format("dddd"));
    setStoreToDayOpeningTime(getdayInformation?.time_periods?.[0].start_time);
    setStoreToDayClosingTime(getdayInformation?.time_periods?.[0].end_time);
  }

  const onMenuError = (error) => {
    console.error("Error fetching data:", error);
    setIsMenuAvailable(false);
    setLoader(false)
  }

  const { isLoading: menuLoading, isError: menuError, refetch: menuRefetch } = useGetQueryAutoUpdate('website-menu', `/menu/${storeGUID}/${BRAND_GUID}`, onMenuSuccess, onMenuError, true)

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

  // useEffect(() => {
  //   if(booleanObj?.isCustomerVerified === false)
  //   {
  //     /**
  //      * all the localStorage clear when 
  //      */
      
  //     // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
  //     const timeoutId = setTimeout(() => {
  //       // Clear all items in localStorage
  //       localStorage.clear();
  //       window.location.reload(true);
  //       setTimeout(() => {setLoader(false);}, 2000);
  //     }, 30 * 60 * 1000); 

  //     // Clear the timeout if the component is unmounted before 20 minutes
  //     return () => clearTimeout(timeoutId);
  //   }
  // });
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
        if(differenceMinutes >= 60)
        {
          localStorage.clear();
          window.location.reload(true);
        }
      }
    }
  },[countMinutes]);

  // Context Data
  const contextData = {
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
    iscartItemDottedBtnClicked,
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

    setComingSoon,
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
    setIscartItemDottedBtnClicked,
    setIsDeliveryChangedBtnClicked,
  }
  
  const loaderState = menuLoading || isLoading || loader
  
  return (
    <HomeContext.Provider value={contextData}>
      {children}
      {booleanObj?.isCustomerCanvasOpen && <CustomerPersonal />}

      {comingSoon && <MenuNotAvailableModal />}

      {atFirstLoad && <AtLoadModalShow />}
      {isCartBtnClicked && <Cart />}
      {/* {isDeliveryBtnClicked && <DeliveryModal />} */}
      {/* {isTimeToClosed && <StoreClosedModal />} */}

      {/* <OtpVerifyModal /> */}
      {
        loaderState && <Loader loader={loaderState}/>}
    </HomeContext.Provider>
         
  );
}
