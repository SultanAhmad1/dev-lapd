import React, { useEffect, useState } from "react";

const StoreBusyModal = ({
  isOpen,
  onClose,
  endTime,
  onExpired, // callback
}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endTime) return;

    const target = new Date(endTime);
    let requestSent = false;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(null);

        if (!requestSent) {
          requestSent = true;

          // Call backend
          onExpired?.();

          // Optional: close modal
          onClose?.();
        }

        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onClose, onExpired]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-100 p-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-4xl shadow-inner">
            ⛔
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mt-5">
          We are temporarily closed
        </h2>

        <p className="text-center text-gray-500 mt-2">
          We will be back sooner.
        </p>

        {/* Countdown */}
        {timeLeft && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-3 text-center">
              <div className="px-4 py-3 bg-white shadow rounded-xl min-w-[70px]">
                <p className="text-xl font-bold text-gray-800">
                  {timeLeft.hours}
                </p>
                <p className="text-xs text-gray-500">Hours</p>
              </div>

              <div className="px-4 py-3 bg-white shadow rounded-xl min-w-[70px]">
                <p className="text-xl font-bold text-gray-800">
                  {timeLeft.minutes}
                </p>
                <p className="text-xs text-gray-500">Min</p>
              </div>

              <div className="px-4 py-3 bg-white shadow rounded-xl min-w-[70px]">
                <p className="text-xl font-bold text-gray-800">
                  {timeLeft.seconds}
                </p>
                <p className="text-xs text-gray-500">Sec</p>
              </div>
            </div>
          </div>
        )}

        {/* End Time */}
        {endTime && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Estimated time till we are back open.
            {/* <span className="font-medium text-gray-700">
              {new Date(endTime).toLocaleString()}
            </span> */}
          </p>
        )}

        {/* Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition shadow-md"
          >
            Got it
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default StoreBusyModal;