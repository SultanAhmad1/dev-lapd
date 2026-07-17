'use client'
import React, { useState } from "react";

export default function Review() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const feedbackTags = [
    "Great taste",
    "Fast delivery",
    "Good packaging",
    "Friendly driver",
    "Would order again",
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          How was your order?
        </h2>

        {/* Stars */}
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl transition-transform duration-200 ${
                rating >= star
                  ? "text-black scale-110"
                  : "text-gray-300 hover:scale-110"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Feedback Tags (Show after rating) */}
        {rating > 0 && (
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {feedbackTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFeedback(tag)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  feedback === tag
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Optional Text Area */}
        {rating > 0 && (
          <textarea
            placeholder="Tell us more (optional)"
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-6"
            rows={4}
          />
        )}

        {/* Submit Button */}
        {rating > 0 && (
          <button
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Submit Review
          </button>
        )}
      </div>
    </div>
  );
}