"use client";

import { ContextCheckApi } from "@/app/layout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/modals/Loader";
import PostcodeModal from "@/components/modals/PostcodeModal";
import OtpVerifyModal from "@/components/OtpVerifyModal";
import { useLoginMutationHook, usePatchMutationHook, usePostMutationHook } from "@/components/reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import { BRANDSIMPLEGUID, BRAND_GUID, IMAGE_URL_Without_Storage, PARTNER_ID, axiosPrivate } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, setLocalStorage, validatePhoneNumber } from "@/global/Store";
import { listtime, round15 } from "@/global/Time";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";

function UserForm() {
  
  const route = useRouter();
  const addDoorNumberRef = useRef(null);

  //   const {isauth, setIsauth} = useContext(AuthContext)

  const [errormessage, setErrormessage] = useState("");
  const {
    booleanObj,
    dayOpeningClosingTime,
    isTimeToClosed,
    couponDiscountapplied,
    totalOrderAmountValue,
    settotalOrderAmountValue,
    setIsTimeToClosed,
    storeGUID,
    cartdata,
    postcode,
    street1,
    street2,
    isLocationBrandOnline,

    setIsLocationBrandOnline,
    setAtfirstload,
    setIscartbtnclicked,
    setHeaderCartBtnDisplay,
    setHeaderPostcodeBtnDisplay,
    handleBoolean,
    websiteModificationData,
  } = useContext(HomeContext);

  
  const { setmetaDataToDipslay} = useContext(ContextCheckApi)

  useEffect(() => {
    if(websiteModificationData)
    {
      const metaHeadingData = {
        title: websiteModificationData?.brand?.name,
        contentData: websiteModificationData?.brand?.name,
        iconImage: IMAGE_URL_Without_Storage+"/"+websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon,
        singleItemsDetails: {
          title: "",
          description: "",
          itemImage: "",
          keywords: "",
          url: ""
        }
      }
      setmetaDataToDipslay(metaHeadingData)
    }
  }, [websiteModificationData]);

  const [isHover, setIsHover] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  
  const [toggleObjects, settoggleObjects] = useState({
    isCustomerHasPassword: false,
    isLoginShow: true,
    authButtonDisabledUntilPasswordChanged: true,
    isPhoneToggle: true,
    isAdddoororHouseClicked: true,
    isDoorInputDisplayClicked: true,
    isAddDriverInstructionClicked: false,
    isEmailToggle: true,
    isEmailInputToggle:true,
    isPhoneToggle:true,
    isPhoneinputToggle:true,
    isFirstnameToggle:true,
    isPostCodeClicked: true,
    isChangePostcodeClicked: false,

    isBySmsClicked: false,
    isByEmailClicked: false,

    isAuthed: false
  });
  

  const [isbysmsclicked, setIsbysmsclicked] = useState(false);
  const [isbyemailclicked, setIsbyemailclicked] = useState(false);
  // Get value states

  const [customerDetailObj, setCustomerDetailObj] = useState({
    email: "",
    phone: "",
    password: "",
    lastname: "",
    firstname: "",
    doorhousename: "",
    driverinstruction: "",
    openingtime: "",
    closingtime: "",

    deliverytimefrom: "",
    deliverytimeend: "",

    phoneError: "",
    PayNowBottomError: "",
    saveMyDetailsError: "",
  });

  const [openingtime, setOpeningtime] = useState("");
  const [closingtime, setClosingtime] = useState("");
  const [deliverytimefrom, setDeliverytimefrom] = useState("");
  const [deliverytimeend, setDeliverytimeend] = useState("");

  const [deliverytime, setDeliveryTime] = useState("");

  const [due, setDue] = useState("due");

  // Message
  const [Message, setMessage] = useState("");
  // Error states
  const [saveMyDetailsError, setSaveMyDetailsError] = useState("");

  const handleToggles = useCallback((event) => {
    const { name} = event.target
    settoggleObjects((prevData) => ({...prevData, [name]: !prevData[name]}))
  }, [toggleObjects]);
  
  const handleInputs = useCallback((event) => {
    const { value, name } = event.target

    switch (name) {
      case "password":
        settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
        setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
        break;
      case "email":
        setIsavefasterdetailsclicked(false)
        setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
        break;
      case 'phone':
        setIsavefasterdetailsclicked(false)
        setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
        break;
      default:
        setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
      break;
    }
    
  },[customerDetailObj])

  function handleDeliveryTime(event) {
    setDeliveryTime(event.target.value);
    setDue("requested");
  }
  // Change Postcode and Address states
  const [deliverydetailtext, setDeliverydetailtext] = useState("Edit");
  const [ispostcodeeditclicked, setIspostcodeeditclicked] = useState(false);

  function handlePostcodeEdit() {
    setIspostcodeeditclicked(!ispostcodeeditclicked);
    setDeliverydetailtext(deliverydetailtext === "Edit" ? "Save" : "Edit");
  }

  const [ischangepostcodeclicked, setIschangepostcodeclicked] = useState(false);

  // Save details for Faster Checkout next time
  const [isavefasterdetailsclicked, setIsavefasterdetailsclicked] = useState(false);
  
  // Function to validate the email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function handleLogin() {
    // navigate("/login");
    
    settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: true}))
    const loginData = {
      userEmail: customerDetailObj?.email,
      userPhone: customerDetailObj?.phone,
      userPassword: toggleObjects?.isCustomerHasPassword ? null : customerDetailObj?.password,
      brand_guid: BRAND_GUID,
    }
    
    if(parseInt(loginData?.userEmail?.length) > parseInt(0))
    {
      if (validateEmail(loginData?.userEmail)) {
      } else {
        settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
        window.alert("Enter valid email address.")
        return
      }
    }
    
    if(!toggleObjects?.isCustomerHasPassword && customerDetailObj?.password?.length === parseInt(0))
    {
      settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
      window.alert("Some fields need to be filled.")
      return 
    }

    if(customerDetailObj?.email?.length === parseInt(0) || customerDetailObj?.phone?.length === parseInt(0))
    {

      settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
      window.alert("Some fields need to be filled.")
      return 
    }
    
    loginMutation(loginData)
  }

  /**
   * Login Post Mutation
   */
  const onLoginSuccess = (data) => {
    if(!toggleObjects?.isCustomerHasPassword)
    {
      setIsOTP(true)
      setLocalStorage(`${BRANDSIMPLEGUID}tempcustomer`, data?.data?.data?.customer)
      return
    }

    setLocalStorage(`${BRANDSIMPLEGUID}websiteToken`, data?.data)
    handleBoolean(true,'isCustomerVerified')

    settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false, isAuthed: true,isCustomerHasPassword: true}))
    // route.push('/')    
  }

  const onLoginError = (error) => {
    settoggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
    window.alert(error?.response?.data?.error)
    return
  }

  const {mutate: loginMutation, isLoading: loginLoading, isError: loginError, isSuccess: loginSuccess, reset: loginReset} = useLoginMutationHook('login', '/website-login', onLoginSuccess, onLoginError)

  const handleRegisteration = () => {

    const getLocationId = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}user_selected_store`))
    const registerationData = {
      location: getLocationId?.display_id,
      brand: BRAND_GUID,
      email: customerDetailObj?.email,
      phone: customerDetailObj?.phone,
      password: customerDetailObj?.password
    }

    registerationMutation(registerationData)
  }

  /**
   * 
   * User no need to redirect can save information related to order.
   */
  const onRegisterationError = (error) => {
    window.alert("There is something went wrong!. Please refresh and try again.")
    return
  }

  const onRegisterationSuccess = (data) => {
    // redirect to OTP screen verify.
    // once otp is verfied, then get the customer password with confirmpassword field.

    setIsOTP(true)
    setLocalStorage(`${BRANDSIMPLEGUID}tempcustomer`, data?.data?.data?.customer)
  }

  const {mutate: registerationMutation, isLoading: registerLoading, isError: registerError, isSuccess: registerSuccess, reset: registerReset} = usePostMutationHook('registeration', '/website-registeration', onRegisterationSuccess, onRegisterationError)

  async function fetchLocationDeliveryEstimate() {
    // Get the current day name
    try {
      const placeOrderGetStoreGUID = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}user_selected_store`));

      const data = {
        location_guid: placeOrderGetStoreGUID === null ? storeGUID : placeOrderGetStoreGUID?.display_id,
        brand_guid: BRAND_GUID,
        day_number: moment().day(),
        partner: PARTNER_ID,
      };

      const response = await axiosPrivate.post(`/website-delivery-time`, data);

      const { brandExists } = response?.data?.data

      setIsLocationBrandOnline(brandExists)
      // Write logic if the closing is up or come closer than show information.
      var startTime   = response?.data?.data?.brandDeliveryEstimatePartner?.start_time;
      var endTime     = response?.data?.data?.brandDeliveryEstimatePartner?.end_time;

      var timeForm    = response?.data?.data?.brandDeliveryEstimatePartner?.time_from;
      var deliveryTo  = response?.data?.data?.brandDeliveryEstimatePartner?.time_to;
      var d = new Date();
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      if (startTime == "24:00:00") {
        startTime = "23:59:59";
      }
      var time_from_temp = months[d.getMonth()] +" " +d.getDate() +", " +d.getFullYear() +" " +startTime;
      var time_to_temp   = months[d.getMonth()] +" " +d.getDate() +", " +d.getFullYear() +" " +endTime;

      var time_from = new Date(time_from_temp);
      var time_to = new Date(time_to_temp);

      if (Date.parse(time_from) > Date.parse(d)) 
      {
        time_from.setMinutes(time_from.getMinutes() + parseInt(deliveryTo));
        var start_time = new Date(time_from);
        start_time = start_time.getHours() + ":" + round15(start_time.getMinutes());
      } 
      else 
      {
        d.setMinutes(d.getMinutes() + parseInt(deliveryTo));
        var start_time  = new Date(d);
        start_time      = start_time.getHours() + ":" + round15(start_time.getMinutes());
      }
      var current_date = new Date();
      // Changed to brand closing time + max delivery time at 4/6/2021

      if (Date.parse(time_to) < Date.parse(current_date)) {
        setIsTimeToClosed(true);
        return;
      }
      time_to.setMinutes(time_to.getMinutes() + parseInt(deliveryTo) - 1);
      let end_time = new Date(time_to);

      end_time = end_time.getHours() + ":" + end_time.getMinutes();
      if (start_time == "23:60") 
      {
        end_time = start_time;
      }

      if (parseFloat(end_time.split(":")[0]) == 0) 
      {
        end_time = "23:59";
      }

      if (start_time.split(":")[1].length == 1) 
      {
        start_time = start_time.split(":")[0] + ":" + start_time.split(":")[1] + "0";
      }

      if (parseFloat(start_time.split(":")[1]) == 60) {
        var temp_time = start_time.split(":")[0] + ":59";
      } else {
        var temp_time = start_time;
      }
      // temp_time = tConvert(temp_time);

      setDeliveryTime(temp_time);

      setOpeningtime(temp_time);

      // setOpeningtime(response?.data?.data?.brandDeliveryEstimatePartner?.start_time)
      setClosingtime(response?.data?.data?.brandDeliveryEstimatePartner?.end_time);
      setDeliverytimefrom(response?.data?.data?.brandDeliveryEstimatePartner?.time_from);
      setDeliverytimeend(response?.data?.data?.brandDeliveryEstimatePartner?.time_to);
      if (parseInt(listtime.length) > parseInt(0)) {}
 
    } catch (error) {
   
    }
  }
  
  useEffect(() => {
    const checkedLogin = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}websiteToken`))
    
    if(checkedLogin !== null)
    {
      settoggleObjects((prevData) => ({...prevData, isAuthed: true, isCustomerHasPassword: true}))
    }
    else
    {
      settoggleObjects((prevData) => ({...prevData, isAuthed: false, isCustomerHasPassword: false}))
    } 

    const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

    if(customer !== undefined || customer !== null)
    {
      const filterAddress = customer?.addresses?.find(address => address?.is_default_address === 1)
      setCustomerDetailObj((prevData) => ({...prevData,
        email: customer?.email,
        phone: customer?.phone,
        lastname: customer?.last_name,
        firstname: customer?.first_name,
        doorhousename: filterAddress?.house_no_name,
        driverinstruction: filterAddress?.driver_instructions,
      }));
    }
    
  }, [booleanObj?.isCustomerVerified]);
  
  useEffect(() => {
    
    // Check if the cart has not any item then back to home page.
    // Check the brand is active or not.
    const useAuthenticate = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}websiteToken`))

    if(useAuthenticate !== null)
    {
      handleBoolean(true,'isCustomerVerified')
    }


    if(addDoorNumberRef.current)
    {
      addDoorNumberRef.current.focus();
    }

    const dayNumber = moment().day();
    const dateTime = moment().format("HH:mm");
    const dayName = moment().format("dddd");

    if (dayOpeningClosingTime?.day_of_week?.toLowerCase().includes(dayName.toLowerCase())) 
    {
      const timePeriods = dayOpeningClosingTime?.time_periods;
      if (timePeriods) 
      {
        if (timePeriods?.[0]?.start_time >= dateTime && dateTime <= timePeriods?.[0]?.end_time) 
        {
          setIsTimeToClosed(true);
          return;
        }
      }
    }

    const placeOrderLocalStorageTotal = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}total_order_value_storage`));
    settotalOrderAmountValue(placeOrderLocalStorageTotal === null ? totalOrderAmountValue : getAmountConvertToFloatWithFixed(JSON.parse(placeOrderLocalStorageTotal),2));

    setIscartbtnclicked(false);
    fetchLocationDeliveryEstimate();
    

    setHeaderCartBtnDisplay(false);
    setHeaderPostcodeBtnDisplay(false);

    const getCustomerInforation = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}customer_information`));

    if (getCustomerInforation !== null) 
    {
      setCustomerDetailObj((prevData) => ({
        ...prevData, 
        doorhousename: getCustomerInforation.doorhousename,
        driverinstruction: getCustomerInforation.driverinstruction,
        email: getCustomerInforation.email,
        phone: getCustomerInforation.phone,
        firstname: getCustomerInforation.firstname,
        lastname: getCustomerInforation.lastname,
      }))
      
      settoggleObjects((prevData) => ({...prevData, isByEmailClicked: getCustomerInforation.isbyemailclicked, isBySmsClicked: getCustomerInforation.isbysmsclicked}))
      setDeliveryTime(getCustomerInforation.deliverytime);
    }
  }, []);

  useEffect(() => {
    // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
    if(booleanObj?.isCustomerVerified === false)
    {
      const timeoutId = setTimeout(() => {
        // Clear all items in localStorage
        localStorage.clear();
        window.location.reload(true);
        window.location.href = "/"
      }, 30 * 60 * 1000); 
      // Clear the timeout if the component is unmounted before 20 minutes
      return () => clearTimeout(timeoutId);
    }

  });

  /**
   * This useEffect reset all user information after a specific time End.
   */

  /**
   * Register customer login Details for faster login.
   */

  const onCustomerSuccess = (data) => {
    if (data?.data?.data?.customer !== null) 
    {
      if (data?.data?.data?.customer?.password === null || data?.data?.data?.customer?.password === '') 
      {
        settoggleObjects((prevData) => ({...prevData, isCustomerHasPassword: false, isLoginShow: true, authButtonDisabledUntilPasswordChanged: false}))
        setCustomerDetailObj((prevData) => ({...prevData, password: null}))
        setMessage("The phone/email you have entered is already registered.");
        return
      }
      else
      {
        settoggleObjects((prevData) => ({...prevData, isCustomerHasPassword: true, isLoginShow: true, authButtonDisabledUntilPasswordChanged: false}))
        setMessage("The phone/email you have entered is already registered.");
        return
      }

      setCustomerDetailObj((prevData) => ({...prevData, password: data?.data?.data?.customer?.password}))
      settoggleObjects((prevData) => ({...prevData, isCustomerHasPassword: false,  isLoginShow: true}))
      setMessage("The phone/email you have entered is already registered.");

      return
    } 
    settoggleObjects((prevData) => ({...prevData, isCustomerHasPassword: false,  isLoginShow: false, authButtonDisabledUntilPasswordChanged: true}))
    setMessage("Register yourself to get more coupons and discounts on your favourite meals.");
  }

  const onCustomerError = (error) => {
    setIsavefasterdetailsclicked(false);
    window.alert("Some fields need to be filled.")

    if (parseInt(error?.response?.data?.errors?.email?.length) > parseInt(0)) 
    {
      setCustomerDetailObj((prevData) => ({...prevData, email: "", emailError: "Enter valid email."}))
    }

    if (parseInt(error?.response?.data?.errors?.phone?.length) > parseInt(0)) 
    {
      setCustomerDetailObj((prevData) => ({...prevData, phone: "", phoneError: "Enter valid phone number."}))
    }
    
  }

  const {mutate: checkCustomerMutation, isSuccess: checkCustomerSuccess, reset: checkCustomerReset, isLoading: checkCustomerLoading, isError: checkCustomerError, } = usePostMutationHook("check-customer-detail",`/get-customer-account-details`, onCustomerSuccess, onCustomerError)

  function handleSaveMyDetails(isActive) {

    if (customerDetailObj?.doorhousename === "" || customerDetailObj?.email === "" || customerDetailObj?.phone === "" || customerDetailObj?.firstname === "" || customerDetailObj?.lastname === "") 
    {
      setSaveMyDetailsError("Please check * (asterisk) mark field and fill them.");
      setIsavefasterdetailsclicked(false);
      return;
    }

    setSaveMyDetailsError("");
    setIsavefasterdetailsclicked(isActive);

    if(isActive === true)
    {
      checkCustomerMutation({
        email: customerDetailObj?.email,
        phone: customerDetailObj?.phone,
      })
    }
  }
 
  const handlePayNow = (e) => 
  {
    e.preventDefault()

    if(isavefasterdetailsclicked || isLocationBrandOnline === null)
    {
      return
    }

    // if(parseInt(cartdata?.length) === parseInt(0))
    // {

    // }

    if (parseInt(customerDetailObj?.doorhousename.length) === parseInt(0) || parseInt(customerDetailObj?.email.length) === parseInt(0) || parseInt(customerDetailObj?.phone.length) === parseInt(0) || parseInt(customerDetailObj?.firstname.length) === parseInt(0) ||parseInt(customerDetailObj?.lastname.length) === parseInt(0)) 
    {
      setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: "Please check * (asterisk) mark field and fill them."}))
      return;
    }

    let checkNumber = validatePhoneNumber(customerDetailObj?.phone);
    if (!checkNumber) {
      setIsavefasterdetailsclicked(false);
      setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: "Kindly enter valid contact number!."}))
      return;
    }

    // if(parseInt(cartdata.length) === parseInt(0))
    // {
    //   route.push('/')
    //   return
    // }
    
    if(parseInt(cartdata.length) > parseInt(0))
    {
      const deliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_matrix`))

      let totalOrder = 0

      for (const total of cartdata) 
      {
        totalOrder = parseFloat(totalOrder) + parseFloat(total?.total_order_amount);
      }

      if(parseFloat(deliveryMatrix?.order_value)?.toFixed(2) > parseFloat(totalOrder)?.toFixed(2))
      {
        route.push('/')
        return  
      }
    }
    else
    {
      route.push('/')
      return
    }
    setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: ""}))
    
    const subTotalOrderLocal        = JSON.parse(JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}sub_order_total_local`))) === null ? null: getAmountConvertToFloatWithFixed(JSON.parse(JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}sub_order_total_local`))),2);
    const localStorageTotal         = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}total_order_value_storage`)) === null? null: JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}total_order_value_storage`));
    const orderAmountDiscountValue  = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_amount_number`)) === null ? null: JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_amount_number`));
    const orderFilter               = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}filter`));
    const deliveryFeeLocalStorage   = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_fee`)) === null ? null : getAmountConvertToFloatWithFixed(JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_fee`)),2);
    const getCouponCode             = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}applied_coupon`));

    const couponCodes               = parseInt(getCouponCode.length) > parseInt(0) ? getCouponCode : couponDiscountapplied;
    const updatedDeliveryTime       = moment(`${moment().format("YYYY-MM-DD")} ${deliverytime}`,"YYYY-MM-DD HH:mm:ss");

    let orderFromDatabaseGUID = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_guid`));

    const customerInformationInLocalStorage = {
      email: customerDetailObj?.email,
      phone: customerDetailObj?.phone,
      lastname: customerDetailObj?.lastname,
      firstname: customerDetailObj?.firstname,
      deliverytime: deliverytime,
      doorhousename: customerDetailObj?.doorhousename,
      isbysmsclicked: customerDetailObj?.isBySmsClicked,
      isbyemailclicked: customerDetailObj?.isByEmailClicked,
      driverinstruction: customerDetailObj?.driverinstruction,
    };

    setLocalStorage(`${BRANDSIMPLEGUID}customer_information`,customerInformationInLocalStorage);

    const customerAuth = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}websiteToken`))
    const customerTemp = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

    const filterAddress = customerTemp?.addresses?.find(address => address?.is_default_address === 1)

    const data = {
      customer:           customerAuth === null ? 0 : customerTemp?.id,
      address:            customerAuth === null ? 0 : filterAddress?.id,
      due:                due,
      email:              customerDetailObj?.email,
      phone:              customerDetailObj?.phone,
      street1:            street1,
      street2:            street2,
      postcode:           postcode,
      lastname:           customerDetailObj?.lastname,
      firstname:          customerDetailObj?.firstname,
      password:           customerDetailObj?.password,
      store:              storeGUID,
      brand:              BRAND_GUID,
      order:              cartdata,
      filterId:           orderFilter === null ? selectedFilter?.id : orderFilter.id,
      filterName:         orderFilter === null ? selectedFilter?.name : orderFilter.name,
      partner:            PARTNER_ID,
      total_order:        localStorageTotal === null? getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2): getAmountConvertToFloatWithFixed(JSON.parse(localStorageTotal),2),
      deliverytime:       deliverytime,
      doorhousename:      customerDetailObj?.doorhousename,
      isbysmsclicked:     toggleObjects?.isBySmsClicked,
      
      isbyemailclicked:   toggleObjects?.isByEmailClicked,
      driverinstruction:  customerDetailObj?.driverinstruction,
      sub_total_order:    subTotalOrderLocal,
      
      
      orderAmountDiscount_guid: orderAmountDiscountValue,
      delivery_estimate_time:   updatedDeliveryTime._i,
      
      // delivery_estimate_time: moment(deliverytime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
      delivery_fee:             deliveryFeeLocalStorage,
      coupons:                  couponCodes,
      order_guid:               orderFromDatabaseGUID !== null ? JSON.parse(orderFromDatabaseGUID) : null,
      is_verified:              booleanObj?.isCustomerVerfied
    };
    
    if (orderFromDatabaseGUID !== null) { 
      patchMutation(data) 
      return
    }

    storeMutation(data)

  }

  const onStoreSuccess = (data) => {
    // first check the order guid id in localStorage if it is null then store information then update them.
    const responseData = data?.data?.data?.order?.order_total;
    if (data?.data?.status === "success") 
    {
      setLocalStorage(`${BRANDSIMPLEGUID}order_guid`,data?.data?.data?.order?.external_order_id);
      if (parseFloat(responseData) === parseFloat(0.0)) 
      {
        route.push(`/track-order/${data?.data?.data?.order?.external_order_id}`);
        return;
      }
      route.push(`/payment/${data?.data?.data?.order?.external_order_id}`);
    }
  }

  const onStoreError = (error) => {
    console.error("Store error:", error);
    
    setErrormessage("There is something went wrong!. Please refresh and try again.")
  }

  const { isLoading: storeLoading, isError: storeError, reset: storeReset, isSuccess: storeSuccess, mutate: storeMutation } = usePostMutationHook('customer-store',`/store-customer-details`,onStoreSuccess, onStoreError)

  const onPatchSuccess = (data) => {
    const responseData = data?.data?.data?.order?.order_total;
    if (data?.data?.status === "success") 
    {
      setLocalStorage(`${BRANDSIMPLEGUID}order_guid`,data?.data?.data?.order?.external_order_id);
      if (parseFloat(responseData) === parseFloat(0.0)) 
      {
        route.push(`/track-order/${data?.data?.data?.order?.external_order_id}`);
        return;
      }
      route.push(`/payment/${data?.data?.data?.order?.external_order_id}`);
    }
  }

  const onPatchError = (error) => {
    console.error("patch error:", error);
    
    setErrormessage("There is something went wrong!. Please refresh and try again.")
  }

  const {isLoading: patchLoading, isError: patchError, isSuccess: patchSuccess, reset: patchReset, mutate: patchMutation} = usePatchMutationHook('customer-update',`/update-customer-details`, onPatchSuccess, onPatchError)

  const loadingState = patchLoading || storeLoading
  return (
    <Fragment>
      <Header />
      <div className="place-order-container e5ald0m1m2amc5checkout-desk">
        <form className="place-order-form m3m4m5gim6checkout-desk" onSubmit={handlePayNow}>
            <div className="hmg1checkout-desk">
              <div className="hmg1mhb0checkout-desk">
                <div className="mimjepmkmlmmcheckout-desk">
                  <h3 className="eik5ekk6checkout-desk">
                    <span className="d1chekcout-desk-span">Delivery Details</span>
                  </h3>
                  <span style={{ color: "red", fontSize: "300" }}>
                    *Fields marked with an asterisk must be filled in to proceed.
                  </span>
                  <div>
                    <div className="d1g1checkout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="kgcheckout-desk">
                          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                            <g clipPath="url(#clip0)">
                              <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                            </g>
                            <defs>
                              <clipPath id="clip0">
                                <path transform="translate(2 2)"d="M0 0h20v20H0z"></path>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            {postcode}
                          </span>
                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                            <span style={{fontFamily: "UberMoveText",color: "#545454",}}>
                              {street1} {street2}
                            </span>
                          </p>
                        </div>

                        <button type="button" className="chcicjckhacheckout-desk-btn" name="isPostCodeClicked" onClick={handleToggles}>
                          {toggleObjects?.isPostCodeClicked ? "Edit" : "Save"}
                        </button>
                      </div>

                      {
                        !toggleObjects?.isPostCodeClicked && 
                        <div className="btautrackorder-postcode-edit">
                          <input type="text" className="strtpostcode" defaultValue={street1} />
                          <input type="text" className="strtpostcode" defaultValue={street2} />
                          <div className="strtpostcode-btn">
                            <input type="text" className="strtpostcode" defaultValue={postcode} />
                            <button type="button" className="change_postcode_btn" name="isChangePostcodeClicked" onClick={handleToggles}>Change postcode</button>
                          </div>
                        </div>
                      }
                      <div className="alcheckout-desk">
                        <div className="spacer _40"></div>
                        <div className="edhtb9d1checkout-desk"></div>
                      </div>
                    </div>

                    <div className="d1g1checkout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="kgcheckout-desk">
                          <svg aria-hidden="true"focusable="false"viewBox="0 0 26 26"className="cxcwd0d1checkout-svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z"></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add door number
                            <span style={{ color: "red" }}>*</span>
                          </span>
                          {
                            !toggleObjects?.isDoorInputDisplayClicked && 
                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                {customerDetailObj?.doorhousename}
                              </span>
                            </p>
                          }
                        </div>

                        <button type="button" name="isDoorInputDisplayClicked" className="chcicjckhacheckout-desk-btn" onClick={handleToggles}>
                          {toggleObjects?.isDoorInputDisplayClicked ? "Save" : "Add"}
                        </button>
                      </div>

                      {
                        toggleObjects?.isDoorInputDisplayClicked && 
                        <div className="btaucheckout-window">
                          <input type="text" ref={addDoorNumberRef} placeholder="Enter door number or name" name="doorhousename" value={customerDetailObj?.doorhousename} className={`door_number ${parseInt(customerDetailObj?.doorhousename?.length) > parseInt(0)? "parse-success": "parse-erorr"}`} onChange={handleInputs}/>
                        </div>
                      }
                      <div className="alcheckout-desk">
                        <div className="spacer _40"></div>
                        <div className="edhtb9d1checkout-desk"></div>
                      </div>
                    </div>

                    <div className="d1g1checkout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="kgcheckout-desk">
                          <svg aria-hidden="true" focusable="false" viewBox="0 0 26 26" className="cxcwd0d1checkout-svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z"></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add driver instructions
                          </span>
                          {
                            !toggleObjects?.isAddDriverInstructionClicked && 
                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                {customerDetailObj?.driverinstruction}
                              </span>
                            </p>
                          }
                        </div>

                        <button type="button" name="isAddDriverInstructionClicked" className="chcicjckhacheckout-desk-btn" onClick={handleToggles}>
                          {toggleObjects?.isAddDriverInstructionClicked ? "Save" : "Add"}
                        </button>
                      </div>

                      {
                        toggleObjects?.isAddDriverInstructionClicked && 
                        <div className="btaucheckout-window">
                          <textarea
                            rows="2"
                            spellCheck="false"
                            className="door_number"
                            name="driverinstruction"
                            value={customerDetailObj?.driverinstruction}
                            placeholder="Add delivery instructions"
                            aria-label="Add delivery instructions"
                            onChange={handleInputs}
                          />
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <hr className="edfhmthtcheckout-desk"></hr>
                <div className="mimjepmkmlmmcheckout-desk">
                  <h3 className="eik5ekk6checkout-desk">
                    <span className="d1chekcout-desk-span">Contact Details</span>
                  </h3>

                  <div className="d1g1checkout-desk">
                    <div className="allzc5checkout-desk">
                      <div className="f2checkout-desk">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add email address
                          <span style={{ color: "red" }}>*</span>
                        </span>
                        {
                          !toggleObjects?.isEmailInputToggle && 
                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                            <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                              {customerDetailObj?.email}
                            </span>
                          </p>
                        }
                      </div>

                      <button type="button" name="isEmailInputToggle" className="chcicjckhacheckout-desk-btn" onClick={handleToggles}>
                        {toggleObjects?.isEmailInputToggle ? "Save" : "Add"}
                      </button>
                    </div>

                    {
                      toggleObjects?.isEmailInputToggle && 
                      <div className="btaucheckout-window">
                        <input
                          required
                          type="email"
                          value={customerDetailObj?.email}
                          name="email"
                          placeholder="Enter email"
                          onChange={handleInputs}
                          className={`email-checkout ${customerDetailObj?.email ? "parse-success": "parse-erorr"}`}
                        />
                      </div>
                    }
                    <div className="alcheckout-desk">
                      <div className="spacer _40"></div>
                      <div className="edhtb9d1checkout-desk"></div>
                    </div>
                  </div>

                  <div className="d1g1checkout-desk">
                    <div className="allzc5checkout-desk">
                      <div className="f2checkout-desk">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add phone number <span style={{ color: "red" }}>*</span>
                        </span>
                        {
                          !toggleObjects?.isPhoneinputToggle && 
                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                            <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                              {customerDetailObj?.phone}
                            </span>
                          </p>
                        }
                      </div>

                      <button type="button" className="chcicjckhacheckout-desk-btn" name="isPhoneinputToggle" onClick={handleToggles}>
                        {toggleObjects?.isPhoneinputToggle ? "Save " : "Add"}
                      </button>
                    </div>

                    {
                      toggleObjects?.isPhoneinputToggle && 
                      <div className="btaucheckout-window">
                        <input
                          type="number"
                          name="phone"
                          value={customerDetailObj?.phone}
                          onChange={handleInputs}
                          placeholder="Enter phone number"
                          className={`email-checkout ${parseInt(customerDetailObj?.phone?.length) > parseInt(0) ? "parse-success" : "parse-erorr"}`}
                        />
                      </div>
                    }
                    <div className="alcheckout-desk">
                      <div className="spacer _40"></div>
                      <div className="edhtb9d1checkout-desk"></div>
                    </div>
                  </div>

                  <div className="d1g1checkout-desk">
                    <div className="allzc5checkout-desk">
                      <div className="f2checkout-desk">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add name <span style={{ color: "red" }}>*</span>
                        </span>
                        {
                          !toggleObjects?.isFirstnameToggle && 
                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                            <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                              {customerDetailObj?.firstname} {customerDetailObj?.lastname}
                            </span>
                          </p>
                        }
                      </div>

                      <button type="button" className="chcicjckhacheckout-desk-btn" name="isFirstnameToggle" onClick={handleToggles}>
                        {toggleObjects?.isFirstnameToggle ? "Save" : "Add"}
                      </button>
                    </div>

                    {
                      toggleObjects?.isFirstnameToggle && 
                      <>
                        <div className="btaucheckout-window">
                          <input
                            type="text"
                            value={customerDetailObj?.firstname}
                            name="firstname"
                            onChange={handleInputs}
                            placeholder="Enter first name"
                            style={{ marginBottom: "4px" }}
                            className={`email-checkout ${parseInt(customerDetailObj?.firstname?.length) > parseInt(0)? "parse-success": "parse-erorr"}`}
                          />
                        </div>

                        <div className="btaucheckout-window">
                          <input
                            type="text"
                            value={customerDetailObj?.lastname}
                            name="lastname"
                            onChange={handleInputs}
                            placeholder="Enter last name"
                            className={`email-checkout ${parseInt(customerDetailObj?.lastname?.length) > parseInt(0)? "parse-success": "parse-erorr"}`}
                          />
                        </div>
                      </>
                    }
                    <div className="alcheckout-desk">
                      <div className="spacer _40"></div>
                      <div className="edhtb9d1checkout-desk"></div>
                    </div>
                  </div>
                </div>

                <hr className="edfhmthtcheckout-desk"></hr>
                <div className="mimjepmkmlmmcheckout-desk">
                  <h3 className="eik5ekk6checkout-desk">
                    <span className="d1chekcout-desk-span">
                      Delivery Estimate
                    </span>
                  </h3>
                  <div className="g8checkout-desk">
                    <div className="oagdalc5o7obc9b1npcheckout-desk">
                      <div className="ale7c5k8hbocheckout-desk">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <title>Calendar</title>
                          <path fillRule="evenodd" clipRule="evenodd" d="M23 8V4h-3V1h-3v3H7V1H4v3H1v4h22Zm0 15H1V10h22v13ZM8 14H5v3h3v-3Z" fill="currentColor"></path>
                        </svg>
                      </div>

                      <div className="ald0fwc5checkout-desk">
                        <h3 className="alamk3checkout-desk-h3">
                          <div className="alc5checkout-desk">
                            <span className="chd2cjd3checkout-desk-span">
                              Schedule
                            </span>
                          </div>
                          <select value={moment(deliverytime).format("HH:mm A")} className="bubvbwbdbxbybkaubzc0checkout-window-input" onChange={handleDeliveryTime}>
                            {
                              listtime?.map((time, index) => {
                                return (
                                  (moment(time?.time,"HH:mm").format("HH:mm")   >= moment(openingtime,"HH:mm").format("HH:mm") && moment(closingtime,"HH:mm").format("HH:mm")  >= moment(time?.time,"HH:mm").format("HH:mm")) && 
                                  (
                                    <option key={index} defaultValue={time?.time}>
                                      {moment(time?.time, "HH:mm A").format("HH:mm A")}
                                    </option>
                                  )
                                );
                              })
                            }
                          </select>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {
                  parseInt(saveMyDetailsError.length) > parseInt(0) && (
                    <p style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",marginBottom: "10px",}}>{saveMyDetailsError}</p>
                  )
                }

                {
                  toggleObjects?.isAuthed === false &&
                  <div className='mimjepmkmlmmcheckout-desk'>
                    <div className="allzc5checkout-desk">
                      <div className="f2checkout-desk">
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div> 
                      <input type="checkbox" className="agaxlqdflacheckout-desk-input"></input>

                      <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isavefasterdetailsclicked ? "mch" : ""}`} onClick={() => handleSaveMyDetails(!isavefasterdetailsclicked)}>
                        <div className="spacer _16"></div>
                        <div className="d1alfwllcheckout-desk">
                          <div className="ald1ame7lmlncheckout-desk">
                            <div className="alaqcheckout-desk">
                              <div className="alamjiencheckout-desk">
                                <div className="chcicjckh6checkout-desk">Save my details for faster checkout next time</div>
                                <div className="spacer _8"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>

                    {
                      isavefasterdetailsclicked &&
                      <>
                        <div className='chcicwd3undersavefastercheckout'>
                          <div className='toundersavefastercheckout'>
                            <div className="eik4ekk5g8undersavefastercheckout">
                              <span className="h3euh4eimfekfdundersavefastercheckout-span">{Message}</span>
                            </div>
                            {
                              toggleObjects?.isCustomerHasPassword === false &&
                              <>
                                <div className="btaundersavefastercheckout">
                                  {/* <label className='password-label'><span style={{color: "red"}}>*</span>Password: </label> */}
                                  <label className='password-label'><span style={{color: "red"}}>*</span></label>
                                  <input type="password" placeholder="Enter password" name="password" value={customerDetailObj?.password} className="undersavecheckoutinput" onChange={handleInputs}/>
                                </div>
                                
                                <div className="already-have-account" style={{margin: "1vh"}}>
                                  <p>
                                      Already have account?. &nbsp;
                                  </p>
                                  <a href="/login" className="sign-in-account">Sign In</a>
                                </div>
                              </>
                            }
                            <div className='alh2amenc9jdundersavefastercheckout'>
                              {
                                toggleObjects?.isCustomerHasPassword  || toggleObjects?.isLoginShow ?
                                  <button type="button" className='agloundersavefastercheckout' disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleLogin}>Login</button>
                                :
                                  <button type="button" className='agloundersavefastercheckout' disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleRegisteration}>Register</button>
                              }
                              <button type="button" className='coasgundersavefastercheckout' disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={() => setIsavefasterdetailsclicked(!isavefasterdetailsclicked)}>Continue as guest user</button>
                            </div>
                          </div>
                        </div>
                      
                      </>
                    }
                  </div>
                }

                <hr className="edfhmthtcheckout-desk"></hr>
                <div className="mimjepmkmlmmcheckout-desk">
                  <div className="d1g1checkout-desk">
                    <div className="allzc5checkout-desk">
                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          When you place your order, we will send you occasional
                          marketing offers and promotions. Please select below if
                          you do not want to receive this marketing.
                        </span>
                      </div>
                    </div>

                    <div className="almycheckout-desk">
                      <div className="allzc5checkout-desk" onClick={() => setIsbyemailclicked(!isbyemailclicked)}>
                        <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                        <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isbyemailclicked ? "mch" : ""}`}>
                          <div className="spacer _16"></div>
                          <div className="d1alfwllcheckout-desk">
                            <div className="ald1ame7lmlncheckout-desk">
                              <div className="alaqcheckout-desk">
                                <div className="alamjiencheckout-desk">
                                  <div className="chcicjckh6checkout-desk">
                                    By Email
                                  </div>
                                  <div className="spacer _8"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div className="spacer _48"></div>
                      <div className="allzc5checkout-desk" onClick={() => setIsbysmsclicked(!isbysmsclicked)}>
                        <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                        <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isbysmsclicked ? "mch" : ""}`}>
                          <div className="spacer _16"></div>
                          <div className="d1alfwllcheckout-desk">
                            <div className="ald1ame7lmlncheckout-desk">
                              <div className="alaqcheckout-desk">
                                <div className="alamjiencheckout-desk">
                                  <div className="chcicjckh6checkout-desk">
                                    By SMS
                                  </div>
                                  <div className="spacer _8"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>

            <div className="d1g1checkout-desk">
              <div className="gmgngoalamgpcheckout-desk">
                <div className="gqcheckout-desk">
                  {
                    parseInt(customerDetailObj?.PayNowBottomError?.length) > parseInt(0) && 
                    <p style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",marginBottom: "10px",}}>
                      {customerDetailObj?.PayNowBottomError}
                    </p>
                  }
                  {
                    isLocationBrandOnline !== null ?

                    <div className="boh7bqh8checkout-desk">
                      <button 
                        type="submit" 
                        className="h7brboe1checkout-btn"

                        style={{
                          background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                          color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                          border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                        }}

                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                      >
                        Pay Now
                      </button>
                    </div>
                    :
                    <div className="boh7bqh8checkout-desk">
                      <button type="submit" className="h7brboe1checkout-btn" style={{background: "rgb(12 12 12)"}}>
                        Next
                      </button>
                    </div>
                  }
                </div>
                <div className="eeb0checkout-desk">
                  <div className="b5grekcheckout-desk">
                    {/* <hr className='f7bsh1f8checkout-hr'></hr> */}
                    <div className="bkhybmh8aldfcheckout-desk">
                      <div className="albcaqcheckout">Total</div>
                      &pound;{getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2)}
                    </div>

                    {/* 
                      *
                      *Display all the allergens End
                    **/}

                    <div className="itcheckout-desk">
                      <div className="bodgbqdhfncheckout-desk">
                        <div className="bodgbqdhb1checkout-desK">
                          <span className="bodgbqdhiucheckout-desk">
                            <span className="bodge1exiucheckout-desk-span">
                              ALLERGIES:
                            </span>
                            If you or someone you’re ordering for has an allergy,
                            please contact the merchant directly to let them know.
                          </span>
                        </div>
                      </div>
                      <div className="e6h3checkout-desk"></div>

                      <div className="bodgbqdhfncheckout-desk">
                        <div className="bodgbqdhb1checkout-desK">
                          <span className="bodgbqdhiucheckout-desk">
                            If you’re not around when the delivery person arrives,
                            they’ll leave your order at the door. By placing your
                            order, you agree to take full responsibility for it
                            once it’s delivered. Orders containing alcohol or
                            other restricted items may not be eligible for leave
                            at door and will be returned to the store if you are
                            not available.
                          </span>
                        </div>
                      </div>
                      <div className="e6h3checkout-desk"></div>

                      <div className="bodgbqdhfncheckout-desk">
                        <div className="bodgbqdhb1checkout-desK">
                          <span className="bodgbqdhiucheckout-desk">
                            Whilst we, and our restaurant partners, have safety
                            measures to mitigate food safety risk, couriers may be
                            delivering more than one order so we cannot eliminate
                            the risk of cross-contamination from allergens.
                          </span>
                        </div>
                      </div>
                      <div className="e6h3checkout-desk"></div>
                    </div>

                    {/* 
                    *
                    *
                    * Display all the allergens End. 
                    **/}
                  </div>
                </div>
                <div className="gqcheckout-desk"></div>
              </div>
            </div>
        </form>
      </div>
    
      {/* Mobile View */}
      <div className="afcheckout">
        <form  onSubmit={handlePayNow}>
          <div className="">
            <div className="cwcxcyczd0d1checkout">
              <div className="hmg1checkout-desk">
                <div className="hmg1mhb0checkout-desk">
                  <div className="mimjepmkmlmmcheckout-desk">
                    <h3 className="eik5ekk6checkout-desk">
                      <span className="d1chekcout-desk-span">
                        Delivery Details
                      </span>
                    </h3>
                    <span style={{ color: "red", fontSize: "300" }}>
                      *Fields marked with an asterisk must be filled in to
                      proceed.
                    </span>
                    <div>
                      <div className="d1g1checkout-desk">
                        <a className="allzc5checkout-desk">
                          <div className="kgcheckout-desk">
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout" >
                              <g clipPath="url(#clip0)">
                                <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <path transform="translate(2 2)" d="M0 0h20v20H0z" ></path>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>

                          <div className="alamd1g1checkout-desk">
                            <span className="chd2cjd3b1checkout-desk">
                              {postcode}
                            </span>
                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                              <span style={{ fontFamily: "UberMoveText", color: "#545454", }}>
                                {street1} {street2}
                              </span>
                            </p>
                          </div>

                          <button className="chcicjckhacheckout-desk-btn" onClick={handlePostcodeEdit}>
                            {deliverydetailtext}
                          </button>
                        </a>
                        {toggleObjects?.isPostCodeClicked && (
                          <div className="btautrackorder-postcode-edit">
                            <input type="text" className="strtpostcode" defaultValue={street1} />

                            <input type="text" className="strtpostcode" defaultValue={street2} />

                            <div className="strtpostcode-btn">
                              <input
                                type="text"
                                className="strtpostcode"
                                defaultValue={postcode}
                              />

                              <button className="change_postcode_btn" onClick={() =>setIschangepostcodeclicked(!ischangepostcodeclicked)}>
                                Change postcode
                              </button>

                            </div>
                          </div>
                        )}
                        <div className="alcheckout-desk">
                          <div className="spacer _40"></div>
                          <div className="edhtb9d1checkout-desk"></div>
                        </div>
                      </div>

                      <div className="d1g1checkout-desk">
                        <div className="allzc5checkout-desk">
                          <div className="kgcheckout-desk">
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 26 26" className="cxcwd0d1checkout-svg" >
                              <path fillRule="evenodd" clipRule="evenodd" d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z" ></path>
                            </svg>
                          </div>

                          <div className="alamd1g1checkout-desk">
                            <span className="chd2cjd3b1checkout-desk">
                              Add door number <span style={{ color: "red" }}>*</span>
                            </span>
                            {!toggleObjects?.isDoorInputDisplayClicked && (
                              <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                  {customerDetailObj?.doorhousename}
                                </span>
                              </p>
                            )}
                          </div>

                          <button type="button" className="chcicjckhacheckout-desk-btn" name="isDoorInputDisplayClicked" onClick={handleToggles}>
                            {toggleObjects?.isDoorInputDisplayClicked ? "Save" : "Add"}
                          </button>
                        </div>

                        {
                          toggleObjects?.isDoorInputDisplayClicked &&
                          <div className="btaucheckout-window">
                            <input
                              type="text"
                              ref={addDoorNumberRef}
                              value={customerDetailObj?.doorhousename}
                              name="doorhousename"
                              onChange={handleInputs}
                              placeholder="Enter door number or name"
                              className={`door_number ${customerDetailObj?.doorhousename ? "parse-success" : "parse-erorr"}`}
                            />
                          </div>
                        }

                        <div className="alcheckout-desk">
                          <div className="spacer _40"></div>
                          <div className="edhtb9d1checkout-desk"></div>
                        </div>
                      </div>

                      <div className="d1g1checkout-desk">
                        <div className="allzc5checkout-desk">
                          <div className="kgcheckout-desk">
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 26 26" className="cxcwd0d1checkout-svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z" ></path>
                            </svg>
                          </div>

                          <div className="alamd1g1checkout-desk">
                            <span className="chd2cjd3b1checkout-desk">
                              Add driver instructions
                            </span>
                            {
                              !toggleObjects?.isAddDriverInstructionClicked && 
                              <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk" >
                                <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                  {customerDetailObj?.driverinstruction}
                                </span>
                              </p>
                            }
                          </div>
                          <button type="button" name="isAddDriverInstructionClicked" className="chcicjckhacheckout-desk-btn" onClick={handleToggles}>
                            {toggleObjects?.isAddDriverInstructionClicked ? "Save" : "Add"}
                          </button>
                        </div>

                        {
                          toggleObjects?.isAddDriverInstructionClicked && 
                          <div className="btaucheckout-window">
                            <textarea
                              rows="2"
                              spellCheck="false"
                              className="door_number"
                              name="driverinstruction"
                              value={customerDetailObj?.driverinstruction}
                              placeholder="Add delivery instructions"
                              aria-label="Add delivery instructions"
                              onChange={handleInputs}
                            />
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  <hr className="edfhmthtcheckout-desk"></hr>
                  <div className="mimjepmkmlmmcheckout-desk">
                    <h3 className="eik5ekk6checkout-desk">
                      <span className="d1chekcout-desk-span">
                        Contact Details
                      </span>
                    </h3>
                    <div className="d1g1checkout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="f2checkout-desk">
                          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                            <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add email address
                            <span style={{ color: "red" }}>*</span>
                          </span>
                          {!toggleObjects?.isEmailInputToggle && (
                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                {customerDetailObj?.email}
                              </span>
                            </p>
                          )}
                        </div>

                        <button type="button" className="chcicjckhacheckout-desk-btn" name="isEmailInputToggle" onClick={handleToggles}>
                          {toggleObjects?.isEmailInputToggle ? "Save" : "Add"}
                        </button>
                      </div>

                      {toggleObjects?.isEmailInputToggle && (
                        <div className="btaucheckout-window">
                          <input
                            required
                            type="email"
                            name="email"
                            value={customerDetailObj?.email}
                            placeholder="Enter email"
                            onChange={handleInputs}
                            className={`email-checkout ${customerDetailObj?.email ? "parse-success" : "parse-erorr"}`}
                          />
                      
                        </div>
                      )}
                      <div className="alcheckout-desk">
                        <div className="spacer _40"></div>
                        <div className="edhtb9d1checkout-desk"></div>
                      </div>
                    </div>

                    <div className="d1g1checkout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="f2checkout-desk">
                          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                            <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add phone number
                            <span style={{ color: "red" }}>*</span>
                          </span>
                          {
                            !toggleObjects?.isPhoneinputToggle && 
                            <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                {customerDetailObj?.phone}
                              </span>
                            </p>
                          }
                        </div>
                        <button type="button" className="chcicjckhacheckout-desk-btn" name="isPhoneinputToggle" onClick={handleToggles}>
                          {toggleObjects?.isPhoneinputToggle ? "Save" : "Add"}
                        </button>
                      </div>

                      {toggleObjects?.isPhoneinputToggle && (
                        <div className="btaucheckout-window">
                          <input
                            type="number"
                            name="phone"
                            value={customerDetailObj?.phone}
                            placeholder="Enter phone number"
                            className={`email-checkout ${parseInt(customerDetailObj?.phone?.length) > parseInt(0)? "parse-success": "parse-erorr"}`}
                            onChange={handleInputs}
                          />
                        </div>
                      )}
                      <div className="alcheckout-desk">
                        <div className="spacer _40"></div>
                        <div className="edhtb9d1checkout-desk"></div>
                      </div>
                    </div>

                    <div className="d1g1checkout-desk">
                      <a className="allzc5checkout-desk">
                        <div className="f2checkout-desk">
                          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                            <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add name <span style={{ color: "red" }}>*</span>
                          </span>
                          {
                            !toggleObjects?.isFirstnameToggle && 
                            <p  data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                {customerDetailObj?.firstname} {customerDetailObj?.lastname}
                              </span>
                            </p>
                          }
                        </div>
                        <button type="button" name="isFirstnameToggle" className="chcicjckhacheckout-desk-btn" onClick={handleToggles}>
                          {toggleObjects?.isFirstnameToggle ? "Save" : "Add"}
                        </button>
                      </a>

                      {toggleObjects?.isFirstnameToggle && (
                        <>
                          <div className="btaucheckout-window">
                            <input type="text" value={customerDetailObj?.firstname} name="firstname" placeholder="Enter first name" onChange={handleInputs} style={{ marginBottom: "4px" }} className={`email-checkout ${parseInt(customerDetailObj?.firstname?.length) > parseInt(0)? "parse-success" : "parse-erorr"}`}/>
                          </div>

                          <div className="btaucheckout-window">
                            <input type="text" value={customerDetailObj?.lastname} name="lastname" placeholder="Enter last name" onChange={handleInputs} className={`email-checkout ${parseInt(customerDetailObj?.lastname?.length) > parseInt(0)? "parse-success": "parse-erorr"}`} />
                          </div>
                        </>
                      )}
                      <div className="alcheckout-desk">
                        <div className="spacer _40"></div>
                        <div className="edhtb9d1checkout-desk"></div>
                      </div>
                    </div>
                  </div>

                  <hr className="edfhmthtcheckout-desk"></hr>
                  <div className="mimjepmkmlmmcheckout-desk">
                    <h3 className="eik5ekk6checkout-desk">
                      <span className="d1chekcout-desk-span">
                        Delivery Estimate
                      </span>
                    </h3>
                    <div className="g8checkout-desk">
                      <div className="oagdalc5o7obc9b1npcheckout-desk">
                        <div className="ale7c5k8hbocheckout-desk">
                          <svg width="20"height="20"viewBox="0 0 24 24"fill="none">
                            <title>Calendar</title>
                            <path fillRule="evenodd" clipRule="evenodd" d="M23 8V4h-3V1h-3v3H7V1H4v3H1v4h22Zm0 15H1V10h22v13ZM8 14H5v3h3v-3Z"fill="currentColor"></path>
                          </svg>
                        </div>

                        <div className="ald0fwc5checkout-desk">
                          <h3 className="alamk3checkout-desk-h3">
                            <div className="alc5checkout-desk">
                              <span className="chd2cjd3checkout-desk-span">
                                Schedule
                              </span>
                            </div>
                            <select value={moment(deliverytime, "HH:mm A").format("HH:mm A")} className="bubvbwbdbxbybkaubzc0checkout-window-input" onChange={handleDeliveryTime}>
                              {
                                listtime?.map((time, index) => {
                                  return (
                                    moment(time?.time, "HH:mm").format("HH:mm") >= moment(openingtime, "HH:mm").format("HH:mm") && moment(closingtime, "HH:mm").format("HH:mm") >= moment(time?.time, "HH:mm").format("HH:mm") &&
                                      <option key={index} defaultValue={time?.time}>
                                        {moment(time?.time, "HH:mm A").format("HH:mm A")}
                                      </option>
                                  );
                                })
                              }
                            </select>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {
                    parseInt(saveMyDetailsError.length) > parseInt(0) && 
                    <p style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",marginBottom: "10px",}}>
                      {saveMyDetailsError}
                    </p>
                  }

                  {
                    toggleObjects?.isAuthed === false &&
                    <div className="mimjepmkmlmmcheckout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="f2checkout-desk">
                          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                            <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                          </svg>
                        </div>
                        <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                        <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isavefasterdetailsclicked ? "mch" : ""}`} onClick={() => handleSaveMyDetails(!isavefasterdetailsclicked)}>
                          <div className="spacer _16"></div>
                          <div className="d1alfwllcheckout-desk">
                            <div className="ald1ame7lmlncheckout-desk">
                              <div className="alaqcheckout-desk">
                                <div className="alamjiencheckout-desk">
                                  <div className="chcicjckh6checkout-desk">
                                    Save my details for faster checkout next time
                                  </div>
                                  <div className="spacer _8"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  }

                  {
                    isavefasterdetailsclicked && 
                    <div className="chcicwd3undersavefastercheckout">
                      <div className="toundersavefastercheckout">
                        <div className="eik4ekk5g8undersavefastercheckout">
                          <span className="h3euh4eimfekfdundersavefastercheckout-span">
                            {Message}
                          </span>
                        </div>

                        {
                          toggleObjects?.isCustomerHasPassword === false && 
                          <>
                            <div className="btaundersavefastercheckout">
                              <label className="password-label">
                                {/* <span style={{ color: "red" }}>*</span>Password:{" "} */}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input type="password" name="password" value={customerDetailObj?.password} onChange={handleInputs} placeholder="Enter password" className="undersavecheckoutinput" />
                            </div>
                            <div className="already-have-account" style={{margin: "1vh"}}>
                              <p>
                                Already have account?. &nbsp;
                              </p>
                              <a href="/login" className="sign-in-account">Sign In</a>
                            </div>
                          </>
                        }

                        <div className="alh2amenc9jdundersavefastercheckout">
                          {
                            toggleObjects?.isCustomerHasPassword || toggleObjects?.isLoginShow ? 
                            <button type="button" className="agloundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleLogin}>{toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working...": "Login"}</button>
                          : 
                            <button type="button" className="agloundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleRegisteration}>{toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working...": "Register"}</button>
                          }
                          <button type="button" className="coasgundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={() => setIsavefasterdetailsclicked(!isavefasterdetailsclicked)}>
                            Continue as guest user
                          </button>
                        </div>
                      </div>
                    </div>
                  }

                  <hr className="edfhmthtcheckout-desk"></hr>
                  <div className="mimjepmkmlmmcheckout-desk">
                    <div className="d1g1checkout-desk">
                      <div className="allzc5checkout-desk">
                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            When you place your order, we will send you occasional
                            marketing offers and promotions. Please select below
                            if you do not want to receive this marketing.
                          </span>
                        </div>
                      </div>

                      <div className="almycheckout-desk">
                        <div className="allzc5checkout-desk" onClick={() => setIsbyemailclicked(!isbyemailclicked)}>
                          <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                          <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isbyemailclicked ? "mch" : ""}`}>
                            <div className="spacer _16"></div>
                            <div className="d1alfwllcheckout-desk">
                              <div className="ald1ame7lmlncheckout-desk">
                                <div className="alaqcheckout-desk">
                                  <div className="alamjiencheckout-desk">
                                    <div className="chcicjckh6checkout-desk">
                                      By Email &nbsp;
                                    </div>
                                    <div className="spacer _8"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>

                        <div className="spacer _48"></div>
                        <div className="allzc5checkout-desk" onClick={() => setIsbysmsclicked(!isbysmsclicked)}>
                          <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                          <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isbysmsclicked ? "mch" : ""}`}>
                            <div className="spacer _16"></div>
                            <div className="d1alfwllcheckout-desk">
                              <div className="ald1ame7lmlncheckout-desk">
                                <div className="alaqcheckout-desk">
                                  <div className="alamjiencheckout-desk">
                                    <div className="chcicjckh6checkout-desk">
                                      By SMS &nbsp;
                                    </div>
                                    <div className="spacer _8"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="dtcxcybgd0d1checkout">
            <div className="bocubqcve9checkout">
              <div className="bocubqcvb1checkout">
                <span className="bocubqcvgycheckout">
                  <span className="bocudfdhgy">ALLERGIES:&nbsp; &nbsp;</span>
                  If you or someone you’re ordering for has an allergy, please
                  contact the merchant directly to let them know.
                </span>
              </div>
            </div>

            <div className="dxgvcheck"></div>

            <div className="bocubqcve9checkout">
              <div className="bocubqcvb1checkout">
                <span className="bocubqcvgycheckout">
                  If you’re not around when the delivery person arrives, they’ll
                  leave your order at the door. By placing your order, you agree
                  to take full responsibility for it once it’s delivered. Orders
                  containing alcohol or other restricted items may not be eligible
                  for leave at door and will be returned to the store if you are
                  not available.
                </span>
              </div>
            </div>
            <div className="dxgvcheck"></div>

            <div className="bocubqcve9checkout">
              <div className="bocubqcvb1checkout">
                <span className="bocubqcvgycheckout">
                  Whilst we, and our restaurant partners, have safety measures to
                  mitigate food safety risk, couriers may be delivering more than
                  one order so we cannot eliminate the risk of cross-contamination
                  from allergens.
                </span>
              </div>
            </div>

            <div className="dxgvcheck"></div>
          </div>

          <div className="">
            <div className="akgzcheckout">
              <div className="atbaagcheckout">
                <div className="">
                  {
                    parseInt(customerDetailObj?.PayNowBottomError?.length) > parseInt(0) && 
                    <p style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",marginBottom: "10px",}}>
                      {customerDetailObj?.PayNowBottomError}
                    </p>
                  }

                  {
                    isLocationBrandOnline ?

                    <button 
                      type="submit" 
                      className="fwbrbocheckout-place-order"
                      style={{
                        background: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                        color: isHover ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                        border: isHover ? `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}` : `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                      }}

                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                    >
                      Pay Now
                    </button>
                  :
                    <button type="submit" className="fwbrbocheckout-place-order" style={{background: "rgb(12,12,12)"}}>
                      Next
                    </button>
                  }
                  
                  <div style={{ height: "10px" }}></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Modal Testing */}

      {
        toggleObjects?.isChangePostcodeClicked && 
        <div className="modal-delivery-details">
          <div className="modal-delivery-details-level-one-div">
            <div className="modal-delivery-details-level-one-div-height"></div>
            <div className="modal-delivery-details-level-one-div-dialog">
              <div></div>
              <div className="modal-delivery-details-level-one-div-dialog-header">
                <div className="delivery-empty-div"></div>
                <button type="button" className="delivery-modal-close-button" name="isChangePostcodeClicked" onClick={handleToggles}>
                  <div className="delivery-modal-close-button-svg-div">
                    <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" >
                      <path d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" fill="#000000" ></path>
                    </svg>
                  </div>
                </button>
              </div>
              {toggleObjects?.isChangePostcodeClicked && <PostcodeModal />}
            </div>
            <div className="modal-delivery-details-level-one-div-height"></div>
          </div>
        </div>
      }
      {
        isOTP && <OtpVerifyModal {...{setIsOTP}}/>
      }
      <Footer />
      {loadingState && <Loader loader={loadingState} />}
    </Fragment>
  );
}
export default UserForm;
