"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { getAmountConvertToFloatWithFixed } from '../global/Store'

export default function ViewCartMobileBtn() 
{
  const {isCartBtnClicked, setIsCartBtnClicked, cartData, websiteModificationData, deliveryMatrix, setLoader} = useContext(HomeContext)

  const [totalOrderValue, setTotalOrderValue] = useState(0)
  const [countTotalItems, setCountTotalItems] = useState(0);

  useEffect(() => {
    try {
      
  
      let totalValue = 0
      let totalQuantity = 0

      if(parseInt(cartData?.length) > parseInt(0))
      {
        for(const total of cartData)
        {
          totalQuantity += total.quantity
          totalValue = parseFloat(totalValue) + parseFloat(total?.total_order_amount)
        }
        
        setCountTotalItems(totalQuantity)
        setTotalOrderValue(totalValue)
      }

      return (() => {
        setTotalOrderValue(0)
      })

    } catch (error) {
      return
    }
  }, [cartData])
  

  const handleCheckoutClicked = () => {
    if(parseInt(cartData?.length) > parseInt(0))
    {
      setLoader(true)
      setIsCartBtnClicked(true)
    }
  }

  return (
    <>
      {!isCartBtnClicked && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:px-6 md:px-10">
          <div className="relative max-w-md mx-auto">
            {/* Optional background layers */}
            <div className="absolute inset-0  blur-sm rounded-lg pointer-events-none"></div>
            <div className="absolute inset-0  blur-md rounded-lg pointer-events-none"></div>

            <button
              type='button'
              onClick={handleCheckoutClicked}
              className="flex text-lg items-center justify-between w-full px-4 py-4 rounded-lg shadow-lg transition-colors duration-300 bg-black text-white"
            >
              {/* Cart count */}
              <span className="flex items-center justify-center w-9 h-9 text-base font-bold border border-white rounded">
                {parseInt(countTotalItems)}
              </span>

              {/* Checkout text */}
              <span
                className={`px-4 py-2 text-lg font-bold rounded-3xl border border-white ${
                  parseInt(cartData.length) > 0 ? 'bg-green-800 hover:bg-green-700' : 'bg-black'
                } text-white`}
              >
                Checkout
              </span>

              {/* Total price */}
              <span className="text-lg font-bold whitespace-nowrap">
                &pound;{getAmountConvertToFloatWithFixed(totalOrderValue, 2)}
              </span>

            </button>


          </div>
        </div>
      )}
    </>

  )
}
