"use client"

import { BLACK_COLOR } from "@/global/Axios";
import PlaceOrderForm from "./subcomponents/PlaceOrderForm";
import { useContext, useState } from "react";
import HomeContext from "@/contexts/HomeContext";
import { Elements } from '@stripe/react-stripe-js';
import WrapWallet from "../paymentcomponent/WrapWallet";
import stripePromise from "../paymentcomponent/Stripe";

export default function PlaceOrderModal() 
{
  const {
    websiteModificationData,
    handleBoolean,
  } = useContext(HomeContext)

  const [modalObject, setModalObject] = useState({
    isPaymentReady: false,
    orderGUI: "7DFF394B-B37A-433E-8107-96B1395ABDDC",
    sectionNumber: 1,
    isNextButtonReadyToClicked: false,
    isCreditCardButtonClicked: false,
  });
  
  const handleObject = (newValue, newField) => {
    setModalObject((prevData) => ({...prevData, [newField]: newValue}))
  }

  return(
    <div className="modal-delivery-details">
      <div className="modal-delivery-details-level-one-div">
        <div className="modal-delivery-details-level-one-div-height"></div>

        <div className="modal-delivery-details-level-one-div-dialog">

          <div className="modal-delivery-details">
            <div className="modal-delivery-details-level-one-div" style={{marginTop: "15px"}}>

              <div className="modal-delivery-details-level-one-div-dialog">
                <div className="modal-lg">
                    
                  <div className="modal-header"
                    style={{
                      position: "relative",
                    }}  
                  >
                    <button
                      // className="cart-close-btn left-align"
                      onClick={() => handleBoolean(false, "isPlaceOrderButtonClicked")}
                      className="checkout-cross-btn"
                    >
                      <div className="cart-close-btn-div">
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
                            fill={websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR}
                          />
                        </svg>
                      </div>
                    </button>
                    <h4 
                      style={{ 
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "26px",
                        lineHeight: "1",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "2px",
                        marginBottom: "15px"
                      }}
                    >
                      Checkout Window
                    </h4>
                      
                  </div>


                  <div className="deliver-to-body-content-nested-div-level-one"   style={{
                    height: modalObject.isCreditCardButtonClicked ? "80vh" : "auto",
                    overflowY: "scroll",
                    overflowX: "hidden"
                  }}>
                    <Elements stripe={stripePromise}>
                      {
                        modalObject.sectionNumber === 2 && 
                        <>  
                          <div style={{display: "flex", alignItems: "center", margin: "24px 0"}}>
                            <div style={{flexGrow: "1", borderTop: "1px solid #ccc"}}></div>
                            <span style={{margin: "0 16px", color: "#666", fontWeight: "600"}}>Express Checkout</span>
                            <div style={{flexGrow: "1", borderTop: "1px solid #ccc"}}></div>
                          </div>

                          <WrapWallet ></WrapWallet>

                          <div style={{display: "flex", alignItems: "center", margin: "24px 0"}}>
                            <div style={{flexGrow: "1", borderTop: "1px solid #ccc"}}></div>
                            <span style={{margin: "0 16px", color: "#666", fontWeight: "600"}}>OR</span>
                            <div style={{flexGrow: "1", borderTop: "1px solid #ccc"}}></div>
                          </div>
                        </>  
                      }
                      
                      {
                        (modalObject.sectionNumber === 2 && modalObject.isCreditCardButtonClicked === false) &&
                        <button type="button" style={{
                          backgroundColor: "red",
                          color: "#fff",
                          padding: "20px",
                          border: "1px solid red",
                          borderRadius: "5px",
                          width: "100%",
                          margin: "0 0 20px 0",
                        }} onClick={() => handleObject(true, "isCreditCardButtonClicked")}>Credit Card</button>
                      }

                      
                      <PlaceOrderForm {
                        ...{
                          setModalObject,
                          handleBoolean,
                          sectionNumber: modalObject.sectionNumber,
                          isNextButtonReadyToClicked: modalObject.isNextButtonReadyToClicked,
                          isCreditCardButtonClicked: modalObject.isCreditCardButtonClicked,
                          handleObject
                        }
                      }/>
                    </Elements>
                    


                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="modal-delivery-details-level-one-div-height"></div>
      </div>
    </div>
    
  )
}
