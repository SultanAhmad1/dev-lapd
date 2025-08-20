"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackOrderDetail from "@/components/track/TrackOrderDetail";

function TrackOrder({params}) 
{
    return (
        <>
            <Header />
            <TrackOrderDetail {...{orderId: params?.order}}/>
            <Footer />
        </>
    )
}

export default TrackOrder