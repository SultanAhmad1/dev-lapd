import Image from 'next/image'

import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'
import Link from 'next/link'

export default function Header() 
{
    // const {params} = useParams()
    
    const{cartdata,brandlogo,postcode, headerUserBtnDisplay, headerPostcodeBtnDisplay,headerSearchBarDisplay, headerCartBtnDisplay, setIscartbtnclicked, setIsdeliverybtnclicked} = useContext(HomeContext)
    return (
        <>
            <header>
                <div className="header">
                    <div className="header-div">
                        {
                            headerUserBtnDisplay &&
                            <a className="hamburger-button" href="/">
                                {/* <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="hamburger-svg">
                                    <path d="M19.167 3.333H.833v2.5h18.334v-2.5zm0 5.834H.833v2.5h18.334v-2.5zM.833 15h18.334v2.5H.833V15z"></path>
                                </svg> */}
                                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="hamburger-svg">
                                    <path d="M8 0a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 15a7 7 0 0 1-5.19-2.32 2.71 2.71 0 0 1 1.7-1 13.11 13.11 0 0 0 1.29-.28 2.32 2.32 0 0 0 .94-.34 1.17 1.17 0 0 0-.27-.7 3.61 3.61 0 0 1-1.32-2.87A3.18 3.18 0 0 1 8 4.07a3.18 3.18 0 0 1 2.86 3.42 3.6 3.6 0 0 1-1.32 2.88 1.13 1.13 0 0 0-.27.69 2.68 2.68 0 0 0 .93.31 10.81 10.81 0 0 0 1.28.23 2.63 2.63 0 0 1 1.78 1A7 7 0 0 1 8 15z"/>
                                </svg>
                            </a>
                        }
                        <div className={`spacer _48`}></div>
                        <Link href="/">
                            <Image  src={brandlogo} width={146} height={24} className="brand-logo" alt='brand-logo'/>
                        </Link>
                        <div className="spacer _40"></div>
                        {
                            headerPostcodeBtnDisplay &&
                            <button className="edit-delivery-location-button" onClick={() => setIsdeliverybtnclicked(true)}>
                                <div className="location-logo-svg">
                                    <svg width="16px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Deliver to" role="img" focusable="false">
                                        <path d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z" fill="#000000" ></path>
                                    </svg>
                                </div>

                                <div className="spacer _8"></div>
                                <div className="delivery-postcode">{postcode}</div>
                                <span className="header-dot">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                                <span>Now</span>
                            </button>
                        }

                        <div className="spacer _48"></div>
                        
                        <div className="search-outer-level-one-div">
                            {
                                headerSearchBarDisplay &&

                                <div className="search-outer-level-two-div">
                                    <div className="search-outer-level-three-div">
                                        <label id="search-suggestions-typeahead-label" htmlFor="search-suggestions-typeahead-input" className="search-label">Search in Wow Shakes and Cakes</label>
                                        <div className="search-outer-level-fourth-div">
                                            <div className="spacer _16"></div>
                                            <div className="search-inner-icon">
                                                <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="search-svg">
                                                    <path d="M18.834 17l-3.666-3.667c.916-1.333 1.5-2.916 1.5-4.666C16.667 4.333 13.083.75 8.75.75 4.417.75.834 4.333.834 8.667c0 4.333 3.583 7.916 7.917 7.916 1.75 0 3.333-.583 4.666-1.5l3.667 3.667 1.75-1.75zm-15.5-8.25c0-3 2.417-5.417 5.417-5.417s5.416 2.417 5.416 5.417-2.416 5.417-5.416 5.417c-3 0-5.417-2.417-5.417-5.417z"></path>
                                                </svg>
                                            </div>
                                            <div className="spacer _16"></div>
                                            <input type="text" className="search-inner-input" autoComplete="off" placeholder="Search in LAPD FOOD" />
                                            <div className="spacer _8"></div>
                                        </div>
                                    </div>
                                </div>
                            }    
                        </div>
                        

                        <div className="spacer _24"></div>
                        
                        <div className="cart-outer-level-one-div">
                        {
                            headerCartBtnDisplay &&
                            <div className="cart-btn-level-one-div">
                                <div className="cart-btn-spacer-24 spacer _24"></div>
                                <div className="cart-btn-level-two-div">
                                    <button className="add-to-cart-btn" onClick={() => setIscartbtnclicked(true)}>
                                        <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="cart-svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M3.666 11.333h10.333l1.334-8h-11l-.267-2h-3.4v2h1.667l1.333 8zm1.333 3.334A1.333 1.333 0 105 12a1.333 1.333 0 000 2.667zm9.334-1.334a1.333 1.333 0 11-2.667 0 1.333 1.333 0 012.667 0z"></path>
                                        </svg>
                                        <div className="spacer _8"></div>&nbsp; {parseInt(cartdata?.length)} <span className="cart-text">&nbsp;carts</span>
                                    </button>
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}