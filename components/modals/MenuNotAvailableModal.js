"use client";
import HomeContext from "@/contexts/HomeContext";
import { BRAND_SIMPLE_GUID } from "@/global/Axios";
import React, { useContext } from "react";

export default function MenuNotAvailableModal({errorMessage}) 
{
    const { setAtFirstLoad, setComingSoon} = useContext(HomeContext)

    const storeDetail = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`))

    const handleClearAll = () => {

        const checkAuth = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`))
        setAtFirstLoad(true)
        setComingSoon(false)
        window.location.href = "/";
        window.location.reload(true);

        if(checkAuth === undefined || checkAuth === null)
        {
            localStorage.clear()
            return
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <form>
                    {errorMessage && (
                        <p className="text-center text-green-800 bg-yellow-200 mt-2 py-2 px-3 font-semibold rounded">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
                    >
                        Click to try with different postcode.
                    </button>
                </form>
            </div>
        </div>
    )
}
