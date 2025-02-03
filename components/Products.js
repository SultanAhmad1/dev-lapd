"use client";
import React, { useContext, useEffect, useRef } from "react";
import HomeContext from "../contexts/HomeContext";
import Banner from "./Banner";

import ViewCartMobileBtn from "./ViewCartMobileBtn";
import { IMAGE_URL_Without_Storage, itemHoverBackgroundColor, itemHoverColor } from "../global/Axios";
import moment from "moment";
import Header from "./Header";
import Footer from "./Footer";
import MobileTopBar from "./MobileTopBar";
import { ContextCheckApi } from "@/app/layout";
import CheckoutDisplay from "./CheckoutDisplay";


export default function Products() {

  const { setMetaDataToDisplay } = useContext(ContextCheckApi)

  const {
    loader,
    setLoader,
    websiteModificationData,
    storeName,
    navigationCategories,
    navMobileIndex,
    setSelectedCategoryId,
    setSelectedItemId,
    setNavMobileIndex,
    dayOpeningClosingTime,
  } = useContext(HomeContext);

  const scrollContainerRef = useRef(null);

  const handleProductSelect = (categoryId, itemId) => {
    setLoader(true);
    setSelectedCategoryId(categoryId);
    setSelectedItemId(itemId);
  };
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };

  useEffect(() => {
   if(loader)
    {
      setTimeout(() => {
        setLoader(false)
      }, 3000);
    }
  }, [loader,setLoader]);
  
  const cartItems = [
    {
      category: '1 x Burgers:',
      items: [
        { name: 'Regular Fries', extraPrice: null },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
        { name: 'Signature Hot Sauce', extraPrice: 1.0 },
      ],
      price: 2.24,
    },
    {
      category: '1 x Drinks:',
      items: [
        { name: 'Pepsi Max 330ml', extraPrice: null },
      ],
      price: 1.99,
    },
  ];

 
  return (
    <>
      <Header websiteModificationData={websiteModificationData}/>
      <MobileTopBar/>

      <div className="header-display">
        <Banner websiteModificationData={websiteModificationData} />
      </div>
      
      {/* <div className="contents">
        <div className="menu-display">
          <h3>Burgers</h3>

          <div className="menu-items">

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
                <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
              <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
              <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
              <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
              <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
              <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

            <div className="menu-display-items">
              <div className="nested-item-display">
                <h6>Item display</h6>
                <span>&pound;5.56</span>
                <p>Dummy text display</p>
              </div>
              <div className="nested-item-image-display">
              <img width={100} height={100} src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image display"></img>
              </div>
            </div>

          </div>
        </div>
        <div className="checkout-display">
          <h5>My Order</h5>

          <div className="checkout-order-display">
            <ul className="order-li-head">
              <li>
                <div className="col-1">Items</div>
                <div className="col-2">Price</div>
                <div className="col-3">Del</div>
              </li>
            </ul>
            
            <ul className="order-details">
              <li>
                <div className="col-1 edit_order" data-index="0">
                  <div>
                    <div className="or-cat-name"><b>1 x </b> Deal: </div>
                    <div className="or-pro-name">1 x Meal Deal - U</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name">Burgers:</div>
                    <div className="or-pro-name">Peri-Peri Twister</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name"></div>
                    <div className="or-pro-name">Double Up + £2.50</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name"></div>
                    <div className="or-pro-name">Cheese Slice + £0.50</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name"></div>
                    <div className="or-pro-name">1 x Signature Hot Sauce + £1.00</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name"></div>
                    <div className="or-pro-name">No Mayonnaise</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name"></div>
                    <div className="or-pro-name">No Red Onion</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name"></div>
                    <div className="or-pro-name">No Lettuce</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name [object Object] h">Sides:</div>
                    <div className="or-pro-name">Sweet Potato Fries</div>
                  </div>
                  
                  <div>
                    <div className="or-cat-name [object Object] h">Milkshakes:</div>
                    <div className="or-pro-name">The Hacker - Bueno and Milky Bar</div>
                  </div>
                  
                </div>
                
                <div className="col-2">£<span className="productPrice0">17.50</span></div>
                <div className="col-3 removeProduct" data-index="0">Remove</div>
              </li>
              <div className="mini-sub-total"></div>
            </ul>
          </div>

          <div className="checkout-coupons">
            <p>Spend &pound;10.00 more to get 10 % off.</p>

            <div className="coupon-input">
              <input type="text" name="" id="" />
              <button type="button">Apply</button>
            </div>

          </div>

          <div className="checkout-order-computed">
            <p>Spend &pound;10.00 to get Free Delivery</p>
            
            <div className="checkout-computation">
              <div className="nested-computed">
                <span>Subtotal</span>
                <span>&pound;25.00</span>
              </div>

            </div>

          </div>
          
        </div>
      </div> */}

      <div className="content">

        <div className="content-div-level-one">
          {/* <div className="left-bar">
            <Navigation
              websiteModificationData={websiteModificationData}
            />
          </div> */}
          <div></div>
          <div className="spacer _40"></div>
          {/* Navigation bar for 900 or lesser width device */}
          <div className="cat-items-content">
            <ul className="items-ul">
              {
                navigationCategories?.map((category, index) => {
                  return (
                    category?.items?.length > 0 && 
                    <li key={category.id}  className={`item-lists`}>
                      <section 
                          id={`section_${index}`} 
                          className="item-title"
                          style={{
                            width: "100vw",
                            overflowX: "auto"
                          }}
                        >
                        <h3 className="item-title-h3" style={{'--category-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.categoryFontColor,}}>
                          {category.title}
                        </h3>
                      </section>
                      <div className="item-list-empty-div"></div>

                      <ul className="items-list-nested-ul">
                        {
                          category?.items?.map((item, itemIndex) => {
                            
                            let isItemSuspend = false;


                            if(item?.suspension_info !== null)
                            {
                              if(moment().format('YYYY-MM-DD') <= moment.unix(item?.suspension_info?.suspend_untill).format('YYYY-MM-DD'))
                              {
                                isItemSuspend = true
                              }
                            }

                            const { id,title, price, description, image_url } = item;
                            return (
                              isItemSuspend === false &&
                              <li 
                                ref={scrollContainerRef} 
                                style={{'--item-hover-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverBackgroundColor, '--item-hover-font-color':websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverFontColor}}
                                key={itemIndex} 
                                className="items-list-nested-list" 
                                onClick={() => handleProductSelect(category?.id, item?.id)}
                              >
                                <a href={`${storeName?.replace(/ /g, '-')?.toLowerCase()}/${category?.slug}/${item?.slug}`}>
                                  <div className="items-nested-div">
                                    <div className="items-nested-div-one">
                                      <div className="item-detail-style">
                                        <div className="item-detail">
                                          <div className="item-title">
                                            <span>{title}</span>
                                          </div>

                                          <div className="item-price">
                                            <span className="item-price-span" >
                                              &pound;{parseFloat(price).toFixed(2)}
                                            </span>
                                          </div>

                                          <div className="item-description-style">
                                            <div className="item-description">
                                              <span className="item-description-span">
                                                {description}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        {
                                          image_url && 
                                          <div className="item-img-style">
                                            <div className="lazyload-wrapper">
                                              {
                                                isValidHttpsUrl(image_url) ? 
                                                  <img className="item-img" src={image_url} alt={title} loading="lazy"/> 
                                                : 
                                                  <img className="item-img" src={IMAGE_URL_Without_Storage+""+image_url} alt={title} loading="lazy"/>
                                              }
                                            </div>
                                          </div>
                                        }
                                      </div>
                                      {/* <div className="item-review">
                                      <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                    </div> */}
                                    </div>
                                  </div>
                                </a>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>

        <div className="checkout-hide">
          <CheckoutDisplay />
        </div>

      </div>

    
      <ViewCartMobileBtn />
      <Footer />
    </>
  );
}
