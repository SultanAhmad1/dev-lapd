import React from "react";
import Modifiers from "./modifiers/Modifiers";

const Item = ({item}) =>
{
    return(
        <div className="order-qty">
            <div className="place-qty">
                {item?.quantity}
            </div>
            <div className="order-item">
                <h5>{item?.product_name}</h5>
                <div className="order-modifiers">
                    {
                        item?.order_line_modifier_groups?.map((modifier, index) => {
                            return(
                                <Modifiers key={modifier?.id.index} {...{modifier}}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Item
