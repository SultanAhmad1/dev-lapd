import React, { useContext, useEffect, useRef, useState } from "react";
import HomeContext from "../contexts/HomeContext";
import Banner from "./Banner";
import FilterLocationTime from "./FilterLocationTime";
import Navigation from "./Navigation";
import ViewCartMobileBtn from "./ViewCartMobileBtn";
import { IMAGE_URL_Without_Storage } from "../global/Axios";
import moment from "moment";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import MobileTopBar from "./MobileTopBar";

export default function Products() {
  const {
    setLoader,
    websiteModificationData,
    storeName,
    navigationcategories,
    navmobileindex,
    setSelectedcategoryid,
    setSelecteditemid,
    setNavmobileindex,
    dayOpeningClosingTime,
  } = useContext(HomeContext);

  const scrollContainerRef = useRef(null);

  const handleProductSelect = (categoryId, itemId) => {
    setLoader(true);
    setSelectedcategoryid(categoryId);
    setSelecteditemid(itemId);
  };
  
  const isValidHttpsUrl = (url) => {
    return url.startsWith('https://');
  };

  return (
    <>
      <Header />

      <div className="header-display">
        <Banner websiteModificationData={websiteModificationData} />
      </div>
      
      <FilterLocationTime />

      <div className="content">
        <div className="content-div-level-one">
          <div className="left-bar">
            <Navigation
              websiteModificationData={websiteModificationData}
            />
          </div>
          <div></div>
          <div className="spacer _40"></div>
          {/* Navigation bar for 900 or lesser width device */}
          <div className="top-bar">
            <MobileTopBar/>
          </div>
          <div className="cat-items-content">
            <ul className="items-ul">
              {
                navigationcategories?.map((category, index) => {
                  return (
                    category?.items?.length > 0 && 
                    <li key={category.id}  className={`item-lists`}>
                      <section id={`section_${index}`} className="item-title">
                        <h3 className="item-title-h3" style={{color: websiteModificationData?.websiteModificationLive !== null && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor !== null && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor,}}>
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

                            const { title, price, description, image_url } = item;
                            return (
                              isItemSuspend === false &&
                              <li ref={scrollContainerRef} key={itemIndex} className="items-list-nested-list" onClick={() => handleProductSelect(category?.id, item?.id)}>
                                <a href={`${storeName.toLowerCase()}/${category?.slug}/${item?.slug}`}>
                                  <div className="items-nested-div">
                                    <div className="items-nested-div-one">
                                      <div className="item-detail-style">
                                        <div className="item-detail">
                                          <div className="item-title" style={{color: websiteModificationData?.websiteModificationLive && websiteModificationData?.websiteModificationLive?.json_log[0]?.itemFontColor && websiteModificationData?.websiteModificationLive?.json_log[0]?.itemFontColor,}}>
                                            <span>{title}</span>
                                          </div>

                                          <div className="item-price">
                                            <span className="item-price-span">
                                              &pound; {parseFloat(price).toFixed(2)}
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
                                                isValidHttpsUrl(image_url) 
                                                ?<img className="item-img" src={image_url} alt={title}/>
                                                :<img className="item-img" src={IMAGE_URL_Without_Storage+""+image_url} alt={title}/>
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
      </div>

      <ViewCartMobileBtn />
      <Footer />
    </>
  );
}
