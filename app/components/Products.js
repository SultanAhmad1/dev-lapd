import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'
import Banner from './Banner'
import FilterLocationTime from './FilterLocationTime'
import Navigation from './Navigation'
import ViewCartMobileBtn from './ViewCartMobileBtn'
import MobileTopBar from './MobileTopBar'

export default function Products() 
{
    const {navcategories} = useContext(HomeContext)
  return (
    <>
        <Banner />
        <div className="main-empt-div"></div>
        <div></div>
        <FilterLocationTime />
        <div className="content">
            <div className="content-div-level-one">
                <Navigation />
                <div></div>
                <div className="spacer _40"></div>
                {/* Navigation bar for 900 or lesser width device */}
                <MobileTopBar />
                <div className="cat-items-content">
                    <ul className="items-ul">
                        {
                            navcategories?.map((catitem, index) => {
                                return(
                                    <li key={catitem.id} className="item-lists" id={`section${catitem.id}`}>
                                        <div className="item-title" >
                                            <h3 className="item-title-h3">{catitem.name}</h3>
                                        </div>
                                        <div className="item-list-empty-div"></div>

                                        <ul className="items-list-nested-ul">
                                            <li className="items-list-nested-list">
                                                <a href="product/1">
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
                                                                        <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg" alt='Product'></img>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* <div className="item-review">
                                                            <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>

                                            <li className="items-list-nested-list">
                                                <a href="product/2">
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
                                                                <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg" alt='Product'></img>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        {/* <div className="item-review">
                                                        <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                                        </div> */}
                                                    </div>
                                                    </div>
                                                </a>
                                            </li>

                                            <li className="items-list-nested-list">
                                                <a href="product/3">
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
                                                                <img className="item-img" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg" alt='Product'></img>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        {/* <div className="item-review">
                                                        <a className="quick-review-btn" onClick={handleQuickViewClicked}>Quick view</a>
                                                        </div> */}
                                                    </div>
                                                    </div>
                                                </a>
                                            </li>
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