"use client";
import HomeContext from "@/contexts/HomeContext";

import { ContextCheckApi } from "@/app/layout";
import { useLoginMutationHook, usePostMutationHook } from "@/components/reactquery/useQueryHook";
import { BRAND_SIMPLE_GUID, BRAND_GUID, IMAGE_URL_Without_Storage, PARTNER_ID, axiosPrivate, DELIVERY_ID } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, setLocalStorage, validatePhoneNumber } from "@/global/Store";
import { listtime, round15 } from "@/global/Time";
import moment from "moment-timezone";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function PlaceOrderForm({
  deliveryTime,
  setDeliveryTime,
  due,
  setDue,
  customerDetailObj,
  setCustomerDetailObj,
  setModalObject, 
  handleBoolean, 
  sectionNumber,
  isNextButtonReadyToClicked, 
  isCreditCardButtonClicked, 
  handleObject,
  paymentError,
  setPaymentError,
  asapOrRequested,
  setAsapOrRequested,
}) 
{
  const addDoorNumberRef = useRef(null);

  //   const {isauth, setIsauth} = useContext(AuthContext)
  const {
    
    setPaymentLoader,
    loader,
    setLoader,
    booleanObj,
    dayOpeningClosingTime,
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
    orderGUID,
    setOrderGuid,
    storeCurrentOrNextDayOpeningTime,
    storeCurrentOrNextDayClosingTime,
  } = useContext(HomeContext);
      
  const stripe = useStripe();
  const elements = useElements();
  

  const [myCardElement, setMyCardElement] = useState(null);
    
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
  const [Message, setMessage] = useState("");

  // Change Postcode and Address states
  const [deliveryDetailText, setDeliveryDetailText] = useState("Edit");
  const [isPostcodeEditClicked, setIsPostcodeEditClicked] = useState(false);
  
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
    setAsapOrRequested('Requested')
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
      setPaymentLoader(true)
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
      // setDeliveryTime(getCustomerInformation.deliveryTime);
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
    handleBoolean(false, "isPlaceOrderButtonClicked")
    const url = window.location.origin
    const pathname = "track-order"
    try 
    {
      setPaymentLoader(true)
      const data = {
        guid: orderId,
        url: url,
        pathname: pathname,
        brandGuid: BRAND_GUID,
      } 

      const response = await axiosPrivate.post(`/send-sms-and-email`, data)

      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      setOrderGuid(null)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_number`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_amount_discount_applied`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}sub_order_total_local`)
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}applied_coupon`)
      setCartData([])
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
      window.alert(error?.response?.data?.error)
      setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
      window.localStorage.removeItem(`${BRAND_SIMPLE_GUID}order_guid`)
      setOrderGuid(null)
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
      setPaymentLoader(true)
      const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))

      const data = {
        guid: orderId,
        amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
        stripeid: paymentIntent.id,
        visitorGUID: visitorInfo.visitorId,
        placed: moment().tz("Europe/London").format("YYYY-MM-DD HH:mm:ss"),
      }  

      const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)
      // Here need to hit sms and email call.
      const orderData = response?.data?.data?.order
      hitSmsAndEmailCall(orderId)
        
    } 
    catch (error) 
    {
      setPaymentLoader(false)
    }
  }

  const handleSubmit = async (event) => 
  {
    event.preventDefault();
    
    setIsPayNowClickAble(false)
    if(!isScheduleClicked && isScheduleIsReady)
    {
      window.alert(`We are currently closed. To schedule your order for << ${scheduleMessage} >>, go to checkout.`)
      window.location.href = "/"
      return
    }
    
    
    setPaymentLoader(true)


    let cleanedTime = deliveryTime.replace(/ PM| AM/i, ''); // remove AM/PM (case-insensitive)
    // Parse the current date
    let baseDate = moment().format("YYYY-MM-DD");

    // If isScheduleForToday === 2, add 1 day
    if (isScheduleForToday === 2) {
      baseDate = moment().add(1, 'day').format("YYYY-MM-DD");
    }

    // Combine date and time
    let updatedDeliveryTime = moment(`${baseDate} ${cleanedTime}`, "YYYY-MM-DD HH:mm");

    // Format the final result
    updatedDeliveryTime = updatedDeliveryTime.format("YYYY-MM-DD HH:mm:ss");

    // let cleanedTime = deliveryTime.replace(/ PM| AM/i, ''); // remove AM/PM
    // let isPM = /PM/i.test(deliveryTime);
    // let hour = parseInt(cleanedTime.split(':')[0]);

    // // Adjust hour based on AM/PM
    // if (isPM && hour !== 12) hour += 12;
    // if (!isPM && hour === 12) hour = 0;

    // // Build full date-time string
    // let today = moment();
    // let fullTime = moment(`${today.format("YYYY-MM-DD")} ${hour}:${cleanedTime.split(':')[1]}`, "YYYY-MM-DD HH:mm");

    // // Optional: Add 1 day if time is between midnight and 5 AM
    // if (hour >= 0 && hour < 5) {
    //   fullTime.add(1, 'day');
    // }

    // let updatedDeliveryTime = fullTime.format("YYYY-MM-DD HH:mm:ss");


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
    //   setPaymentError(error.message);
    //   setLoader(false)
    //   return
    // }
    // Use this to generate a token from split fields
    const { token, error } = await stripe.createToken(cardElementNumber);

    
    if (error) {
      setIsPayNowClickAble(false);
      setPaymentError(error.message);
      setPaymentLoader(false);
      return;
    }
      
    if(isSaveFasterDetailsClicked || isLocationBrandOnline === null)
    {
      setIsPayNowClickAble(false)
      setPaymentLoader(false)
      return
    }
  
    if (!stripe || !elements) 
    {
      setPaymentLoader(false)
      return;
    }

    if(selectedFilter.id === DELIVERY_ID)
    {
      if (parseInt(customerDetailObj?.doorHouseName?.length) === parseInt(0)) 
      {
        setIsPayNowClickAble(false)
        setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: "Please check * (asterisk) mark field and fill them."}))
        return;
      }
    }
    else
    {
      if (parseInt(customerDetailObj?.email?.length) === parseInt(0) || parseInt(customerDetailObj?.phone?.length) === parseInt(0) || parseInt(customerDetailObj?.firstName.length) === parseInt(0) ||parseInt(customerDetailObj?.lastName?.length) === parseInt(0)) 
      {
        setIsPayNowClickAble(false)
        setCustomerDetailObj((prevData) => ({...prevData, PayNowBottomError: "Please check * (asterisk) mark field and fill them."}))
        return;
      }
    }
    
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
      asapOrRequested:    asapOrRequested,
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
      doorHouseName:      customerDetailObj.doorHouseName,
      isBySmsClicked:     isBySmsClicked,
      
      isByEmailClicked:   isByEmailClicked,
      driverInstruction:  customerDetailObj?.driverInstruction === undefined ? "" : customerDetailObj?.driverInstruction,
      sub_total_order:    subTotalOrderLocal,
      
      
      orderAmountDiscount_guid: orderAmountDiscountValue,
      is_schedule_order: isScheduleForToday,
      delivery_estimate_time: updatedDeliveryTime,
      
      delivery_fee:             deliveryFeeLocalStorage,
      coupons:                  couponCodes,
      order_guid:               orderFromDatabaseGUID ?? orderGUID,
      is_verified:              booleanObj?.isCustomerVerified,

      
      order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
      token: token.id,
      // order: orderId,
      brand: BRAND_GUID,
      type: "card",
      is_paid_via_wallet: 0,
      visitorGUID: visitorInfo.visitorId
    };      

    setLocalStorage(`${BRAND_SIMPLE_GUID}card_data:`, data)
    if (orderFromDatabaseGUID ?? orderGUID) { 
      patchMutation(data) 
      return
    }

    storeMutation(data)
  };
  
  const onStoreSuccess = async (data) => {
    // first check the order guid id in localStorage if it is null then store information then update them.
    const responseData = data?.data?.data?.order?.order_total;
    const { clientSecret, type } = data?.data?.data;
    
    const orderGUID = data?.data?.data?.order?.external_order_id

    setIsPayNowClickAble(false)
    if (data?.data?.status === "success") 
    {
      setOrderGuid(orderGUID)
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
        setPaymentLoader(false)
        setPaymentError(result.error.message);
        setIsPayNowClickAble(true)
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
        
        if (result.error)  {
          setPaymentLoader(false)
          setPaymentError(result.error.message);
          setIsPayNowClickAble(true)
          return
        } else {
          afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent);
        }
      } catch (err) {
        
        setIsPayNowClickAble(true)
        ev.complete("fail");
        const errorMessage = err.response.data.error
        if (errorMessage.toLowerCase().includes("minimum charge amount")) {
          setPaymentError("Amount is too low for this currency.");
        }
        else if (errorMessage.toLowerCase().includes("declined")) {
            setPaymentError("Your card was declined.");
        }
        else if (errorMessage.toLowerCase().includes("insufficient")) {
          setPaymentError("Your card has insufficient funds.");
        }
        else{
          window.alert("There is something went wrong. Please refresh and try again.")
        }
      }
    }
  }
  
  const onStoreError = (error) => {
    setPaymentLoader(false)
    setIsPayNowClickAble(true)
    const errorMessage = error.response.data.error
    if (errorMessage.toLowerCase().includes("minimum charge amount")) {
      setPaymentError("Amount is too low for this currency.");
    }
    else if (errorMessage.toLowerCase().includes("declined")) {
        setPaymentError("Your card was declined.");
    }
    else if (errorMessage.toLowerCase().includes("insufficient")) {
      setPaymentError("Your card has insufficient funds.");
    }
    else{
      window.alert("There is something went wrong. Please refresh and try again.")
    }
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
    setIsPayNowClickAble(false)
    
    const { clientSecret, type } = data?.data?.data;
    
    const orderGUID = data?.data?.data?.order?.external_order_id
    if (data?.data?.status === "success") 
    {
      setOrderGuid(orderGUID)
      setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,orderGUID);
      setModalObject((prevData) => ({
          ...prevData, 
          isPaymentReady: true,
          orderGUI: orderGUID
      }))
    }

    if(type === "card")
    {
      try {
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
          
          
          if (result?.error) 
          {
            setPaymentLoader(false)
            setPaymentError(result.error.message);
            
            setIsPayNowClickAble(true)
            
          } 
          else 
          {
            afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent)
          }
        
      } catch (error) {
        
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
    
        if (result.error)  {
          setPaymentLoader(false)
          setPaymentError(result.error.message);
          setIsPayNowClickAble(true)
          return
        } else {
          afterPaymentSavedOrderUpdate(orderGUID, result.paymentIntent);
        }
      } catch (err) {
        ev.complete("fail");
        const errorMessage = err.response.data.error
        if (errorMessage.toLowerCase().includes("minimum charge amount")) {
          setPaymentError("Amount is too low for this currency.");
        }
        else if (errorMessage.toLowerCase().includes("declined")) {
            setPaymentError("Your card was declined.");
        }
        else if (errorMessage.toLowerCase().includes("insufficient")) {
          setPaymentError("Your card has insufficient funds.");
        }
        else{
          window.alert("There is something went wrong. Please refresh and try again.")
        }
        
        setIsPayNowClickAble(true)
      }
    }
  }

  const onPatchError = (error) => {

    const errorMessage = error.response.data.error
    setPaymentLoader(false)
    setIsPayNowClickAble(true)

    if (errorMessage.toLowerCase().includes("minimum charge amount")) {
      setPaymentError("Amount is too low for this currency.");
    }
    else if (errorMessage.toLowerCase().includes("declined")) {
        setPaymentError("Your card was declined.");
    }
    else if (errorMessage.toLowerCase().includes("insufficient")) {
      setPaymentError("Your card has insufficient funds.");
    }
    else{
      window.alert("There is something went wrong. Please refresh and try again.")
    }
    
    // setIsPayNowClickAble(true)
    // set
    // window.alert("There is something went wrong!. Please refresh and try again.")
    // return
  }

  const {
    isLoading: patchLoading, 
    isError: postError, 
    isSuccess: postSuccess, 
    reset: postReset, 
    mutate: patchMutation
  } = usePostMutationHook('customer-update',`/update-customer-details`, onPatchSuccess, onPatchError)

  const loadingState = patchLoading || storeLoading || loader

  const [cardError, setCardError] = useState(null);

  const handleChangePostcode = () =>
  {
    setAtFirstLoad(true)
    setPaymentError(null)
    setCardError()
    handleBoolean(true,"isChangePostcodeButtonClicked")
    handleBoolean(false, "isPlaceOrderButtonClicked")
  }
  
  const handleOTPInput = (e) => {
    setOtpCodeData(e.target.value)
  }

  const handleStreetAddress = () => {

  }
  
  useEffect(() => {
    // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
    const timeoutId = setTimeout(() => {
      // Clear all items in localStorage
      localStorage.clear();
      window.location.reload(true);
      window.location.href = "/"
      setTimeout(() => {
        setPaymentLoader(false);
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
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }

    if (event.complete) {
      const cvcElement = elements?.getElement(CardCvcElement)
      cvcElement?.focus()
    }
  }

  return(
    <Fragment>
      {
        <form  
          onSubmit={handleSubmit}
          className="checkout-form"
        >
          <div className="hmg1checkout-desk"
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

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="email"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email address."
                        value={customerDetailObj?.email}
                        ref={addDoorNumberRef} 
                        onChange={handleInputs}
                        className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                          parseInt(customerDetailObj?.email?.length) > 0
                            ? "border-green-500 focus:ring-green-300"
                            : customerDetailObj?.email?.length === 0
                            ? "border-gray-300 focus:ring-gray-200"
                            : "border-red-500 focus:ring-red-300"
                        }`}
                      />
                    </div>
                    
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-start gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="fullName"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full flex gap-1">
                        <input
                          type="text"
                          value={customerDetailObj?.firstName}
                          id="fullName"
                          name="firstName"
                          onChange={handleInputs}
                          placeholder="Enter first name"
                          className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.firstName?.length) > 0
                              ? "border-green-500 focus:ring-green-300"
                              : customerDetailObj?.firstName?.length === 0
                              ? "border-gray-300 focus:ring-gray-200"
                              : "border-red-500 focus:ring-red-300"
                          }`}
                        />

                        <input
                          type="text"
                          value={customerDetailObj?.lastName}
                          name="lastName"
                          id="fullName"
                          onChange={handleInputs}
                          placeholder="Enter last name"
                          className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.lastName?.length) > 0
                              ? "border-green-500 focus:ring-green-300"
                              : customerDetailObj?.lastName?.length === 0
                              ? "border-gray-300 focus:ring-gray-200"
                              : "border-red-500 focus:ring-red-300"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="phone"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="number"
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number."
                        value={customerDetailObj?.phone}
                        onWheel={(e) => e.target.blur()}
                        onChange={handleInputs}
                        className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${
                          parseInt(customerDetailObj?.phone?.length) > 0
                            ? "border-green-500 focus:ring-green-300"
                            : customerDetailObj?.phone?.length === 0
                            ? "border-gray-300 focus:ring-gray-200"
                            : "border-red-500 focus:ring-red-300"
                        }`}
                      />

                    </div>
                  
                  </>
                }

                {
                  ((!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1)) && selectedFilter.id === DELIVERY_ID) &&
                  <>
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="doorNumber"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Door Number <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        id="doorNumber"
                        name="doorHouseName"
                        placeholder="Enter door number or name"
                        value={customerDetailObj?.doorHouseName}
                        onChange={handleInputs}
                        className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                          parseInt(customerDetailObj?.doorHouseName?.length) > 0
                            ? "border-green-500 focus:ring-green-300"
                            : customerDetailObj?.doorHouseName?.length === 0
                            ? "border-gray-300 focus:ring-gray-200"
                            : "border-red-500 focus:ring-red-300"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-start gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="address"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Address <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full flex flex-col">
                        <input
                          type="text"
                          value={street1}
                          onClick={() => handleStreetAddress}
                          className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.doorHouseName?.length) > 0
                              ? "border-green-500 focus:ring-green-300"
                              : customerDetailObj?.doorHouseName?.length === 0
                              ? "border-gray-300 focus:ring-gray-200"
                              : "border-red-500 focus:ring-red-300"
                          }`}
                        />

                        <input
                          type="text"
                          value={street2}
                          onClick={() => handleStreetAddress}
                          className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                            parseInt(customerDetailObj?.doorHouseName?.length) > 0
                              ? "border-green-500 focus:ring-green-300"
                              : customerDetailObj?.doorHouseName?.length === 0
                              ? "border-gray-300 focus:ring-gray-200"
                              : "border-red-500 focus:ring-red-300"
                          }`}
                        />

                        <div className="flex">
                          <input
                            type="text"
                            value={postcode}
                            onClick={() => handleStreetAddress}
                            className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                              parseInt(customerDetailObj?.doorHouseName?.length) > 0
                                ? "border-green-500 focus:ring-green-300"
                                : customerDetailObj?.doorHouseName?.length === 0
                                ? "border-gray-300 focus:ring-gray-200"
                                : "border-red-500 focus:ring-red-300"
                            }`}
                          />

                          <button
                            type="button"
                            onClick={handleChangePostcode}
                            className="whitespace-nowrap px-4 py-2 text-blue-600 hover:text-blue-800 bg-[#cfcfcfb5] font-medium transition-colors duration-200"
                          >
                            Change postcode
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="driverInstruction"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Driver Instruction
                      </label>

                      <textarea
                        type="text"
                        placeholder="Please don’t add notes relating to your food e.g. allergies or extra toppings. These notes are for your driver only."
                        rows={2}
                        cols={30}
                        id="driverInstruction"
                        spellCheck="false"
                        onChange={handleInputs}
                        name="driverInstruction"
                        aria-label="Add delivery instructions"
                        value={customerDetailObj?.driverInstruction}
                        className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${
                          parseInt(customerDetailObj?.doorHouseName?.length) > 0
                            ? "border-green-500 focus:ring-green-300"
                            : customerDetailObj?.doorHouseName?.length === 0
                            ? "border-gray-300 focus:ring-gray-200"
                            : "border-red-500 focus:ring-red-300"
                        }`}
                      />
                    </div>
                  </>
                }
                
                {
                  (isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(2)) &&
                  <>
                    <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="creditCard"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
                        Credit Card <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col md:flex-row gap-2">
                          {/* Card Number */}
                          <div className="w-full md:w-1/2 px-4 py-2 border rounded-md bg-[#cfcfcfb5]">
                            <CardNumberElement
                              onChange={handleCardNumberChange}
                              options={{
                                hidePostalCode: true,
                                style: {
                                  base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                  },
                                },
                              }}
                            />
                          </div>

                          {/* Expiry */}
                          <div className="w-full md:w-1/4 px-4 py-2 border rounded-md bg-[#cfcfcfb5]">
                            <CardExpiryElement
                              onChange={handleCardExpiryChange}
                              options={{
                                hidePostalCode: true,
                                style: {
                                  base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                  },
                                },
                              }}
                            />
                          </div>

                          {/* CVC */}
                          <div className="w-full md:w-1/4 px-4 py-2 border rounded-md bg-[#cfcfcfb5]">
                            <CardCvcElement
                              options={{
                                hidePostalCode: true,
                                style: {
                                  base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                    <>
                      {/* Error Message */}
                      {cardError && (
                        <div className="flex items-center justify-center bg-red-400 mb-4"> 
                          <p className="text-white text-sm">{cardError}</p>
                        </div>
                      )}

                    {paymentError && (
                      <div className="flex items-center justify-center bg-red-400 mb-4">
                        <p className="text-white text-sm">{paymentError}</p>
                      </div>
                    )}

                    </>
                  </>


                }
                
                {
                  (!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1) && (isScheduleClicked === false || isScheduleClicked === true)) &&

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-20 mb-4">
                      <label
                        htmlFor="deliveryCollectionTime"
                        className="w-full lg:w-[20rem] text-md font-semibold text-gray-900"
                      >
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
                      </label>

                      <select 
                        value={`${asapOrRequested} ${moment(deliveryTime, "HH:mm A").format("HH:mm A")}`}     
                        className={`w-full px-4 py-2 text-gray-700 border bg-[#cfcfcfb5] focus:outline-none focus:ring-2 transition ${parseInt(customerDetailObj?.doorHouseName?.length) > 0 ? "border-green-500 focus:ring-green-300" : customerDetailObj?.doorHouseName?.length === 0 ? "border-gray-300 focus:ring-gray-200" : "border-red-500 focus:ring-red-300" }`}
                        onChange={handleDeliveryTime}
                      >
                        {
                          listtime?.map((time, index) => {

                              return (
                              moment(time?.time, "HH:mm").format("HH:mm") >= moment(storeCurrentOrNextDayOpeningTime, "HH:mm").format("HH:mm") && moment(storeCurrentOrNextDayClosingTime, "HH:mm").format("HH:mm") >= moment(time?.time, "HH:mm").format("HH:mm") &&
                                  <option key={index} defaultValue={time?.time}>
                                    {
                                      moment(deliveryTime, "HH:mm A").format("HH:mm A") === moment(time?.time, "HH:mm A").format("HH:mm A") ?
                                        `${asapOrRequested} ${moment(time?.time, "HH:mm A").format("HH:mm A")}`
                                      :
                                      moment(time?.time, "HH:mm A").format("HH:mm A")
                                    }
                                  </option>
                              );
                          })
                        }
                      </select>
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





                  {/* Need to work on these two commented parts later on. */}
                  {
                    // toggleObjects?.isAuthed === false &&
                    // <div className="w-full py-4">
                    //   <div className="flex items-start gap-3 items-center">
                        
                    //     {/* Checkbox */}
                    //       <div className="flex items-center">
                    //         <input
                    //           id="checkboxNoLabel"
                    //           type="checkbox"
                    //           checked={isSaveFasterDetailsClicked}
                    //           className={`h-5 w-5 appearance-none border-2 border-gray-300 rounded 
                    //             checked:bg-black checked:border-black 
                    //             checked:bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Cpath%20fill='white'%20d='M6%2010.8L3.2%208l-0.93%200.93L6%2012.67%2014%204.67%2013.07%203.73%206%2010.8z'/%3E%3C/svg%3E")] 
                    //             bg-no-repeat bg-center bg-[length:12px_12px] 
                    //             transition-all cursor-pointer`}
                    //           aria-label="Select option"
                    //           onChange={() => handleSaveMyDetails(!isSaveFasterDetailsClicked)}
                    //         />
                    //       </div>

                    //     <label
                    //       htmlFor="save-details-checkbox"
                    //       className="flex items-center gap-2 cursor-pointer select-none"
                    //     >
                    //       {/* Checkbox UI */}
                    //       <div className="h-5 w-5 rounded-sm border-2 border-gray-400 flex items-center justify-center peer-checked:bg-black peer-checked:border-black transition">
                    //         {/* Tick icon */}
                    //         <svg
                    //           className="hidden peer-checked:block w-3 h-3 text-white"
                    //           fill="none"
                    //           stroke="currentColor"
                    //           strokeWidth="3"
                    //           viewBox="0 0 24 24"
                    //         >
                    //           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    //         </svg>
                    //       </div>

                    //       {/* Label Text */}
                    //       <span className={`text-base font-semibold leading-snug ${isSaveFasterDetailsClicked ? "text-black" : "text-gray-700"}`}>
                    //         Save my details for faster checkout next time
                    //       </span>
                    //     </label>

                    //   </div>
                    // </div>
                  }
                
                  {
                    // isSaveFasterDetailsClicked && 
                    // <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                    //   <div className="space-y-4">
                    //     <div>
                    //       <span className="block text-sm text-gray-700">{Message}</span>
                    //     </div>

                    //     {/* Password Input */}
                    //     {toggleObjects?.isCustomerHasPassword === false && (
                    //       <>
                    //         <div>
                    //           <label className="block text-sm font-medium text-gray-700 mb-1">
                    //             Password <span className="text-red-500">*</span>
                    //           </label>
                    //           <input
                    //             type="password"
                    //             name="password"
                    //             value={customerDetailObj?.password}
                    //             onChange={handleInputs}
                    //             placeholder="Enter password"
                    //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    //           />
                    //         </div>

                    //         <div className="text-sm mt-2 flex items-center space-x-1">
                    //           <p className="text-gray-600">Already have an account?</p>
                    //           <a href="/login" className="text-blue-600 hover:underline font-medium">
                    //             Sign In
                    //           </a>
                    //         </div>
                    //       </>
                    //     )}

                    //     {/* OTP Input */}
                    //     {toggleObjects?.isOTPReady && (
                    //       <div>
                    //         <label className="block text-sm font-medium text-gray-700 mb-1">
                    //           OTP Code <span className="text-red-500">*</span>
                    //         </label>
                    //         <input
                    //           type="number"
                    //           name="otp"
                    //           value={otpCodeData}
                    //           onChange={handleOTPInput}
                    //           placeholder="Enter OTP Code"
                    //           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black no-spinner"
                    //         />
                    //       </div>
                    //     )}

                    //     {/* Action Buttons */}
                    //     {!toggleObjects?.isSuccessFullyLogin && (
                    //       <div className="flex flex-col gap-3 pt-2">
                    //         {toggleObjects?.isLoginShow ? (
                    //           <button
                    //             type="button"
                    //             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all disabled:opacity-50"
                    //             disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged}
                    //             onClick={handleLogin}
                    //           >
                    //             {toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working..." : "Login"}
                    //           </button>
                    //         ) : toggleObjects?.isOTPReady ? (
                    //           <button
                    //             type="button"
                    //             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all disabled:opacity-50"
                    //             disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged}
                    //             onClick={handleOTP}
                    //           >
                    //             {toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working..." : "Verify OTP"}
                    //           </button>
                    //         ) : (
                    //           <button
                    //             type="button"
                    //             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all disabled:opacity-50"
                    //             disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged}
                    //             onClick={handleRegister}
                    //           >
                    //             {toggleObjects?.authButtonDisabledUntilPasswordChanged ? "Working..." : "Register"}
                    //           </button>
                    //         )}

                    //         <button
                    //           type="button"
                    //           className="w-full bg-gray-200 text-black py-2 rounded-md hover:bg-gray-300 transition-all disabled:opacity-50"
                    //           disabled={toggleObjects?.authButtonDisabledUntilPasswordChanged}
                    //           onClick={() => setIsSaveFasterDetailsClicked(!isSaveFasterDetailsClicked)}
                    //         >
                    //           Continue as guest user
                    //         </button>
                    //       </div>
                    //     )}
                    //   </div>
                    // </div>

                  }

                  <div className="px-4 py-6">
                    <div className="mt-5">
                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-sm font-normal text-gray-800">
                          When you place your order, we will send you occasional marketing offers and promotions.
                          Please select below if you do not want to receive this marketing.
                        </p>
                      </div>

                      {/* By Email Option */}
                      <div className="mb-6">
                        <label className="flex gap-6 items-center space-x-3 cursor-pointer">
                          <span className="text-lg font-semibold w-1/3">By Email</span>
                          {
                            isByEmailClicked ?
                            <input
                              id="checkboxNoLabel"
                              type="checkbox"
                              checked={isByEmailClicked}
                              onChange={() => setIsByEmailClicked(false)}
                              className={`h-8 w-8 appearance-none bg-white border-2 border-gray-300 rounded 
                                checked:bg-black checked:border-black 
                                checked:bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Cpath%20fill='white'%20d='M6%2010.8L3.2%208l-0.93%200.93L6%2012.67%2014%204.67%2013.07%203.73%206%2010.8z'/%3E%3C/svg%3E")] 
                                bg-no-repeat bg-center bg-[length:12px_12px] transition-all cursor-pointer`}
                              aria-label="Select option"
                            />
                            :
                            <div className="flex items-center">
                              <input
                                id="checkboxNoLabel"
                                onChange={() => setIsByEmailClicked(true)}
                                type="checkbox"
                                className="h-8 w-8 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                value=""
                                aria-label="Select option"
                              />
                            </div>
                          }
                          
                        </label>
                      </div>



                      {/* By SMS Option */}
                      <div className="mb-6">
                        <label className={`flex gap-6 items-center space-x-3`}>
                          <span className="text-lg font-semibold w-1/3">By SMS</span>
                          
                          {
                            isBySmsClicked ?
                            <input
                              id="checkboxNoLabel"
                              type="checkbox"
                              checked={isBySmsClicked}
                              onChange={() => setIsBySmsClicked(false)}
                              className={`h-8 w-8 appearance-none bg-white border-2 border-gray-300 rounded 
                                checked:bg-black checked:border-black 
                                checked:bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Cpath%20fill='white'%20d='M6%2010.8L3.2%208l-0.93%200.93L6%2012.67%2014%204.67%2013.07%203.73%206%2010.8z'/%3E%3C/svg%3E")] 
                                bg-no-repeat bg-center bg-[length:12px_12px] transition-all cursor-pointer`}
                              aria-label="Select option"
                            />
                            :
                            <div className="flex items-center">
                              <input
                                id="checkboxNoLabel"
                                onChange={() => setIsBySmsClicked(true)}
                                type="checkbox"
                                className="h-8 w-8 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                value=""
                                aria-label="Select option"
                              />
                            </div>
                          }
                          
                        </label>
                      </div>

                      {/* Total Section */}
                      <div className="flex flex-col md:flex-row"> 
                        <div className=" items-center text-lg font-semibold">
                          Total
                        </div>
                          <div className="w-full md:w-2/5 mx-auto mt-5 mb-4 text-center">
                            <h4 className="text-3xl font-bold leading-none">
                              &pound; <span>{getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2)}</span>
                            </h4>
                          </div>

                      </div>
                    </div>
                  </div>

                </>
              }
            </div>
          </div>
        

          <div className="flex justify-center items-center w-full">
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
                      className="bg-green-700 hover:bg-green-800 text-white w-1/3 px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center mx-auto block"
                  >
                    Pay Now
                  </button>
                  :
                  <button type="button" className="bg-black text-white w-1/3 px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center mx-auto block">
                    Pay Now
                  </button>

                }
              </>
            }
            
        
            <div style={{ height: "10px" }}></div>
          </div>
        </form>
      }

      <>
      
        {
          (!isCreditCardButtonClicked && parseInt(sectionNumber) === parseInt(1)) &&
          <>
            {
              (isNextButtonReadyToClicked) ?
              
              <button 
                type="button" 
                className="bg-green-700 hover:bg-green-800 text-white w-1/3 px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center mx-auto block"

                onClick={() => handleObject(2,"sectionNumber")}
              >
                Next
              </button>
              :
              <button type="button" className="bg-black text-white w-1/3 px-4 py-3 rounded-md font-semibold transition-all duration-200 border text-center mx-auto block">
                Next
              </button>
            }
          </>
        }
      </> 
            
    </Fragment>
  )
}
