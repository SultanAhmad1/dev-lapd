"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThankYouDetail from "@/components/track/ThankYouDetail";

function ThankYou({params}) 
{
    // Check if order param is missing
    if (!params?.order) {
        window.location.href = '/'; // Client-side redirect
    }

    return (
        <>
            <Header />
            <ThankYouDetail {...{orderId: params?.order}}/>
            <Footer />
        </>
    )
}

export default ThankYou