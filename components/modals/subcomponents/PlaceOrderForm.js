"use client";
import HomeContext from "@/contexts/HomeContext";

import { ContextCheckApi } from "@/app/layout";
import { useLoginMutationHook, usePostMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_SIMPLE_GUID, BRAND_GUID, IMAGE_URL_Without_Storage, PARTNER_ID, axiosPrivate, DELIVERY_ID } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, setLocalStorage, validatePhoneNumber } from "@/global/Store";
import { listtime, round15 } from "@/global/Time";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, PaymentRequestButtonElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";

export default function PlaceOrderForm({setModalObject, handleBoolean, sectionNumber,isNextButtonReadyToClicked, isCreditCardButtonClicked, handleObject}) 
{
    const addDoorNumberRef = useRef(null);
    const router = useRouter()
  
    //   const {isauth, setIsauth} = useContext(AuthContext)
  
    const [errormessage, setErrormessage] = useState("");
    const {
      loader,
      setLoader,
      booleanObj,
      dayOpeningClosingTime,
      isTimeToClosed,
      couponDiscountApplied,
      totalOrderAmountValue,
      setTotalOrderAmountValue,
      setIsTimeToClosed,
      storeGUID,
      cartData,
      postcode,
      street1,
      street2,
      isLocationBrandOnline,
  
      setIsLocationBrandOnline,
      setAtFirstLoad,
      setIsCartBtnClicked,
      setHeaderCartBtnDisplay,
      setHeaderPostcodeBtnDisplay,
      websiteModificationData,
      setCartData,
      selectedFilter,
      isScheduleClicked,
      scheduleMessage,
      isScheduleIsReady,
      isScheduleForToday,
      scheduleTime,

      storeToDayOpeningTime,
      storeToDayClosingTime,
    } = useContext(HomeContext);
      
    const [myCardElement, setMyCardElement] = useState(null);
    
    const { setMetaDataToDisplay} = useContext(ContextCheckApi)
    
    const [isPayNowClicked, setIsPayNowClicked] = useState(false);
    
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
        setMetaDataToDisplay(metaHeadingData)
      }
    }, [websiteModificationData]);
      
    const [isHover, setIsHover] = useState(false);
    const [isOTP, setIsOTP] = useState(false);
        
    const [toggleObjects, setToggleObjects] = useState({
      isCustomerHasPassword: false,
      isSuccessFullyLogin: false,
      isOTPReady: false,
      isLoginShow: true,
      authButtonDisabledUntilPasswordChanged: true,
      isPhoneToggle: true,
      isAdddoororHouseClicked: true,
      isDoorInputDisplayClicked: true,
      isAdddriverInstructionClicked: false,
      isEmailToggle: true,
      isEmailInputToggle:true,
      isPhoneToggle:true,
      isPhoneinputToggle:true,
      isfirstNameToggle:true,
      isLastNameToggle: true,
      isPostCodeClicked: true,
      isChangePostcodeClicked: false,
  
      isBySmsClicked: false,
      isByEmailClicked: false,
  
      isAuthed: false
    });
      
    const [isBySmsClicked, setIsBySmsClicked] = useState(false);
    const [isByEmailClicked, setIsByEmailClicked] = useState(false);
    const [otpCodeData, setOtpCodeData] = useState(0);
    
    // Get value states
  
    const [customerDetailObj, setCustomerDetailObj] = useState({
      id: 0,
      email: "",
      phone: "",
      password: "",
      lastName: "",
      firstName: "",
      doorHouseName: "",
      driverInstruction: "",
      openingTime: "",
      closingTime: "",
      deliveryTimeFrom: "",
      deliveryTimeEnd: "",
  
      phoneError: "",
      PayNowBottomError: "",
      saveMyDetailsError: "",
    });
      
    const [openingTime, setOpeningTime] = useState("");
    const [closingTime, setClosingTime] = useState("");
    const [deliveryTimeFrom, setDeliveryTimeFrom] = useState("");
    const [deliveryTimeEnd, setDeliveryTimeEnd] = useState("");
  
    const [deliveryTime, setDeliveryTime] = useState("");
    const [due, setDue] = useState("due");
    const [Message, setMessage] = useState("");
  
    // Change Postcode and Address states
    const [deliveryDetailText, setDeliveryDetailText] = useState("Edit");
    const [isPostcodeEditClicked, setIsPostcodeEditClicked] = useState(false);
  
    
    const [isChangePostcodeClicked, setIsChangePostcodeClicked] = useState(false);
    const [isSaveFasterDetailsClicked, setIsSaveFasterDetailsClicked] = useState(false);
      
    // Error states
    const [saveMyDetailsError, setSaveMyDetailsError] = useState("");
    const [isPayNowClickAble, setIsPayNowClickAble] = useState(false);
    
    useEffect(() => {
      if(selectedFilter.id === DELIVERY_ID)
      {
        if (
          (customerDetailObj?.email || "").length > 0 &&
          (customerDetailObj?.firstName || "").length > 0 &&
          (customerDetailObj?.lastName || "").length > 0 &&
          (customerDetailObj?.phone || "").length > 0 &&
          (customerDetailObj?.doorHouseName || "").length > 0 &&
          isSaveFasterDetailsClicked === false
        ) {
          setIsPayNowClickAble(true);
        } else {
          setIsPayNowClickAble(false);
        }

      }
      else
      {
        if (
          (customerDetailObj?.email || "").length > 0 &&
          (customerDetailObj?.firstName || "").length > 0 &&
          (customerDetailObj?.lastName || "").length > 0 &&
          (customerDetailObj?.phone || "").length > 0 &&
          isSaveFasterDetailsClicked === false
        ) {
          setIsPayNowClickAble(true);
        } else {
          setIsPayNowClickAble(false);
        }
      }
    }, [
      customerDetailObj,
      isSaveFasterDetailsClicked,
      selectedFilter
    ]);
    
    const handleInputs = useCallback((event) => {
      const { value, name } = event.target

      switch (name) {
        case "password":
          setToggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
          setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
          break;
        case "email":
          setIsSaveFasterDetailsClicked(false)
          setCustomerDetailObj((prevData) => ({...prevData, [name]: value}))
          break;
        case 'phone':
          setIsSaveFasterDetailsClicked(false)
          let validPhone = validatePhoneNumber(value)

          setCustomerDetailObj((prevData) => ({...prevData, [name]: validPhone}))
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
      
      
    function handlePostcodeEdit() {
      setIsPostcodeEditClicked(!isPostcodeEditClicked);
      setDeliveryDetailText(deliveryDetailText === "Edit" ? "Save" : "Edit");
    }
      
    // Function to validate the email format
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    function handleLogin() {
      // navigate("/login");
      
      setToggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: true}))
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
          setToggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
          window.alert("Enter valid email address.")
          return
        }
      }
      
      if(!toggleObjects?.isCustomerHasPassword && customerDetailObj?.password?.length === parseInt(0))
      {
        setToggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
        window.alert("Some fields need to be filled.")
        return 
      }
  
      if(customerDetailObj?.email?.length === parseInt(0) || customerDetailObj?.phone?.length === parseInt(0))
      {
  
        setToggleObjects((prevData) => ({...prevData, authButtonDisabledUntilPasswordChanged: false}))
        window.alert("Some fields need to be filled.")
        return 
      }
      
      loginMutation(loginData)
    }
      
    /**
     * Login Post Mutation
     */
    const onLoginSuccess = (data) => {

      setMessage("")
      setIsSaveFasterDetailsClicked(false)

      // if(!toggleObjects?.isCustomerHasPassword)
      if(parseInt(data?.data?.data?.customer) === parseInt(0))
      {
        setIsOTP(true)
        setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, data?.data?.data?.customer)
        return
      }
  
      setToggleObjects((prevData) => ({...prevData, isSuccessFullyLogin: true, isLoginShow: false, authButtonDisabledUntilPasswordChanged: false, isAuthed: true,isCustomerHasPassword: true}))

      setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, data?.data)

      const loginDataToLocationStorage = {
        email: customerDetailObj.email,
        phone: customerDetailObj.phone,
        lastName: customerDetailObj.lastName,
        firstName: customerDetailObj.firstName,
        deliveryTime: deliveryTime,
        doorHouseName: customerDetailObj.doorHouseName,
        isBySmsClicked: isBySmsClicked,
        isByEmailClicked: isByEmailClicked,
        driverInstruction: customerDetailObj.driverInstruction,
        street1: street1,
        street2: street2,
        postcode: postcode,
      };
  
      setLocalStorage(`${BRAND_SIMPLE_GUID}customer_information`,loginDataToLocationStorage);
      setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, data?.data?.data?.customer)
      handleBoolean(true,'isCustomerVerified')
      // route.push('/')
    }
  
    const onLoginError = (error) => {
      isPayNowClickAble(false)
      setToggleObjects((prevData) => ({...prevData,isSuccessFullyLogin: false,  authButtonDisabledUntilPasswordChanged: false}))
      window.alert(error?.response?.data?.error)
      return
    }
  
    const {mutate: loginMutation, isLoading: loginLoading, isError: loginError, isSuccess: loginSuccess, reset: loginReset} = useLoginMutationHook('login', '/website-login', onLoginSuccess, onLoginError)
  
    const handleRegister = () => {
  
      const getLocationId = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))
      const validPostcode = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`))
      const registerData = {
        location: getLocationId?.display_id,
        brand: BRAND_GUID,
        first_name: customerDetailObj?.firstName,
        last_name: customerDetailObj?.lastName,
        email: customerDetailObj?.email,
        phone: customerDetailObj?.phone,
        password: customerDetailObj?.password,
        postcode: validPostcode,
      }
  
      registerMutation(registerData)
    }
  
    /**
     * 
     * User no need to redirect can save information related to order.
     */
    const onRegisterError = (error) => {
      window.alert("There is something went wrong!. Please refresh and try again.")
      return
    }
  
    const onRegisterSuccess = (data) => {
      
      // redirect to OTP screen verify.
      // once otp is verified, then get the customer password with confirm-password field.
      setIsOTP(true)
      setCustomerDetailObj((prevData) => ({...prevData, id: data?.data?.data?.customer?.id}))
      // setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, data?.data?.data?.customer)
      
      handleBoolean(false,'isCustomerVerified')
      setToggleObjects((prevData) => ({...prevData, isOTPReady: true ,isSuccessFullyLogin: false, isLoginShow: false, authButtonDisabledUntilPasswordChanged: false, isAuthed: false ,isCustomerHasPassword: true}))
    }
      
    const {mutate: registerMutation, isLoading: registerLoading, isError: registerError, isSuccess: registerSuccess, reset: registerReset} = usePostMutationHook('register', '/website-register', onRegisterSuccess, onRegisterError)
  
    const handleOTP = () => {

      const data = {
        customerId: customerDetailObj?.id,
        otpCode: otpCodeData
      }

      otpMutation(data)
    }

    const onOTPError = (error) => {
      window.alert("Invalid OTP Code.")
      return
    }
  
    const onOTPSuccess = (data) => {
      // redirect to OTP screen verify.
      // once otp is verified, then get the customer password with confirm-password field.
      setIsOTP(true)
      setMessage("You have been verified successfully now please login.")
      setToggleObjects((prevData) => ({...prevData, isOTPReady: false ,isSuccessFullyLogin: false, isLoginShow: true, authButtonDisabledUntilPasswordChanged: false, isAuthed: false,isCustomerHasPassword: false}))
    }
      
    const {mutate: otpMutation, isLoading: otpLoading, isError: otpError, isSuccess: otpSuccess, reset: otpReset} = usePostMutationHook('otpVerified', '/website-otp-verified', onOTPSuccess, onOTPError)

    async function fetchLocationDeliveryEstimate() {
      // Get the current day name
      try {
        const placeOrderGetStoreGUID = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`));
  
        const data = {
          location_guid: placeOrderGetStoreGUID === null ? storeGUID : placeOrderGetStoreGUID?.display_id,
          brand_guid: BRAND_GUID,
          day_number: moment().isoWeekday(),
          partner: PARTNER_ID,
        };
  
        const response = await axiosPrivate.post(`/website-delivery-time`, data);
  
        const { brandExists } = response?.data?.data
        
        setIsLocationBrandOnline(brandExists)
        // Write logic if the closing is up or come closer than show information.brandDeliveryEstimatePartner
        var startTime   = response?.data?.data?.brandDeliveryEstimatePartner?.start_time;
        var endTime     = response?.data?.data?.brandDeliveryEstimatePartner?.end_time;
  
        var timeForm    = response?.data?.data?.brandDeliveryEstimatePartner?.time_from;
        var deliveryTo  = response?.data?.data?.brandDeliveryEstimatePartner?.time_to;

        // console.log("response data is here:", response);
        
        var collectionAfter = response?.data?.data?.brandDeliveryEstimatePartner?.collection_after_opening_from;
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
        
        // if (Date.parse(time_to) < Date.parse(current_date)) {
        //   setIsTimeToClosed(true);
        //   return;
        // }
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
  
        if(selectedFilter.id === DELIVERY_ID)
        {
          if (parseFloat(start_time.split(":")[1]) == 60) {
            var temp_time = start_time.split(":")[0] + ":59";
            
          } else {
            var temp_time = start_time;
          }
        }
        else
        {
          const today = moment().format("YYYY-MM-DD HH:mm:ss");
          
          const todayTime = moment(today, 'YYYY-MM-DD HH:mm:ss');
          const formatTime = todayTime.add(collectionAfter, 'minutes');
          var temp_time = moment(formatTime).format("HH:mm");
        }

        // temp_time = tConvert(temp_time);
        if(parseInt(isScheduleForToday) > parseInt(0))
        {
          setDeliveryTime(moment(scheduleTime).format("HH:mm"))
        }else
        {
          setDeliveryTime(temp_time);
        }
  
        setOpeningTime(temp_time);
  
        // setOpeningTime(response?.data?.data?.brandDeliveryEstimatePartner?.start_time)
        setClosingTime(response?.data?.data?.brandDeliveryEstimatePartner?.end_time);
        setDeliveryTimeFrom(response?.data?.data?.brandDeliveryEstimatePartner?.time_from);
        setDeliveryTimeEnd(response?.data?.data?.brandDeliveryEstimatePartner?.time_to);
        if (parseInt(listtime.length) > parseInt(0)) {}
    
      } catch (error) {
      
      }
    }
        
    useEffect(() => {
      const checkedLogin = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
      
      if(checkedLogin !== null)
      {
        setToggleObjects((prevData) => ({...prevData, isAuthed: true, isCustomerHasPassword: true}))
      }
      else
      {
        setToggleObjects((prevData) => ({...prevData, isAuthed: false, isCustomerHasPassword: false}))
      } 
  
      const customer = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`))
  
      if(customer !== undefined && customer !== null)
      {
        const filterAddress = customer?.addresses?.find(address => address?.is_default_address === 1)
        const addressDetail = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))
        setCustomerDetailObj((prevData) => ({...prevData,
          email: customer?.email,
          phone: customer?.phone,
          lastName: customer?.last_name,
          firstName: customer?.first_name,
          doorHouseName: filterAddress?.house_no_name !== undefined ? filterAddress?.house_no_name : addressDetail?.doorHouseName,
          driverInstruction: filterAddress?.driver_instructions !== undefined? filterAddress?.driver_instructions : addressDetail?.driverInstruction,
          street1: street1,
          street2: street2,
          postcode: postcode,
        }));

      }
      
    }, [booleanObj?.isCustomerVerified]);
        
    useEffect(() => {
      const checkTheCart = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}cart`))
  
      if(checkTheCart === null || checkTheCart === undefined || parseInt(checkTheCart.length) === parseInt(0))
      {
        setLoader(true)
        window.location.reload(true);
        window.location.href = "/"
        return
      }
      // Check if the cart has not any item then back to home page.
      // Check the brand is active or not.
      const useAuthenticate = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
  
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
  
      const placeOrderLocalStorageTotal = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`));
      setTotalOrderAmountValue(placeOrderLocalStorageTotal === null ? totalOrderAmountValue : getAmountConvertToFloatWithFixed(JSON.parse(placeOrderLocalStorageTotal),2));
  
      setIsCartBtnClicked(false);
      fetchLocationDeliveryEstimate();
      
  
      setHeaderCartBtnDisplay(false);
      setHeaderPostcodeBtnDisplay(false);
  
      const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`));
  
      if (getCustomerInformation !== null) 
      {
        setCustomerDetailObj((prevData) => ({
          ...prevData, 
            doorHouseName: getCustomerInformation.doorHouseName,
            driverInstruction: getCustomerInformation.driverInstruction,
            email: getCustomerInformation.email,
            phone: getCustomerInformation.phone,
            firstName: getCustomerInformation.firstName,
            lastName: getCustomerInformation.lastName,
        }))
        
        setIsBySmsClicked(getCustomerInformation?.isBySmsClicked)
        setIsByEmailClicked(getCustomerInformation?.isByEmailClicked)
        setToggleObjects((prevData) => ({...prevData, isByEmailClicked: getCustomerInformation.isByEmailClicked, isBySmsClicked: getCustomerInformation.isBySmsClicked}))
        setDeliveryTime(getCustomerInformation.deliveryTime);
      }
      else
      {
        const getStoreHouseName = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}house_no_name`))

        if(getStoreHouseName)
        {
          setCustomerDetailObj((prevData) => ({
            ...prevData, 
              doorHouseName: getStoreHouseName,
          }))
        }

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

    useEffect(() => {
      // First i need to check the selected order filter is deliver then if block otherwise else block for collection.
      if(selectedFilter.id === DELIVERY_ID)
      {
        if(sectionNumber === 1)
        {
          if(parseInt(customerDetailObj?.doorHouseName?.length) > parseInt(0) && parseInt(street1.length) > parseInt(0) && parseInt(street2.length) > parseInt(0) && parseInt(postcode.length) > parseInt(0))
          {
            handleObject(true, "isNextButtonReadyToClicked")
          }
        }
      }
      // else if(isScheduleClicked === false)
      // {
      //   handleObject(2,"sectionNumber")
      //   handleObject(true, "isNextButtonReadyToClicked")
      // }
      else
      {
        // handleObject(1,"sectionNumber")
        handleObject(true, "isNextButtonReadyToClicked")
      }
    }, [sectionNumber, customerDetailObj?.doorHouseName, street1, street2, postcode, selectedFilter,isScheduleClicked]);
    
      
    /**
     * This useEffect reset all user information after a specific time End.
     */
  
    /**
     * Register customer login Details for faster login.
     */
  
    const onCustomerSuccess = (data) => {
      
      if (data?.data?.data?.customer === null) 
      {
        setToggleObjects((prevData) => ({...prevData, isCustomerHasPassword: false,  isLoginShow: false, authButtonDisabledUntilPasswordChanged: false}))
        setMessage("Register yourself to get more coupons and discounts on your favourite meals.");
      } 
      else
      {

        if (parseInt(data?.data?.data?.customer?.is_verified) === parseInt(0) ) 
        {
          setToggleObjects((prevData) => ({...prevData, isCustomerHasPassword: false, isLoginShow: true, authButtonDisabledUntilPasswordChanged: false}))
          setCustomerDetailObj((prevData) => ({...prevData, password: null}))
          setMessage("The phone/email you have entered is already registered 1.");
          // return
        }
        else
        {
          setToggleObjects((prevData) => ({...prevData, isCustomerHasPassword:  false, isLoginShow: true, authButtonDisabledUntilPasswordChanged: false}))
          setMessage("The phone/email you have entered is already registered 2.");
          // return
        }
    
          // setCustomerDetailObj((prevData) => ({...prevData, password: data?.data?.data?.customer?.password}))
          // setToggleObjects((prevData) => ({...prevData, isCustomerHasPassword: false,  isLoginShow: true}))
          // setMessage("The phone/email you have entered is already registered.");
      }
    }
  
    const onCustomerError = (error) => {
      setIsSaveFasterDetailsClicked(false);
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
      
      if (customerDetailObj?.doorHouseName === "" || customerDetailObj?.email === "" || customerDetailObj?.phone === "" || customerDetailObj?.firstName === "" || customerDetailObj?.lastName === "") 
      {
        setSaveMyDetailsError("Please check * (asterisk) mark field and fill them.");
        setIsSaveFasterDetailsClicked(false);
        return;
      }
      
      setSaveMyDetailsError("");
      setIsSaveFasterDetailsClicked(isActive);
      
      setIsPayNowClickAble(false) // when save my details for faster checkout true
      if(isActive === true)
      {
        checkCustomerMutation({
          email: customerDetailObj?.email,
          phone: customerDetailObj?.phone,
        })
      }
    }

    // This submit send request to Database and stripe.
    const hitSmsAndEmailCall = async (orderId) =>
    {
      const url = window.location.origin
      const pathname = "track-order"
      setLoader(true)
      try 
      {
        const data = {
          guid: orderId,
          url: url,
          pathname: pathname
        } 

        const response = await axiosPrivate.post(`/send-sms-and-email`, data)

        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        setCartData([])
        // setLoader(false)
        // if(response?.data?.status === "success")
        // {
        // first check this is delivery order or collection order.
        if (selectedFilter?.id === DELIVERY_ID)
          {
            window.location.href = `/track-order/${orderId}`
            return
          }
          window.location.href = `/thank-you/${orderId}`
        
        // }

      } 
      catch (error) 
      {
        // window.alert(error?.response?.data?.error)
        setLoader(false)
        setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
        window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
        setCartData([])
        
        if (selectedFilter?.id === DELIVERY_ID)
        {
          window.location.href = `/track-order/${orderId}`
          return
        }
        window.location.href = `/thank-you/${orderId}`
      }
    }
    
    // This method will hit when payment successfully done, to send sms and email to user.
    const afterPaymentSavedOrderUpdate = async (orderId,paymentIntent) =>
    {
      try 
      {
        setLoader(true)

        const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))

        const data = {
          guid: orderId,
          amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
          stripeid: paymentIntent.id,
          visitorGUID: visitorInfo.visitorId,
        }  

        const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)
        // Here need to hit sms and email call.

        if(response?.data?.status === "success")
        {
          hitSmsAndEmailCall(orderId)
        }
      } 
      catch (error) 
      {
        setLoader(false)
      }
    }

    const handleSubmit = async (event) => 
    {
      event.preventDefault();

      if(!isScheduleClicked && isScheduleIsReady)
      {
        window.alert(`We are currently closed. To schedule your order for << ${scheduleMessage} >>, go to checkout.`)
        window.location.href = "/"
        return
      }
      setIsPayNowClicked(true)
      setLoader(true)
      
      const dayNumber = moment().day();
      const dateTime = moment().format("HH:mm");
      const dayName = moment().format("dddd");
      
      let updatedDeliveryTime = moment(`${moment().format("YYYY-MM-DD")} ${deliveryTime}`,"YYYY-MM-DD HH:mm:ss");
      
      // const cardElement = elements.getElement(CardElement);
      const cardElementNumber = elements.getElement(CardNumberElement)
      setMyCardElement(cardElementNumber);
      // setMyCardElement(cardElement)
      // const { token, error,type } = await stripe.createToken(cardElement);
      // const { token, error,type } = await stripe.createToken({type: 'card'});
      // if(token)
      // {
      //   setMyCardElement(token)
      // }

      // if (error) 
      // {
      //   setIsPayNowClicked(false)
      //   setPaymentError(error.message);
      //   setLoader(false)
      //   return
      // }
      // Use this to generate a token from split fields
      const { token, error } = await stripe.createToken(cardElementNumber);

      if (error) {
        setIsPayNowClicked(false);
        setPaymentError(error.message);
        setLoader(false);
        return;
      }
        
      if(isSaveFasterDetailsClicked || isLocationBrandOnline === null)
      {
        setIsPayNowClicked(false)
        setLoader(false)
        return
      }
    
      if (!stripe || !elements) 
      {
        setLoader(false)
        return;
      }

      if(selectedFilter.id === DELIVERY_ID)
      {
        if (parseInt(customerDetailObj?.doorHouseName?.length) === parseInt(0)) 
        {
          setIsPayNowClicked(false)
          setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: "Please check * (asterisk) mark field and fill them."}))
          return;
        }
      }
      else
      {
        if (parseInt(customerDetailObj?.email?.length) === parseInt(0) || parseInt(customerDetailObj?.phone?.length) === parseInt(0) || parseInt(customerDetailObj?.firstName.length) === parseInt(0) ||parseInt(customerDetailObj?.lastName?.length) === parseInt(0)) 
        {
          setIsPayNowClicked(false)
          setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: "Please check * (asterisk) mark field and fill them."}))
          return;
        }
      }

      
      
      setLoader(true)
      setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: ""}))
        
      const subTotalOrderLocal        = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)) === null ? null: getAmountConvertToFloatWithFixed(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)),2);
      const localStorageTotal         = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`)) === null? null: JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`));
      const orderAmountDiscountValue  = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_number`)) === null ? null: JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_amount_number`));
      const orderFilter               = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`));
      const deliveryFeeLocalStorage   = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_fee`)) === null ? null : getAmountConvertToFloatWithFixed(JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_fee`)),2);
      const getCouponCode             = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}applied_coupon`));
  
      const couponCodes               = parseInt(getCouponCode?.length) > parseInt(0) ? getCouponCode : couponDiscountApplied;
      
  
      let orderFromDatabaseGUID = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}order_guid`));
      // send card payment details
    
  
      const customerInformationInLocalStorage = {
        email: customerDetailObj.email,
        phone: customerDetailObj.phone,
        lastName: customerDetailObj.lastName,
        firstName: customerDetailObj.firstName,
        deliveryTime: deliveryTime,
        doorHouseName: customerDetailObj.doorHouseName,
        isBySmsClicked: isBySmsClicked,
        isByEmailClicked: isByEmailClicked,
        driverInstruction: customerDetailObj.driverInstruction,
        street1: street1,
        street2: street2,
        postcode: postcode,
      };
    
      setLocalStorage(`${BRAND_SIMPLE_GUID}customer_information`,customerInformationInLocalStorage);
  
      const customerAuth = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
      const customerTemp = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`))
  
      const filterAddress = customerTemp?.addresses?.find(address => address?.is_default_address === 1)

      const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      const data = {
        customer:           customerAuth === null ? 0 : customerTemp?.id,
        address:            customerAuth === null ? 0 : filterAddress?.id,
        due:                due,
        email:              customerDetailObj?.email,
        phone:              customerDetailObj?.phone,
        street1:            street1,
        street2:            street2,
        postcode:           postcode,
        lastName:           customerDetailObj?.lastName,
        firstName:          customerDetailObj?.firstName,
        password:           customerDetailObj?.password,
        store:              storeGUID,
        brand:              BRAND_GUID,
        order:              cartData,
        filterId:           orderFilter === null ? selectedFilter?.id : orderFilter.id,
        filterName:         orderFilter === null ? selectedFilter?.name : orderFilter.name,
        partner:            PARTNER_ID,
        total_order:        localStorageTotal === null? getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2): getAmountConvertToFloatWithFixed(JSON.parse(localStorageTotal),2),
        deliveryTime:       deliveryTime,
        doorHouseName:      customerDetailObj?.doorHouseName,
        isBySmsClicked:     isBySmsClicked,
        
        isByEmailClicked:   isByEmailClicked,
        driverInstruction:  customerDetailObj?.driverInstruction === undefined ? "" : customerDetailObj?.driverInstruction,
        sub_total_order:    subTotalOrderLocal,
        
        
        orderAmountDiscount_guid: orderAmountDiscountValue,
        is_schedule_order: isScheduleForToday,
        delivery_estimate_time: (parseInt(isScheduleForToday) > parseInt(0) ? scheduleTime : updatedDeliveryTime._i),
        
        // delivery_estimate_time: moment(deliveryTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
        delivery_fee:             deliveryFeeLocalStorage,
        coupons:                  couponCodes,
        order_guid:               orderFromDatabaseGUID !== null ? orderFromDatabaseGUID : null,
        is_verified:              booleanObj?.isCustomerVerified,

        
        order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
        token: token.id,
        // order: orderId,
        brand: BRAND_GUID,
        type: "card",
        is_paid_via_wallet: 0,
        visitorGUID: visitorInfo.visitorId
      };
      
      if (orderFromDatabaseGUID !== null) { 
        postMutation(data) 
        return
      }
  
      storeMutation(data)
    };
    
    const onStoreSuccess = async (data) => {
      // first check the order guid id in localStorage if it is null then store information then update them.
      const responseData = data?.data?.data?.order?.order_total;
      const { clientSecret, type } = data?.data?.data;
      
      const orderGUID = data?.data?.data?.order?.external_order_id

      setIsPayNowClicked(false)
      if (data?.data?.status === "success") 
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
        // if (parseFloat(responseData) === parseFloat(0.0)) 
        // {
        //   route.push(`/track-order/${orderGUID}`);
        //   return;
        // }
        // route.push(`/payment/${orderGUID}`);
        setModalObject((prevData) => ({
            ...prevData, 
            isPaymentReady: true,
            orderGUI: orderGUID
        }))
      }

      if(type === "card")
      {
        const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))
        const city = getCustomerInformation?.street2?.split(',')[0].trim();
  
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: myCardElement,
            billing_details: {
              name: `${getCustomerInformation?.firstName} ${getCustomerInformation?.lastName}`,
              email: getCustomerInformation?.email,
              address: {
                line1: `${getCustomerInformation?.doorHouseName} ${getCustomerInformation?.street1} ${getCustomerInformation?.street1}`,
                city: city,
                postal_code: getCustomerInformation?.postcode,
                country: 'GB',
              },
            },
          },
        });
  
        if (result.error) 
        {
          setLoader(false)
          setPaymentError(result.error.message);
          return
        } 
        else 
        {
          afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent)
        }
      }
      else
      {
        
        try
        {
          // ✅ Finish wallet UI prompt
          ev.complete("success");
      
          // ✅ Confirm payment with Stripe
          const result = await stripe.confirmCardPayment(clientSecret); // No payment_method object needed
      
          if (result.error) {
            alert("Payment failed");
          } else {
            afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent);
          }
        } catch (err) {
          ev.complete("fail");
          alert("Payment failed");
        }
      }

      handleBoolean(false, "isPlaceOrderButtonClicked")
    }
  
    const onStoreError = (error) => {
      console.error("Store error:", error);
      
      setIsPayNowClicked(false)
      // if(error?.response?.data?.status.includes("success"))
      // {
      //   route.push(`/payment/${data?.data?.data?.order?.external_order_id}`);
      // }
      setErrormessage("There is something went wrong!. Please refresh and try again.")
      window.alert("There is something went wrong!. Please refresh and try again.")
      return
    }
  
    const { 
      isLoading: storeLoading, 
      isError: storeError, 
      reset: storeReset, 
      isSuccess: storeSuccess, 
      mutate: storeMutation 
    } = usePostMutationHook('customer-store',`/store-customer-details`,onStoreSuccess, onStoreError)

    const onPatchSuccess = async (data) => {
      const responseData = data?.data?.data?.order?.order_total;
      setIsPayNowClicked(false)
      
      handleBoolean(false, "isPlaceOrderButtonClicked")
      const { clientSecret, type } = data?.data?.data;
      
      const orderGUID = data?.data?.data?.order?.external_order_id
      setIsPayNowClicked(false)
      if (data?.data?.status === "success") 
      {
        setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
        // if (parseFloat(responseData) === parseFloat(0.0)) 
        // {
        //   route.push(`/track-order/${orderGUID}`);
        //   return;
        // }
        // handleBoolean(true, "isPayNowClickAble")
        setModalObject((prevData) => ({
            ...prevData, 
            isPaymentReady: true,
            orderGUI: orderGUID
        }))
        // route.push(`/payment/${orderGUID}`);
      }

      if(type === "card")
      {
        const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))
        const city = getCustomerInformation?.street2?.split(',')[0].trim();
  
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: myCardElement,
            billing_details: {
              name: `${getCustomerInformation?.firstName} ${getCustomerInformation?.lastName}`,
              email: getCustomerInformation?.email,
              address: {
                line1: `${getCustomerInformation?.doorHouseName} ${getCustomerInformation?.street1} ${getCustomerInformation?.street1}`,
                city: city,
                postal_code: getCustomerInformation?.postcode,
                country: 'GB',
              },
            },
          },
        });
        
        
        if (result.error) 
        {
          setLoader(false)
          setPaymentError(result.error.message);
          return
        } 
        else 
        {
          afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent)
        }
      }
      else
      {
        try
        {
          // ✅ Finish wallet UI prompt
          ev.complete("success");
      
          // ✅ Confirm payment with Stripe
          const result = await stripe.confirmCardPayment(clientSecret); // No payment_method object needed
      
          if (result.error) {
            alert("Payment failed");
          } else {
            afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent);
          }
        } catch (err) {
          ev.complete("fail");
          alert("Payment failed");
        }
      }
    }
  
    const onPatchError = (error) => {
      console.error("patch error:", error);
      setIsPayNowClicked(false)
      setErrormessage("There is something went wrong!. Please refresh and try again.")
      window.alert("There is something went wrong!. Please refresh and try again.")
      return
    }
  
    const {
      isLoading: patchLoading, 
      isError: postError, 
      isSuccess: postSuccess, 
      reset: postReset, 
      mutate: postMutation
    } = usePostMutationHook('customer-update',`/update-customer-details`, onPatchSuccess, onPatchError)
  
    const loadingState = patchLoading || storeLoading || loader

    const handleChangePostcode = () =>
    {
      setAtFirstLoad(true)
      handleBoolean(true,"isChangePostcodeButtonClicked")
      handleBoolean(false, "isPlaceOrderButtonClicked")
    }
    
    const handleOTPInput = (e) => {
      setOtpCodeData(e.target.value)
    }

    const handleStreetAddress = () => {

    }
    
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
        setMetaDataToDisplay(metaHeadingData)
      }
    }, [websiteModificationData]);
  
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);
    
    useEffect(() => {
      // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
      const timeoutId = setTimeout(() => {
        // Clear all items in localStorage
        localStorage.clear();
        window.location.reload(true);
        window.location.href = "/"
        setTimeout(() => {
          setLoader(false);
        }, 3000);
      }, 30 * 60 * 1000); 

      // Clear the timeout if the component is unmounted before 20 minutes
      return () => clearTimeout(timeoutId);
    });
    
    const handleCardNumberChange = (event) => {
      if (event.complete) {
        const expiryElement = elements?.getElement(CardExpiryElement)
        expiryElement?.focus()
      }
    }

    const handleCardExpiryChange = (event) => {
      if (event.complete) {
        const cvcElement = elements?.getElement(CardCvcElement)
        cvcElement?.focus()
      }
    }

    // console.log("store closing time:", storeToDayClosingTime, "delivery time", deliveryTime);

    return(
      <Fragment>
        {
          <form  
            onSubmit={handleSubmit}
            // style={{
            //     padding: "0px 40px 0px 40px"
            // }}
            className="checkout-form"
          >
            <div className="hmg1checkout-desk"
              // style={{
              //   height: "50vh",
              //   overflowY: "scroll",
              //   overflowX: "hidden"
              // }}
            >
              <div className="hmg1mhb0checkout-desk">

                <div className="mimjepmkmlmmcheckout-desk">
                  {
                    (selectedFilter.id === DELIVERY_ID && (!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1)) || (isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(2))) &&
                    <p style={{ color: "red", fontSize: "600", fontWeight: "bold", marginBottom: "8px"}}>
                      *Fields marked with an asterisk must be filled in to proceed.
                    </p>
                  }
                    
                  {
                    (isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(2)) &&

                    <>
                      <div className="d1g1checkout-desk" style={{ width: "94%"}}>
                        <div className="allzc5checkout-desk">
                          <div className="alamd1g1checkout-desk">

                            <div className="custom-form-group" >
                              <div className="chd2cjd3b1checkout-desk" style={{fontWeight: "600", fontSize: "18px"}}>
                                Email Address
                                <span style={{ color: "red" }}>*</span>

                                {
                                  !toggleObjects?.isEmailInputToggle && 
                                  <>
                                      &nbsp; &nbsp; &nbsp; &nbsp; 
                                      <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                          <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                              {customerDetailObj?.email}
                                          </span>
                                      </p>
                                  </>
                                }
                              </div>

                              {
                                toggleObjects?.isEmailInputToggle && 
                                <div className="checkout-window-form">
                                  <input
                                    required
                                    type="email"
                                    name="email"
                                    ref={addDoorNumberRef} 
                                    onChange={handleInputs}
                                    placeholder="Enter email"
                                    value={customerDetailObj?.email}
                                    className={`email-checkout ${customerDetailObj?.email ? "parse-success": "parse-erorr"}`}
                                  />
                                </div>
                              }
                            </div>
                          
                          </div>
                        </div>
                      </div>

                        
                      <div className="d1g1checkout-desk" style={{ width: "94%"}}>
                        <div className="allzc5checkout-desk">

                          <div className="alamd1g1checkout-desk">

                            <div className="custom-form-group">
                              <div className="chd2cjd3b1checkout-desk" style={{fontWeight: "600", fontSize: "18px"}}>
                                Full Name <span style={{ color: "red" }}>*</span>
                                {
                                  !toggleObjects?.isfirstNameToggle && 
                                  <>
                                    &nbsp; &nbsp; &nbps; &nbsp;
                                    <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                      <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                          {customerDetailObj?.firstName}
                                      </span>
                                    </p>
                                  </>
                                }
                              </div>

                            {
                              toggleObjects?.isfirstNameToggle && 
                              <div className="checkout-group-window-form">
                                <input
                                  type="text"
                                  value={customerDetailObj?.firstName}
                                  name="firstName"
                                  onChange={handleInputs}
                                  placeholder="Enter first name"
                                  style={{ marginBottom: "4px" }}
                                  className={`full-name-inputs ${parseInt(customerDetailObj?.firstName?.length) > parseInt(0)? "parse-success": "parse-erorr"}`}
                                />
                                  <input
                                  type="text"
                                  value={customerDetailObj?.lastName}
                                  name="lastName"
                                  onChange={handleInputs}
                                  placeholder="Enter last name"
                                  style={{ marginBottom: "4px" }}
                                  className={`full-name-inputs ${parseInt(customerDetailObj?.lastName?.length) > parseInt(0)? "parse-success": "parse-erorr"}`}
                                />
                              </div>
                            }
                            
                            </div>
                              
                          </div>
                    
                        </div>
                      </div>
                    
                      {/* <div className="d1g1checkout-desk" style={{ width: "94%"}}>
                          <div className="allzc5checkout-desk">

                              <div className="alamd1g1checkout-desk">

                                  <div className="custom-form-group">

                                    <div className="chd2cjd3b1checkout-desk" style={{fontWeight: "600", fontSize: "18px"}}>
                                      Last Name <span style={{ color: "red" }}>*</span>
                                      {
                                      !toggleObjects?.isLastNameToggle && 
                                      <> 
                                        &nbsp; &nbsp;&nbsp; &nbsp;
                                        <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                          <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                              {customerDetailObj?.lastName}
                                          </span>
                                        </p>
                                      </>
                                      }
                                    </div>

                                    {
                                      toggleObjects?.isLastNameToggle && 
                                      <div className="checkout-window-form">
                                        <input
                                          type="text"
                                          value={customerDetailObj?.lastName}
                                          name="lastName"
                                          onChange={handleInputs}
                                          placeholder="Enter last name"
                                          className={`email-checkout ${parseInt(customerDetailObj?.lastName?.length) > parseInt(0)? "parse-success": "parse-error"}`}
                                        />
                                      </div>
                                    }

                              
                                  </div>
                                  
                              </div>

                          </div>
                      </div> */}
                                    
                      <div className="d1g1checkout-desk" style={{ width: "94%"}}>

                        <div className="allzc5checkout-desk">

                          <div className="alamd1g1checkout-desk">
                            <div className="custom-form-group">
                              <div className="chd2cjd3b1checkout-desk" style={{fontWeight: "600", fontSize: "18px"}}>
                                Mobile Number <span style={{ color: "red" }}>*</span>
                                {
                                  !toggleObjects?.isPhoneinputToggle && 
                                  <>
                                      &nbsp; &nbsp; &nbsp; &nbsp;
                                      <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                          <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                          {customerDetailObj?.phone}
                                          </span>
                                    </p>
                                  </>
                                }
                              </div>

                              {
                                toggleObjects?.isPhoneinputToggle && 
                                <div className="checkout-window-form">
                                  <input
                                    type="number"
                                    name="phone"
                                    value={customerDetailObj?.phone}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleInputs}
                                    placeholder="Enter phone number"
                                    className={`email-checkout no-spinner ${parseInt(customerDetailObj?.phone?.length) > parseInt(0) ? "parse-success" : "parse-erorr"}`}
                                  />
                                </div>
                              }
                              
                            </div>
                          </div>

                        </div>

                      </div>
                    
                    </>
                  }

                  {
                    ((!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1)) && selectedFilter.id === DELIVERY_ID) &&
                    <>
                      <div className="d1g1checkout-desk" style={{ width: "94%"}}>
                        <div className="allzc5checkout-desk">

                          <div className="alamd1g1checkout-desk">
                            <div className="custom-form-group">
                              <div className="chd2cjd3b1checkout-desk" style={{fontWeight: "600", fontSize: "18px"}}>
                                Door Number <span style={{ color: "red" }}>*</span>
                                {
                                !toggleObjects?.isPhoneinputToggle && 
                                <>
                                  &nbsp; &nbsp; &nbsp; &nbsp;
                                  <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                    <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                      {customerDetailObj?.doorHouseName}
                                    </span>
                                  </p>
                                </>
                                }
                              </div>

                              {
                                toggleObjects?.isPhoneinputToggle && 
                                <div className="checkout-window-form">
                                  <input 
                                    type="text"
                                    placeholder="Enter door number or name" 
                                    name="doorHouseName" 
                                    value={customerDetailObj?.doorHouseName} 
                                    className={`door_number ${parseInt(customerDetailObj?.doorHouseName?.length) > parseInt(0)? "parse-success": "parse-erorr"}`} 
                                    onChange={handleInputs}
                                  />
                                </div>
                              }
                            
                            </div>
                          </div>
                            
                        </div>
                      </div>

                      <div className="d1g1checkout-desk" style={{ width: "94%"}}>
                        <div className="allzc5checkout-desk">

                            <div className="alamd1g1checkout-desk">
                                <div className="custom-form-group">
                                    <div className="chd2cjd3b1checkout-desk" style={{fontWeight: "600", fontSize: "18px"}}>
                                        Address <span style={{ color: "red" }}>*</span>
                                        {
                                        !toggleObjects?.isPhoneinputToggle && 
                                        <>
                                          &nbsp; &nbsp; &nbsp; &nbsp;
                                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk">
                                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                                  {customerDetailObj?.doorHouseName}
                                              </span>
                                          </p>
                                        </>
                                        }
                                    </div>

                                    {
                                        toggleObjects?.isPhoneinputToggle && 
                                        <div className="checkout-window-form">

                                            <div className="btautrackorder-postcode-edit" >
                                                <input type="text" className="strtpostcode" value={street1} onClick={() => handleStreetAddress}/>

                                                <input type="text" className="strtpostcode" value={street2} onClick={() => handleStreetAddress}/>

                                                <div className="strtpostcode-btn">
                                                    <input
                                                        type="text"
                                                        className="strtpostcode"
                                                        value={postcode}
                                                        onClick={() => handleStreetAddress}
                                                    />

                                                    <button type="button" className="change_postcode_btn" onClick={handleChangePostcode}>
                                                      Change postcode
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    }

                                
                                </div>
                            </div>
                        </div>
                      </div>

                      <div className="d1g1checkout-desk" style={{ width: "94%"}}>
                        <div className="allzc5checkout-desk">

                          <div className="alamd1g1checkout-desk">
                            <div className="custom-form-group">
                              <div className="chd2cjd3b1checkout-desk" style={{display: "flex", fontWeight: "600", fontSize: "18px"}}>
                                  Driver Instruction
                                  {
                                      !toggleObjects?.isPhoneinputToggle && 
                                      <>
                                          &nbsp; &nbsp; &nbsp; &nbsp;
                                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk" >
                                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                                  {customerDetailObj?.driverInstruction}
                                              </span>
                                          </p>
                                      </>
                                  }
                              </div>

                              {
                                <div className="checkout-window-form">
                                  <textarea
                                    rows={10}
                                    cols={30}
                                    spellCheck="false"
                                    onChange={handleInputs}
                                    className="door_number"
                                    name="driverInstruction"
                                    aria-label="Add delivery instructions"
                                    value={customerDetailObj?.driverInstruction}
                                    style={{
                                      paddingTop:" 5px",
                                      paddingLeft: "10px",
                                      height: "70px",
                                      fontSize: "17px"
                                    }}
                                    placeholder="Please don’t add notes relating to your food e.g. allergies or extra toppings. These notes are for your driver only."
                                  />
                                </div>
                              }

                            
                            </div>
                          </div>

                        </div>
                      </div>
                    </>
                  }
                  
                  {
                    (isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(2)) &&
                    <>
                      <div className="card-display" style={{ width: "94%"}}>

                        <div className="" style={{display: "flex", fontWeight: "600", fontSize: "18px"}}>
                          Credit Card
                        </div>

                        <div className="display-card">
                          <div className="card-number">
                            <CardNumberElement  onChange={handleCardNumberChange} options={{hidePostalCode: true, style: { base: {fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />

                          </div>
                          <div className="card-expiry">

                            <CardExpiryElement onChange={handleCardExpiryChange} options={{hidePostalCode: true, style: { base: {fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
                          </div>
                          <div className="card-cvc">
                            <CardCvcElement options={{hidePostalCode: true, style: { base: {fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
                          </div>

                          {/* <CardElement options={{hidePostalCode: true, style: { base: {fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} /> */}
                          {paymentError && <div style={{background: "#ed5858", color: "white", padding: "12px", borderRadius: "1px", marginTop: "10px"}}>{paymentError}</div>}
                        </div>

                      </div>
                      
                      
                    </>
                  }
                  
                  {
                    (!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1) && (isScheduleClicked === false || isScheduleClicked === true)) &&
                    <div className="d1g1checkout-desk" style={{ width: "94%"}}>

                      <div className="allzc5checkout-desk">

                        <div className="alamd1g1checkout-desk">
                          <div className="custom-form-group">
                            <div className="chd2cjd3b1checkout-desk" style={{display: "flex", fontWeight: "600", fontSize: "18px"}}>
                              
                              {
                                isScheduleClicked ?
                                  (selectedFilter.id === DELIVERY_ID) ?
                                    "Schedule delivery time"
                                  :
                                  "Schedule collection time"
                                :
                                (selectedFilter.id === DELIVERY_ID) ?
                                  "Estimated delivery time"  
                                :
                                  "Estimated collection time"
                              }
                              {
                                !toggleObjects?.isPhoneinputToggle && 
                                <>
                                  &nbsp; &nbsp; &nbsp; &nbsp;
                                  <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk" >
                                    <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                      {customerDetailObj?.driverInstruction}
                                    </span>
                                  </p>
                                </>
                              }
                            </div>

                            {
                              !toggleObjects?.isAdddriverInstructionClicked &&
                              <div className="checkout-window-form">
                                <select value={moment(deliveryTime, "HH:mm A").format("HH:mm A")} className="bubvbwbdbxbybkaubzc0checkout-window-input" onChange={handleDeliveryTime}>
                                  {
                                    listtime?.map((time, index) => {
                                        return (
                                        moment(time?.time, "HH:mm").format("HH:mm") >= moment(deliveryTime, "HH:mm").format("HH:mm") && moment(storeToDayClosingTime, "HH:mm").format("HH:mm") >= moment(time?.time, "HH:mm").format("HH:mm") &&
                                            <option key={index} defaultValue={time?.time}>
                                            {moment(time?.time, "HH:mm A").format("HH:mm A")}
                                            </option>
                                        );
                                    })
                                  }
                                </select>
                              </div>
                            }

                          </div>
                        </div>
                      
                      </div>

                    </div>
                  }
                </div>
                
                {
                  (isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(2)) &&
                  <>
                    {
                      parseInt(saveMyDetailsError.length) > parseInt(0) && 
                      <p style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",marginBottom: "1px",}}>
                        {saveMyDetailsError}
                      </p>
                    }
                    
                    {
                      toggleObjects?.isAuthed === false &&
                      <div className="save-my-details">
                          <div className="save-my-details-nested">
                              
                              <input type="checkbox" className="save-details-input"/>
                              <label className={`save-details ${isSaveFasterDetailsClicked ? "mch" : ""}`} onClick={() => handleSaveMyDetails(!isSaveFasterDetailsClicked)}>
                                  <div className="spacer _16"></div>
                                  <div className="save-my-detail-desk">
                                      <div className="save-my-checkout-details-desk">
                                          <div className="save-my-details-checkout-desk">
                                              <div className="save-my-details-jiencheckout-desk">
                                                  <div className="save-my-details-ckh6checkout-desk" style={{fontSize: "18px", fontWeight: "600"}}>
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
                      isSaveFasterDetailsClicked && 
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

                          {
                            toggleObjects?.isOTPReady && 
                            <>
                              <div className="btaundersavefastercheckout">
                                <label className="password-label">
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input type="number" name="otp" value={otpCodeData} onChange={handleOTPInput} placeholder="Enter OTP Code" className="undersavecheckoutinput no-spinner" />
                              </div>
                            </>
                          }
                          {
                            !toggleObjects?.isSuccessFullyLogin &&
                            <div className="alh2amenc9jdundersavefastercheckout">
                              {
                                toggleObjects?.isLoginShow ? 
                                <button type="button" className="agloundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleLogin}>{toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working...": "Login"}</button>
                                : 
                                toggleObjects?.isOTPReady ?
                                <button type="button" className="agloundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleOTP}>{toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working...": "Verify OTP"}</button>
                                :
                                <button type="button" className="agloundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={handleRegister}>{toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working...": "Register"}</button>
                              }
                              <button type="button" className="coasgundersavefastercheckout" disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged} onClick={() => setIsSaveFasterDetailsClicked(!isSaveFasterDetailsClicked)}>
                                Continue as guest user
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <div className="mimjepmkmlmmcheckout-desk">
                      <div className="d1g1checkout-desk" style={{marginTop: "20px"}}>
                          <div className="allzc5checkout-desk">
                          <div className="alamd1g1checkout-desk">
                              <div className="chd2cjd3b1checkout-desk" style={{fontSize: "18px", fontWeight: "400"}}>
                              When you place your order, we will send you occasional
                              marketing offers and promotions. Please select below
                              if you do not want to receive this marketing.
                              </div>
                          </div>
                          </div>

                          <div className="almycheckout-desk" style={{marginTop: "20px"}}>
                          <div className="allzc5checkout-desk" onClick={() => setIsByEmailClicked(!isByEmailClicked)}>
                              <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                              <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isByEmailClicked ? "mch" : ""}`}>
                                <div className="spacer _16"></div>
                                <div className="d1alfwllcheckout-desk">
                                  <div className="ald1ame7lmlncheckout-desk">
                                    <div className="alaqcheckout-desk">
                                        <div className="alamjiencheckout-desk">
                                          <div className="chic-cj-ckh6checkout-desk" style={{display: "flex", fontWeight: "600", fontSize: "18px"}}>
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
                          <div className="allzc5checkout-desk" onClick={() => setIsBySmsClicked(!isBySmsClicked)}>
                            <input type="checkbox" className="agaxlqdflacheckout-desk-input"/>
                            <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isBySmsClicked ? "mch" : ""}`}>
                              <div className="spacer _16"></div>
                                <div className="d1alfwllcheckout-desk">
                                  <div className="ald1ame7lmlncheckout-desk">
                                    <div className="alaqcheckout-desk">
                                      <div className="alamjiencheckout-desk">
                                        <div className="chic-cj-ckh6checkout-desk" style={{display: "flex", fontWeight: "600", fontSize: "18px"}}>
                                          By SMS &nbsp;
                                        </div>
                                        <div className="spacer _8"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </label>
                          </div>

                          <div className="d1g1checkout-desk" style={{ width: "94%", marginTop: "8px"}}>

                            <div className="allzc5checkout-desk">

                              <div className="alamd1g1checkout-desk">
                                <div className="form-total-value">
                                  <div className="chd2cjd3b1checkout-desk" style={{display: "flex", fontWeight: "600", fontSize: "18px"}}>
                                      Total
                                      {
                                      !toggleObjects?.isPhoneinputToggle && 
                                      <>
                                          &nbsp; &nbsp; &nbsp; &nbsp;
                                          <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3checkout-desk" >
                                              <span style={{fontFamily: "UberMoveText",color: "#05944F",}}>
                                                  {customerDetailObj?.driverInstruction}
                                              </span>
                                          </p>
                                      </>
                                      }
                                  </div>

                                  {
                                      !toggleObjects?.isAdddriverInstructionClicked &&
                                      <div className="checkout-window-form" style={{width: "40%", }} >
                                          <h4
                                              style={{
                                              fontSize: "26px",
                                              lineHeight: "1",
                                              fontWeight: "bold",
                                              textAlign: "center",
                                              marginTop: "20px",
                                              marginBottom: "15px",
                                              }}    
                                          >
                                              &pound; <span>{getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2)}</span>
                                          </h4>
                                      </div>
                                  }

                                
                                </div>
                              </div>
                            
                            </div>

                          </div>
                          </div>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          

            <div className="atbaagcheckout">
              {
                (isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(2)) &&
                <>
                  {
                    parseInt(customerDetailObj?.PayNowBottomError?.length) > parseInt(0) && 
                    <p style={{color: "red",background: "#eda7a7",textAlign: "center",padding: "10px",marginBottom: "1px",}}>
                      {customerDetailObj?.PayNowBottomError}
                    </p>
                  }
      
                  {
                    isPayNowClickAble ?
      
                    <button 
                      type="submit" 
                      className="fwbrbocheckout-place-order"
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                    
                    >
                      Pay Now
                    </button>
                    :
                    <button type="button" className="fwbrbocheckout-place-order" style={{background: "rgb(12,12,12)"}}>
                      Pay Now
                    </button>
                  }
                </>
              }
              
              {
                (!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1)) &&
                  <>
                    {
                      (isNextButtonReadyToClicked) ?
                      
                      <button 
                        type="button" 
                        className="fwbrbocheckout-place-order"
        
                        onClick={() => handleObject(2,"sectionNumber")}
                      >
                        Next
                      </button>
                      :
                      <button type="button" className="fwbrbocheckout-place-order" style={{background: "rgb(12,12,12)"}}>
                        Next
                      </button>
                    }
                  </>
              }
              <div style={{ height: "10px" }}></div>
            </div>

          </form>
        }
      </Fragment>
    )
}
