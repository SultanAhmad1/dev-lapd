"use client";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID } from "@/global/Axios";
import React, { useContext } from "react";

export default function MenuNotAvailableModal({errorMessage}) 
{
    const { setAtFirstLoad, setComingSoon} = useContext(HomeContext)

    const storeDetail = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))

    const handleClearAll = () => {

        const checkAuth = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
        setAtFirstLoad(true)
        setComingSoon(false)
        
        if(checkAuth === undefined || checkAuth === null)
        {
            localStorage.clear()
            return
        }
    }

    return (
        <>
            <div className="modal-delivery-details">
                <div className="modal-delivery-details-level-one-div">
                    <div className="modal-delivery-details-level-one-div-height"></div>

                    <div className="modal-delivery-details-level-one-div-dialog">
                    <div className="modal-delivery-details">
                        <div className="modal-delivery-details-level-one-div">
                            <div className="modal-delivery-details-level-one-div-height"></div>

                            <div className="modal-delivery-details-level-one-div-dialog">
                            <div className="deliver-to-body-content">
                                <div className="deliver-to-body-content-nested-div-level-one">

                                <form >
                                    <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label" >
                                    When autocomplete results are available, use up and down arrows
                                    to review and enter to select. Touch device users, explore by
                                    touch or with swipe gestures.
                                    </label>

                                    <div className="availabe_stores"></div>
                                    
                                    <p style={{ color:" #6e9600",background: "rgb(235 214 124)",textAlign: "center", marginTop: "10px",padding: "10px",fontWeight: "bold"}}>
                                        {/* Comming Soon at {storeDetail?.store} */}
                                        {errorMessage}
                                    </p>

                                    <button type="button" className="deliver-to-done-button" onClick={handleClearAll}>Click to try with different postcode.</button>
                                </form>

                                </div>

                            </div>
                            </div>

                            <div className="modal-delivery-details-level-one-div-height"></div>
                        </div>
                    </div>
                        
                        

                    </div>

                    <div className="modal-delivery-details-level-one-div-height"></div>
                </div>
            </div>
        </>
    )
}
