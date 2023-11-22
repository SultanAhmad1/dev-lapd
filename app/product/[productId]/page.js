"use client";

import HomeContext from '@/app/contexts/HomeContext';
import React, { useContext, useEffect, useState } from 'react'


function productDetails({params}) {
    const{firstname, lastname, iscartbtnclicked} = useContext(HomeContext)


    console.log("I am inside the product details:", firstname, "", lastname, "Is cart clicked:", iscartbtnclicked);
    // const {setIsitemclicked, handleInput} = useContext(HomeContext)
    const [isitemclicked, setIsitemclicked] = useState(false)
    const [isaccordianclicked, setIsaccordianclicked] = useState(false)

    let options = '';

    for(let i = 1; i < 100; i++)
    {
    options += `<option value${i}" className="co">${i}</option>`
    }

    useEffect(() => {
    
        let qtySelect = document.querySelectorAll(`.qty-select`)  
        for(let i = 0; i < qtySelect.length; i++)
        {
        qtySelect[i].innerHTML = options
        }

        if(isaccordianclicked)
        {
        var acc = document.getElementsByClassName("accordion");
        console.log("All acc", acc);
        var i;

        for (i = 0; i < acc.length; i++) 
        {
            acc[i].addEventListener("click", function() 
            {
            var panel = this.parentNode.parentNode.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
                this.children[0].children[0].style.display = 'none'
                this.children[0].children[1].style.display = 'block'
            } else {
                panel.style.display = "block";
                this.children[0].children[0].style.display = 'block'
                this.children[0].children[1].style.display = 'none'
            }
            });
        }
        
        setIsaccordianclicked(false)
        }
    }, [isaccordianclicked])

    const handleInput = (type) =>
    {

    }

    return (
        
        <>
          
            <div className="single-product">
                <div className="e5 e6">
                    <div className="single-product-level-one-div">
                        <div className="level-one-div-nested-one">

                        <a className="back-btn" href="/">
                            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="back-svg">
                            <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3z"></path>
                            </svg>
                            <div className="spacer _8"></div>
                            Back to list
                        </a>

                        <button className="cross-btn" onClick={() => setIsitemclicked(false)}>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="back-svg">
                            <line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/>
                            <line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/>
                            </svg>
                            <span>Chocolate Strawberry Cookie Dough</span>
                        </button>

                        <div className="product-img">
                            <div className="bz">
                            <div className="product-img-div-one-div">
                                <div className="product-img-div-one-div-nested">
                                <div className="product-img-div-one-div-nested-div">
                                    <div className="product-img-zoom">
                                    <img alt="" role="presentation" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg" className="product-img-display" />
                                    <div className="img-hr"></div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="level-one-div-nested-two">
                        <div className="product-title">
                            <h2 className="product-h2"></h2>
                            <h1 className="product-h1">The O.G.</h1>
                            <span className="product-price-span">£7.45</span>
                            <div className="product_h8"></div>

                            <div className="product-description">
                            <div className="product-description-div">
                                Double Smash Patty (Ground British Beef) with Melted Cheese, Crunchy Lettuce, Red Onions, Tomato &amp; Burger Sauce in a Seeded Brioche Bun
                            </div>
                            </div>

                            <div className="product_h8"></div>
                        </div>

                        <div className="product-height"></div>
                            
                        <ul className="product-ul">

                            <li>
                            <div>
                                <div>
                                <hr className="product_hr"></hr>

                                <div className="product-list-div">
                                    <div className="product-modifier-groups">
                                    <div className="product-modifier-name">Request</div>
                                    <div className="product-modifier-option">
                                        <span>Choose 1</span>
                                    </div>
                                    </div>
                                    <div className="product-required">
                                    <div className="product-required-div">Required</div>
                                    </div>
                                </div>

                                </div>
                                <div className="hg">
                                <div className="product-modifier-item-detail" onClick={() => handleInput("radio")}>
                                    <div className="poquickreview-modal">
                                    <div className="c8c7cuquickreview-modal">
                                        <svg style={{cursor: "pointer"}} width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="#AFAFAF" transform="rotate(90, 12, 12)"></path></svg>
                                    </div>
                                    </div>
                                    <input type="radio" className="radio-input" ></input>
                                    <label className="modifier-product-item-name nv">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">Yes</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                <hr className="product-modifier-items-hr"></hr>

                                <div className="product-modifier-item-detail" onClick={() => handleInput("radio")}>
                                    <input type="radio" className="radio-input" ></input>
                                    <label className="modifier-product-item-name ob">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                </div>
                            </div>
                            </li>

                            <li>
                            <div>
                                <div>
                                <hr className="product_hr"></hr>

                                <div className="product-list-div">
                                    <div className="product-modifier-groups">
                                    <div className="product-modifier-name">Request</div>
                                    <div className="product-modifier-option">
                                        <span>Choose 1</span>
                                    </div>
                                    </div>
                                    <div className="product-required">
                                    <div className="product-required-div">Required</div>
                                    </div>
                                </div>

                                </div>
                                {/* List of all modifier group products */}
                                <div className="hg">
                                <div className="product-modifier-item-detail"  onClick={() => handleInput("radio")}>
                                    <input type="radio" className="radio-input"></input>
                                    <label className="modifier-product-item-name nv">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                <hr className="product-modifier-items-hr"></hr>

                                <div className="product-modifier-item-detail" onClick={() => handleInput("radio")}>
                                    <input type="radio" className="radio-input"></input>
                                    <label className="modifier-product-item-name ob">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                <hr className="product-modifier-items-hr"></hr>

                                <div className="product-modifier-item-detail" onClick={() => handleInput("radio")}>
                                    <input type="radio" className="radio-input"></input>
                                    <label className="modifier-product-item-name ob">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                <hr className="product-modifier-items-hr"></hr>

                                <div className="product-modifier-item-detail" onClick={() => handleInput("radio")}>
                                    <input type="radio" className="radio-input"></input>
                                    <label className="modifier-product-item-name ob">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            <div className="spacer _8"></div>
                                            <div className="modifier-group-price">
                                                +£5.44
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                </div>
                            </div>
                            </li>

                            {/* minimum optino = '- / 0' and maximum option = 1 and single item select = 1 */}
                            <li>
                            <div>
                                <div>
                                <hr className="product_hr"></hr>

                                <div className="product-list-div">
                                    <div className="product-modifier-groups">
                                    <div className="product-modifier-name">Add Treat</div>
                                    <div className="product-modifier-option">
                                        <span>Choose up to 1</span>
                                    </div>
                                    </div>
                                    <div className="product-required">
                                    <div className="product-required-div">Required</div>
                                    </div>
                                </div>

                                </div>
                                {/* List of all modifier group products */}
                                <div className="hg">
                                <div className="product-modifier-item-detail" onClick={() => handleInput("checkbox")}>
                                    <input type="checkbox" className="checkbox-input"></input>
                                    <label className="modifier-product-item-name-checkbox mche">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                <hr className="product-modifier-items-hr"></hr>

                                {/* Checkbox with LightBlack Border */}
                                <div className="product-modifier-item-detail"  onClick={() => handleInput("checkbox")}>
                                    <input type="checkbox" className="checkbox-input"></input>
                                    <label className="modifier-product-item-name-checkbox mch">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                <hr className="product-modifier-items-hr"></hr>
                                
                                {/* Checkbox with White Border */}
                                <div className="product-modifier-item-detail" onClick={() => handleInput("checkbox")}>
                                    <input type="checkbox" className="checkbox-input"></input>
                                    <label className="modifier-product-item-name-checkbox mchw">
                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            <div className="spacer _8"></div>
                                            <div className="modifier-group-price">
                                                +£5.44
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </label>
                                </div>
                                </div>
                            </div>
                            </li>
                            
                            {/* minimum option = '- / 0' and maximum option = 5 and single item select = 2 */}
                            <li>
                            <div>
                                <div>
                                <hr className="product_hr"></hr>
                                <div className="product-list-div">
                                    <div className="product-modifier-groups">
                                    <div className="product-modifier-name">Chocolates & Fruits - Add-ons</div>
                                    <div className="product-modifier-option">
                                        <span>Choose up to 5</span>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                {/* List of all modifier group products */}
                                <div className="hg">

                                <div className="product-modifier-item-detail">

                                    <div className="modifier-product-item-name-inc-dec">
                                    
                                    <div className="modifier-inc-dec">
                                        <button className="modifier-btn" onClick={() => handleInput("incbutton")}>

                                        <div className="modifier-btn-div">
                                            <div className="modifier-btn-svg">
                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                            </svg>
                                            </div>
                                        </div>

                                        </button>
                                        
                                        <div className="incremented-values">1</div>
                                        
                                        <button className="modifier-btn" onClick={() => handleInput("incbutton")}>

                                        <div className="modifier-btn-div">
                                            <div className="modifier-btn-svg">
                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                            </svg>
                                            </div>
                                        </div>

                                        </button>
                                    </div>

                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>

                                </div>
                                <hr className="product-modifier-items-hr"></hr>

                                <div className="product-modifier-item-detail">

                                    <div className="modifier-product-item-name-inc-dec">
                                    
                                    <div className="modifier-inc-dec">
                                    <button className="modifier-btn">

                                        <div className="modifier-btn-div">
                                        <div className="modifier-btn-svg">
                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path>
                                            </svg>
                                        </div>
                                        </div>

                                    </button>
                                    
                                    <div className="incremented-values">1</div>
                                    
                                    <button className="modifier-btn">

                                        <div className="modifier-btn-div">
                                        <div className="modifier-btn-svg">
                                            <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path>
                                            </svg>
                                        </div>
                                        </div>

                                    </button>
                                    </div>

                                    <div className="spacer _16"></div>
                                    <div className="modifier-product-item-name-one-div">
                                        <div className="modifier-product-item-name-one-nested-div">
                                        <div className="modifier-product-item-name-one-nested-div-one">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested">
                                            <div className="modifier-product-item-name-one-nested-div-one-nested-div">No Extra Topping 1</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>

                                </div>

                                </div>
                            </div>
                            </li>
                        </ul>

                        <div className="product-top-padding-2"></div>

                        <div className="of">
                            <hr className="ed b9 og ho"></hr>
                            <div className="add-to-cart-btn-no-selection">
                            <div className="single-item-qty-div">
                                <div className="qty-selector">
                                    <div className="qty-selector-div">

                                    <select className="qty-select">
                                        {/* <option data-testid="quantity-options" value="100000" className="co">1</option> */}
                                    </select>
                                    <div className="svg-div">
                                        <div className="svg-div-one">
                                        <svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path></svg>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="da c7"></div>
                            <button className="add-to-cart-btn-item">Add 1 to order
                                <span className="add-cart-span">&nbsp;•&nbsp;</span>
                                £3.95
                            </button>
                            </div>
                        </div>
                        </div>

                    </div>
                </div>
                <div className="bz">
                    <ul className="items-ul">
                        <li className="item-lists">
                        <div className="item-title">
                            <h3 className="item-title-h3">Items bought together</h3>
                        </div>
                        <div className="item-list-empty-div"></div>

                        <ul className="items-list-nested-ul">
                            <li className="items-list-nested-list" onClick={() => setIsitemclicked(true)}>
                            <div className="items-nested-div">
                                <div className="items-nested-div-one">
                                <div className="item-detail-style">
                                    <div className="item-detail">
                                        <div className="item-title">
                                            <span>Banoffee Waffle</span>
                                        </div>
                                        
                                        <div className="item-price">
                                        <span className="item-price-span">£3.45</span>
                                        </div>

                                        <div className="item-description-style">
                                        <div className="item-description">
                                            <span className="item-description-span">
                                            The classic dynamic duo, slices of fresh banana and toffee fudge sauce, finished with a sprinkle of chocolate curls.
                                            </span>
                                        </div>
                                        </div>

                                    </div>

                                    <div className="item-img-style">
                                    <div className="lazyload-wrapper">
                                        <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg"></img>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="item-review">
                                    <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                </div> */}
                                </div>
                            </div>
                            </li>

                            <li className="items-list-nested-list" onClick={() => setIsitemclicked(true)}>
                            <div className="items-nested-div">
                                <div className="items-nested-div-one">
                                <div className="item-detail-style">
                                    <div className="item-detail">
                                        <div className="item-title">
                                            <span>Banoffee Waffle</span>
                                        </div>
                                        
                                        <div className="item-price">
                                        <span className="item-price-span">£3.45</span>
                                        </div>

                                        <div className="item-description-style">
                                        <div className="item-description">
                                            <span className="item-description-span">
                                            The classic dynamic duo, slices of fresh banana and toffee fudge sauce, finished with a sprinkle of chocolate curls.
                                            </span>
                                        </div>
                                        </div>

                                    </div>

                                    <div className="item-img-style">
                                    <div className="lazyload-wrapper">
                                        <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg"></img>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="item-review">
                                    <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                </div> */}
                                </div>
                            </div>
                            </li>

                            <li className="items-list-nested-list" onClick={() => setIsitemclicked(true)}>
                            <div className="items-nested-div">
                                <div className="items-nested-div-one">
                                <div className="item-detail-style">
                                    <div className="item-detail">
                                        <div className="item-title">
                                            <span>Banoffee Waffle</span>
                                        </div>
                                        
                                        <div className="item-price">
                                        <span className="item-price-span">£3.45</span>
                                        </div>

                                        <div className="item-description-style">
                                        <div className="item-description">
                                            <span className="item-description-span">
                                            The classic dynamic duo, slices of fresh banana and toffee fudge sauce, finished with a sprinkle of chocolate curls.
                                            </span>
                                        </div>
                                        </div>

                                    </div>

                                    <div className="item-img-style">
                                    <div className="lazyload-wrapper">
                                        <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg"></img>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="item-review">
                                    <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                </div> */}
                                </div>
                            </div>
                            </li>

                            <li className="items-list-nested-list" onClick={() => setIsitemclicked(true)}>
                            <div className="items-nested-div">
                                <div className="items-nested-div-one">
                                <div className="item-detail-style">
                                    <div className="item-detail">
                                        <div className="item-title">
                                            <span>Banoffee Waffle</span>
                                        </div>
                                        
                                        <div className="item-price">
                                        <span className="item-price-span">£3.45</span>
                                        </div>

                                        <div className="item-description-style">
                                        <div className="item-description">
                                            <span className="item-description-span">
                                            The classic dynamic duo, slices of fresh banana and toffee fudge sauce, finished with a sprinkle of chocolate curls.
                                            </span>
                                        </div>
                                        </div>

                                    </div>

                                    <div className="item-img-style">
                                    <div className="lazyload-wrapper">
                                        <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg"></img>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="item-review">
                                    <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                </div> */}
                                </div>
                            </div>
                            </li>
                        </ul>
                        </li>
                    </ul>
                </div>
                <div className="da je"></div>
                <div className="e5 e6"></div>
            </div>

            {/* Mobile Responsive */}
            <div>
                <div>
                <div className="agassingle-product">
                    <div  style={{width: "1px", height: "0px", padding: "0px", overflow: "hidden", position: "fixed", top: "1px", left: "1px"}}></div>
                    <div>
                        <div className="arc2single-product">
                        <div className="albfsingle-product">
                            <div className="akb0cccdsingle-product">
                            
                            <div className="ctascusingle-product">

                                <div className="agaksingle-product">
                                <div className="agasbcbksingle-product"></div>
                                <div className="akcyczbfsingle-product">

                                    <div className="d5single-product">
                                    <a className="d6aqbfc4single-product-cross-btn" to="/">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <title>X</title>
                                        <path d="m21.1 5.1-2.2-2.2-6.9 7-6.9-7-2.2 2.2 7 6.9-7 6.9 2.2 2.2 6.9-7 6.9 7 2.2-2.2-7-6.9 7-6.9Z" fill="currentColor"></path></svg>
                                    </a>
                                    </div>

                                    <div className="bre3dpsingle-product">Banoffee Waffle</div>
                                    <div className="e9single-product"></div>
                                </div>
                                </div>

                            </div>

                            <div>
                                <div className="akbkbxc3single-product">
                                <div className="bkeaebalsingle-product">
                                    <div className="ecsingle-product">
                                    <div className="akedeebkefsingle-product">
                                        <img alt="" role="presentation" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg" className="egbkaeeheisingle-productimg" />
                                        <div className="agasatbdbcajsingle-product"></div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            
                            <div className="eksingle-product">
                                {/* <div className="bnelbpemeneoalbfsingle-product">Banoffee Waffle</div> */}
                                <span data-testid="rich-text" className="fnfofpbnfqbpfrb1single-product-price">£3.45</span>
                                <div className="epeqsingle-product-div"></div>
                                <div className="er">
                                <div className="bresbtdqetbxsingle-product">The classic dynamic duo, slices of fresh banana and toffee fudge sauce, finished with a sprinkle of chocolate curls.</div>
                                </div>
                            </div>

                            <ul className="ftsingle-productul">
                                <li>
                                <div className="fusingle-productlidiv">
                                    <hr className="efeqeofvsingle-product"></hr>

                                    <div className="fwsingle-product">
                                        <div className="alaqd0fxsingle-product">
                                            <div className="alamsingle-product">
                                            <div className="bnfrbpfsingle-product">Waffle Type</div>
                                            <div className="bresbtdqfysingle-product">
                                                <span>Choose 1</span>
                                                <div className="fzsingle-product">
                                                <div className="g0afg1single-product">Required</div>
                                                </div>
                                            </div>
                                            </div>
                                            {/* <div className="fzsingle-product">
                                            <div className="g0afg1single-product">Required</div>
                                            </div> */}
                                            {/* <div className="single-product-svg-div accordion" onClick={handleNestedDivOpend}> */}
                                            <div className="single-product-svg-div accordion" onClick={() => setIsaccordianclicked(true)}>
                                            <div className="single-product-svg-div-one">
                                                <svg className="bottom-arrow-head-svg" style={{display: "none"}} width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                                </svg>

                                                <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer"}}>
                                                <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                                                </svg>
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Listed Data */}
                                    <div className="g5single-product">

                                        <div className="alakg6bfsingle-product">
                                        <div className="poquickreview-modal" onClick={() => handleInput("radio")}>
                                            <div className="c8c7cuquickreview-modal">
                                            <svg style={{cursor: "pointer"}} width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="#AFAFAF" transform="rotate(90, 12, 12)"></path></svg>
                                            </div>
                                        </div>
                                        <input type="radio" className="radio-input"></input>

                                        <label className="brbsdpdqbkalbfafg6single-productlable nv" onClick={() => handleInput("radio")}>
                                            <div className="spacer _16"></div>
                                            <div className="e4ald0gisingle-product">
                                            <div className="ale4amc4gjgkglsingle-product">
                                                <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                    <div className="bresdpg4gosingle-product">Regular - Half - 7" Fresh Waffle</div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </label>
                                        </div>
                                        <hr className="efbvgpgq"></hr>
                                        <div className="alakg6bfsingle-product">
                                        <input type="radio" className="radio-input"/>

                                        <label className="brbsdpdqbkalbfafg6single-productlable ob">
                                            <div className="spacer _16"></div>
                                            <div className="e4ald0gisingle-product">
                                            <div className="ale4amc4gjgkglsingle-product">
                                                <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                    <div className="bresdpg4gosingle-product">Regular - Half - 7" Fresh Waffle</div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </label>
                                        </div>
                                        <hr className="efbvgpgq"></hr>

                                    </div>

                                </div>

                                </li>

                                <li>
                                <div className="fusingle-productlidiv">
                                    <hr className="efeqeofvsingle-product"></hr>

                                    <div className="fwsingle-product">
                                        <div className="alaqd0fxsingle-product">
                                            <div className="alamsingle-product">
                                            <div className="bnfrbpfsingle-product">Waffle Type 2</div>
                                            <div className="bresbtdqfysingle-product">
                                                <span>Choose 1</span>
                                                <div className="fzsingle-product">
                                                <div className="g0afg1single-product">Required</div>
                                                </div>
                                            </div>
                                            </div>
                                            {/* <div className="fzsingle-product">
                                            <div className="g0afg1single-product">Required</div>
                                            </div> */}
                                            {/* <div className="single-product-svg-div accordion" onClick={handleNestedDivOpend}> */}
                                            <div className="single-product-svg-div accordion" onClick={() => setIsaccordianclicked(true)}>
                                            <div className="single-product-svg-div-one">
                                                <svg className="bottom-arrow-head-svg" style={{display: "none"}} width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                                <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                                </svg>

                                                <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer"}}>
                                                <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                                                </svg>
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Listed Data */}
                                    <div className="g5single-product">

                                        <div className="alakg6bfsingle-product">
                                        <input type="checkbox" className="checkbox-input"/>

                                        <label className="brbsdpdqbkalbfafg6single-productlablecheck mch">
                                            <div className="spacer _16"></div>
                                            <div className="e4ald0gisingle-product">
                                            <div className="ale4amc4gjgkglsingle-product">
                                                <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                    <div className="bresdpg4gosingle-product">Regular - Half - 7" Fresh Waffle</div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </label>
                                        </div>
                                        <hr className="efbvgpgq"></hr>

                                        <div className="alakg6bfsingle-product">
                                        <input type="checkbox" className="checkbox-input"/>

                                        <label className="brbsdpdqbkalbfafg6single-productlablecheck mche">
                                            <div className="spacer _16"></div>
                                            <div className="e4ald0gisingle-product">
                                            <div className="ale4amc4gjgkglsingle-product">
                                                <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                    <div className="bresdpg4gosingle-product">Regular - Half - 7" Fresh Waffle</div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </label>
                                        </div>
                                        <hr className="efbvgpgq"></hr>

                                        <div className="alakg6bfsingle-product">
                                        <input type="checkbox" className="checkbox-input"/>

                                        <label className="brbsdpdqbkalbfafg6single-productlablecheck mchw">
                                            <div className="spacer _16"></div>
                                            <div className="e4ald0gisingle-product">
                                            <div className="ale4amc4gjgkglsingle-product">
                                                <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                    <div className="bresdpg4gosingle-product">Regular - Half - 7" Fresh Waffle</div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </label>
                                        </div>
                                        <hr className="efbvgpgq"></hr>

                                    </div>

                                </div>

                                </li>

                                <li>
                                <div className="fusingle-productlidiv">
                                    <hr className="efeqeofvsingle-product"></hr>

                                    <div className="fwsingle-product">
                                    <div className="alaqd0fxsingle-product">
                                        <div className="alamsingle-product">
                                        <div className="bnfrbpfsingle-product">Waffle Type 3</div>
                                        <div className="bresbtdqfysingle-product">
                                            <span>Choose 1</span>
                                            <div className="fzsingle-product">
                                            <div className="g0afg1single-product">Required</div>
                                            </div>
                                        </div>
                                        </div>
                                        {/* <div className="fzsingle-product">
                                        <div className="g0afg1single-product">Required</div>
                                        </div> */}
                                        {/* <div className="single-product-svg-div accordion" onClick={handleNestedDivOpend}> */}
                                        <div className="single-product-svg-div accordion" onClick={() => setIsaccordianclicked(true)}>
                                        <div className="single-product-svg-div-one">
                                            <svg className="bottom-arrow-head-svg" style={{display: "none"}} width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(180, 12, 12)"></path>
                                            </svg>

                                            <svg className="rigth-arrow-head-svg" width="30px" height="30px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{cursor: "pointer"}}>
                                            <path d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z" fill="currentColor" transform="rotate(90, 12, 12)"></path>
                                            </svg>
                                        </div>
                                        </div>
                                    </div>
                                    </div>

                                    {/* Listed Data */}
                                    <div className="g5single-product">
                                    <div className="alg5bfsingle-product">
                                        <div className="alaqbfsingle-product">
                                            <button data-testid="quantity-decrement-selection-button" aria-label="Decrement" className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn"><div className="ez fj"><div className="fj ez h1"><svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="m7.33325 13v-2h9.33335v2z" fill="#000000"></path></svg></div></div></button>
                                            <div className="bresbtdqiqsingle-product">1</div>
                                            <button data-testid="quantity-increment-selection-button" aria-label="Increment" className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn"><div className="ez fj"><div className="fj ez h1"><svg width="24px" height="24px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z" fill="#000000"></path></svg></div></div></button>
                                        </div>

                                        <div className="spacer _16"></div>
                                        <div className="e4ald0ghsingle-productincdec">
                                            <div className="ale4amc4gigjgksingle-productincdec">
                                            <div className="alaqsingle-product">
                                                <div className="alamglgmsingle-productincdec">
                                                    <div className="bresdpg3gnsingle-productincdecheading">Add: Chocolate Sauce</div>
                                                    <div className="spacer _8"></div>
                                                    <div className="bresbtdqb1bzsingle-productincdecprice">+£0.50</div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="efbvgogpsingle-producthr"></hr>
                                    </div>
                                    
                                </div>

                                </li>
                            </ul>

                            <div className="h2single-product"></div>
                            <div>
                                <div className="albfglh3single-product">
                                <div className="akh4gzh5h6bxgtb1h7single-product">

                                    <div className="agbdh8h4albfsingle-product">
                                    <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-dec-product">
                                        <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                                        <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                                        </svg>
                                    </button>
                                    
                                    <div style={{width: "48px"}}></div>
                                    
                                    <button className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-inc-product">
                                        <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="hfg0ebhgsingle-product-svg">
                                        <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                                        </svg>
                                    </button>
                                    </div>

                                    <div className="aghhhibre3dpbualc4bfbzbmsingle-product">
                                    <div>1</div>
                                    </div>

                                </div>
                                </div>

                                <div className="epezsingle-product"></div>
                                <hr className="efeqhjg2single-producthr"></hr>
                            </div>

                            <div className="iosignle-product"></div>
                            <div className="i7single-product"></div>
                            <div className="iaibicblidieifigcsctbcsingle-product">
                                <button className="e3bubrdpb9ihbkalbfc4afh2iibbijikilgwgxsingle-product" onClick={() => setIsitemclicked(false)}>
                                    Add 1 to order
                                    <span className="bre3dpbud6imbfsingle-product-span">&nbsp;•&nbsp;</span>
                                    £3.95
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div  style={{width: "1px", height: "0px", padding: "0px", overflow: "hidden", position: "fixed", top: "1px", left: "1px"}}></div>
                </div>
                </div>
            </div>
        </>
    )
}

export default productDetails