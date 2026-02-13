"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import { getAmountConvertToFloatWithFixed } from '../global/Store'
import CheckoutDisplay from './CheckoutDisplay';
import { BLACK_COLOR } from '@/global/Axios';

export default function ViewCartMobileBtn() 
{
  const {isCartBtnClicked,websiteModificationData, setIsCartBtnClicked, cartData, setLoader} = useContext(HomeContext)

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
        <div className="fixed bottom-3 left-0 right-0 z-40 px-4 sm:px-6 md:px-10">
          <div className="relative max-w-md mx-auto">
            {/* Optional background layers */}
            <div className="absolute inset-0  blur-sm rounded-lg pointer-events-none"></div>
            <div className="absolute inset-0  blur-md rounded-lg pointer-events-none"></div>
            
            <button
              type='button'
              onClick={handleCheckoutClicked}
              command="show-modal" commandfor="dialog" 

              className="flex text-lg items-center justify-between w-full px-4 py-2 rounded-lg shadow-lg transition-colors duration-300 bg-black text-white"
            >
              {/* Cart count */}
              <span className="flex items-center justify-center w-9 h-9 text-base font-bold border border-white rounded">
                {parseInt(countTotalItems)}
              </span>

              {/* Checkout text */}
              <span
                className={`px-4 py-1 text-lg font-bold rounded-3xl border border-white ${
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


      {/* <!-- Include this script tag or install `@tailwindplus/elements` via npm: --> */}
      {/* <!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> --> */}
      {/* <button command="show-modal" commandfor="dialog" class="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10">Open dialog</button> */}
      {/* <el-dialog>
        <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-[#eaeaea] backdrop:bg-[#eaeaea]">
          <el-dialog-backdrop class="fixed inset-0 bg-[#eaeaea] transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>
          <div class="bg-[#eaeaea] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button type="button" command="close" commandfor="dialog" class="mt-3 inline-flex w-full justify-center rounded-md bg-[#eaeaea] px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-[#eaeaea] sm:mt-0 sm:w-auto"> 
              <svg
                  width="24"
                  height="24"
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
            </button>
          </div>

          <div tabindex="0" class="flex h-auto items-end justify-center p-1 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-[#eaeaea] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              <div class="bg-[#eaeaea] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <CheckoutDisplay />
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog> */}

    </>

  )
}
