import HomeContext from '@/app/contexts/HomeContext'
import { BRAND_GUID, axiosPrivate } from '@/app/global/Axios'
import React, { useContext, useEffect, useState } from 'react'

function SubAtLoadLoadShow() 
{
    const {dayname,daynumber,postcode, setPostcode, setAtfirstload, setIsgobtnclicked} = useContext(HomeContext)

    const [validpostcode, setValidpostcode] = useState("")
    const [postcodeerror, setPostcodeerror] = useState("")

    const [isgobtnclickable, setIsgobtnclickable] = useState(false)

    const handlePostCode = (event) =>
    {   
        setValidpostcode(event.target.value.toUpperCase())
    }

    useEffect(() => {
      if(parseInt(validpostcode.length) > parseInt(0))
      {
        console.log("Valid postcode data:", validpostcode.length);
        setIsgobtnclickable(true)
      }
    }, [validpostcode])

    const fetchPostcodeData = async () => {
        try {
            const data = {
                postcode: validpostcode,
                brand_guid: BRAND_GUID,
                dayname: dayname,
                daynumber: daynumber
            }
            console.log("The Data:", data);
          const response = await axiosPrivate.post(`/ukpostcode-website`, data);
          console.log("Success repsonse:", response.data);
        //   setIsgobtnclickable(false)
        } catch (error) {
          console.error('Error fetching data:', error);
          setPostcodeerror(error?.response?.data?.postcode)
          setIsgobtnclickable(false)
        }
    };

    const handleGoBtn = () =>
    {
        fetchPostcodeData();
    }

    return (
        <div className="modal-delivery-details">
            <div className="modal-delivery-details-level-one-div">
                <div className="modal-delivery-details-level-one-div-height"></div>

                <div className="modal-delivery-details-level-one-div-dialog">
    
                    <div className="modal-delivery-details-level-one-div-dialog-header">
                        <div className="delivery-empty-div"></div>
                        <button className="delivery-modal-close-button">
                            
                            <div className="delivery-modal-close-button-svg-div" onClick={() => setAtfirstload(false)}>
                                <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <path d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" fill="#000000"></path>
                                </svg>
                            </div>

                        </button>
                    </div>

                    <div className="deliver-to-body-content">
                        <h1 className="deliver-to-body-content-h1"> Enter postcode </h1>
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

                            <p style={{color: "red"}}>{postcodeerror}</p>
                            {
                                isgobtnclickable &&
                                <button className="deliver-to-done-button" onClick={handleGoBtn}> Go </button>
                            }
                        </div>
                    </div>
                    
                </div>

                <div className="modal-delivery-details-level-one-div-height"></div>
            </div>
        </div>
    )
}

export default SubAtLoadLoadShow