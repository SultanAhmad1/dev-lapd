import React from "react";
import Image from "next/image";

export default function OrderStatusImage({imageSrc}) 
{
    return(
        <div className='stagonetrackorder-desk trackImageWrapper'>
            <Image alt="Order Received" width={100} height={100} src={imageSrc} />
            <div className='stagonelineheight trackImageLine'></div>
        </div>
    )
}
