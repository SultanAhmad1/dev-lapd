import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { getAmountConvertToFloatWithFixed, getCountryCurrencySymbol } from '../global/Store'

export default function ViewCartMobileBtn() 
{
  const {iscartbtnclicked, setIscartbtnclicked, cartdata} = useContext(HomeContext)

  const [totalordervalue, setTotalordervalue] = useState(0)
  useEffect(() => {
    
    if(parseInt(cartdata?.length) > parseInt(0))
    {
      let totalValue = 0

      for(const total of cartdata)
      {
        totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount)
      }
      setTotalordervalue(totalValue)
    }
  }, [cartdata])
    
  return (
    <>
    {
      !iscartbtnclicked &&
      <div className="arcgatchl4h2view-cart">
        <div className="coagatchascgl5cnl6view-cart"></div>
        <div className="coagatchascgl5axl6view-cart"></div>
        <button className="bllview-cart-btn" onClick={() => setIscartbtnclicked(true)}>
          <span>({parseInt(cartdata?.length)})</span> <span>View cart</span> <span>({getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(totalordervalue, 2)})</span>
        </button>
      </div>
    }
    </>
  )
}
