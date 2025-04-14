"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { getAmountConvertToFloatWithFixed, getCountryCurrencySymbol } from '../global/Store'
import { BRAND_SIMPLE_GUID } from '@/global/Axios'

export default function ViewCartMobileBtn() 
{
  const {isCartBtnClicked, setIsCartBtnClicked, cartData, websiteModificationData} = useContext(HomeContext)

  const [totalordervalue, setTotalordervalue] = useState(0)

  const [isTotalGreatherThanMinimum, setIsTotalGreatherThanMinimum] = useState(false);
  
  useEffect(() => {
    
    let totalValue = 0
    if(parseInt(cartData?.length) > parseInt(0))
    {
      for(const total of cartData)
      {
        totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount)
      }
      setTotalordervalue(totalValue)
    }
    const deliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}delivery_matrix`))

    if(totalValue >= deliveryMatrix?.order_value)
    {
      setIsTotalGreatherThanMinimum(true)
    }

    return (() => {
      setTotalordervalue(0)
      setIsTotalGreatherThanMinimum(false)
    })
  }, [cartData])
  
  return (
    <>
    {
      !isCartBtnClicked &&
      <div className="arcgatchl4h2view-cart">
        <div className="coagatchascgl5cnl6view-cart"></div>
        <div className="coagatchascgl5axl6view-cart"></div>

        {
          // check is there any item in cart then button background should be green
          parseInt(cartData?.length) > parseInt(0) ?
          <button className="bllview-cart-btn" onClick={() => setIsCartBtnClicked(true)}>
            <span 
              style={{
                border: "1px solid #fff",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
              }}
            >{parseInt(cartData?.length)}</span>
                <span className='mobile-view-cart' style={{backgroundColor: !isTotalGreatherThanMinimum && `${websiteModificationData?.websiteModificationLive?.json_log[0]?.buttonBackgroundColor}`}} >Checkout</span>
            
            <span>&pound;{getAmountConvertToFloatWithFixed(totalordervalue, 2)}</span>
          </button>

          :

            <button className="bllview-cart-btn">
              <span 
                style={{
                  border: "1px solid #fff",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                }}
              >
                {parseInt(cartData?.length)}
              </span>

              <span 
                className='mobile-view-cart' 
                style={{backgroundColor: "#000", color: "#fff", border: "1px solid #fff"}}
              >
                Checkout
              </span>
            
            <span>&pound;{getAmountConvertToFloatWithFixed(totalordervalue, 2)}</span>
          </button>
        }
      </div>
    }
    </>
  )
}
