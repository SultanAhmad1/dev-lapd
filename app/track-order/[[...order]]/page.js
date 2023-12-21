"use client"

import { axiosPrivate } from "@/app/global/Axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";

import notOrderRecieved from "../../../public/gallery/trackorder/track-icon-1.svg"
import orderRecieved from "../../../public/gallery/trackorder/track-icon-hover-1.svg"

import notInTheKitchen from "../../../public/gallery/trackorder/track-icon-2.svg"
import inTheKitchen from "../../../public/gallery/trackorder/track-icon-hover-2.svg"

import notOutForDelivery from "../../../public/gallery/trackorder/track-icon-3.svg"
import outForDelivery from "../../../public/gallery/trackorder/track-icon-hover-3.svg"

import notCompleted from "../../../public/gallery/trackorder/track-icon-4.svg"
import Completed from "../../../public/gallery/trackorder/track-icon-hover-4.svg"
import { getAmountConvertToFloatWithFixed, getCountryCurrencySymbol } from "@/app/global/Store";
import Link from "next/link";
import Loader from "@/app/components/modals/Loader";

function TrackOrder({params}) 
{

    const [orderhash, setOrderhash] = useState("")
    const [brand, setBrand] = useState(null)
    const [location, setLocation] = useState(null)
    const [address, setAddress] = useState(null)
    const [trackorders, setTrackorders] = useState([])

    const [discountamount, setDiscountamount] = useState(0)

    const [loader, setLoader] = useState(true)
    const [issearchdisable, setIssearchdisable] = useState(true)

    useEffect(() => 
    {
        const getTrackOrderDetails = async () =>
        {
            try 
            {
                const data = {
                    guid: params?.order,
                }   
                const response = await axiosPrivate.post(`/website-track-order`,data)
                console.log("Track Order Response:", response);
    
                setBrand(response?.data?.data?.trackOrder?.brand)
                setLocation(response?.data?.data?.trackOrder?.location)
                setAddress(response?.data?.data?.trackOrder?.address)
                setOrderhash(response?.data?.data?.trackOrder?.order_hash)
                setTrackorders(response?.data?.data?.trackOrder)
    
                setDiscountamount((response?.data?.data?.trackOrder?.order_amount_discounts === null) ? 0 : response?.data?.data?.trackOrder?.order_amount_discounts?.amount_discount_applied)
                setTimeout(() => {
                    setLoader(!loader)
                }, 3000);
            } 
            catch (error) 
            {
                console.log("Track Order Error Response:", error);
                setTimeout(() => {
                    setLoader(!loader)
                }, 3000);
            }
        }
        getTrackOrderDetails()
    }, [params?.order])
    
    const handleOrderHashTypeByUser = (event) =>
    {
        const getOrderHash = event.target.value
        setOrderhash(event.target.value)
        
        setIssearchdisable(parseInt(getOrderHash.length) > parseInt(0) ? false : true)
    }

    const getTrakcOrderDetailByOrderCode = async () =>
    {
        try 
        {
            const data = {
                orderhash: orderhash,
            }   
            const response = await axiosPrivate.post(`/track-order-by-hash-order`,data)
            // console.log("Hash code order Track Order Response:", response);

            setBrand(response?.data?.data?.trackOrder?.brand)
            setLocation(response?.data?.data?.trackOrder?.location)
            setAddress(response?.data?.data?.trackOrder?.address)
            setOrderhash(response?.data?.data?.trackOrder?.order_hash)
            setTrackorders(response?.data?.data?.trackOrder)

            setDiscountamount((response?.data?.data?.trackOrder?.order_amount_discounts === null) ? 0 : response?.data?.data?.trackOrder?.order_amount_discounts?.amount_discount_applied)
            setTimeout(() => {
                setLoader(false)
            }, 3000);
        } 
        catch (error) 
        {
            console.log("Track Order Error Response:", error);
            setTimeout(() => {
                setLoader(false)
            }, 3000);
        }
    }

    const handleSearchOrderCode = () =>
    {
        setLoader(true)
        getTrakcOrderDetailByOrderCode()
    }

    return (
        <>
            <div className='e5ald0m1m2amc5trackorder-desk'>
                <div className="m3m4m5gim6trackorder-desk">
                    <div className="hmg1trackorder-desk">
                        <div className="hmg1mhb0trackorder-desk">
                            <div className='mimjepmkmlmmtrackorder-desk'>
                                <h3 className="eik5ekk6trackorder-desk">
                                    <span className="d1trackorder-desk-span">Track Order</span>
                                </h3>
                            </div>

                            <hr className='edfhmthttrackorder-desk'></hr>

                            <div className='mimjepmkmlmmtrackorder-desk'>
                                <div className='d1g1trackorder-desk'>
                                    <div className="allzc5trackorder-desk">
                                        <div className="alamd1g1trackorder-desk">
                                            <span className="chd2cjd3b1trackorder-desk">Enter your order code: </span>
                                        </div>
                                    </div>

                                    <div className="btautrackorder-window">
                                        <input type="email" placeholder="Enter your order code" value={orderhash} className="track_order" onChange={handleOrderHashTypeByUser}/>
                                        <button className='trackorder_btn' disabled={issearchdisable} onClick={handleSearchOrderCode}>Search</button>
                                    </div>

                                    <div className="altrackorder-desk">
                                        <div className="spacer _40"></div>
                                        <div className="edhtb9d1trackorder-desk"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div></div>
                </div>

                {/* Track Icon Order */}
                {
                    trackorders !== null ?

                    <>
                        <div className="d1g1trackordericon-desk">
                            <div className='gmgngoalamgptrackordericon-desk'>
                                <div className="eeb0trackordericon-desk">
                                    <div className='b5grektrackorder-desk'>
                                        {
                                            trackorders !== null &&
                                            <>
                                                <div className='stagonetrackorder-desk trackImageWrapper'>
                                                    <img alt="Order Received" src={(trackorders?.status === 'created') ? orderRecieved.src : notOrderRecieved.src} />
                                                    <div className='stagonelineheight trackImageLine'></div>
                                                </div>

                                                <div className='stagsecondtrackorder-desk trackImageWrapper'>
                                                    <img alt="Order Received" src={(trackorders?.status === 'live') ? inTheKitchen.src : notInTheKitchen.src } />
                                                    <div className='stagsecondlineheight trackImageLine'></div>
                                                </div>

                                                <div className='stagthirdtrackorder-desk trackImageWrapper'>
                                                    <img alt="Order Received" src={(trackorders?.status === 'out_for_delivery') ? outForDelivery.src : notOutForDelivery.src} />
                                                    <div className='stagthirdlineheight trackImageLine'></div>
                                                </div>

                                                <div className='stagfourthtrackorder-desk trackImageWrapper'>
                                                    <img alt="Order Received" src={(trackorders?.status === 'completed') ? Completed.src : notCompleted.src} />
                                                </div>
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="m3m4m5gim6mytrackorder-desk">

                            <div className="hmg1mytrackorder-desk">
                                <div className="hmg1mhb0mytrackorder-desk">
                                    <div className='mimjepmkmlmmchemytrackorder-desk'>
                                        <h3 className="eik5ekk6mytrackorder-desk">
                                            <span className="d1mytrackorder-desk-span">My Order</span>
                                        </h3>

                                        <div className="afcart">
                                            <div className="">
                                                <div className="dtcxcyczd0d1checkout">

                                                    <div className="dze0checkout"></div>

                                                    <div className="alame1e2checkout">
                                                        <div className="b7avfpfqcheckout-details">
                                                            {/* li start from here */}
                                                            {
                                                                trackorders !== null &&
                                                                trackorders?.order_lines?.map((orderLine, index) => 
                                                                {
                                                                    return(
                                                                        <div className="esetcheckout" key={index}>
                                                                            <div className="ald5egbhddeteud1checkout-edit-item d1">
                                                                                <div className="bodgdfcheckout-qty">
                                                                                    {parseInt(orderLine?.quantity)}
                                                                                </div>
                                                                                <div className="alamcjewcheckout">
                                                                                    <span className="bobpdfcvcheckout-item-header">{orderLine?.product_name}</span>
                                                                                    <ul className="excheckout">
                                                                                        
                                                                                        {
                                                                                            (parseInt(orderLine?.order_line_modifier_group_products?.length) > parseInt(0)) &&
                                                                                            orderLine?.order_line_modifier_group_products?.map((modifier, index) =>
                                                                                            {
                                                                                                return(
                                                                                                    <div key={index}>
                                                                                                        <li className="bheyezebalf0checkout-item-li ez">
                                                                                                            <span className="bodgdfcvcheckout-li-modi-title">{modifier?.modifier_group_name}:</span>
                                                                                                            <div className="spacer _4"></div>
                                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">
                                                                                                                {modifier?.product_name} ({getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(modifier?.price,2)})
                                                                                                                <div></div>
                                                                                                            </span>
                                                                                                        </li>
                                                                                                        {
                                                                                                            parseInt(modifier?.order_line_secondary_product_modifiers?.length) > parseInt(0) &&

                                                                                                            modifier?.order_line_secondary_product_modifiers?.map((secondaryProductModifier,index) =>
                                                                                                            {
                                                                                                                return(
                                                                                                                    <li className="bheyezebalf0checkout-item-li ez">
                                                                                                                        <span className="bodgdfcvcheckout-li-modi-title">{secondaryProductModifier?.modifier_name}:</span>
                                                                                                                        <div className="spacer _4"></div>
                                                                                                                        {
                                                                                                                            secondaryProductModifier?.quantity > 0 ?
                                                                                                                            <>
                                                                                                                                <span className="albodgbqcvcheckout-li-modi-detail">
                                                                                                                                {parseInt(secondaryProductModifier?.quantity)} x {secondaryProductModifier?.product_name} ({getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(secondaryProductModifier?.quantity * secondaryProductModifier?.price,2)})
                                                                                                                                    <div></div>
                                                                                                                                </span>
                                                                                                                            </>
                                                                                                                            :
                                                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">
                                                                                                                                {secondaryProductModifier?.product_name} ({getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(secondaryProductModifier?.price,2)})
                                                                                                                                <div></div>
                                                                                                                            </span>
                                                                                                                        }
                                                                                                                    </li>
                                                                                                                )
                                                                                                            })
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }

                                                                                        {/* <li className="bheyezebalf0checkout-item-li ez">
                                                                                            <span className="bodgdfcvcheckout-li-modi-title">Waffle Type:</span>
                                                                                            <div className="spacer _4"></div>
                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">Regular - Half - 7" Fresh Waffle<div></div></span>
                                                                                        </li> */}

                                                                                        {/* <li className="bheyezebalf0checkout-item-li ez">
                                                                                            <span className="bodgdfcvcheckout-li-modi-title">Add Treat:</span>
                                                                                            <div className="spacer _4"></div>
                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">Add: Strawberry (£1.00)<div></div></span>
                                                                                        </li>

                                                                                        <li className="bheyezebalf0checkout-item-li ez">
                                                                                            <span className="bodgdfcvcheckout-li-modi-title">Add Sauce / Topping:</span>
                                                                                            <div className="spacer _4"></div>
                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">No Extra Sauce<div></div></span>
                                                                                        </li>

                                                                                        <li className="bheyezebalf0checkout-item-li ez">
                                                                                            <span className="bodgdfcvcheckout-li-modi-title">Chocolates &amp; Fruits - Add-ons:</span>
                                                                                            <div className="spacer _4"></div>
                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">Add: Ferrero Rocher (£1.50)<div></div></span>
                                                                                        </li>

                                                                                        <li className="bheyezebalf0checkout-item-li ez">
                                                                                            <span className="bodgdfcvcheckout-li-modi-title">Sauces and Toppings:</span>
                                                                                            <div className="spacer _4"></div>
                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">Add: Crushed Lotus Biscoff (£0.50)<div></div></span>
                                                                                        </li>

                                                                                        <li className="bheyezebalf0checkout-item-li ez">
                                                                                            <span className="bodgdfcvcheckout-li-modi-title">Ice Cream:</span>
                                                                                            <div className="spacer _4"></div>
                                                                                            <span className="albodgbqcvcheckout-li-modi-detail">Mint Chocolate Ice Cream (£1.95)<div></div></span>
                                                                                        </li> */}
                                                                                    </ul>
                                                                                </div>
                                                                                <div className="f1alamcheckout-item-qty">
                                                                                    <span className="gye2gzcheckout-item-qty-span">{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(orderLine?.total,2)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {/* li end at here */}
                                                        
                                                        </div>
                                                    </div>

                                                    <div className="cjdchkout">
                                                        <div className="alcheckout">
                                                            <div className="drdsbscjcheckout"></div>
                                                        </div>
                                                    </div>

                                                    <div className="dxc6checkout"></div>

                                                    <ul>
                                                        <li className="bobpcheckout-sutotals">
                                                            <div className="albcaqcheckout">
                                                                <div className="bobpbqbrb1checkout">Subtotal</div>
                                                            </div>

                                                            <div className="bobpbqbrb1checkout">
                                                                <span className="">{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(trackorders?.order_subtotal,2)}</span>
                                                            </div>
                                                        </li>

                                                        <li className="dxgvcheck"></li>

                                                        <li className="dxgvcheck"></li>

                                                        <li className="bobpcheckout-sutotals">
                                                            <div className="albcaqcheckout">
                                                                <div className="bobpbqbrb1checkout">Service</div>
                                                            </div>

                                                            <div className="bobpbqbrb1checkout">
                                                                <span className="">{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(trackorders?.service_charge,2)}</span>
                                                            </div>
                                                        </li>

                                                        <li className="bobpcheckout-sutotals">
                                                            <div className="albcaqcheckout">
                                                                <div className="bobpbqbrb1checkout">Discount</div>
                                                            </div>

                                                            <div className="bobpbqbrb1checkout">
                                                                <span className="">({getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(discountamount, 2)})</span>
                                                            </div>
                                                        </li>

                                                        <li className="dxgvcheck"></li>

                                                        <li className="bobpcheckout-sutotals">
                                                            <div className="albcaqcheckout">
                                                                <div className="bobpbqbrb1checkout">Delivery</div>
                                                            </div>

                                                            <div className="bobpbqbrb1checkout">
                                                                <span className="">{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed(trackorders?.delivery_charge,2)}</span>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <div className="bkgfbmggalcheckout">
                                                        <div className="albcaqcheckout-total">Total</div>{getCountryCurrencySymbol()}{getAmountConvertToFloatWithFixed((parseFloat(trackorders?.order_subtotal) + parseFloat(trackorders?.delivery_charge) + parseFloat(trackorders?.service_charge)) - parseFloat(discountamount),2)}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div></div>
                            </div>

                            <div className="d1g1mytrackorder-desk">
                                <div className='gmgngoalamgpmytrackorder-desk'>
                                    <div className="eeb0trackorder-desk">
                                        <div className='b5grekmytrackorder-desk'>

                                            <div className='mimjepmkmlmmchemytrackorderdetail-desk'>

                                                <h3 className="eik5ekk6mytrackorder-desk">
                                                    <span className="d1mytrackorder-desk-span">Order Details</span>
                                                </h3>

                                                <div>
                                                    <div className='d1g1mytrackorder-desk'>
                                                        <div className="allzc5mytrackorder-desk" >
                                                            <div className="kgmytrackorder-desk">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                                                                    <g data-name="Building Store">
                                                                        <path d="M42 2a1 1 0 0 0-1-1H23a1 1 0 0 0-1 1v15h20zM30 15a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm4 0a1 1 0 1 1 1-1 1.003 1.003 0 0 1-1 1zm3.93-8.63-2 5A1 1 0 0 1 35 12h-6a1.002 1.002 0 0 1-.99-.86l-.71-4.98v-.03L27.13 5H26a1 1 0 0 1 0-2h2a.993.993 0 0 1 .99.86L29.16 5H37a.999.999 0 0 1 .83.44 1.02 1.02 0 0 1 .1.93z" style={{ fill: "#232328" }} /><path style={{ fill: "#232328" }} d="M29.87 10h4.45l1.2-3h-6.08l.43 3z" /><path d="M53 10c0-1.55-.45-2-1-2h-8v10a1.003 1.003 0 0 1-1 1H21a1.003 1.003 0 0 1-1-1V8h-8a1.003 1.003 0 0 0-1 1v14h42zM12 35a3.999 3.999 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 4.002 4.002 0 0 0 8 .19L53.34 25H10.66L8 31.19A4.016 4.016 0 0 0 12 35zM44 44h3v2h-3zM39 48h3v2h-3zM39 44h3v2h-3zM44 48h3v2h-3z" style={{ fill: "#232328" }} /><path d="M55 61h-2V36.91a5.47 5.47 0 0 1-1 .09 6.01 6.01 0 0 1-5-2.69 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0 5.992 5.992 0 0 1-10 0A6.01 6.01 0 0 1 12 37a5.47 5.47 0 0 1-1-.09V61H9a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM37 43a1.003 1.003 0 0 1 1-1h10a1.003 1.003 0 0 1 1 1v8a1.003 1.003 0 0 1-1 1H38a1.003 1.003 0 0 1-1-1zm-6 18V44h-5v17h-2V44h-5v17h-2V43a1.003 1.003 0 0 1 1-1h14a1.003 1.003 0 0 1 1 1v18z" style={{ fill: "#232328" }} />
                                                                    </g>
                                                                </svg>
                                                            </div>

                                                            <div className="alamd1g1mytrackorder-desk">
                                                                <span className="chd2cjd3b1mytrackorder-desk">Store</span>
                                                                <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                    <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                        {/* {(brand !== null) && brand?.name} {(location !== null) && location?.name} */}
                                                                        {(location !== null) && location?.name}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="almytrackorder-desk">
                                                            <div className="spacer _40"></div>
                                                            <div className="edhtb9d1mytrackorder-desk"></div>
                                                        </div>
                                                    </div>

                                                    <div className='d1g1mytrackorder-desk'>
                                                        <div className="allzc5mytrackorder-desk" >
                                                            <div className="kgmytrackorder-desk">
                                                                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="c8c7cccdmytrackorder">
                                                                    <g clipPath="url(#clip0)">
                                                                        <path d="M17.583 5.166a7.896 7.896 0 00-11.166 0c-3.084 3.083-3.084 8.167 0 11.25L12 21.999l5.583-5.666c3.084-3 3.084-8.084 0-11.167zM12 12.416c-.917 0-1.667-.75-1.667-1.667 0-.916.75-1.666 1.667-1.666s1.667.75 1.667 1.666c0 .917-.75 1.667-1.667 1.667z"></path>
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0">
                                                                            <path transform="translate(2 2)" d="M0 0h20v20H0z"></path>
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </div>

                                                            <div className="alamd1g1mytrackorder-desk">
                                                                <span className="chd2cjd3b1mytrackorder-desk">{address !== null && address?.postcode}</span>
                                                                <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                    <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                        {
                                                                            address !== null &&
                                                                            `${address?.house_no_name} ${address?.street1}, ${address?.street2}`
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="almytrackorder-desk">
                                                            <div className="spacer _40"></div>
                                                            <div className="edhtb9d1mytrackorder-desk"></div>
                                                        </div>
                                                    </div>

                                                    <div className='d1g1mytrackorder-desk'>
                                                        <div className="allzc5mytrackorder-desk" >
                                                            <div className="kgmytrackorder-desk">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.108 20H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2h-2.108c-.247-2.774-1.071-7.61-3.826-9 2.564-1.423 3.453-4.81 3.764-7H20a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2h2.17c.311 2.19 1.2 5.577 3.764 7-2.755 1.39-3.579 6.226-3.826 9zM9 16.6c0-1.2 3-3.6 3-3.6s3 2.4 3 3.6V20H9z" /></svg>
                                                            </div>

                                                            <div className="alamd1g1mytrackorder-desk">
                                                                <span className="chd2cjd3b1mytrackorder-desk">Estimated Delivery Time</span>
                                                                <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                    <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                        {
                                                                            trackorders !== null &&
                                                                            moment(trackorders?.estimated_delivery_time).format("HH:mm A")
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="almytrackorder-desk">
                                                            <div className="spacer _40"></div>
                                                            <div className="edhtb9d1mytrackorder-desk"></div>
                                                        </div>
                                                    </div>

                                                    <div className='d1g1mytrackorder-desk'>
                                                        <div className="allzc5mytrackorder-desk" >
                                                            <div className="kgmytrackorder-desk">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0ZM12,8a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,8Z" /></svg>
                                                            </div>

                                                            <div className="alamd1g1mytrackorder-desk">
                                                                <span className="chd2cjd3b1mytrackorder-desk">Driver Instructions</span>
                                                                <p data-baseweb="typo-paragraphsmall" className="b1chcwcid3mytrackorder-desk">
                                                                    <span style={{ fontFamily: "UberMoveText", color: "#545454" }}>
                                                                        {
                                                                            address !== null &&
                                                                            address?.driver_instructions === null
                                                                            ?
                                                                            "No instruction provided"
                                                                            :
                                                                            address?.driver_instructions

                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="almytrackorder-desk">
                                                            <div className="spacer _40"></div>
                                                            <div className="edhtb9d1mytrackorder-desk"></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* <hr className='edfhmthtmytrackorder-desk'></hr> */}
                                        </div>
                                    </div>
                                    <div className="gqtrackorder-desk"></div>
                                </div>
                            </div>

                        </div>
                    </>

                    :
                    <div className="m3m4m5gim6trackorder-desk">
                        <div className="hmg1trackorder-desk">
                            <div className="hmg1mhb0trackorder-desk">

                                <div className='mimjepmkmlmmtrackorder-desk'>
                                    <div className='d1g1trackorder-desk'>
                                    
                                        <h1 className="invalid-order-code">Invalid Order code</h1>
                                        
                                        <Link className="continue-to-menu-btn" href="/">Continue to menu</Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div></div>
                    </div>
                }   

            </div>
          
            <Loader loader={loader}/>
        </>
    )
}

export default TrackOrder