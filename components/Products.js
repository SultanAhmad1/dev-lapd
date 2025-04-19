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
import Image from "next/image";
import Link from "next/link";


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

      <div className="content">

        <div className="content-div-level-one">
       
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
                      <section id={`section_${index}`} className="item-title">
                        <h3 className="item-title-h3" style={{'--category-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.categoryFontColor}}>
                          {category.title}
                        </h3>
                      </section>
                      
                      {/* <div className="item-list-empty-div"></div> */}

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
                                style={{
                                  '--item-hover-background': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverBackgroundColor, 
                                  '--item-hover-font-color':websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverFontColor
                                }}
                                key={itemIndex} 
                                className="items-list-nested-list" 
                                onClick={() => handleProductSelect(category?.id, item?.id)}
                              >
                                <Link href={`${storeName?.replace(/ /g, '-')?.toLowerCase()}/${category?.slug}/${item?.slug}`}>
                                  <div className="items-nested-div">
                                    <div className="items-nested-div-one">
                                      <div className="item-detail-style">
                                        <div className="item-detail">
                                          <p className="item-title-p"
                                            style={{
                                              '--font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemFontColor,
                                              '--item-hover-font-color':websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverFontColor
                                            }}
                                          >
                                            {title}
                                          </p>

                                          <div className="item-description-style">
                                            <p className="item-description"
                                              style={{
                                                '--font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemFontColor,
                                                '--item-hover-font-color':websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverFontColor
                                              }}
                                            >
                                              {description}
                                            </p>
                                          </div>

                                          {/* <div className="item-price"> */}
                                            <span className="item-price-span" 
                                              style={{
                                                '--font-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemFontColor,
                                                '--item-hover-font-color':websiteModificationData?.websiteModificationLive?.json_log?.[0]?.itemHoverFontColor
                                              }}
                                            >
                                              &pound;{parseFloat(price).toFixed(2)}
                                            </span>
                                          {/* </div> */}

                                          {/* <div className="item-description-style">
                                            <div className="item-description">
                                              <span className="item-description-span">
                                                {description}
                                              </span>
                                            </div>
                                          </div> */}

                                        </div>
                                        {
                                          image_url && 
                                          <div className="item-img-style">
                                            <div className="lazyload-wrapper">
                                              {
                                                isValidHttpsUrl(image_url) ? 
                                                  <Image className="item-img" src={image_url} alt={title} width={200} height={200}/>
                                                : 
                                                  <Image className="item-img" src={IMAGE_URL_Without_Storage+""+image_url} alt={title} width={200} height={200}/>
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
                                </Link>
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
