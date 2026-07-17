'use client'
import { useWebsite } from '@/app/providers/context/WebsiteContext';
import { usePatchMutationHook } from '@/components/reactquery/useQueryHook';
import HomeContext from '@/contexts/HomeContext';
import { BRAND_SIMPLE_GUID } from '@/global/Axios';
import { setLocalStorage } from '@/global/Store';
import moment from 'moment/moment';
import React, { useContext, useEffect, useState } from 'react'

export default function OrderReviewClient({order, orderId}) {

    const {layoutWebsiteModification} = useWebsite()
    const {
        setPaymentLoader,
        setLoader,
        setJoinModal,
    } = useContext(HomeContext)

    const [rating, setRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);
    const [comment, setComment] = useState("");

    
    const tags = [
        "Great taste",
        "Fast delivery",
        "Good packaging",
        "Hot & fresh",
        "Friendly service",
    ];

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
        prev.includes(tag)
            ? prev.filter((t) => t !== tag)
            : [...prev, tag]
        );
    };

    const [reviewData, setReviewData] = useState(null)
    
    useEffect(() => {
        if(order)
        {
            if(parseInt(order?.order_review?.food_quality_rating_data) === parseInt(1))
            {
                setSelectedTags((prev) =>
                    [...prev, "Great taste"]
                );
            }
            if(parseInt(order?.order_review?.package_rating_data) === parseInt(1))
            {
                setSelectedTags((prev) =>
                    [...prev, "Good packaging"]
                );
            }
            if(parseInt(order?.order_review?.delivery_rating_data) === parseInt(1))
            {
                setSelectedTags((prev) =>
                    [...prev, "Fast delivery"]
                );
            }
            if(parseInt(order?.order_review?.website_rating_data) === parseInt(1))
            {
                setSelectedTags((prev) =>
                    [...prev, "Friendly service"]
                );
            }
            if(parseInt(order?.order_review?.user_clicked_on_individual_order_review) === parseInt(1))
            {
                setSelectedTags((prev) =>
                    [...prev, "Hot & fresh"]
                );
            }

            setRating(order?.order_review?.rating)
            setComment(order?.order_review?.user_review)

            setReviewData(order)

            setPaymentLoader(false)
            setLoader(false)
            setJoinModal(false)
            setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalClickedAtFirstLoad`, false)
            setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalShow`, false)
        }
    }, [order])

    const handleLike = (productId, status = 1) => {
        setReviewData((prevData) => ({
            ...prevData,
            order_lines: prevData.order_lines?.map((orderLines) => {
                
                if(parseInt(productId) === parseInt(orderLines?.product_id))
                {
                    return {
                        ...orderLines,
                        individual_review: status
                    }
                }
                return orderLines
            })
        }))
    }

    const {
        mutate: patchMutation, 
        isPending: reviewLoading, 
        isSuccess: reviewSuccess, 
        reset: reviewReset,
        isError: reviewError,
    } 
    = 
    usePatchMutationHook(
        `review-update`, 
        `/reviews/${orderId}`, 
        (data) => {
            console.log("data: ", data?.data?.data);
            
            const { orderData } = data?.data?.data

            // if(parseInt(orderData?.order_review?.food_quality_rating_data) === parseInt(1))
            // {
            //     setSelectedTags((prev) =>
            //         [...prev, "Great taste"]
            //     );
            // }
            // if(parseInt(orderData?.order_review?.package_rating_data) === parseInt(1))
            // {
            //     setSelectedTags((prev) =>
            //         [...prev, "Good packaging"]
            //     );
            // }
            // if(parseInt(orderData?.order_review?.delivery_rating_data) === parseInt(1))
            // {
            //     setSelectedTags((prev) =>
            //         [...prev, "Fast delivery"]
            //     );
            // }
            // if(parseInt(orderData?.order_review?.website_rating_data) === parseInt(1))
            // {
            //     setSelectedTags((prev) =>
            //         [...prev, "Friendly service"]
            //     );
            // }
            // if(parseInt(orderData?.order_review?.user_clicked_on_individual_order_review) === parseInt(1))
            // {
            //     setSelectedTags((prev) =>
            //         [...prev, "Hot & fresh"]
            //     );
            // }

            // setRating(orderData?.order_review?.rating)
            // setComment(orderData?.order_review?.user_review)
            // setReviewData(orderData)
        },
        (error) => {
            console.log("error : ", error);
        }
    )

    const handleSubmitReview = (e) => {
        e.preventDefault()

        /**
         * food_quality_rating_data = great taste
         * package_rating_data = good packaging
         * deilvery_rating_data = fast delivery
         * website_rating_data = hot & fresh
         * individual_clicked_on_individual_order_review
        */

        const productReviews = reviewData?.order_lines?.map((review) => {
            return {product_id: review?.product_id, review: review?.individual_review}
        })

        const updateData = {
            orderId,
            rating,
            user_review: comment,
            productReviews,
            selectedTags,
            food_quality_rating_data: selectedTags.find((tag) => tag.includes("Great taste")) ? 1 : 0,
            package_rating_data: selectedTags.find((tag) => tag.includes("Good packaging")) ? 1 : 0,
            delivery_rating_data: selectedTags.find((tag) => tag.includes("Fast delivery")) ? 1 : 0,
            website_rating_data: selectedTags.find((tag) => tag.includes("Friendly service")) ? 1 : 0,
            user_clicked_on_individual_order_review: selectedTags.find((tag) => tag.includes("Hot & fresh")) ? 1 : 0,
        }

        console.log("update review:", updateData);

        patchMutation(updateData)
    }

    useEffect(() => {
        if(reviewSuccess)
        {
            setTimeout(() => {
                reviewReset()
            }, 3000);    
        }
    }, [reviewSuccess])
    
    return (

        <>
            {
                reviewSuccess &&
                <>
                    {/* // Overlay */}
                    <div
                        id="successModal"
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-10"
                    >
                        {/* Modal */}
                        <div className="bg-green-500 rounded-2xl shadow-lg w-96 max-w-full p-6 text-center text-white">
                            
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-md font-semibold mb-2">Success!</h2>
                            
                            {/* Message */}
                            <p className="mb-3 text-white font-medium">Your review submitted successfully.</p>
                        </div>
                    </div>
                </>
            }

            {
                reviewError &&
                <>
                    {/* // Overlay */}
                    <div
                        id="errorModal"
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-10"
                    >
                        {/* Modal */}
                        <div className="bg-red-500 rounded-2xl shadow-lg w-96 max-w-full p-6 text-center text-white">
                            
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12" // "X" icon for error
                                    />
                                </svg>
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-md font-semibold mb-2">Error!</h2>
                            
                            {/* Message */}
                            <p className="mb-3 text-white font-medium">Something went wrong. Please try again.</p>
                        </div>
                    </div>
                </>
            }
            <div className="bg-gray-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-3 mt-3 mb-3">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            How was your order?
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">
                            {moment(order?.placed).format("D MMMM YYYY")} • &pound;{parseFloat(reviewData?.order_total).toFixed(2)}
                        </p>
                    </div>

                    {/* Star Rating */}
                    {
                        <form onSubmit={handleSubmitReview}>
                            <div className="flex justify-center gap-4 mb-10">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isSelected = rating >= star;

                                    return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-4xl px-3 py-2 rounded-lg transition-all duration-200 ${
                                            isSelected
                                            ? "scale-110"
                                            : "text-gray-300 hover:scale-110"
                                        }`}
                                        style={
                                            isSelected
                                            ? {
                                                color:
                                                layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                    ?.buttonBackgroundColor || "black",
                                            }
                                            : {}
                                        }
                                    >
                                        ★
                                    </button>
                                    );
                                })}
                                </div>
                            {
                                rating > 0 &&
                                <>
                                    {/* Feedback Tags */}
                                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                                        {tags.map((tag) => {
                                            const isSelected = selectedTags.includes(tag);
                                            return (
                                                <button
                                                    key={tag}
                                                    type='button'
                                                    onClick={() => toggleTag(tag)}
                                                    className={`px-4 py-2 rounded-full text-sm border transition-all
                                                    ${
                                                        isSelected
                                                        ? "border-transparent"
                                                        : "border-gray-300 text-gray-700 hover:border-black"
                                                    }
                                                    `}
                                                    style={
                                                        isSelected
                                                            ? {
                                                                backgroundColor: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || "black",
                                                                color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || "white",
                                                            }
                                                            : {}
                                                    }
                                                >
                                                    {tag}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-2">
                                        {
                                            reviewData?.order_lines?.map((orderLines, index) => {
                                                return(
                                                    <div key={index} className="bg-gray-50 p-2 rounded-xl flex justify-between items-center">
                                                        <h3 className="font-medium text-gray-700">
                                                            {orderLines?.category_name}: {orderLines?.quantity} x {orderLines?.product_name}
                                                        </h3>

                                                        <ul className="flex gap-6 text-2xl">
                                                            <li
                                                                className="cursor-pointer text-gray-400 hover:text-gray-900 transition"
                                                                onClick={() => handleLike(orderLines?.product_id, 0)}
                                                                style={
                                                                    orderLines?.individual_review === 0
                                                                    ? {
                                                                        color:
                                                                            layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                                            ?.buttonBackgroundColor || "black",
                                                                        }
                                                                    : {}
                                                                }
                                                                >
                                                                <i
                                                                    className={`${
                                                                    orderLines?.individual_review === 0 ? "fa-solid" : "fa-regular"
                                                                    } fa-thumbs-down`}
                                                                ></i>
                                                            </li>
                                                            <li
                                                                className="cursor-pointer text-gray-400 hover:text-gray-900 transition"
                                                                onClick={() => handleLike(orderLines?.product_id, 1)}
                                                                style={
                                                                    orderLines?.individual_review === 1
                                                                    ? {
                                                                        color:
                                                                            layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                                                                            ?.buttonBackgroundColor || "black",
                                                                        }
                                                                    : {}
                                                                }
                                                                >
                                                                <i
                                                                    className={`${
                                                                    orderLines?.individual_review === 1 ? "fa-solid" : "fa-regular"
                                                                    } fa-thumbs-up`}
                                                                ></i>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    {/* Comment Box */}
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us more (optional)"
                                        className="mt-5 w-full border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-6"
                                        rows={4}
                                    />

                                    {/* Submit Button */}
                                    <button
                                        type='button'
                                        onClick={handleSubmitReview}
                                        disabled={reviewLoading}
                                        className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
                                        style={{
                                            backgroundColor: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || 'black',
                                            color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || 'white',
                                        }}
                                    >
                                        {reviewLoading ? "Submiting...": "Submit review"}
                                    </button>
                                </>
                            }
                        </form>
                    }
                </div>
            </div>
        </>
    );
}