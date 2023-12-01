import HomeContext from '@/app/contexts/HomeContext'
import { BRAND_GUID, axiosPrivate } from '@/app/global/Axios'
import React, { useContext, useEffect, useState } from 'react'
import { find_matching_postcode, getAtFirstLoadModalShow, getStoreName, setAtFirstLoadModalShow, setLocalStorage, setStoreName } from '@/app/global/Store'
function SubAtLoadLoadShow() 
{
   
    const {setStoreName,dayname,daynumber,postcode, setPostcode, setAtfirstload, setIsgobtnclicked,setPostcodefororderamount, deliverymatrix,setDeliverymatrix,setStreet1,setStreet2} = useContext(HomeContext)

    const [validpostcode, setValidpostcode] = useState("")
    const [postcodeerror, setPostcodeerror] = useState("")

    const [isgobtnclickable, setIsgobtnclickable] = useState(false)

    const [availablestores, setAvailablestores] = useState([])
    const handlePostCode = (event) =>
    {   
        setValidpostcode(event.target.value.toUpperCase())
        setPostcodeerror("")
    }

    useEffect(() => {
      if(parseInt(validpostcode.length) > parseInt(0))
      {
        setIsgobtnclickable(true)
        setAtFirstLoadModalShow(true)
      }
    }, [validpostcode])

  

    const fetchPostcodeData = async () => {
        try 
        {
            const data = {
                postcode: validpostcode,
                brand_guid: BRAND_GUID,
                dayname: dayname,
                daynumber: daynumber
            }
            // console.log("The Data:", data);
            const response = await axiosPrivate.post(`/ukpostcode-website`, data);
            const matrix = response.data?.data?.deliveryMartix?.delivery_matrix_rows
              console.log("Success repsonse:", response.data);
            
            find_matching_postcode(matrix, validpostcode, setDeliverymatrix)
            setLocalStorage('address',response?.data?.data)
            setLocalStorage('user_valid_postcode', validpostcode)
        
            setAvailablestores(response.data?.data?.availableStore)
            
            setIsgobtnclickable(false)
            setPostcode(validpostcode)
        } catch (error) {
          setPostcodeerror(error?.response?.data?.postcode)
          setIsgobtnclickable(false)
        }
    };

    useEffect(() => {
      if(deliverymatrix !== null)
      {
        setPostcodefororderamount(deliverymatrix?.postcode)
        window.localStorage.setItem("delivery_matrix", JSON.stringify(deliverymatrix))
      }
    
    }, [deliverymatrix])
    
    const handleGoBtn = () =>
    {
        fetchPostcodeData();
    }

    const handleLocationSelect = (storeGUID,storeName, storeTelephone) =>
    {
        setStoreName(storeName)
        setAtfirstload(false)
        if(parseInt(availablestores.length) > parseInt(0))
        {
            for(const store of availablestores)
            {
                if(storeGUID === store?.location_guid)
                {
                    setStreet1(store?.user_street1)
                    setStreet2(store?.user_street2)
                }
            }
        }
        const selectedStoreData = {
            display_id: storeGUID,
            store: storeName,
            telephone: storeTelephone
        }
        setLocalStorage('user_selected_store', selectedStoreData)
    }

    return (
        <div className="modal-delivery-details">
            <div className="modal-delivery-details-level-one-div">
                <div className="modal-delivery-details-level-one-div-height"></div>

                <div className="modal-delivery-details-level-one-div-dialog">
    
                    {/* <div className="modal-delivery-details-level-one-div-dialog-header">
                        <div className="delivery-empty-div"></div>
                        <button className="delivery-modal-close-button">
                            
                            <div className="delivery-modal-close-button-svg-div" onClick={() => setAtfirstload(false)}>
                                <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <path d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" fill="#000000"></path>
                                </svg>
                            </div>

                        </button>
                    </div> */}

                    <div className="deliver-to-body-content">
                        <h1 className="deliver-to-body-content-h1">Order Food Now</h1>
                        <div className="deliver-to-body-content-nested-div-level-one">
                            <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label">
                                When autocomplete results are available, use up and
                                down arrows to review and enter to select. Touch
                                device users, explore by touch or with swipe
                                gestures.
                            </label>

                            <div className="deliver-to-body-content-nested-div-level-one-nested">
                                <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                                    <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
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
                                                d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="spacer _16"></div>
                            
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="deliver-to-input"
                                    placeholder="Enter postcode"
                                    value={validpostcode}
                                    onChange={handlePostCode}
                                ></input>
                                <div className="spacer _8"></div>
                            </div>

                            <div className='availabe_stores'>

                            </div>
                            {
                                parseInt(postcodeerror.length) > parseInt(0) &&
                                <p style={{color: "red", background: "#eda7a7", textAlign: "center"}}>{postcodeerror}</p>
                            }
                        </div>

                        {/* All the Available Stores */}
                        {
                            parseInt(availablestores.length) > parseInt(0) &&
                            <>
                                <h2 className="available-store-h2"> Available Stores </h2>
                                <div className="deliver-to-body-content-nested-div-level-one">
                                    <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label">
                                        When autocomplete results are available, use up and
                                        down arrows to review and enter to select. Touch
                                        device users, explore by touch or with swipe
                                        gestures.
                                    </label>

                                    {
                                        availablestores?.map((stores, index) =>
                                        {
                                            return(
                                                <div className="available-stores-show" style={{cursor: "pointer"}} key={index} onClick={() => handleLocationSelect(stores.location_guid,stores.location_name, stores.telephone)}>
                                                    <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                                                        <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                                                                <g data-name="Building Store">
                                                                    <path d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z" style={{fill:"#232328"}}/><path style={{fill:"#232328"}} d="M29.87 10h4.45l1.2-3h-6.08l.43 3z"/><path d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z" style={{fill:"#232328"}}/><path d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z" style={{fill:"#232328"}}/>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="spacer _16"></div>
                                                
                                                    <div className="available-stores">{stores?.location_name}</div>
                                                    <div className="spacer _8"></div>
                                                </div>
                                            )
                                        })
                                    }
                                
                                </div>
                            </>
                        }
                        {
                            isgobtnclickable &&
                            <button className="deliver-to-done-button" onClick={handleGoBtn}> Go </button>
                        }
                    </div>
                    
                </div>

                <div className="modal-delivery-details-level-one-div-height"></div>
            </div>
        </div>
    )
}

export default SubAtLoadLoadShow