'use client'
import { submitJoinUs } from "@/app/join-us/action"
import { useWebsite } from "@/app/providers/context/WebsiteContext"
import HomeContext from "@/contexts/HomeContext"
import { BRAND_GUID } from "@/global/Axios"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function JoinComponent()
{   
    const { layoutWebsiteModification } = useWebsite()
    const router = useRouter()

    const {loader, setLoader, setJoinModal, selectedStoreDetails, setAtFirstLoad} = useContext(HomeContext)

    const [status, setStatus] = useState({type: "", message: "", isSubmitting: false,})
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

    const handleJoinSubmit = async (e) => {
        e.preventDefault();

        setStatus({
            type: "",
            message: "",
            isSubmitting: true
        })

        const result = await submitJoinUs(e.target);

        console.log("result: ", result);
        
        if (!result?.success) {
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
        console.log("Success record:", result?.data);
    };

    return(
        <div className="flex items-center justify-center bg-gray-100 px-4">
            <div className="mt-3 mb-3 w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
                
                <h2 className="text-2xl font-bold text-center mb-6">
                    Join Us
                </h2>

                {
                    status?.type === "success" && 
                    <p className="bg-green-500 text-green-200 p-3">{status?.message}</p>
                }
                {
                    status?.type === "error" && 
                    <p className="bg-red-500 text-red-200 p-3">{status?.message}</p>
                }
                <form className="space-y-4" onSubmit={handleJoinSubmit}>
                
                    {/* Full Name */}
                    <input hidden type="text" name="brand" defaultValue={BRAND_GUID} id="brand" />
                    <input hidden type="text" name="store" defaultValue={selectedStoreDetails?.display_id} id="store" />
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            name="fullName"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            maxLength={11}
                            pattern="^0\d{10}$"
                            required
                            onInput={(e) => {
                            let value = e.target.value;

                            // 🔥 Replace +44 with 0
                            if (value.startsWith("+44")) {
                                value = "0" + value.slice(3);
                            }

                            // 🔥 Remove non-numeric characters
                            value = value.replace(/\D/g, "");

                            // 🔥 Ensure starts with 0
                            if (value.length > 0 && value[0] !== "0") {
                                value = "0" + value;
                            }

                            // 🔥 Limit to 11 digits
                            value = value.slice(0, 11);

                            // ✅ Directly update input value (no React state)
                            e.target.value = value;
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            name="email"
                            required
                        />
                    </div>

                    {/* is Agreed */}
                    <div
                        className="flex items-start gap-3 mt-4"
                        style={{
                            "--primary-color": backgroundColor,
                            "--text-color": textColor,
                        }}
                    >

                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            id="marketingConsent"
                            name="marketingConsent"
                            className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2"
                            style={{
                                accentColor: "var(--primary-color)", // ✅ checkbox color
                            }}
                            required
                        />

                        {/* Label */}
                        <label
                            htmlFor="marketingConsent"
                            className="text-sm leading-relaxed cursor-pointer"
                            style={{ color: "#555" }}
                        >
                            By signing up, you agree to receive marketing emails and text messages from 
                            <span style={{ color: "var(--primary-color)", fontWeight: "600" }}>
                                {" "}LAPD Food
                            </span> about latest offers, new product launches, and giveaways. 
                            You can unsubscribe at any time using the unsubscribe link in our emails.
                        </label>

                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            "--btn-bg": backgroundColor,
                            "--btn-text": textColor,
                        }}
                        disabled={status.isSubmitting}
                        className="w-full py-2 rounded-lg font-semibold transition-all duration-200 bg-[var(--btn-bg)] text-[var(--btn-text)] hover:scale-105"
                    >
                        {
                            status.isSubmitting ? "Processing..." : "Join Now"
                        }
                    </button>

                </form>
            </div>
        </div>
    )
}