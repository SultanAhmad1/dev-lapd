"use client";
import { useContext } from "react";
import moment from "moment";
import HomeContext from "@/contexts/HomeContext";

function StoreClosedModal() {
  const { dayOpeningClosingTime } = useContext(HomeContext);

  return (
    <div className="modal-delivery-details">
      <div className="modal-delivery-details-level-one-div">
        <div className="modal-delivery-details-level-one-div-height"></div>

        <div className="modal-delivery-details-level-one-div-dialog">
          <div className="deliver-to-body-content">
            <h1 className="deliver-to-body-content-h1">We are closed now!</h1>
            <div className="deliver-to-body-content-nested-div-level-one">
              <label id="location-typeahead-location-manager-label" htmlFor="location-typeahead-location-manager-input" className="deliver-to-body-content-nested-div-level-one-label">
                When autocomplete results are available, use up and down arrows
                to review and enter to select. Touch device users, explore by
                touch or with swipe gestures.
              </label>

              <div className="deliver-to-body-content-nested-div-level-one-nested">
                <p className="store-closed-to-body-content-p" style={{ padding: "10px", marginLeft: "50px" }}>
                  Opening time is {moment(dayOpeningClosingTime?.time_periods?.[0]?.start_time,"hh:mm A").format("hh:mm A")}
                  <br />
                  Closing time is {moment(dayOpeningClosingTime?.time_periods?.[0]?.end_time,"hh:mm A").format("hh:mm A")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-delivery-details-level-one-div-height"></div>
      </div>
    </div>

    // <>
    //     <div className="modal-store-closed" style={{display: "block"}}>
    //         <div className="modal-store-closed-level-one-div">
    //             <div className="modal-store-closed-level-one-div-height"></div>

    //             <div className="modal-store-closed-level-one-div-dialog">
    //                 <div></div>
    //                 <SubStoreClosedModal />
    //             </div>

    //             <div className="modal-store-closed-level-one-div-height"></div>
    //         </div>
    //     </div>
    // </>
  );
}

export default StoreClosedModal;
