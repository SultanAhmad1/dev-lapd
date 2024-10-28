"use client";
import { BRANDSIMPLEGUID, IMAGE_URL_Without_Storage } from "@/global/Axios";
import moment from "moment";
import React from "react";
import Item from "./children/Item";

export default function OrderTab({order}) 
{
    const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

    let statusColor = "order-awaiting-status"
    let urlStart = 'track-order'

    switch (order?.status) {
        case 'created':
            urlStart = 'track-order'
            statusColor = "order-create-status"
            break;
        case 'canceled':
            urlStart = 'track-order'
            statusColor = "order-canceled-status"
            break;

        case 'awaiting':
            urlStart = 'payment'
            statusColor = "order-awaiting-status"
            break;

        default:
            urlStart = 'track-order'
            statusColor = "order-awaiting-status"
            break;
    }

    return(
        <div className="order-history-container">
            <a className="order-item-anchor" target="_blank" href={`/${urlStart}/${order.external_order_id}`}>
                <figure className="order-item-figure">
                    <div className="order-item-div">
                        <div className="lazyload-wrapper " style={{height: "140px"}}>
                            <picture>
                                <source type="image/webp" srcSet={`${order?.order_lines?.[0]?.product_image ? IMAGE_URL_Without_Storage+""+ order?.order_lines?.[0]?.product_image?.url: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3NrdS8wN2E1N2IzYzZjZjRhMTY0MzExMmE4ZmExM2I4MjUzMQ=="}`} />
                                <img  loading='lazy' alt={order?.order_lines?.[0]?.product_name} role="presentation" src={`${order?.order_lines?.[0]?.product_image ? IMAGE_URL_Without_Storage+""+ order?.order_lines?.[0]?.product_image?.url: "https://duyt4h9nfnj50.cloudfront.net/sku/07a57b3c6cf4a1643112a8fa13b82531"}`} aria-hidden="true" className="order-item-img" />
                            </picture>
                        </div>
                    </div>
                </figure>
            </a>
            <a href={`/${urlStart}/${order.external_order_id}`} target="_blank" className="order-texts">
                <h3>{customer?.first_name} {customer?.last_name}</h3>
                <p className="order-information">{parseInt(order?.order_lines?.length)} items for &pound; {parseFloat(order?.order_total).toFixed(2)}
                    <span className="dot-separator">&nbsp;•&nbsp;</span>
                    <span className={statusColor}>{order?.status?.replace(/^\w/, (c) => c.toUpperCase())}</span> on {moment(order?.created_at).format("MMM D [at] h:mm A")}
                </p>
                
                <div className="vertical"></div>
                {
                    order?.order_lines?.map((item, index) => {
                        return(
                            <Item key={item.id.index} {...{item}} />
                        )
                    })
                }
            </a>
            {/* <div className="order-button">
                <button className="login-button" type="button">Get Help</button>
            </div> */}
        </div>
    )
}
