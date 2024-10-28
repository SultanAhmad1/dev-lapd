"use client";
import HomeContext from '@/app/contexts/HomeContext'
import React, { useContext } from 'react'

function SubProduct() {

    
    const {navigationcategories} = useContext(HomeContext)
    return (
        <div className="cat-items-content">
            <ul className="items-ul">
                {
                    navigationcategories?.map((category, index) =>
                    {
                        return(
                            <li className="item-lists" key={index} id={`section${category?.id}`}>
                                <div className="item-title" >
                                    <h3 className="item-title-h3">{category?.title}</h3>
                                </div>
                                <div className="item-list-empty-div"></div>

                                <ul className="items-list-nested-ul">
                                    {
                                        category?.items?.map((item, itemIndex) =>
                                        {
                                            return(
                                                <li key={itemIndex} className="items-list-nested-list">
                                                    <a href="product/1">
                                                        <div className="items-nested-div">
                                                            <div className="items-nested-div-one">
                                                                <div className="item-detail-style">
                                                                    <div className="item-detail">
                                                                        <div className="item-title">
                                                                            <span>{item?.title}</span>
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

                                                                    <div className="item-img-style">
                                                                        <div className="lazyload-wrapper">
                                                                            <img  loading='lazy' className="item-img" src={item?.image_url} alt='Product'></img>
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
    )
}

export default SubProduct