"use client";

import Loader from "@/components/modals/Loader";
import PostcodeModal from "@/components/modals/PostcodeModal";
import HomeContext from "@/contexts/HomeContext";
import { BRANDSIMPLEGUID, BRAND_GUID, PARTNER_ID, axiosPrivate } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed, setLocalStorage, validatePhoneNumber } from "@/global/Store";
import { listtime, round15 } from "@/global/Time";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Fragment, useContext, useEffect, useRef, useState } from "react";

function UserForm() {
  const route = useRouter();
  //   const {isauth, setIsauth} = useContext(AuthContext)
  const {
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
    setIscartbtnclicked,
    setHeaderCartBtnDisplay,
    setHeaderPostcodeBtnDisplay,
  } = useContext(HomeContext);

  const addDoorNumberRef = useRef(null);
  const [loader, setLoader] = useState(true);

  // Button Name Change State
  const [doornumbertext, setDoornumbertext] = useState("Add");
  const [isadddoortext, setIsadddoortext] = useState("Add");
  const [emailaddbtntext, setEmailaddbtntext] = useState("Save");

  const [phoneaddbtntext, setPhoneaddbtntext] = useState("Save");
  const [firstnameaddbtntext, setFirstNameaddbtntext] = useState("Save");

  // Boolean States
  const [isadddoororhouseclicked, setIsadddoororhouseclicked] = useState(false);
  const [isdoorinputdisplayclicked, setIsdoorinputdisplayclicked] =
    useState(true);

  const [isadddrivertoggle, setIsadddrivertoggle] = useState(false);
  const [isadddriverdisplayclicked, setIsadddriverdisplayclicked] =
    useState(false);

  const [isemailtoggle, setIsemailtoggle] = useState(true);
  const [isemailinputtoggle, setIsemailinputtoggle] = useState(true);

  const [isphonetoggle, setIsphonetoggle] = useState(true);
  const [isphoneinputtoggle, setIsphoneinputtoggle] = useState(true);

  const [isfirstnametoggle, setIsfirstnametoggle] = useState(true);
  const [isfirtnameinputtoggle, setIsfirtnameinputtoggle] = useState(true);
  const [iscustomerhaspassword, setIscustomerhaspassword] = useState(false);

  const [isbyemailclicked, setIsbyemailclicked] = useState(false);
  const [isbysmsclicked, setIsbysmsclicked] = useState(false);

  // Get value states
  const [doorhousename, setDoorhousename] = useState("");
  const [driverinstruction, setDriverinstruction] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [openingtime, setOpeningtime] = useState("");
  const [closingtime, setClosingtime] = useState("");
  const [deliverytimefrom, setDeliverytimefrom] = useState("");
  const [deliverytimeend, setDeliverytimeend] = useState("");

  const [deliverytime, setDeliveryTime] = useState("");

  const [due, setDue] = useState("due");

  // Message
  const [Message, setMessage] = useState("");
  // Error states
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [saveMyDetailsError, setSaveMyDetailsError] = useState("");
  const [PayNowBottomError, setPayNowBottomError] = useState("");

  function handleDoorHouseClicked() {
    setIsadddoororhouseclicked(!isadddoororhouseclicked);
    setDoornumbertext(doornumbertext === "Add" ? "Save" : "Add");
    setIsdoorinputdisplayclicked(!isdoorinputdisplayclicked);
  }

  function handleDoorOrHouse(event) {
    setDoorhousename(event.target.value);
    setIsavefasterdetailsclicked(false);
  }

  function handleDriverInstruction() {
    setIsadddrivertoggle(!isadddrivertoggle);
    setIsadddoortext(isadddoortext === "Add" ? "Save" : "Add");
    setIsadddriverdisplayclicked(!isadddriverdisplayclicked);
  }

  function handleDriverInstructionEvent(event) {
    setDriverinstruction(event.target.value);
  }

  function handleEmailToggle() {
    setIsemailtoggle(!isemailtoggle);
    setEmailaddbtntext(emailaddbtntext === "Save" ? "Edit" : "Save");
    setIsemailinputtoggle(!isemailinputtoggle);
  }

  function handleUserEmail(event) {
    setEmail(event.target.value);
    setIsavefasterdetailsclicked(false);
  }

  function handlePhoneToggle() {
    setIsphonetoggle(!isphonetoggle);
    setPhoneaddbtntext(phoneaddbtntext === "Save" ? "Edit" : "Save");
    setIsphoneinputtoggle(!isphoneinputtoggle);
  }

  function handleUserPhone(event) {
    setPhone(event.target.value);
    setIsavefasterdetailsclicked(false);
  }

  function handleFirstNameToggle() {
    setIsfirstnametoggle(!isfirstnametoggle);
    setFirstNameaddbtntext(firstnameaddbtntext === "Save" ? "Edit" : "Save");
  }

  function handleUserFirstName(event) {
    setFirstName(event.target.value.replace(/^\w/, (c) => c.toUpperCase()));
    setIsavefasterdetailsclicked(false);
  }

  function handleUserLastName(event) {
    setLastName(event.target.value.replace(/^\w/, (c) => c.toUpperCase()));
    setIsavefasterdetailsclicked(false);
  }

  function handleDeliveryTime(event) {
    setDeliveryTime(event.target.value);
    setDue("requested");
  }
  // Change Postcode and Address states
  const [ispostcodeeditclicked, setIspostcodeeditclicked] = useState(false);
  const [deliverydetailtext, setDeliverydetailtext] = useState("Edit");
  function handlePostcodeEdit() {
    setIspostcodeeditclicked(!ispostcodeeditclicked);
    setDeliverydetailtext(deliverydetailtext === "Edit" ? "Save" : "Edit");
  }

  const [ischangepostcodeclicked, setIschangepostcodeclicked] = useState(false);

  // Save details for Faster Checkout next time
  const [isavefasterdetailsclicked, setIsavefasterdetailsclicked] =
    useState(false);

  function handleLogin() {
    setIsauth(false);
    navigate("/login");
  }

  function handleRegisteration() {}

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function fetchLocationDeliveryEstimate() {
    // Get the current day name
    try {
      const placeOrderGetStoreGUID = JSON.parse(
        window.localStorage.getItem(`${BRANDSIMPLEGUID}user_selected_store`)
      );
      const data = {
        location_guid:
          placeOrderGetStoreGUID === null
            ? storeGUID
            : placeOrderGetStoreGUID?.display_id,
        brand_guid: BRAND_GUID,
        day_number: moment().day(),
        partner: PARTNER_ID,
      };

      const response = await axiosPrivate.post(`/website-delivery-time`, data);

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

      setTimeout(() => {
        setLoader(false);
      }, 3000);
    } catch (error) {
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    }
  }

  useEffect(() => {
    // dayOpeningClosingTime
    // setIsTimeToClosed

    const dayNumber = moment().day();
    const dateTime = moment().format("HH:mm");
    const dayName = moment().format("dddd");

    if (
      dayOpeningClosingTime?.day_of_week
        ?.toLowerCase()
        .includes(dayName.toLowerCase())
    ) {
      const timePeriods = dayOpeningClosingTime?.time_periods;
      if (timePeriods) {
        if (
          timePeriods?.[0]?.start_time >= dateTime &&
          dateTime <= timePeriods?.[0]?.end_time
        ) {
          setIsTimeToClosed(true);
          return;
        }
      }
    }

    const placeOrderLocalStorageTotal = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}total_order_value_storage`));
    settotalOrderAmountValue(placeOrderLocalStorageTotal === null ? totalOrderAmountValue : getAmountConvertToFloatWithFixed(JSON.parse(placeOrderLocalStorageTotal),2));

    setIscartbtnclicked(false);
    fetchLocationDeliveryEstimate();
    addDoorNumberRef.current.focus();

    setHeaderCartBtnDisplay(false);
    setHeaderPostcodeBtnDisplay(false);

    const getCustomerInforation = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}customer_information`));

    if (getCustomerInforation !== null) 
    {
      setDoorhousename(getCustomerInforation.doorhousename);
      setDriverinstruction(getCustomerInforation.driverinstruction);
      setEmail(getCustomerInforation.email);
      setPhone(getCustomerInforation.phone);
      setFirstName(getCustomerInforation.firstname);
      setLastName(getCustomerInforation.lastname);
      setDeliveryTime(getCustomerInforation.deliverytime);
      setIsbyemailclicked(getCustomerInforation.isbyemailclicked);
      setIsbysmsclicked(getCustomerInforation.isbysmsclicked);
    }
  }, []);

  async function fetchCustomerLoginDetails() {
    try {
      // Use user email or password.
      const data = {
        email: email,
        phone: phone,
      };

      const response = await axiosPrivate.post(`/create-account-faster`, data);
      if (response?.data?.data?.customer !== null) {
        if (response?.data?.data?.customer?.customer_password !== null) {
          setPassword(
            response?.data?.data?.customer?.customer_password?.password
          );
          setIscustomerhaspassword(true);
          setMessage("The phone/email you have entered is already registered.");
        }
      } else {
        setMessage(
          "Register yourself to get more coupons and discounts on your favourite meals."
        );
      }
    } catch (error) {
      if (
        parseInt(error?.response?.data?.errors?.email?.length) > parseInt(0)
      ) {
        setEmail("");
        setPhoneError("Enter valid email.");
      }
      if (
        parseInt(error?.response?.data?.errors?.phone?.length) > parseInt(0)
      ) {
        setPhone("");
        setPhoneError("Enter valid phone number.");
      }
      setIsavefasterdetailsclicked(false);
    }
  }

  function handleSaveMyDetails() {
    if (
      doorhousename === "" ||
      email === "" ||
      phone === "" ||
      firstname === "" ||
      lastname === ""
    ) {
      setSaveMyDetailsError(
        "Please check * (asterisk) mark field and fill them."
      );
      setIsavefasterdetailsclicked(false);
      return;
    }

    setSaveMyDetailsError("");
    setIsavefasterdetailsclicked(!isavefasterdetailsclicked);

    fetchCustomerLoginDetails();
  }

  async function storeCustomerDetail() {
    const subTotalOrderLocal =
      JSON.parse(
        JSON.parse(
          window.localStorage.getItem(`${BRANDSIMPLEGUID}sub_order_total_local`)
        )
      ) === null
        ? null
        : getAmountConvertToFloatWithFixed(
            JSON.parse(
              JSON.parse(
                window.localStorage.getItem(
                  `${BRANDSIMPLEGUID}sub_order_total_local`
                )
              )
            ),
            2
          );
    const localStorageTotal =
      JSON.parse(
        window.localStorage.getItem(
          `${BRANDSIMPLEGUID}total_order_value_storage`
        )
      ) === null
        ? null
        : JSON.parse(
            window.localStorage.getItem(
              `${BRANDSIMPLEGUID}total_order_value_storage`
            )
          );
    const orderAmountDiscountValue  = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_amount_number`)) === null ? null: JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_amount_number`));
    const orderFilter               = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}filter`));
    const deliveryFeeLocalStorage   = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_fee`)) === null ? null : getAmountConvertToFloatWithFixed(JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_fee`)),2);
    const getCouponCode             = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}applied_coupon`));

    const couponCodes               = parseInt(getCouponCode.length) > parseInt(0) ? getCouponCode : couponDiscountapplied;
    const updatedDeliveryTime       = moment(`${moment().format("YYYY-MM-DD")} ${deliverytime}`,"YYYY-MM-DD HH:mm:ss");

    let orderFromDatabaseGUID = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}order_guid`));

    let customerURL = `/store-customer-details`;

    if (orderFromDatabaseGUID !== null) { customerURL = `/update-customer-details`;}

    const customerInformationInLocalStorage = {
      email,
      phone,
      lastname,
      firstname,
      deliverytime,
      doorhousename,
      isbysmsclicked,
      isbyemailclicked,
      driverinstruction,
    };

    setLocalStorage(`${BRANDSIMPLEGUID}customer_information`,customerInformationInLocalStorage);

    try {
      const data = {
        due:                due,
        email:              email,
        phone:              phone,
        street1:            street1,
        street2:            street2,
        postcode:           postcode,
        lastname:           lastname,
        firstname:          firstname,
        password:           password,
        store:              storeGUID,
        brand:              BRAND_GUID,
        order:              cartdata,
        filterId:           orderFilter === null ? selectedFilter?.id : orderFilter.id,
        filterName:         orderFilter === null ? selectedFilter?.name : orderFilter.name,
        partner:            PARTNER_ID,
        total_order:        localStorageTotal === null? getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2): getAmountConvertToFloatWithFixed(JSON.parse(localStorageTotal),2),
        deliverytime:       deliverytime,
        doorhousename:      doorhousename,
        isbysmsclicked:     isbysmsclicked,
        
        isbyemailclicked:   isbyemailclicked,
        driverinstruction:  driverinstruction,
        sub_total_order:    subTotalOrderLocal,
        
        
        orderAmountDiscount_guid: orderAmountDiscountValue,
        delivery_estimate_time:   updatedDeliveryTime._i,
        
        // delivery_estimate_time: moment(deliverytime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
        delivery_fee:             deliveryFeeLocalStorage,
        coupons:                  couponCodes,
        order_guid:               orderFromDatabaseGUID !== null ? JSON.parse(orderFromDatabaseGUID) : null,
      };
      // first check the order guid id in localStorage if it is null then store information then update them.

      const response = await axiosPrivate.post(customerURL, data);

      const responseData = response?.data?.data?.order?.order_total;
      if (response?.data?.status === "success") 
      {
        setLocalStorage(`${BRANDSIMPLEGUID}order_guid`,response?.data?.data?.order?.external_order_id);
        setLoader(false);

        if (parseFloat(responseData) === parseFloat(0.0)) 
        {
          route.push(`/track-order/${response?.data?.data?.order?.external_order_id}`);
          return;
        }
        route.push(`/payment/${response?.data?.data?.order?.external_order_id}`);
      }
    } 
    catch (error) 
    {
      setTimeout(() => { setLoader(false);}, 2000);
    }
  }

  function handlePayNow() 
  {
    setLoader(true);
    // console.log('Door:', doorhousename.length, "First",firstname.length,"last",lastname.length,"email",email.length, "phone",phone.length);
    if (
      parseInt(doorhousename.length) === parseInt(0) ||
      parseInt(email.length) === parseInt(0) ||
      parseInt(phone.length) === parseInt(0) ||
      parseInt(firstname.length) === parseInt(0) ||
      parseInt(lastname.length) === parseInt(0)
    ) {
      setPayNowBottomError("Please check * (asterisk) mark field and fill them.");
      setTimeout(() => {setLoader(false);}, 2000);
      return;
    }

    let checkNumber = validatePhoneNumber(phone);
    if (!checkNumber) {
      setIsavefasterdetailsclicked(false);
      setPayNowBottomError("Kindly enter valid contact number!.");
      setTimeout(() => {setLoader(false);}, 2000);
      return;
    }
    setPayNowBottomError("");
    storeCustomerDetail();
  }

  return (
    <Fragment>
      <div className="e5ald0m1m2amc5checkout-desk">
        <div className="m3m4m5gim6checkout-desk">
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
                    <a className="allzc5checkout-desk">
                      <div className="kgcheckout-desk">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 24 24"
                          className="c8c7cccdcheckout"
                        >
                          <g clipPath="url(#clip0)">
                            <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                          </g>
                          <defs>
                            <clipPath id="clip0">
                              <path
                                transform="translate(2 2)"
                                d="M0 0h20v20H0z"
                              ></path>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          {postcode}
                        </span>
                        <p
                          data-baseweb="typo-paragraphsmall"
                          className="b1chcwcid3checkout-desk"
                        >
                          <span
                            style={{
                              fontFamily: "UberMoveText",
                              color: "#545454",
                            }}
                          >
                            {street1} {street2}
                          </span>
                        </p>
                      </div>

                      <button
                        className="chcicjckhacheckout-desk-btn"
                        onClick={handlePostcodeEdit}
                      >
                        {deliverydetailtext}
                      </button>
                    </a>

                    {ispostcodeeditclicked && (
                      <div className="btautrackorder-postcode-edit">
                        <input type="text" className="strtpostcode" value={street1} />
                        <input type="text" className="strtpostcode" value={street2} />
                        <div className="strtpostcode-btn">
                          <input type="text" className="strtpostcode" value={postcode} />
                          <button className="change_postcode_btn" onClick={() => setIschangepostcodeclicked( !ischangepostcodeclicked )}>Change postcode</button>
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
                        <svg aria-hidden="true"focusable="false"viewBox="0 0 26 26"className="cxcwd0d1checkout-svg">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z"
                          ></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add door number{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                        {!isdoorinputdisplayclicked && (
                          <p
                            data-baseweb="typo-paragraphsmall"
                            className="b1chcwcid3checkout-desk"
                          >
                            <span
                              style={{
                                fontFamily: "UberMoveText",
                                color: "#05944F",
                              }}
                            >
                              {doorhousename}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        className="chcicjckhacheckout-desk-btn"
                        onClick={handleDoorHouseClicked}
                      >
                        {doornumbertext}
                      </button>
                    </div>

                    {isdoorinputdisplayclicked && (
                      <div className="btaucheckout-window">
                        <input type="text" ref={addDoorNumberRef} placeholder="Enter door number or name" value={doorhousename} className={`door_number ${parseInt(doorhousename.length) > parseInt(0)? "parse-success": "parse-erorr"}`} onChange={handleDoorOrHouse}/>
                      </div>
                    )}
                    <div className="alcheckout-desk">
                      <div className="spacer _40"></div>
                      <div className="edhtb9d1checkout-desk"></div>
                    </div>
                  </div>

                  <div className="d1g1checkout-desk">
                    <a className="allzc5checkout-desk">
                      <div className="kgcheckout-desk">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 26 26"
                          className="cxcwd0d1checkout-svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z"
                          ></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add driver instructions
                        </span>
                        {!isadddriverdisplayclicked && (
                          <p
                            data-baseweb="typo-paragraphsmall"
                            className="b1chcwcid3checkout-desk"
                          >
                            <span
                              style={{
                                fontFamily: "UberMoveText",
                                color: "#05944F",
                              }}
                            >
                              {driverinstruction}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        className="chcicjckhacheckout-desk-btn"
                        onClick={handleDriverInstruction}
                      >
                        {isadddoortext}
                      </button>
                    </a>

                    {isadddriverdisplayclicked && (
                      <div className="btaucheckout-window">
                        <textarea
                          placeholder="Add delivery instructions"
                          rows="2"
                          aria-label="Add delivery instructions"
                          value={driverinstruction}
                          onChange={handleDriverInstructionEvent}
                          className="door_number"
                          spellCheck="false"
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <hr className="edfhmthtcheckout-desk"></hr>
              <div className="mimjepmkmlmmcheckout-desk">
                <h3 className="eik5ekk6checkout-desk">
                  <span className="d1chekcout-desk-span">Contact Details</span>
                </h3>

                <div className="d1g1checkout-desk">
                  <a className="allzc5checkout-desk">
                    <div className="f2checkout-desk">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 24 24"
                        className="c8c7cccdcheckout"
                      >
                        <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                      </svg>
                    </div>

                    <div className="alamd1g1checkout-desk">
                      <span className="chd2cjd3b1checkout-desk">
                        Add email address{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                      {!isemailinputtoggle && (
                        <p
                          data-baseweb="typo-paragraphsmall"
                          className="b1chcwcid3checkout-desk"
                        >
                          <span
                            style={{
                              fontFamily: "UberMoveText",
                              color: "#05944F",
                            }}
                          >
                            {email}
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      className="chcicjckhacheckout-desk-btn"
                      onClick={handleEmailToggle}
                    >
                      {emailaddbtntext}
                    </button>
                  </a>

                  {isemailinputtoggle && (
                    <div className="btaucheckout-window">
                      <input
                        type="email"
                        required
                        placeholder="Enter email"
                        value={email}
                        className={`email-checkout ${
                          parseInt(email.length) > parseInt(0)
                            ? "parse-success"
                            : "parse-erorr"
                        }`}
                        onChange={handleUserEmail}
                      />
                      {/* {
                        parseInt(emailError.length) > parseInt(0) &&
                        <>
                          <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                          
                          <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                            <span style={{color: "red"}}>* This field is required.</span>
                          </div>
                        </>
                      } */}
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
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 24 24"
                        className="c8c7cccdcheckout"
                      >
                        <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                      </svg>
                    </div>

                    <div className="alamd1g1checkout-desk">
                      <span className="chd2cjd3b1checkout-desk">
                        Add phone number <span style={{ color: "red" }}>*</span>
                      </span>
                      {!isphoneinputtoggle && (
                        <p
                          data-baseweb="typo-paragraphsmall"
                          className="b1chcwcid3checkout-desk"
                        >
                          <span
                            style={{
                              fontFamily: "UberMoveText",
                              color: "#05944F",
                            }}
                          >
                            {phone}
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      className="chcicjckhacheckout-desk-btn"
                      onClick={handlePhoneToggle}
                    >
                      {phoneaddbtntext}
                    </button>
                  </a>

                  {isphoneinputtoggle && (
                    <div className="btaucheckout-window">
                      <input
                        type="number"
                        placeholder="Enter phone number"
                        value={phone}
                        className={`email-checkout ${
                          parseInt(phone.length) > parseInt(0)
                            ? "parse-success"
                            : "parse-erorr"
                        }`}
                        onChange={handleUserPhone}
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
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 24 24"
                        className="c8c7cccdcheckout"
                      >
                        <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                      </svg>
                    </div>

                    <div className="alamd1g1checkout-desk">
                      <span className="chd2cjd3b1checkout-desk">
                        Add name <span style={{ color: "red" }}>*</span>
                      </span>
                      {!isfirstnametoggle && (
                        <p
                          data-baseweb="typo-paragraphsmall"
                          className="b1chcwcid3checkout-desk"
                        >
                          <span
                            style={{
                              fontFamily: "UberMoveText",
                              color: "#05944F",
                            }}
                          >
                            {firstname} {lastname}
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      className="chcicjckhacheckout-desk-btn"
                      onClick={handleFirstNameToggle}
                    >
                      {firstnameaddbtntext}
                    </button>
                  </a>

                  {isfirstnametoggle && (
                    <>
                      <div className="btaucheckout-window">
                        <input
                          type="text"
                          style={{ marginBottom: "4px" }}
                          placeholder="Enter first name"
                          value={firstname}
                          className={`email-checkout ${
                            parseInt(firstname.length) > parseInt(0)
                              ? "parse-success"
                              : "parse-erorr"
                          }`}
                          onChange={handleUserFirstName}
                        />
                      </div>

                      <div className="btaucheckout-window">
                        <input
                          type="text"
                          placeholder="Enter last name"
                          value={lastname}
                          className={`email-checkout ${
                            parseInt(lastname.length) > parseInt(0)
                              ? "parse-success"
                              : "parse-erorr"
                          }`}
                          onChange={handleUserLastName}
                        />
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <title>Calendar</title>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M23 8V4h-3V1h-3v3H7V1H4v3H1v4h22Zm0 15H1V10h22v13ZM8 14H5v3h3v-3Z"
                          fill="currentColor"
                        ></path>
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
                                  <option key={index} value={time?.time}>
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
              {/* <div className='mimjepmkmlmmcheckout-desk'>
                <div className="allzc5checkout-desk">
                  <div className="f2checkout-desk">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdcheckout">
                      <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                    </svg>
                  </div> 
                  <input type="checkbox" className="agaxlqdflacheckout-desk-input"></input>
                  <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isavefasterdetailsclicked ? "mch" : ""}`} onClick={handleSaveMyDetails}>
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
                          iscustomerhaspassword === false &&
                          <div className="btaundersavefastercheckout">
                            <label className='password-label'><span style={{color: "red"}}>*</span>Password: </label>
                            <input type="password" placeholder="Enter password" value={password} className="undersavecheckoutinput" onChange={handlePassword}/>
                          </div>
                        }
                        <div className='alh2amenc9jdundersavefastercheckout'>
                          {
                            iscustomerhaspassword ?
                              <button className='agloundersavefastercheckout' onClick={handleLogin}>Login</button>
                            :
                              <button className='agloundersavefastercheckout' onClick={handleRegisteration}>Register</button>
                          }
                          <button className='coasgundersavefastercheckout' onClick={() => setIsavefasterdetailsclicked(!isavefasterdetailsclicked)}>Continue as guest user</button>
                        </div>
                      </div>
                    </div>
                   
                  </>
                }
              </div> */}

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
                    <div
                      className="allzc5checkout-desk"
                      onClick={() => setIsbyemailclicked(!isbyemailclicked)}
                    >
                      <input
                        type="checkbox"
                        className="agaxlqdflacheckout-desk-input"
                      ></input>
                      <label
                        className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${
                          isbyemailclicked ? "mch" : ""
                        }`}
                      >
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
                    <div
                      className="allzc5checkout-desk"
                      onClick={() => setIsbysmsclicked(!isbysmsclicked)}
                    >
                      <input
                        type="checkbox"
                        className="agaxlqdflacheckout-desk-input"
                      ></input>
                      <label
                        className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${
                          isbysmsclicked ? "mch" : ""
                        }`}
                      >
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
                {parseInt(PayNowBottomError.length) > parseInt(0) && (
                  <p
                    style={{
                      color: "red",
                      background: "#eda7a7",
                      textAlign: "center",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {PayNowBottomError}
                  </p>
                )}
                <div className="boh7bqh8checkout-desk">
                  <button
                    className="h7brboe1checkout-btn"
                    onClick={handlePayNow}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
              <div className="eeb0checkout-desk">
                <div className="b5grekcheckout-desk">
                  {/* <hr className='f7bsh1f8checkout-hr'></hr> */}
                  <div className="bkhybmh8aldfcheckout-desk">
                    <div className="albcaqcheckout">Total</div>
                    &pound;{getAmountConvertToFloatWithFixed(totalOrderAmountValue, 2)}
                  </div>

                  <div className="itcheckout-desk">
                    <div className="bodgbqdhfncheckout-desk">
                      <div className="bodgbqdhb1checkout-desK">
                        <span className="bodgbqdhiucheckout-desk">
                          <span className="bodge1exiucheckout-desk-span">
                            ALLERGIES:{" "}
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
                </div>
              </div>
              <div className="gqcheckout-desk"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="afcheckout">
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
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            viewBox="0 0 24 24"
                            className="c8c7cccdcheckout"
                          >
                            <g clipPath="url(#clip0)">
                              <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                            </g>
                            <defs>
                              <clipPath id="clip0">
                                <path
                                  transform="translate(2 2)"
                                  d="M0 0h20v20H0z"
                                ></path>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            {postcode}
                          </span>
                          <p
                            data-baseweb="typo-paragraphsmall"
                            className="b1chcwcid3checkout-desk"
                          >
                            <span
                              style={{
                                fontFamily: "UberMoveText",
                                color: "#545454",
                              }}
                            >
                              {street1} {street2}
                            </span>
                          </p>
                        </div>

                        <button
                          className="chcicjckhacheckout-desk-btn"
                          onClick={handlePostcodeEdit}
                        >
                          {deliverydetailtext}
                        </button>
                      </a>
                      {ispostcodeeditclicked && (
                        <div className="btautrackorder-postcode-edit">
                          <input
                            type="text"
                            className="strtpostcode"
                            value={street1}
                          ></input>
                          <input
                            type="text"
                            className="strtpostcode"
                            value={street2}
                          ></input>
                          <div className="strtpostcode-btn">
                            <input
                              type="text"
                              className="strtpostcode"
                              value={postcode}
                            ></input>
                            <button
                              className="change_postcode_btn"
                              onClick={() =>
                                setIschangepostcodeclicked(
                                  !ischangepostcodeclicked
                                )
                              }
                            >
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
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            viewBox="0 0 26 26"
                            className="cxcwd0d1checkout-svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z"
                            ></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add door number{" "}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                          {!isdoorinputdisplayclicked && (
                            <p
                              data-baseweb="typo-paragraphsmall"
                              className="b1chcwcid3checkout-desk"
                            >
                              <span
                                style={{
                                  fontFamily: "UberMoveText",
                                  color: "#05944F",
                                }}
                              >
                                {doorhousename}
                              </span>
                            </p>
                          )}
                        </div>

                        <button
                          className="chcicjckhacheckout-desk-btn"
                          onClick={handleDoorHouseClicked}
                        >
                          {doornumbertext}
                        </button>
                      </div>

                      {isdoorinputdisplayclicked && (
                        <div className="btaucheckout-window">
                          <input
                            type="text"
                            ref={addDoorNumberRef}
                            placeholder="Enter door number or name"
                            value={doorhousename}
                            className={`door_number ${
                              parseInt(doorhousename.length) > parseInt(0)
                                ? "parse-success"
                                : "parse-erorr"
                            }`}
                            onChange={handleDoorOrHouse}
                          />
                          {/* <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                            
                            <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                                <span style={{color: "red"}}>* This field is required.</span>
                            </div> */}
                        </div>
                      )}

                      <div className="alcheckout-desk">
                        <div className="spacer _40"></div>
                        <div className="edhtb9d1checkout-desk"></div>
                      </div>
                    </div>

                    <div className="d1g1checkout-desk">
                      <a className="allzc5checkout-desk">
                        <div className="kgcheckout-desk">
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            viewBox="0 0 26 26"
                            className="cxcwd0d1checkout-svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.958 7.042a5.958 5.958 0 11-11.916 0 5.958 5.958 0 0111.916 0zM3.25 21.667c0-3.575 2.925-6.5 6.5-6.5h6.5c3.575 0 6.5 2.925 6.5 6.5v3.25H3.25v-3.25z"
                            ></path>
                          </svg>
                        </div>

                        <div className="alamd1g1checkout-desk">
                          <span className="chd2cjd3b1checkout-desk">
                            Add driver instructions
                          </span>
                          {!isadddriverdisplayclicked && (
                            <p
                              data-baseweb="typo-paragraphsmall"
                              className="b1chcwcid3checkout-desk"
                            >
                              <span
                                style={{
                                  fontFamily: "UberMoveText",
                                  color: "#05944F",
                                }}
                              >
                                {driverinstruction}
                              </span>
                            </p>
                          )}
                        </div>
                        <button
                          className="chcicjckhacheckout-desk-btn"
                          onClick={handleDriverInstruction}
                        >
                          {isadddoortext}
                        </button>
                      </a>
                      {isadddriverdisplayclicked && (
                        <div className="btaucheckout-window">
                          {/* <textarea placeholder="Add delivery instructions" className="door_number" ></textarea> */}
                          <textarea
                            placeholder="Add delivery instructions"
                            rows="2"
                            aria-label="Add delivery instructions"
                            value={driverinstruction}
                            onChange={handleDriverInstructionEvent}
                            className="door_number"
                            spellCheck="false"
                          ></textarea>
                          {/* <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                          
                          <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                            <span style={{color: "red"}}>* This field is required.</span>
                          </div> */}
                        </div>
                      )}
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
                    <a className="allzc5checkout-desk">
                      <div className="f2checkout-desk">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 24 24"
                          className="c8c7cccdcheckout"
                        >
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add email address{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                        {!isemailinputtoggle && (
                          <p
                            data-baseweb="typo-paragraphsmall"
                            className="b1chcwcid3checkout-desk"
                          >
                            <span
                              style={{
                                fontFamily: "UberMoveText",
                                color: "#05944F",
                              }}
                            >
                              {email}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        className="chcicjckhacheckout-desk-btn"
                        onClick={handleEmailToggle}
                      >
                        {emailaddbtntext}
                      </button>
                    </a>

                    {isemailinputtoggle && (
                      <div className="btaucheckout-window">
                        <input
                          type="email"
                          required
                          placeholder="Enter email"
                          value={email}
                          className={`email-checkout ${
                            parseInt(email.length) > parseInt(0)
                              ? "parse-success"
                              : "parse-erorr"
                          }`}
                          onChange={handleUserEmail}
                        />
                        {/* {
                          parseInt(emailError.length) > parseInt(0) &&
                          <>
                            <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                            
                            <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                              <span style={{color: "red"}}>* This field is required.</span>
                            </div>
                          </>
                        } */}
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
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 24 24"
                          className="c8c7cccdcheckout"
                        >
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add phone number{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                        {!isphoneinputtoggle && (
                          <p
                            data-baseweb="typo-paragraphsmall"
                            className="b1chcwcid3checkout-desk"
                          >
                            <span
                              style={{
                                fontFamily: "UberMoveText",
                                color: "#05944F",
                              }}
                            >
                              {phone}
                            </span>
                          </p>
                        )}
                      </div>
                      <button
                        className="chcicjckhacheckout-desk-btn"
                        onClick={handlePhoneToggle}
                      >
                        {phoneaddbtntext}
                      </button>
                    </a>

                    {isphoneinputtoggle && (
                      <div className="btaucheckout-window">
                        <input
                          type="number"
                          placeholder="Enter phone number"
                          value={phone}
                          className={`email-checkout ${
                            parseInt(phone.length) > parseInt(0)
                              ? "parse-success"
                              : "parse-erorr"
                          }`}
                          onChange={handleUserPhone}
                        />
                        {/* <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                      
                      <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                      <span style={{color: "red"}}>* This field is required.</span>
                      </div> */}
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
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 24 24"
                          className="c8c7cccdcheckout"
                        >
                          <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                        </svg>
                      </div>

                      <div className="alamd1g1checkout-desk">
                        <span className="chd2cjd3b1checkout-desk">
                          Add name <span style={{ color: "red" }}>*</span>
                        </span>
                        {!isfirstnametoggle && (
                          <p
                            data-baseweb="typo-paragraphsmall"
                            className="b1chcwcid3checkout-desk"
                          >
                            <span
                              style={{
                                fontFamily: "UberMoveText",
                                color: "#05944F",
                              }}
                            >
                              {firstname} {lastname}
                            </span>
                          </p>
                        )}
                      </div>
                      <button
                        className="chcicjckhacheckout-desk-btn"
                        onClick={handleFirstNameToggle}
                      >
                        {firstnameaddbtntext}
                      </button>
                    </a>

                    {isfirstnametoggle && (
                      <>
                        <div className="btaucheckout-window">
                          <input
                            type="text"
                            placeholder="Enter first name"
                            style={{ marginBottom: "4px" }}
                            value={firstname}
                            className={`email-checkout ${
                              parseInt(firstname.length) > parseInt(0)
                                ? "parse-success"
                                : "parse-erorr"
                            }`}
                            onChange={handleUserFirstName}
                          />
                          {/* <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>
                        
                        <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                            <span style={{color: "red"}}>* This field is required.</span>
                        </div> */}
                        </div>

                        <div className="btaucheckout-window">
                          <input
                            type="text"
                            placeholder="Enter last name"
                            value={lastname}
                            className={`email-checkout ${
                              parseInt(lastname.length) > parseInt(0)
                                ? "parse-success"
                                : "parse-erorr"
                            }`}
                            onChange={handleUserLastName}
                          />
                          {/* <div data-lastpass-icon-root="true" style={{position: "relative !important", height: "0px !important", width: "0px !important", float: "left !important"}}></div>

                        <div style={{marginTop: "5px", lineHeight: "16px", fontSize: "14px"}}>
                            <span style={{color: "red"}}>* This field is required.</span>
                        </div> */}
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
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <title>Calendar</title>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M23 8V4h-3V1h-3v3H7V1H4v3H1v4h22Zm0 15H1V10h22v13ZM8 14H5v3h3v-3Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>

                      <div className="ald0fwc5checkout-desk">
                        <h3 className="alamk3checkout-desk-h3">
                          <div className="alc5checkout-desk">
                            <span className="chd2cjd3checkout-desk-span">
                              Schedule
                            </span>
                          </div>
                          <select
                            value={moment(deliverytime, "HH:mm A").format(
                              "HH:mm A"
                            )}
                            className="bubvbwbdbxbybkaubzc0checkout-window-input"
                            onChange={handleDeliveryTime}
                          >
                            {listtime?.map((time, index) => {
                              return (
                                moment(time?.time, "HH:mm").format("HH:mm") >=
                                  moment(openingtime, "HH:mm").format(
                                    "HH:mm"
                                  ) &&
                                moment(closingtime, "HH:mm").format("HH:mm") >=
                                  moment(time?.time, "HH:mm").format(
                                    "HH:mm"
                                  ) && (
                                  <option key={index} value={time?.time}>
                                    {moment(time?.time, "HH:mm A").format(
                                      "HH:mm A"
                                    )}
                                  </option>
                                )
                              );
                            })}
                          </select>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {parseInt(saveMyDetailsError.length) > parseInt(0) && (
                  <p
                    style={{
                      color: "red",
                      background: "#eda7a7",
                      textAlign: "center",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {saveMyDetailsError}
                  </p>
                )}
                <div className="mimjepmkmlmmcheckout-desk">
                  <div className="allzc5checkout-desk">
                    <div className="f2checkout-desk">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 24 24"
                        className="c8c7cccdcheckout"
                      >
                        <path d="M11.333 22l10-10V3.667H13l-10 10L11.333 22z"></path>
                      </svg>
                    </div>
                    <input
                      type="checkbox"
                      className="agaxlqdflacheckout-desk-input"
                    ></input>
                    {/* <label className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${isavefasterdetailsclicked ? "mch" : ""}`} onClick={() => setIsavefasterdetailsclicked(!isavefasterdetailsclicked)}> handleSaveMyDetails */}
                    <label
                      className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${
                        isavefasterdetailsclicked ? "mch" : ""
                      }`}
                      onClick={handleSaveMyDetails}
                    >
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

                {isavefasterdetailsclicked && (
                  <div className="chcicwd3undersavefastercheckout">
                    <div className="toundersavefastercheckout">
                      <div className="eik4ekk5g8undersavefastercheckout">
                        <span className="h3euh4eimfekfdundersavefastercheckout-span">
                          {Message}
                        </span>
                      </div>

                      {iscustomerhaspassword === false && (
                        <div className="btaundersavefastercheckout">
                          <label className="password-label">
                            <span style={{ color: "red" }}>*</span>Password:{" "}
                          </label>
                          <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            className="undersavecheckoutinput"
                            onChange={handlePassword}
                          />
                        </div>
                      )}

                      <div className="alh2amenc9jdundersavefastercheckout">
                        {iscustomerhaspassword ? (
                          <button
                            className="agloundersavefastercheckout"
                            onClick={handleLogin}
                          >
                            Login
                          </button>
                        ) : (
                          <button
                            className="agloundersavefastercheckout"
                            onClick={handleRegisteration}
                          >
                            Register
                          </button>
                        )}
                        <button
                          className="coasgundersavefastercheckout"
                          onClick={() =>
                            setIsavefasterdetailsclicked(
                              !isavefasterdetailsclicked
                            )
                          }
                        >
                          Continue as guest user
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                      <div
                        className="allzc5checkout-desk"
                        onClick={() => setIsbyemailclicked(!isbyemailclicked)}
                      >
                        <input
                          type="checkbox"
                          className="agaxlqdflacheckout-desk-input"
                        ></input>
                        <label
                          className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${
                            isbyemailclicked ? "mch" : ""
                          }`}
                        >
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
                      <div
                        className="allzc5checkout-desk"
                        onClick={() => setIsbysmsclicked(!isbysmsclicked)}
                      >
                        <input
                          type="checkbox"
                          className="agaxlqdflacheckout-desk-input"
                        ></input>
                        <label
                          className={`chd2cjd3bzalafc5l9fwc9lblrcheckout-desk-label ${
                            isbysmsclicked ? "mch" : ""
                          }`}
                        >
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
                {parseInt(PayNowBottomError.length) > parseInt(0) && (
                  <p
                    style={{
                      color: "red",
                      background: "#eda7a7",
                      textAlign: "center",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {PayNowBottomError}
                  </p>
                )}
                <button
                  className="fwbrbocheckout-place-order"
                  onClick={handlePayNow}
                >
                  Pay Now
                </button>
                <div style={{ height: "10px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Testing */}

      {ischangepostcodeclicked && (
        <div className="modal-delivery-details">
          <div className="modal-delivery-details-level-one-div">
            <div className="modal-delivery-details-level-one-div-height"></div>
            <div className="modal-delivery-details-level-one-div-dialog">
              <div></div>
              <div className="modal-delivery-details-level-one-div-dialog-header">
                <div className="delivery-empty-div"></div>
                <button className="delivery-modal-close-button">
                  <div
                    className="delivery-modal-close-button-svg-div"
                    onClick={() =>
                      setIschangepostcodeclicked(!ischangepostcodeclicked)
                    }
                  >
                    <svg
                      width="24px"
                      height="24px"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z"
                        fill="#000000"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              {ischangepostcodeclicked && <PostcodeModal />}
            </div>
            <div className="modal-delivery-details-level-one-div-height"></div>
          </div>
        </div>
      )}

      <Loader loader={loader} />
    </Fragment>
  );
}

export default UserForm;
