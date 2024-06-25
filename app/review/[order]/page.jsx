'use client'

import Banner from "@/components/Banner";
import HomeContext from "@/contexts/HomeContext";
import { useContext, useEffect, useState } from "react";

{/* <li><i className="fa-regular fa-face-frown"></i></li>
<li><i className="fa-regular fa-face-meh"></i></li>
<li><i className="fa-regular fa-face-smile"></i></li>
<li><i className="fa-regular fa-face-laugh-beam"></i></li>
<li><i className="fa-regular fa-face-grin-hearts"></i></li> */}


const reviewEmojis = [
    {
        emojiId: 1,
        text: "Not Liked",
        emojiClass: "fa-regular fa-face-frown",
    },
    {
        emojiId: 2,
        text: "Neutral",
        emojiClass: "fa-regular fa-face-meh",
    },
    {
        emojiId: 3,
        text: "Liked",
        emojiClass: "fa-regular fa-face-smile",
    },
    {
        emojiId: 4,
        text: "Just satisfied",
        emojiClass: "fa-regular fa-face-laugh-beam",
    }
    ,
    {
        emojiId: 5,
        text: "Loving it",
        emojiClass: "fa-regular fa-face-grin-hearts",
    }
]
function Review() 
{
    const { 
        setIsReviewPage,
        setHeaderCartBtnDisplay, 
        websiteModificationData,
    } = useContext(HomeContext)
    // Divide into three steps.
    // Quality
    const [isError, setIsError] = useState(false);
    
    const [reviewSections, setReviewSections] = useState(1);
    const [sectionOneObjData, setSectionOneObjData] = useState({
        packaging: 0,
        foodQuality: 0,
        deliveryTime: 0,
        websiteExperience: 0,
    });
    
    
    useEffect(() => {
        setHeaderCartBtnDisplay(false)
        setIsReviewPage(true)
    }, []);
    

    const handleReviews = () =>
    {
        if(reviewSections === 1)
        {
            if((sectionOneObjData.packaging > 0 && sectionOneObjData.foodQuality > 0) && (sectionOneObjData.deliveryTime > 0 && sectionOneObjData.websiteExperience > 0))
            {
                setIsError(false)
                setReviewSections((prevData) => prevData + 1) 
                return
            }
            else
            {
                setIsError(true)
            }
        }
        else if(reviewSections === 2)
        {
            setReviewSections((prevData) => prevData + 1) 
            return
        }
        else if(reviewSections === 3)
        {
            setIsError(false)
        }

        // data will be send to database.
    }

    const handleUserReviews = (attributeName, emojiId) =>
    {
        setSectionOneObjData((prevData) => ({...prevData, [attributeName]: emojiId}))
    }

    return(
        <div>
            <Banner websiteModificationData={websiteModificationData} />
            <div className="review-system">
                {/* Order review system */}
            
                <div className="review-order">
                    
                    <h2 className="review-header">Review your order</h2>
                    <div className="order-date-price">
                        <h3>13 April 2024 14:40 PM</h3>
                        <h3>&pound; 45.06</h3>
                    </div>

                    {/* Error Message: */}
                    {
                        isError &&
                        <div className="alertMessage">
                            <p>All the fields are required.</p>
                        </div>
                    }
                    {/* Review Emojis */}
                    <div className="div-hr"></div>
                    {
                        reviewSections === 1 ?

                            <div className="review-list-data">
                                <div className="review-data">
                                    <h3 className="review-data-heading">Food Quality</h3>
                                    <ul className="review-ul">
                                       
                                        {
                                            reviewEmojis?.map((emojis) =>{
                                                const { emojiId,text, emojiClass} = emojis
                                                return(
                                                    <li key={emojis.emojiId} onClick={() => handleUserReviews("foodQuality", emojiId)}>
                                                        <span className="tooltip">{text}</span>
                                                        <i className={`${sectionOneObjData.foodQuality === emojiId ? "fa-solid" : ""} ${emojiClass}`}></i>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>

                                <div className="review-data">
                                    <h3 className="review-data-heading">Packaging</h3>
                                    <ul className="review-ul">
                                        {
                                            reviewEmojis?.map((emojis) =>{
                                                const { emojiId,text, emojiClass} = emojis
                                                return(
                                                    <li key={emojis.emojiId} onClick={() => handleUserReviews("packaging", emojiId)}>
                                                        <span className="tooltip">{text}</span>
                                                        <i className={`${sectionOneObjData.packaging === emojiId ? "fa-solid" : ""} ${emojiClass}`}></i>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>

                                <div className="review-data">
                                    <h3 className="review-data-heading">Delivery Time</h3>
                                    <ul className="review-ul">
                                        {
                                            reviewEmojis?.map((emojis) =>{
                                                const { emojiId,text, emojiClass} = emojis
                                                return(
                                                    <li key={emojis.emojiId} onClick={() => handleUserReviews("deliveryTime", emojiId)}>
                                                        <span className="tooltip">{text}</span>
                                                        <i className={`${sectionOneObjData.deliveryTime === emojiId ? "fa-solid" : ""} ${emojiClass}`}></i>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>

                                <div className="review-data">
                                    <h3 className="review-data-heading">Website Experience</h3>
                                    <ul className="review-ul">
                                        {
                                            reviewEmojis?.map((emojis) =>{
                                                const { emojiId,text, emojiClass} = emojis
                                                return(
                                                    <li key={emojis.emojiId} onClick={() => handleUserReviews("websiteExperience", emojiId)}>
                                                        <span className="tooltip">{text}</span>
                                                        <i className={`${sectionOneObjData.websiteExperience === emojiId ? "fa-solid" : ""} ${emojiClass}`}></i>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        :
                            reviewSections === 2 ?
                            <div className="review-list-data">
                                <div className="review-product-data">
                                    <h3 className="review-product-data-heading">Category: 2 x Product Name</h3>
                                    <ul className="review-product-ul">
                                        <li><i className="fa-regular fa-thumbs-down"></i></li>
                                        <li><i className="fa-regular fa-thumbs-up"></i></li>
                                    </ul>
                                </div>
                            </div>
                        :
                            reviewSections === 3 &&
                            <div className="review-list-data">
                                <div className="review-message">
                                    <h3 className="review-data-heading">Leave a review:</h3>
                                    
                                    <textarea className="review-textarea" placeholder="Help us to improve our service, tell us about your experience."/>
                                </div>
                            </div>
                    }

                    {/* Product individual review */}
                    {/* // <div className="div-hr"></div>
                    // <div className="review-list-data">
                    //     <div className="review-product-data">
                    //         <h3 className="review-product-data-heading">Category: 2 x Product Name</h3>
                    //         <ul className="review-product-ul">
                    //             <li><i className="fa-regular fa-thumbs-down"></i></li>
                    //             <li><i className="fa-regular fa-thumbs-up"></i></li>
                    //         </ul>
                    //     </div>
                    // </div> */}

                    {/* Leave a review */}
                    {/* <div className="div-hr"></div>
                    <div className="review-list-data">
                        <div className="review-message">
                            <h3 className="review-data-heading">Leave a review:</h3>
                            
                            <textarea className="review-textarea" placeholder="Help us to improve our service, tell us about your experience."/>
                        </div>
                    </div> */}
                </div>


             
                <div className="div-hr"></div>
                <div className="review-div">
                    {
                        reviewSections < 3 ?
                            <button className="review-btn" onClick={handleReviews}>Next</button>
                        :
                            <button className="review-submit-btn" onClick={handleReviews}>Submit</button>
                    }
                </div>
                
                
                <div className="review-mobile-btn">
                    {
                        reviewSections < 3 ?
                            <div className="akgzcheckout" onClick={handleReviews}>
                                <div className="atbaagcheckout">
                                    <div className="">
                                        <button className="fwbrbocheckout-place-order" > Next </button>
                                    </div>
                                </div>
                            </div>
                        :
                            <div className="arcgatchl4h2view-cart" onClick={handleReviews}>
                                <button className="bllview-cart-btn"> Submit </button>
                            </div>
                    }

                </div>

            </div>

        </div>
    );
}

export default Review;
