"use client";
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
        setOrdertypeselect,
        websiteModificationData,
    } = useContext(HomeContext)

    console.log("Filter side Website modification data:", websiteModificationData);
    
    const handleOrderType = (id) => {
        const updateFilter = filters?.find((findFilter) => findFilter?.id === id && findFilter?.status)
        if(updateFilter)
        {
            setSelectedFilter(updateFilter)
            setLocalStorage(`${BRANDSIMPLEGUID}filter`,updateFilter)
        }
    }

    console.log("Filters data:", filters);
    
    return (
        <div className='open-close-time'>
            <div>
                {/* <h1 className='gfj0ggge-store-head'>{storeName}</h1>

                <div className='daem-d-store'></div>
                <div className="display-time">
                    <span className="">{storetodaydayname}: <span>{moment(storetodayopeningtime,'HH:mm A').format('HH:mm A')} - {moment(storetodayclosingtime,'HH:mm A').format('HH:mm A')}</span></span>
                </div> */}

            </div>

            <div className='openclosetime-type'>

                <div className="filter-type">
                    {
                        filters?.map((fitler,index) =>
                        {
                            return(
                                <div key={index} className={`akd0afbz-delivery-type ${fitler?.id === selectedFilter?.id && "delivery-type-active"}`} onClick={() => handleOrderType(fitler?.id)}>
                                    <div className="algid0amc5-delvery-type">
                                        <div className="chcicjckeeafgmc9gnehclbz g7">
                                            <div className={`algid0amc5-delvery-type ${fitler?.status === false && "p8"}`}>
                                                <div className="chcicjck b1">{fitler?.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
            
                </div>

            </div>
        </div>
    )
}

export default FilterLocationTime