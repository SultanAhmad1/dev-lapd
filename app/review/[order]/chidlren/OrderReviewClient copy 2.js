'use client'
import moment from 'moment/moment';
import React, { useState } from 'react'
import { useFormState } from 'react-dom';

const initialState = {
    success: false,
    error: "",
}

export default function OrderReviewClient({order, patchReview, orderId}) {

    const [state, formAction, pending] = useFormState(patchReview, initialState);
    const [rating, setRating] = useState(0)

    const tags = [
        "Great taste",
        "Fast delivery",
        "Good packaging",
        "Hot & fresh",
        "Friendly driver",
    ];

    return (
        <div className="bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-3 mt-3 mb-3">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        How was your order?
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                        {moment(order?.placed).format("D MMMM YYYY")} • &pound;{parseFloat(order?.order_total).toFixed(2)}
                    </p>
                </div>

                <form action={formAction}>
                    <input type='hidden' name="orderId" defaultValue={orderId}/>
                    <div className="flex flex-col items-center">

                        {/* Stars */}
                        <div className="flex flex-row-reverse justify-center gap-2 mb-10">
                            {[5,4,3,2,1].map(star => (
                            <React.Fragment key={star}>
                                <input
                                    type="radio"
                                    id={`star${star}`}
                                    name="rating"
                                    value={star}
                                    className="hidden"
                                    onChange={() => setRating(star)}
                                />
                                <label
                                    htmlFor={`star${star}`}
                                    className={`text-5xl cursor-pointer hover:text-black ${
                                        rating >= star ? 'text-black' : 'text-gray-300'
                                    }`}
                                >
                                ★
                                </label>
                            </React.Fragment>
                            ))}
                        </div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-5 mb-8 justify-center">
                    {tags.map((tag) => (
                        <label key={tag} className="cursor-pointer">
                            <input
                                type="checkbox"
                                name="selectedTags"
                                value={tag}
                                className="peer hidden"
                            />
                            <span className="px-4 py-2 rounded-full border text-sm
                                border-gray-300
                                peer-checked:bg-black
                                peer-checked:text-white"
                            >
                                {tag}
                            </span>
                        </label>
                    ))}
                    </div>

                    {/* Products */}
                    <div className="space-y-2">
                        {order?.order_lines?.map((line, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-2 rounded-xl flex justify-between items-center"
                            >
                                <h3 className="font-medium text-gray-700">
                                    {line.category_name}: {line.quantity} x {line.product_name}
                                </h3>

                                <div className="flex gap-4 text-2xl">
                                    {/* Dislike */}
                                    <label className="cursor-pointer relative">
                                        <input
                                            type="radio"
                                            name={`review_${line.product_id}`}
                                            value="0"
                                            className="peer hidden"
                                            onChange={(e) => {
                                                const icon = e.currentTarget.nextElementSibling
                                                icon.classList.remove("fa-regular")
                                                icon.classList.add("fa-solid")
                                            }}
                                        />
                                        <i className="fa-solid fa-regular fa-thumbs-down text-black/30 peer-checked:text-black"></i>
                                    </label>

                                    {/* Like */}
                                    <label className="cursor-pointer relative">
                                        <input
                                            type="radio"
                                            name={`review_${line.product_id}`}
                                            value="1"
                                            className="peer hidden"
                                            onChange={(e) => {
                                            const icon = e.currentTarget.nextElementSibling
                                            icon.classList.remove("fa-regular")
                                            icon.classList.add("fa-solid")
                                            }}
                                        />
                                        <i className="fa-solid fa-regular fa-thumbs-up text-black/30 peer-checked:text-black"></i>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment */}
                    <textarea
                        name="comment"
                        placeholder="Tell us more (optional)"
                        className="mt-5 w-full border border-gray-300 rounded-xl p-4 text-sm"
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="mt-6 w-full bg-black text-white py-4 rounded-xl"
                    >
                        Submit review
                    </button>
                </form>
            </div>
        </div>
    );
}