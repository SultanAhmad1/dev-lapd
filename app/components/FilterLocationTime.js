import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

function FilterLocationTime() 
{
    const {ordertypeselect, setOrdertypeselect} = useContext(HomeContext)
    const handleOrderType = (id) => {
        setOrdertypeselect(id)
    }

    return (
        <div className='c2c3c1afc4-delivery-type'>
            <div className="chcicjckotalou-delivery-type">
            
            <div>
                <h1 className='gfj0ggge-store-head'>Stockport</h1>

                <div className='daem-d-store'></div>
                <div className="al">
                <div>
                    <div className="chcicwd3cz-time">
                    <span className="">Time: <span>00:00 AM - 11:00 PM</span></span>
                    </div>
                </div>
                </div>

            </div>

            <div className='cmakp3p4-delivery-type'>

                <div className="coalclp5afbdaqc5ae-delivery-type">
                <div className={`akd0afbz-delivery-type ${ordertypeselect === 1 && "delivery-type-active"}`} onClick={() => handleOrderType(1)}>
                    <div className="algid0amc5-delvery-type">
                    <div className="chcicjckeeafgmc9gnehclbz g7">
                        <div className="algid0amc5-delvery-type">
                        <div className="chcicjck b1">Delivery</div>
                        {/* <div className="chobcjck ni">25 min</div> */}
                        </div>
                    </div>
                    </div>
                </div>

                <div className={`akd0afbz-delivery-type ${ordertypeselect === 2 && "delivery-type-active"}`} onClick={() => handleOrderType(2)}>
                    <div className="algid0amc5-delvery-type">
                    <div role="radio" aria-checked="false" tabIndex="0" aria-label="[object Object]" className="chcicjckeeafgmc9gnehclbz b1">
                        {/* <div className="algid0amc5-delvery-type p8"> */}
                        <div className="algid0amc5-delvery-type p8">
                        {/* <div className="chcicjck p9">Pickup</div> */}
                        <div className="chcicjck p9">Pickup</div>
                        {/* <div className="chobcjck p9"></div> */}
                        </div>
                    </div>
                    </div>
                </div>
                </div>

            </div>
            </div>
        </div>
    )
}

export default FilterLocationTime