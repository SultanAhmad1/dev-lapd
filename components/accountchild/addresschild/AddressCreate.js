"use client";
import AccountAvailableStore from "@/components/account/AccountAvailableStore";
import { usePostAfterAuthenticateMutationHook, usePostMutationHook } from "@/components/reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_GUID, BRAND_SIMPLE_GUID, DELIVERY_ID, loginAxios, PARTNER_ID, USER_IMAGE } from "@/global/Axios";
import { find_collection_matching_postcode, find_matching_postcode, setLocalStorage, setNextCookies } from "@/global/Store";
import moment from "moment";
import React, { Fragment, useContext, useEffect, useState } from "react";

export default function AddressCreate({handleCreateAddress}) 
{
    const {
        setDayOpeningClosingTime,
        setIsTimeToClosed,
        setMenu,
        setSelectedFilter,
        setFilters,
        setNavigationCategories,
        setNavMobileIndex,
        setStoreToDayName,
        setStoreToDayOpeningTime,
        setStoreToDayClosingTime,
        setStoreCurrentOrNextDayOpeningTime,
        setStoreCurrentOrNextDayClosingTime,
        setPostCodeForOrderAmount,
        setComingSoon,
        setSelectedStoreDetails,
    } = useContext(HomeContext);

    const [addressObj, setAddressObj] = useState({
        customer: null,
        house: "",
        addressType: "",
        activeAddress: "",
        street1: "",
        street2: "",
        postcode: "",
        instructions: "",
        typedPostCode: "",
        isSearchPostcodeReady: true,
    });
    
    const handleInputs = (event) => {
        const { name, value } = event.target
        
        switch (name) {
            case "typedPostCode":
                setAddressObj((prevData) => ({...prevData, [name]: value, isSearchPostcodeReady: false}))
                break;
        
            default:
                setAddressObj((prevData) => ({...prevData, [name]: value, isSearchPostcodeReady: prevData?.isSearchPostcodeReady}))
                break;
        }
    }

    /** Handle Search Postcode. */

    const [deliveryMatrix, setDeliveryMatrix] = useState(null);
    const [availableStore, setAvailableStore] = useState([]);
    const [isStoreReady, setIsStoreReady] = useState(false);

    const [selectedStores, setSelectedStores] = useState({
        storeID: "",
        storeName: "",
        storeTelephone: "",
        street1: "",
        street2: "",
        address: null,
        validPostcode: "",
    });
    
    
    const handlePostCodeSearch = (e) => {
        e.preventDefault()

        const dayNumber = moment().day();
        const dayName = moment().format("dddd");

        let filterPostcode = addressObj?.typedPostCode?.replace(/\s/g, "");
    
        let grabPostcodeOutWard = "";
        if (parseInt(filterPostcode.length) === parseInt(7)) 
        {
          grabPostcodeOutWard = filterPostcode.substring(0, 4);
        } 
        else if (parseInt(filterPostcode.length) === parseInt(6)) 
        {
          grabPostcodeOutWard = filterPostcode.substring(0, 3);
        } 
        else 
        {
          grabPostcodeOutWard = filterPostcode.substring(0, 2);
        }
  
        const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const ukPostcodeData = {
          postcode: filterPostcode,
          brand_guid: BRAND_GUID,
          dayName: dayName,
          dayNumber: dayNumber,
          outwardString: grabPostcodeOutWard,
          visitorGUID: visitorInfo.visitorId
        };
        
        ukPostcodeMutate(ukPostcodeData)
    }
    
    const onWebsitePostcodeError = (error) => {
        
    }

    const onWebsitePostcodeSuccess = (data) => {
        const { deliveryMartix, availableStore } = data?.data?.data

        const addressListFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))
        if(addressListFilter !== null && addressListFilter !== undefined)
        {
            if(addressListFilter.id.includes(DELIVERY_ID))
            {
                const matrix = deliveryMartix?.delivery_matrix_rows
                find_matching_postcode(matrix, addressObj?.typedPostCode, setDeliveryMatrix);
            }
            else
            {
                const matrix = deliveryMartix?.collection_matrix_rows
                find_collection_matching_postcode(matrix, addressObj?.typedPostCode, setDeliveryMatrix);
            }
        }
        setSelectedStores((prevData) => ({...prevData, address: data?.data?.data, validPostcode: addressObj?.postcode}))

        setAddressObj((prevData) => ({...prevData, 
            street1: data?.data?.data?.ukpostcode?.street1, 
            street2: data?.data?.data?.ukpostcode?.street2,
            postcode: data?.data?.data?.ukpostcode?.postcode,
        }))

        setAvailableStore(availableStore);
        setIsStoreReady(true)
    }

    const {mutate: ukPostcodeMutate, isLoading: ukPostcodeLoading, isError: ukPostcodeError, isSuccess: ukPostcodeSuccess, reset: ukPostcodeReset} = usePostMutationHook('account-postcode-data', '/ukpostcode-website', onWebsitePostcodeSuccess, onWebsitePostcodeError)

    if(ukPostcodeSuccess)
    {
        ukPostcodeReset()
        return
    }

    const handleAccountUpdate = (event) => {
        event.preventDefault()

        const accountStoreData = {
            customer: addressObj?.customer?.id,
            house_no_name: addressObj?.house,
            is_default_address: 1,
            street1: addressObj?.street1,
            street2: addressObj?.street2,
            postcode: addressObj?.postcode,
            driver_instructions: addressObj?.instructions
        }

        addressPostMutation(accountStoreData)
    }

    const onError = (error) => {
        const { response } = error
    }

    const onSuccess = (data) => {
        const { customer } = data?.data?.data
        
        setLocalStorage(`${BRAND_SIMPLE_GUID}tempCustomer`, customer)
        /** Now set all the data to make localStorage. */

        const selectedStoreData = {
            display_id: selectedStores?.storeID,
            store: selectedStores?.storeName,
            telephone: selectedStores?.storeTelephone,
        };
        
        setPostCodeForOrderAmount(deliveryMatrix?.postcode);

        setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`,deliveryMatrix);

        setLocalStorage(`${BRAND_SIMPLE_GUID}address`, selectedStores?.address);
        setLocalStorage(`${BRAND_SIMPLE_GUID}user_valid_postcode`, selectedStores?.validPostcode);
        setLocalStorage(`${BRAND_SIMPLE_GUID}user_selected_store`, selectedStoreData);

        setSelectedStoreDetails({
            email: selectedStores?.storeEmail,
            telephone: selectedStores?.storeTelephone
        })
        
        authMenuMutate({
            location: selectedStoreData?.display_id,
            brand: BRAND_GUID,
            partner: PARTNER_ID,
        })
        handleCreateAddress()
    }

    const {mutate: addressPostMutation, isLoading, isSuccess, reset} = usePostAfterAuthenticateMutationHook("customer-update", `/customer-address-create`, onSuccess, onError)

    if(isSuccess)
    {
        setTimeout(() => {
            reset()
        }, 3000);
    }

    const onAuthError = (error) => {
        setMenu([])
        setComingSoon(true)
    }

    const onAuthMenuSuccess = (data) => {
        
          /**
           * Day
           * Current Time
        */
        const dayNumber = moment().day();
        const dateTime = moment().format("HH:mm");
        const dayName = moment().format("dddd");
        
        const convertToJSobj = data.data?.data?.menu.menu_json_log;
        
        if(convertToJSobj === null || convertToJSobj === undefined)
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
            setNextCookies(`${BRAND_SIMPLE_GUID}filter`, convertToJSobj.filters[0]);
        }

        setSelectedFilter(getFilterDataFromObj === null? convertToJSobj.filters[0] : getFilterDataFromObj);
        setFilters(convertToJSobj.filters);
        setNavigationCategories(convertToJSobj.categories);
        setNavMobileIndex(convertToJSobj.categories[0].id);

        const getDayInformation = convertToJSobj.menus[0].service_availability?.find((dayInformation) =>dayInformation.day_of_week === moment().format("dddd").toLowerCase());
        setStoreToDayName(moment().format("dddd"));

        setStoreToDayOpeningTime(getDayInformation.time_periods[0].start_time);
        setStoreToDayClosingTime(getDayInformation.time_periods[0].end_time);
        setStoreCurrentOrNextDayClosingTime(getDayInformation.time_periods[0].end_time);
        setStoreCurrentOrNextDayOpeningTime(getDayInformation.time_periods[0].start_time);
    }

    const {mutate: authMenuMutate, isSuccess: authMenuSuccess, reset: authMenuReset} = usePostAfterAuthenticateMutationHook('auth-menu', `/menu-auth`, onAuthMenuSuccess, onAuthError)

    if(authMenuSuccess)
    {
        authMenuReset()
        return
    }

    function handleLocationSelect(storeGUID, storeName, storeTelephone) 
    {

        setSelectedStores((prevData) => ({...prevData, storeID: storeGUID,  storeName: storeName, storeTelephone: storeTelephone}))

        if (parseInt(availableStore.length) > parseInt(0)) 
        {
            for (const store of availableStore) 
            {
                if (storeGUID === store?.location_guid) {
                    setSelectedStores((prevData) => ({...prevData, street1: store?.user_street1,  street2: store?.user_street2, validPostcode: store?.user_postcode}))
                }
            }
        }

        setIsStoreReady(false)
    }

    useEffect(() => {
        setTimeout(() => {
            if (parseInt(availableStore.length) === parseInt(1)) 
            {
                handleLocationSelect(
                    availableStore[0]?.location_guid,
                    availableStore[0]?.location_name,
                    availableStore[0]?.telephone
                );
            }
        }, 2000);
    }, [availableStore]);
    // code is working

    useEffect(() => {
        const customer = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}tempCustomer`))
        
        setAddressObj((prevData) => ({
            ...prevData,
            customer: customer,
        }))
        
    }, []);

    return(
        <Fragment>
            <form onSubmit={handleAccountUpdate}>
                <h1 className="address-title">Address Info</h1>

                <div className="title-with-button">
                    <button type="button" onClick={handleCreateAddress}> 
                        <svg width="50px" height="50px" viewBox="0 0 512 512" version="1.1" >
                            <g id="Layer_1"/>
                            <g id="Layer_2">
                                <g>
                                    <path className="st0" d="M217,129.88c-6.25-6.25-16.38-6.25-22.63,0L79.61,244.64c-0.39,0.39-0.76,0.8-1.11,1.23    c-0.11,0.13-0.2,0.27-0.31,0.41c-0.21,0.28-0.42,0.55-0.62,0.84c-0.14,0.21-0.26,0.43-0.39,0.64c-0.14,0.23-0.28,0.46-0.41,0.7    c-0.13,0.24-0.24,0.48-0.35,0.73c-0.11,0.23-0.22,0.45-0.32,0.68c-0.11,0.26-0.19,0.52-0.28,0.78c-0.08,0.23-0.17,0.46-0.24,0.69    c-0.09,0.29-0.15,0.58-0.22,0.86c-0.05,0.22-0.11,0.43-0.16,0.65c-0.08,0.38-0.13,0.76-0.17,1.14c-0.02,0.14-0.04,0.27-0.06,0.41    c-0.11,1.07-0.11,2.15,0,3.22c0.01,0.06,0.02,0.12,0.03,0.18c0.05,0.46,0.12,0.92,0.21,1.37c0.03,0.13,0.07,0.26,0.1,0.39    c0.09,0.38,0.18,0.76,0.29,1.13c0.04,0.13,0.09,0.26,0.14,0.4c0.12,0.36,0.25,0.73,0.4,1.09c0.05,0.11,0.1,0.21,0.15,0.32    c0.17,0.37,0.34,0.74,0.53,1.1c0.04,0.07,0.09,0.14,0.13,0.21c0.21,0.38,0.44,0.76,0.68,1.13c0.02,0.03,0.04,0.06,0.06,0.09    c0.55,0.81,1.18,1.58,1.89,2.29l114.81,114.81c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63    l-87.5-87.5h291.62c8.84,0,16-7.16,16-16s-7.16-16-16-16H129.51L217,152.5C223.25,146.26,223.25,136.13,217,129.88z"/>
                                </g>
                            </g>
                        </svg>
                    </button>
                    <button type="submit" disabled={isLoading} className="register-button">Save</button>
                </div>

                <div className="form-group">
                    <label className="form-label">&nbsp; House Number / Name:</label>
                    <input type="text" className="text-[16px] form-input" name="house" value={addressObj?.house} onChange={handleInputs} placeholder="Enter house name or number..." required/>
                </div>
                
                <div className="form-group">
                    <label className="form-label">&nbsp; Address Type:</label>
                    <select className="form-input" name="addressType" onChange={handleInputs}>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Friend">Friend&apos;s House</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                
                {/* <div className="form-group">
                    <label className="form-label">&nbsp; Active Address:</label>
                    <select className="form-input" name="activeAddress" onChange={handleInputs}>
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                    </select>
                </div> */}
                
                {
                    ukPostcodeError &&
                    <div className="alert-message">
                        {addressObj?.typedPostCode} is out of range.
                    </div>
                }

                <div className="form-group">
                    <label className="form-label">&nbsp; PostCode:</label>

                    <div className="account-address-input-button">
                        <input type="text" className="form-input-postcode" name="typedPostCode" value={addressObj?.typedPostCode} onChange={handleInputs} placeholder="Enter postcode..." required/>
                        <button type="button" className="account-change-address" style={{borderBottomRightRadius: "10px"}} disabled={addressObj.isSearchPostcodeReady || ukPostcodeLoading} onClick={handlePostCodeSearch}>Search</button>
                    </div>
                </div>

                <div className="form-group-address">
                    <label className="form-label">&nbsp; Address Detail:</label>
                        <input type="text" className="text-[16px] form-input-address" name="street1" onChange={handleInputs} style={{borderTop: "1px solid #000", borderLeft: "1px solid #000", borderRight: "1px solid #000", borderTopRightRadius:"10px",borderTopLeftRadius:"10px"}} value={addressObj.street1} placeholder="Street 1" required/>
                        <input type="text" className="text-[16px] form-input-address" name="street2" onChange={handleInputs} style={{borderLeft: "1px solid #000", borderRight: "1px solid #000"}} value={addressObj.street2} placeholder="Street 2" required/>
                        <input type="text" className="text-[16px] form-input-address" name="postcode" onChange={handleInputs} style={{borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}} value={addressObj.postcode} placeholder="Postcode" required/>

                        {/* <div className="account-address-input-button" style={{borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}}>
                            <input type="text" className="text-[16px] form-input-postcode" name="postcode" value={addressObj.postcode} onChange={handleInputs} style={{borderBottomLeftRadius: "10px"}} placeholder="Postcode" required/>
                            <button type="button" className="account-change-address" style={{borderBottomRightRadius: "10px"}}>Change Address</button>
                        </div> */}
                </div>

                <div className="form-group">
                    <label className="form-label">&nbsp; Driver Instructions:</label>
                    <textarea className="form-input" name="instructions" onChange={handleInputs} placeholder="Driver Instructions..."/>
                </div>

                {/* <div className="form-group">
                    <label className="form-label">&nbsp; Password:</label>
                    <input type="password" className="text-[16px] form-input" name="firstName" placeholder="Enter first name..." required/>
                </div> */}
            </form>
            
            {
                isStoreReady &&
                <div className="modal-delivery-details">
                    <div className="modal-delivery-details-level-one-div">
                        <div className="modal-delivery-details-level-one-div-height"></div>
            
                        <div className="modal-delivery-details-level-one-div-dialog">
                            <div className="deliver-to-body-content">
                            
                                {/* <AccountAvailableStore availableStores={availableStore} isStoreReady={isStoreReady} setIsStoreReady={setIsStoreReady}/> */}

                                <Fragment>
                                    <>
                                        <h2 className="available-store-h2"> Available Stores </h2>
                                        <div className="deliver-to-body-content-nested-div-level-one">
                                        <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label" >
                                            When autocomplete results are available, use up and down
                                            arrows to review and enter to select. Touch device users,
                                            explore by touch or with swipe gestures.
                                        </label>

                                        {
                                            availableStore?.map((stores, index) => {
                                            return (
                                                <div className="available-stores-show" style={{ cursor: "pointer" }} key={index} onClick={() => handleLocationSelect(stores.location_guid,stores.location_name,stores.telephone)}>
                                                    <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                                                        <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" >
                                                            <g data-name="Building Store">
                                                            <path
                                                                d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z"
                                                                style={{ fill: "#232328" }}
                                                            />
                                                            <path
                                                                style={{ fill: "#232328" }}
                                                                d="M29.87 10h4.45l1.2-3h-6.08l.43 3z"
                                                            />
                                                            <path
                                                                d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z"
                                                                style={{ fill: "#232328" }}
                                                            />
                                                            <path
                                                                d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z"
                                                                style={{ fill: "#232328" }}
                                                            />
                                                            </g>
                                                        </svg>
                                                        </div>
                                                    </div>

                                                    <div className="spacer _16"></div>

                                                    <div className="available-stores">
                                                        {stores?.location_name}
                                                    </div>
                                                    <div className="spacer _8"></div>
                                                </div>
                                            );
                                            })
                                        }
                                        </div>
                                    </>
                                </Fragment>
                            
                            </div>
                        </div>
            
                        <div className="modal-delivery-details-level-one-div-height"></div>
                    </div>
                </div>
            }
        </Fragment>
    )
}
