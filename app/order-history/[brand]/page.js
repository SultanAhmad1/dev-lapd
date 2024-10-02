"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import OrderHistory from "@/components/orderhistory/OrderHistory";
import { Fragment } from "react";

export default function page() 
{
    return(
        <Fragment>
            <Header />
            <OrderHistory />                
            <Footer />
        </Fragment>
    )
}
