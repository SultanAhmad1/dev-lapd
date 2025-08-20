'use client';

import { useEffect, useState } from 'react';

const orderSteps = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function DeliveryProgress({ currentStep = 1 }) {
  const [showTicks, setShowTicks] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTicks((prev) => [...prev, currentStep]);
    }, 1500); // Delay before showing tick (simulate completion)
    return () => clearTimeout(timer);
  }, [currentStep]);


  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="relative flex items-center justify-between">
        {/* Back Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-200 transform -translate-y-1/2 z-0" />

        {/* Fill Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-cyan-500 z-10 transition-all duration-700 ease-in-out"
          style={{
            width: `${(currentStep / (orderSteps.length - 1)) * 100}%`,
            transform: 'translateY(-50%)',
          }}
        />

        {/* Rider with smoke */}
        <div
          className="absolute -top-6 transition-all duration-700 ease-in-out z-30"
          style={{
            left: `calc(${(currentStep / (orderSteps.length - 1)) * 100}% - 24px)`, // Rider centers on step
          }}
        >
            
        {/* Rider with smoke */}
<div
  className="absolute -top-6 transition-all duration-700 ease-in-out z-40"
  style={{
    left: `calc(${(currentStep / (orderSteps.length - 1)) * 100}% - 24px)`,
  }}
>
  <div className="relative w-12 h-12">
    {/* Rider Image */}
    <img
      src="/rider.png"
      alt="Rider"
      className="w-12 h-12 object-contain transition-transform duration-700 ease-in-out"
    />

    {/* Smoke trail behind the rider */}
    <div className="absolute -left-2 bottom-1 w-3 h-3 bg-gray-400 rounded-full opacity-70 animate-smoke z-10" />
    <div className="absolute -left-4 bottom-2 w-2 h-2 bg-gray-300 rounded-full opacity-60 animate-smoke2 z-10" />
  </div>
</div>




        </div>

        {/* Steps */}
        {orderSteps.map((label, idx) => (
          <div key={label} className="relative z-20 flex flex-col items-center text-center w-1/4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 shadow-md 
                ${
                  idx < currentStep
                    ? 'bg-gradient-to-br from-cyan-500 to-cyan-700 border border-cyan-800 text-white'
                    : idx === currentStep
                    ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 border border-cyan-700 text-white animate-pulse shadow-xl scale-105'
                    : 'bg-gradient-to-b from-white to-gray-100 border border-cyan-200 text-cyan-300 shadow-sm'
                }`}
            >
              {/* Completed: tick */}
              {showTicks.includes(idx) && idx < currentStep && (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {/* Current step: loader */}
              {!showTicks.includes(idx) && idx === currentStep && (
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}

              {/* Future steps: step number */}
              {idx > currentStep && <span className="text-sm font-bold">{idx + 1}</span>}
            </div>

            <span
              className={`mt-2 text-xs text-center ${
                idx <= currentStep ? 'text-cyan-700 font-bold' : 'text-cyan-300'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
