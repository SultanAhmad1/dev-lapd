import { useState } from "react";
import { BRAND_SIMPLE_GUID, JOINUS_VIDEO } from "@/global/Axios";
import { setLocalStorage } from "@/global/Store";
import { useRouter } from "next/navigation";

function PromoModal({
  isOpen,
  onClose,
  title,
  description,
  setLoader,
  selectedStoreDetails,
}) {
  const router = useRouter();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  console.log("is video loaded: ", isVideoLoaded);
  
  if (!isOpen) return null;

  const handleClose = (isModalShow) => {
    if (isVideoLoaded === false) return; // 🚫 block close
    onClose(isModalShow);
    setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalShow`, false);
  };

  const handleAtFirstLoad = () => {
    if (isVideoLoaded === false) return; // 🚫 prevent click before video ready

    onClose(false);
    setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalClickedAtFirstLoad`, false);
    setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalShow`, false);
    setLoader(true)
    router.push("/join-us");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={isVideoLoaded ? handleClose : undefined}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-[90%] max-w-md h-[460px] rounded-2xl overflow-hidden shadow-2xl">

        {/* Click Wrapper */}
        {
          // selectedStoreDetails === null ?

          <button
            type="button"
            onClick={handleAtFirstLoad}
            disabled={!isVideoLoaded}
            className={`w-full h-full relative ${
              !isVideoLoaded ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {/* Video */}
            <video
              src={JOINUS_VIDEO}
              autoPlay
              muted
              onEnded={() => setIsVideoLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover scale-95"
            />
            
          </button>

          // :

          // <button
          //   type="button"
          //   disabled={!isVideoLoaded}
          //   className={`w-full h-full relative ${
          //     !isVideoLoaded ? "cursor-not-allowed" : "cursor-pointer"
          //   }`}
          // >
          //   {/* Video */}
          //   <video
          //     src={JOINUS_VIDEO}
          //     autoPlay
          //     muted
          //     onEnded={() => setIsVideoLoaded(true)}
          //     className="absolute inset-0 w-full h-full object-cover scale-95"
          //   />
            
          // </button>

        }
          {/* Gradient */}
        {/* ❌ Close Button (disabled until loaded) */}
        {
          isVideoLoaded && (
            <button
              onClick={handleClose}
              disabled={!isVideoLoaded}
              className={`absolute top-5 right-5 z-30 w-10 h-10 fw-bold rounded-full flex items-center justify-center
                ${isVideoLoaded ? "bg-black/60 hover:bg-black text-white" : "bg-gray-500/40 text-gray-300 cursor-not-allowed"}
              `}
            >
              ✕
            </button>
          )
        }

      </div>
    </div>
  );
}

export default PromoModal;