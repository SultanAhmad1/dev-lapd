import React from "react";

export default function ShowExistsOrderDetailModal() 
{
    return(
     <div className="fixed inset-0 bg-black/90 z-40 flex justify-center px-2 overflow-y-auto pt-10 pb-10">
  <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative flex flex-col transition-all duration-300 max-h-screen">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        Order Already Placed
      </h1>
      {/* Close button (optional) */}
    </div>

    {/* Message */}
    <div className="text-center text-gray-600 text-sm font-medium">
      An order with this tracking number already exists.
    </div>

    {/* Order Number */}
    <div className="mt-4 text-center">
      <p className="text-gray-700">
        <span className="font-semibold">Order Number:</span>{' '}
        <span className="text-blue-600 font-bold">ABC</span>
      </p>
    </div>

    {/* Link to Details */}
    <div className="mt-6 flex justify-center">
      <a
        href={`/orders/abc`} // or use <Link> if using React Router
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
      >
        View Order Details
      </a>
    </div>

  </div>
</div>

    )
}
