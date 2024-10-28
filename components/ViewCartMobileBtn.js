"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { getAmountConvertToFloatWithFixed, getCountryCurrencySymbol } from '../global/Store'
import { BRANDSIMPLEGUID } from '@/global/Axios'

export default function ViewCartMobileBtn() 
{
  const {iscartbtnclicked, setIscartbtnclicked, cartdata, websiteModificationData} = useContext(HomeContext)

  const [totalordervalue, setTotalordervalue] = useState(0)

  const [isTotalGreatherThanMinimum, setIsTotalGreatherThanMinimum] = useState(false);
  
  useEffect(() => {
    
    let totalValue = 0
    if(parseInt(cartdata?.length) > parseInt(0))
    {
      for(const total of cartdata)
      {
        totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount)
      }
      setTotalordervalue(totalValue)
    }
    const deliveryMatrix = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}delivery_matrix`))

    if(totalValue >= deliveryMatrix?.order_value)
    {
      setIsTotalGreatherThanMinimum(true)
    }

    return (() => {
      setTotalordervalue(0)
      setIsTotalGreatherThanMinimum(false)
    })
  }, [cartdata])
    
  return (
    <>
    {
      !iscartbtnclicked &&
      <div className="arcgatchl4h2view-cart">
        <div className="coagatchascgl5cnl6view-cart"></div>
        <div className="coagatchascgl5axl6view-cart"></div>
        <button className="bllview-cart-btn" onClick={() => setIscartbtnclicked(true)}>
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
          >{parseInt(cartdata?.length)}</span>
          {/* <span className='mobile-view-cart' style={{backgroundColor: !isTotalGreatherThanMinimum && `${websiteModificationData?.websiteModificationLive?.json_log[0]?.buttonBackgroundColor} !important`}} >Checkout</span> */}
          <span className='mobile-view-cart' style={{backgroundColor: !isTotalGreatherThanMinimum && `${websiteModificationData?.websiteModificationLive?.json_log[0]?.buttonBackgroundColor}`}} >Checkout</span>
          <span>&pound;{getAmountConvertToFloatWithFixed(totalordervalue, 2)}</span>
        </button>
      </div>
    }
    </>
  )
}
