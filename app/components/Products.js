import React, { useContext, useEffect, useRef, useState } from "react";
import HomeContext from "../contexts/HomeContext";
import Banner from "./Banner";
import FilterLocationTime from "./FilterLocationTime";
import Navigation from "./Navigation";
import ViewCartMobileBtn from "./ViewCartMobileBtn";
import MobileTopBar from "./MobileTopBar";
import Link from "next/link";

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
  } = useContext(HomeContext);

  const [isscrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollContainerRef = useRef(null);

  const handleCategoryClick = (navmobileindex) => 
  {
    setNavmobileindex(navmobileindex);
    scrollTo(navmobileindex, "smooth");
  };

  const scrollTo = (target, behavior) => 
  {
    const element = target === "top" ? document.body : document.querySelector(`.section${target}`);
    if (element) 
    {
      element.scrollIntoView({ behavior: behavior });
    }
  };

  const handleProductSelect = (categoryId, itemId) => 
  {
    setLoader(true);
    setSelectedcategoryid(categoryId);
    setSelecteditemid(itemId);
  };
  
  useEffect(() => {
    let listElements = document.querySelectorAll('.item-lists')
  
    window.addEventListener("scroll",function(){
      if(window.scrollY > 300)
      {
        listElements.forEach((list) => {
  
          let top = window.scrollY
          let offset = list.offsetTop
          let height = list.offsetHeight
    
          if(top >= offset && top < offset + height)
          {
            setIsScrolled(true)
            let scrollData = scrollPosition + parseInt(list.getAttribute('data-index'))
            setScrollPosition(scrollData);
            setNavmobileindex(parseInt(list.getAttribute('data-index')))
          }
        })
      }
      else
      {
        setScrollPosition(0)
        setIsScrolled(false)
      }
    
    })
  })
  
  
  return (
    <>
      <Banner websiteModificationData={websiteModificationData} />
      <div className="main-empt-div"></div>
      <div></div>
      <FilterLocationTime />
      <div className="content">
        <div className="content-div-level-one">
          <Navigation websiteModificationData={websiteModificationData} handleCategoryClick={handleCategoryClick}/>
          <div></div>
          <div className="spacer _40"></div>
          {/* Navigation bar for 900 or lesser width device */}
          {/* <MobileTopBar
            websiteModificationData={websiteModificationData}
            handleCategoryClick={handleCategoryClick}
            isscrolled={isscrolled}
            scrollPosition={scrollPosition}
          /> */}
          <div className="cat-items-content">
            <ul className="items-ul">
              {navigationcategories?.map((category, index) => {
                return (
                  category?.items?.length > 0 &&
                  <li key={category.id} className={`item-lists section${index}`} data-index={index} id={`${category?.title?.replace(/\s+/g,'')}`}>
                    <div className="item-title">
                      <h3
                        className="item-title-h3"
                        style={{
                          color:
                            websiteModificationData?.websiteModificationLive !==
                              null &&
                            websiteModificationData?.websiteModificationLive
                              ?.json_log[0]?.categoryFontColor !== null &&
                            websiteModificationData?.websiteModificationLive
                              ?.json_log[0]?.categoryFontColor,
                        }}
                      >
                        {category.title}
                      </h3>
                    </div>
                    <div className="item-list-empty-div"></div>

                    <ul className="items-list-nested-ul">
                      {category.items?.map((item, itemIndex) => {
                        return (
                          <li
                            ref={scrollContainerRef}
                            key={itemIndex}
                            className="items-list-nested-list"
                            onClick={() =>
                              handleProductSelect(category?.id, item?.id)
                            }
                          >
                            <Link
                              href={`${storeName}/${category?.slug}/${item?.slug}`}
                            >
                              <div className="items-nested-div">
                                <div className="items-nested-div-one">
                                  <div className="item-detail-style">
                                    <div className="item-detail">
                                      <div
                                        className="item-title"
                                        style={{
                                          color:
                                            websiteModificationData?.websiteModificationLive !==
                                              null &&
                                            websiteModificationData
                                              ?.websiteModificationLive
                                              ?.json_log[0]?.itemFontColor !==
                                              null &&
                                            websiteModificationData
                                              ?.websiteModificationLive
                                              ?.json_log[0]?.itemFontColor,
                                        }}
                                      >
                                        <span>{item.title}</span>
                                      </div>

                                      <div className="item-price">
                                        <span className="item-price-span">
                                          {item?.country_price_symbol}
                                          {parseFloat(item?.price).toFixed(2)}
                                        </span>
                                      </div>

                                      <div className="item-description-style">
                                        <div className="item-description">
                                          <span className="item-description-span">
                                            {item?.description}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {item?.image_url !== null && (
                                      <div className="item-img-style">
                                        <div className="lazyload-wrapper">
                                          <img
                                            className="item-img"
                                            src={item?.image_url}
                                            alt="Product"
                                          ></img>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* <div className="item-review">
                                    <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                  </div> */}
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <ViewCartMobileBtn />
    </>
  );
}
