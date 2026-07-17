'use client'

import { useWebsite } from "@/app/providers/context/WebsiteContext"
import HomeContext from "@/contexts/HomeContext"
import { JOINUS_COMPONENT_VIDEO } from "@/global/Axios"
import { useRouter } from "next/navigation"
import { BRAND_GUID } from "@/global/Axios"
import { useContext, useEffect, useState } from "react"
import { hexToRgba } from "@/global/Store"
import { submitJoinUs } from "@/app/join-us/action"

export default function JoinComponent() 
{
  const { layoutWebsiteModification } = useWebsite()

  const router = useRouter()

  const {loader, setLoader, setJoinModal, selectedStoreDetails, setAtFirstLoad} = useContext(HomeContext)

  const [status, setStatus] = useState({type: "", message: "", isSubmitting: false,})
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isJoinButtonShow, setIsJoinButtonShow] = useState(false)

  const [isAtFirstLoad, setIsAtFirstLoad] = useState(50)
  useEffect(() => {
    if(loader)
    {
      setLoader(false)
      setJoinModal(false)
    }

    // if(selectedStoreDetails === null)
    // {
    //     setAtFirstLoad(true)
    //     setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalClickedAtFirstLoad`, false)
    //     setLocalStorage(`${BRAND_SIMPLE_GUID}isJoinModalShow`, false)
    //     router.push("/")
    // }
  }, [loader, setLoader, setJoinModal, selectedStoreDetails])

  const textColor = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor || 'white'
  const backgroundColor = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || 'black'
  const activeButtonBackgroundColor = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || '#000'

  console.log("background color:", backgroundColor);
  
  const handleJoinSubmit = async (e) => {
    e.preventDefault();

    if(selectedStoreDetails === null)
    {
      setAtFirstLoad(true)
      setIsAtFirstLoad(10)
      // setShowJoinModal(false)
      return
    }

    setStatus({
      type: "",
      message: "",
      isSubmitting: true
    })

    const result = await submitJoinUs(e.target);

    console.log("result: ", result);
    
    if (!result?.success) 
    {
      console.log("is result message is ready : ",result?.message);
      setStatus({
        type: "error",
        message: result?.message,
        isSubmitting: false,
      })

      // optional: show field error
      if (result?.field === "phone") {
        alert(result?.message);
      }

      return;
    }

    // e.target.reset();
    setStatus({
      type: "success",
      message: result?.message,
      isSubmitting: false,
    })

    router.push('/')
    console.log("Success record:", result?.data);
  };


  useEffect(() => {
    // optional cleanup logic if needed
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }, [])

  

  const handleShowJoinModalWhenVideoEnd = () => {
    setShowJoinModal(true)
    setIsJoinButtonShow(true)
  }

  return (
    <>
      <div
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundColor: activeButtonBackgroundColor,
        }}
      >

        {/* 🎥 Video */}
        <video
          src={JOINUS_COMPONENT_VIDEO}
          autoPlay
          muted
          playsInline
          onEnded={() => handleShowJoinModalWhenVideoEnd()}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* 🌑 Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* 🎯 Center CTA */}
        {
          // isJoinButtonShow &&
          // <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center">
          //   <button
          //     type="button"
          //     onClick={() => setShowJoinModal(true)}
          //     className="
          //       px-10 py-4
          //       rounded-full

          //       bg-white/90
          //       text-black

          //       font-bold uppercase
          //       tracking-wide

          //       shadow-lg
          //       hover:shadow-2xl

          //       hover:scale-105
          //       active:scale-95

          //       transition-all duration-300
          //       backdrop-blur-md
          //     "
          //   >
          //     Join Us
          //   </button>
          // </div>
        }

      </div>

      {
        showJoinModal &&
        (
          <div className={`fixed inset-0 z-${isAtFirstLoad} flex items-center justify-center`} style={{'--textColor': textColor, '--backgroundColor': backgroundColor}}>

            {/* 🌑 Background */}
            <div
              className="absolute inset-0 backdrop-blur-md pointer-events-none"
              style={{ backgroundColor: `${backgroundColor}B3` }}
            />

            {/* 🎥 Glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[--textColor]-500/10 via-[--backgroundColor] to-[--textColor]-500/10 animate-pulse" />

            {/* 🧊 Modal */}
            <div
              className="
                w-[92%] max-w-lg
                p-6 md:p-8
                backdrop-blur-xl
                shadow-2xl
                transition-transform duration-300
                text-[--backgroundColor]
              "
              style={{ backgroundColor: `${textColor}B3` }}
            >

              {/* ❌ Close */}
              {/* <div className="text-end">
                <button
                  type="button"
                  className="mb-5 text-[--backgroundColor]/70 hover:text-[--backgroundColor] text-xl font-bold "
                  onClick={() => setShowJoinModal(false)}
                >
                  ✕
                </button>
              </div> */}

              {/* Header */}
              <p className="text-sm tracking-wide text-[--backgroundColor]/80">
                Enter your details to register your interest and we will contact you.
              </p>

              {/* Alerts */}
              {status?.type === "success" && (
                <p className="bg-green-500/20 text-green-200 p-3 rounded-lg mb-3">
                  {status?.message}
                </p>
              )}

              {status?.type === "error" && (
                <p className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-3">
                  {status?.message}
                </p>
              )}

              <form className="space-y-6" onSubmit={handleJoinSubmit}>

                <input type="hidden" name="brand" defaultValue={BRAND_GUID} />
                <input type="hidden" name="store" defaultValue={selectedStoreDetails?.display_id} />

                {/* Name */}
                <input
                  name="fullName"
                  placeholder="Your Name"
                  className="
                    w-full px-2 py-3
                    bg-transparent
                    border-b-2 border-white/30
                    focus:border-yellow-400
                    outline-none
                    placeholder:font-semibold placeholder:text-[--backgroundColor]
                  "
                  required
                />

                {/* Phone */}
                <input
                  name="phone"
                  placeholder="Phone Number"
                  className="
                    w-full px-2 py-3
                    bg-transparent
                    border-b-2 border-white/30
                    focus:border-yellow-400
                    outline-none
                    placeholder:font-semibold placeholder:text-[--backgroundColor]
                  "
                  required
                />

                {/* Email */}
                <input
                  name="email"
                  placeholder="Email Address"
                  className="
                    w-full px-2 py-3
                    bg-transparent
                    border-b-2 border-[--backgroundColor]/30
                    focus:border-[--backgroundColor]-400
                    outline-none
                    placeholder:font-semibold placeholder:text-[--backgroundColor]
                  "
                  required
                />

                {/* Checkbox */}
                <label className="flex items-start gap-3 text-sm text-[--backgroundColor]/80">
                  <input 
                    type="checkbox"
                    required
                    defaultChecked
                    name="marketingConsent"
                    className="mt-1 accent-[--backgroundColor]"
                  />
                  <span>
                    By signing up, you agree to receive marketing emails and text messages from 
                    <span>
                        {" "}{layoutWebsiteModification?.brand?.name}
                    </span> about latest offers, new product launches, and giveaways. 
                    You can unsubscribe at any time using the unsubscribe link in our emails.
                  </span>
                </label>

                {/* 🔥 New Button Design */}

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={status.isSubmitting}
                    className="
                      relative
                      px-10 py-4
                      rounded-full

                      text-lg md:text-xl
                      font-bold
                      uppercase tracking-wide

                      flex items-center justify-center gap-2

                      hover:scale-105
                      active:scale-95
                      transition-all duration-300

                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    style={{
                      color: '${textColor}',
                      border: `2px solid ${backgroundColor}`,
                      boxShadow: `0 10px 25px ${hexToRgba(backgroundColor, 0.35)}`
                    }}
                  >
                    {status.isSubmitting ? (
                      <>
                        <span className="animate-pulse">Joining</span>
                        <span className="animate-bounce">...</span>
                      </>
                    ) : (
                      <>Join Us</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )
      }
      
    </>
  )
}