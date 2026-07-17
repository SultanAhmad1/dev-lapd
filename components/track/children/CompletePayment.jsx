import React from 'react'

function CompletePayment({external_order_number,external_order_id, source}) {
  return (
    <div className="max-w-md mx-auto bg-white border border-red-200 rounded-2xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86l-8 14A1 1 0 003.14 19h17.72a1 1 0 00.85-1.14l-8-14a1 1 0 00-1.72 0z"
                />
            </svg>
        </div>

        <h2 className="text-2xl font-bold text-red-600">
            Payment Pending
        </h2>

        <p className="mt-2 text-gray-600">
            Your order has been successfully created, but payment has not yet been completed.
        </p>

        <div className="mt-5 bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
                Order ID: <span className="text-md font-semibold text-gray-900 break-all">{external_order_number}</span>
            </p>

        </div>

        {
            // source === 1 ?
                <a
                    href={`/payment/${external_order_id}`}
                    className="mt-6 inline-flex items-center justify-center w-full rounded-xl bg-red-600 px-6 py-3 text-white font-semibold transition-all duration-200 hover:bg-red-700 hover:shadow-lg"
                >
                    Complete Payment
                </a>

            // :
            //     <a
            //         href="/"
            //         className="mt-6 inline-flex items-center justify-center w-full rounded-xl bg-red-600 px-6 py-3 text-white font-semibold transition-all duration-200 hover:bg-red-700 hover:shadow-lg"
            //     >
            //         Complete Payment
            //     </a>
        }

        <p className="mt-4 text-sm text-gray-500">
            Your order will not be processed until the payment has been completed.
        </p>
    </div>
  )
}

export default CompletePayment