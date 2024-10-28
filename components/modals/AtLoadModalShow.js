"use client";
import { useState } from "react"
import Loader from "./Loader"
import SubAtLoadLoadShow from "./subcomponents/SubAtLoadLoadShow"

function AtLoadModalShow() 
{

    const [loader, setLoader] = useState(false)
    return (
        <>
            <div className="modal-delivery-details">
                <div className="modal-delivery-details-level-one-div">
                    <div className="modal-delivery-details-level-one-div-height"></div>

                    <div className="modal-delivery-details-level-one-div-dialog">
                        <div></div>
                        <SubAtLoadLoadShow setLoader={setLoader}/>
                    </div>

                    <div className="modal-delivery-details-level-one-div-height"></div>
                </div>
            </div>
            <Loader loader={loader}/>
        </>
    )
}

export default AtLoadModalShow