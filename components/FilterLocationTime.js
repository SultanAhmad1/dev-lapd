"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import moment from 'moment'
import { setLocalStorage, setNextCookies, setSessionStorage } from '../global/Store'
import { BLACK_COLOR, BRAND_SIMPLE_GUID, LIGHT_BLACK_COLOR, WHITE_COLOR } from '../global/Axios'

function FilterLocationTime(props) 
{
    const {isDisplayFromModal} = props

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
        setDisplayFilterModal
    } = useContext(HomeContext)

    const [isHeaderSandwichHover, setIsHeaderSandwichHover] = useState(false);

    const handleOrderType = (id) => {
        const updateFilter = filters?.find((findFilter) => findFilter?.id === id && findFilter?.status)
        if(updateFilter)
        {
            setSelectedFilter(updateFilter)
            setLocalStorage(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
            setNextCookies(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
            document.cookie = `${BRAND_SIMPLE_GUID}filter=${updateFilter}`

            if(isDisplayFromModal)
            {
                setTimeout(() => {
                    setDisplayFilterModal(false)
                }, 3000);
            }
            window.location.href = '/'
        }
    }
    
    useEffect(() => {
      const jsFilters = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filtersList`))
      setFilters(jsFilters)
    }, [isDisplayFromModal]);
    
    // useEffect(() => {
    //     if(isDisplayFromModal)
    //     {
    //         const filterByStatus = filters?.filter((filter) => filter?.status === true)

    //         if(parseInt(filterByStatus.length) === parseInt(1))
    //         {
    //             setTimeout(() => {
    //                 handleOrderType(filterByStatus?.[0]?.id)
    //             }, 3000);
    //         }
    //     }
    // }, [isDisplayFromModal, filters]);
    
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

                <div 
                    className="filter-type"
                    // style={{
                    //     background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                    //     color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                    //     border: `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR}` 
                    //     ,
                    // }}

                   
                >
                    {
                        filters?.map((filter,index) =>
                        {
                            return(
                                <div 
                                    key={index} 
                                    className={`akd0afbz-delivery-type ${filter?.id === selectedFilter?.id && "delivery-type-active"}`} 
                                    onClick={() => handleOrderType(filter?.id)}

                                    style={{
                                        background: filter?.id === selectedFilter?.id ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                
                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR
                                        ,
                                        color: filter?.id === selectedFilter?.id ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonFontColor || WHITE_COLOR
                                        :
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
                                        ,
                                        border: filter?.id === selectedFilter?.id ? 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR}` 
                                        : 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR}`
                                        ,
                                        display: "flex"
                                    }}

                                >
                                    {
                                        filter?.id === selectedFilter?.id &&
                                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path 
                                                d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" 
                                                stroke={`${(filter?.id === selectedFilter?.id ? (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonFontColor || WHITE_COLOR) : (websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR))}`} 
                                                strokeWidth="2.5" 
                                                strokeLinejoin="round"/>
                                        </svg>
                                    }
                                    <div className="algid0amc5-delivery-type">
                                        <div className="chic-cj-ckeeafgmc9gnehclbz g7">
                                            <div className={`algid0amc5-delivery-type ${filter?.status === false && "p8"}`}>
                                                <div 
                                                    className="chic-cj-ck b1"
                                                    style={{
                                                        color: filter?.id === selectedFilter?.id ? 
                                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonFontColor || WHITE_COLOR
                                                        :
                                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || BLACK_COLOR
                                                        ,
                                                    }}
                                                >
                                                    {filter?.name}
                                                </div>
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