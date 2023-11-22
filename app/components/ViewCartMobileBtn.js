import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

export default function ViewCartMobileBtn() 
{
    const {iscartbtnclicked, setIscartbtnclicked} = useContext(HomeContext)
  return (
    <>
    {
        !iscartbtnclicked &&
        <div className="arcgatchl4h2view-cart">
            <div className="coagatchascgl5cnl6view-cart"></div>
            <div className="coagatchascgl5axl6view-cart"></div>
            <a className="bllview-cart-btn" onClick={() => setIscartbtnclicked(true)}>
                <span>(1)</span> <span>View cart</span> <span>(£40.1)</span>
            </a>
        </div>
    }
    </>
  )
}
