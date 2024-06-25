import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'
import moment from 'moment'
import { setLocalStorage, setSessionStorage } from '../global/Store'
import { BRANDSIMPLEGUID } from '../global/Axios'

function FilterLocationTime() 
{
    const {
        selectedFilter,
        setSelectedFilter,
        filters,
        setFilters,
        storeName,
        storetodaydayname,
        storetodayopeningtime,
        storetodayclosingtime,
        ordertypeselect, 
        setOrdertypeselect
    } = useContext(HomeContext)

    const handleOrderType = (id) => {
        const updateFilter = filters?.find((findFilter) => findFilter?.id === id)
        setSelectedFilter(updateFilter)
        setLocalStorage(`${BRANDSIMPLEGUID}filter`,updateFilter)
    }

    return (
        <div className='location-openclose-filter'>
            <div>
                <h1 className='gfj0ggge-store-head'>{storeName}</h1>

                <div className='daem-d-store'></div>
                <div className="al">
                <div>
                    <div className="chcicwd3cz-time">
                    <span className="">{storetodaydayname}: <span>{moment(storetodayopeningtime,'HH:mm A').format('HH:mm A')} - {moment(storetodayclosingtime,'HH:mm A').format('HH:mm A')}</span></span>
                    </div>
                </div>
                </div>

            </div>

            <div className='openclosetime-type'>

                <div className="filter-type">
                    {
                        filters?.map((fitler,index) =>
                        {
                            return(
                                (fitler?.status) ?
                                    <div key={index} className={`akd0afbz-delivery-type ${fitler?.id === selectedFilter?.id && "delivery-type-active"}`} onClick={() => handleOrderType(fitler?.id)}>
                                        <div className="algid0amc5-delvery-type">
                                            <div className="chcicjckeeafgmc9gnehclbz g7">
                                                <div className="algid0amc5-delvery-type">
                                                    <div className="chcicjck b1">{fitler?.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <div key={index} className={`akd0afbz-delivery-type`}>
                                        <div className="algid0amc5-delvery-type">
                                            <div className="chcicjckeeafgmc9gnehclbz b1">
                                                <div className="algid0amc5-delvery-type p8">
                                                    <div className="chcicjck p9">{fitler?.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            )
                        })
                    }
            

                    {/* <div className={`akd0afbz-delivery-type ${ordertypeselect === 2 && "delivery-type-active"}`} onClick={() => handleOrderType(2)}>
                        <div className="algid0amc5-delvery-type">
                            <div role="radio" aria-checked="false" tabIndex="0" aria-label="[object Object]" className="chcicjckeeafgmc9gnehclbz b1">
                                <div className="algid0amc5-delvery-type p8">
                                <div className="algid0amc5-delvery-type p8">
                                <div className="chcicjck p9">Pickup</div>
                                <div className="chcicjck p9">Pickup</div>
                                <div className="chobcjck p9"></div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

            </div>
        </div>
    )
}

export default FilterLocationTime