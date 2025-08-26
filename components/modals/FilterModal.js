"use client";
import { useState } from "react"
import Loader from "./Loader"
import FilterLocationTime from "../FilterLocationTime";

function FilterModal() 
{

    const [loader, setLoader] = useState(false)
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
                                    <h1 className="deliver-to-body-content-h1">Delivery Type</h1>
                                    <div className="deliver-to-body-content-nested-div-level-one">
                                        <FilterLocationTime 
                                            {
                                                ...{
                                                    isDisplayFromModal: true
                                                }
                                            }
                                        />
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
            {loader && <Loader />}
        </>
    )
}

export default FilterModal