"use client";
import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'
import moment from 'moment'
import { setLocalStorage, setNextCookies, setSessionStorage } from '../global/Store'
import { BRAND_SIMPLE_GUID } from '../global/Axios'

function FilterLocationTime() 
{
    const {
        selectedFilter,
        setSelectedFilter,
        filters,
        setFilters,
        storeName,
        storeToDayName,
        storeToDayOpeningTime,
        storeToDayClosingTime,
        ordertypeselect, 
        setOrdertypeselect,
        websiteModificationData,
    } = useContext(HomeContext)

    const handleOrderType = (id) => {
        const updateFilter = filters?.find((findFilter) => findFilter?.id === id && findFilter?.status)
        if(updateFilter)
        {
            setSelectedFilter(updateFilter)
            setLocalStorage(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
            setNextCookies(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
            document.cookie = `${BRAND_SIMPLE_GUID}filter=${updateFilter}`
        }
    }

    return (
        <div className='open-close-time'>
            <div>
                {/* <h1 className='gfj0GGGe-store-head'>{storeName}</h1>

                <div className='dame-d-store'></div>
                <div className="display-time">
                    <span className="">{storeToDayName}: <span>{moment(storeToDayOpeningTime,'HH:mm A').format('HH:mm A')} - {moment(storeToDayClosingTime,'HH:mm A').format('HH:mm A')}</span></span>
                </div> */}

            </div>
            
            <div className='openCloseTime-type'>

                <div className="filter-type">
                    {
                        filters?.map((filter,index) =>
                        {
                            return(
                                <div key={index} className={`akd0afbz-delivery-type ${filter?.id === selectedFilter?.id && "delivery-type-active"}`} onClick={() => handleOrderType(filter?.id)}>
                                    <div className="algid0amc5-delivery-type">
                                        <div className="chic-cj-ckeeafgmc9gnehclbz g7">
                                            <div className={`algid0amc5-delivery-type ${filter?.status === false && "p8"}`}>
                                                <div className="chic-cj-ck b1">{filter?.name}</div>
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