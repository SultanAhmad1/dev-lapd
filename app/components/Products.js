import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import Banner from './Banner'
import FilterLocationTime from './FilterLocationTime'
import Navigation from './Navigation'
import ViewCartMobileBtn from './ViewCartMobileBtn'
import MobileTopBar from './MobileTopBar'
import Link from 'next/link'

export default function Products() 
{
  const {setLoader,websiteModificationData, storeName,navigationcategories, navmobileindex, setSelectedcategoryid, setSelecteditemid, setNavmobileindex} = useContext(HomeContext)

  const [isscrolled, setIsScrolled] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleCategoryClick = (navmobileindex) => {
      setNavmobileindex(navmobileindex);
      scrollTo(navmobileindex, 'smooth');
  };

  const scrollTo = (target, behavior) => {
    const element = target === 'top' ? document.body : document.getElementById(`section${target}`);
    if (element) 
    {
      element.scrollIntoView({ behavior: behavior });
    }
  };

  const handleProductSelect = (categoryId, itemId) =>
  {
    setLoader(true)
    setSelectedcategoryid(categoryId)
    setSelecteditemid(itemId)
  }

  const handleScroll = () => {
    // Check if the user has scrolled down (you can adjust the threshold as needed)
    if (window.scrollY > 200) 
    {
      setIsScrolled(true);
      const currentPosition = window.scrollY;
      // Determine which section is currently in view
      const active = navigationcategories?.find((section, index) => {
        const nextSection = navigationcategories[index + 1];
        if (nextSection) {
          return currentPosition >= document.getElementById(`section${section.id}`)?.offsetTop 
          &&
            currentPosition < document.getElementById(`section${nextSection.id}`)?.offsetTop;
        }
        return currentPosition >= document.getElementById(`section${section.id}`)?.offsetTop;
      });

      setNavmobileindex(active ? active.id : navmobileindex);

      setScrollPosition(currentPosition / 10);
    } else{
      setIsScrolled(false);
    }
  };

  useEffect(() => {
      // Add a scroll event listener to track scrolling
      window.addEventListener('scroll', handleScroll);
  
      // if (contentRef.current) {
      //   setContentWidth(navcategories.length * contentRef.current.offsetWidth);
      // }
  
      const tabs = document.querySelectorAll(".alaqbtbbh6h7avh8akawanothernav bycsd3d4topbar-div");
      // const rightArrow = document.querySelector(
      //   ".scrollable-tabs-container .right-arrow svg"
      // );
      // const leftArrow = document.querySelector(
      //   ".scrollable-tabs-container .left-arrow svg"
      // );
      const tabsList = document.querySelector(".alaqbbbcnocqavlcakawtopbar-div");
      // const leftArrowContainer = document.querySelector(
      //   ".scrollable-tabs-container .left-arrow"
      // );
      // const rightArrowContainer = document.querySelector(
      //   ".scrollable-tabs-container .right-arrow"
      // );
  
      const removeAllActiveClasses = () => {
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });
      };
  
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          removeAllActiveClasses();
          tab.classList.add("active");
        });
      });
  
      const manageIcons = () => {
        if (tabsList.scrollLeft >= 20) {
          // leftArrowContainer.classList.add("active");
        } else {
          // leftArrowContainer.classList.remove("active");
        }
  
        let maxScrollValue = tabsList.scrollWidth - tabsList.clientWidth - 20;
  
        if (tabsList.scrollLeft >= maxScrollValue) {
          // rightArrowContainer.classList.remove("active");
        } else {
          // rightArrowContainer.classList.add("active");
        }
      };
  
      // rightArrow.addEventListener("click", () => {
      //   tabsList.scrollLeft += 200;
      //   manageIcons();
      // });
  
      // leftArrow.addEventListener("click", () => {
      //   tabsList.scrollLeft -= 200;
      //   manageIcons();
      // });
  
      tabsList.addEventListener("scroll", manageIcons);
  
      let dragging = false;
  
      const drag = (e) => {
        if (!dragging) return;
        tabsList.classList.add("dragging");
        tabsList.scrollLeft -= e.movementX; 
      };
  
      tabsList.addEventListener("mousedown", () => {
        dragging = true;
      });
  
      tabsList.addEventListener("mousemove", drag);
  
      document.addEventListener("mouseup", () => {
        dragging = false;
        tabsList.classList.remove("dragging");
      });
    
      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('scroll', handleScroll);
        // setContentWidth(0)
      };
  
      
    }, []);
  
  return (
    <>
      <Banner  websiteModificationData={websiteModificationData}/>
      <div className="main-empt-div"></div>
      <div></div>
      <FilterLocationTime />
      <div className="content">
        <div className="content-div-level-one">
          <Navigation websiteModificationData={websiteModificationData} handleCategoryClick={handleCategoryClick}/>
          <div></div>
          <div className="spacer _40"></div>
          {/* Navigation bar for 900 or lesser width device */}
          <MobileTopBar websiteModificationData={websiteModificationData} handleCategoryClick={handleCategoryClick} isscrolled={isscrolled} scrollPosition={scrollPosition}/>
          <div className="cat-items-content">
            <ul className="items-ul">
              {
                navigationcategories?.map((category, index) => {
                    return(
                        <li key={category.id} className="item-lists" id={`section${category.id}`}>
                          <div className="item-title" >
                            <h3 className="item-title-h3">{category.title}</h3>
                          </div>
                          <div className="item-list-empty-div"></div>

                          <ul className="items-list-nested-ul">
                            {
                              category.items?.map((item, itemIndex) =>
                              {
                                return(
                                  <li key={itemIndex} className="items-list-nested-list" onClick={() => handleProductSelect(category?.id,item?.id)}>
                                      <Link href={`${storeName}/${category?.slug}/${item?.slug}`}>
                                      {/* <a> */}
                                        <div className="items-nested-div">
                                          <div className="items-nested-div-one">
                                            <div className="item-detail-style">
                                                <div className="item-detail">
                                                    <div className="item-title" style={{color: (websiteModificationData !== null && websiteModificationData?.json_log[0]?.itemFontColor !== null) && websiteModificationData?.json_log[0]?.itemFontColor}}>
                                                        <span>{item.title}</span>
                                                    </div>
                                                    
                                                    <div className="item-price">
                                                        <span className="item-price-span">{item?.country_price_symbol}{parseFloat(item?.price).toFixed(2)}</span>
                                                    </div>

                                                    <div className="item-description-style">
                                                        <div className="item-description">
                                                        <span className="item-description-span">
                                                            {item?.description}
                                                        </span>
                                                        </div>
                                                    </div>

                                                </div>
                                                {
                                                    item?.image_url !== null &&
                                                    <div className="item-img-style">
                                                        <div className="lazyload-wrapper">
                                                            <img className="item-img" src={item?.image_url} alt='Product'></img>
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
                                )
                              })
                            }
                          </ul>
                        </li>
                    )
                })
              }
            </ul>
          </div>
          </div>
      </div>
      <ViewCartMobileBtn />
    </>
  )
}