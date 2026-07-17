"use server";

import { BRAND_GUID } from "@/global/Axios";

export default async function postTrackOrder(prevState, formData) {

    const orderHash = formData.get("orderHash");

    console.log("order hash:", orderHash);

    if (!orderHash) {
        return {
            ...prevState,
            success: false,
            orderHashError: "Order ID is required",
        };
    }
    
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/track-order-by-hash-order`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderHash: orderHash,
                brandGUID: BRAND_GUID
            }),
            cache: "no-store",
        }
    );

    const data = await res.json();

    console.log("track order data:", data);
    

    return {
        ...prevState,
        success: true,
        orderHashError: "",
        message: null,
        data: data?.data
    };
}