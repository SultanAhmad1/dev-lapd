"use client";
import { useContext } from "react";
import CheckoutDisplay from "./CheckoutDisplay";
import HomeContext from "@/contexts/HomeContext";
import { BLACK_COLOR } from "@/global/Axios";

export default function Cart() {
  
  const { websiteModificationData, setIsCartBtnClicked } = useContext(HomeContext)
  
  return (
    <div className="cart-level-one-div">
      <div className="cart-level-one-div-screen-one"></div>
      <div className="cart-level-one-div-screen-two">
        <div className="cart jp">
          <div className="cart-close-btn-div-level-one">
            <button className="cart-close-btn" onClick={() => setIsCartBtnClicked(false)}>
              <div className="cart-close-btn-div">
                <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z" fill={(websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || BLACK_COLOR)} ></path>
                </svg>
              </div>
            </button>
          </div>
          
          <CheckoutDisplay />
          
        </div>
      </div>
    </div>
  );
}
