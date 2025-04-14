"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import moment from 'moment'
import { setLocalStorage, setNextCookies, setSessionStorage } from '../global/Store'
import { BLACK_COLOR, BRAND_SIMPLE_GUID, LIGHT_BLACK_COLOR, WHITE_COLOR } from '../global/Axios'

function FilterLocationTimeEdit(props) 
{
    const {isDisplayFromModal, orderTypeDetails, storeId, availableStores,setAvailableStores} = props

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
        setDisplayFilterModal,
    } = useContext(HomeContext)
    
    const [isHeaderSandwichHover, setIsHeaderSandwichHover] = useState(false);

    const handleOrderType = (storeId, id) => {

        if(parseInt(orderTypeDetails.length) === parseInt(0))
        {
            return
        }
        const updateAvailableStores = availableStores?.map((stores) => {
            if(stores?.location_guid === storeId)
            {
                return {
                    ...stores,
                    orderType: stores?.orderType?.map((order) => {
                        if(order?.id === id)
                        {
                            return {
                                ...order,
                                isClicked: true
                            }
                        }

                        return {
                            ...order,
                            isClicked: false
                        }
                    })
                }
            }
            return stores
        })

        setAvailableStores(updateAvailableStores)

        const findOrderType = updateAvailableStores?.find((stores) => stores?.id === storeId)

        setFilters(findOrderType?.orderType)
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
        }
    }
    
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
                    style={{
                        background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR,
                        color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR,
                        border: `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR}` 
                        ,
                    }}

                   
                >
                    {
                        orderTypeDetails?.map((filter,index) =>
                        {
                            return(
                                <div 
                                    key={index} 
                                    className={`akd0afbz-delivery-type ${filter?.isClicked && "delivery-type-active"}`} 
                                    onClick={() => handleOrderType(storeId,filter?.id)}

                                    style={{
                                        background: filter?.isClicked ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || WHITE_COLOR
                
                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR
                                        ,
                                        color: filter?.isClicked ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || WHITE_COLOR
                                        :
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
                                        ,
                                        border: filter?.isClicked ? 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR}` 
                                        : 
                                            `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor || LIGHT_BLACK_COLOR}`
                                        ,
                                    }}

                                >
                                    <div className="algid0amc5-delivery-type">
                                        <div className="chic-cj-ckeeafgmc9gnehclbz g7">
                                            <div className={`algid0amc5-delivery-type ${filter?.status === false && "p8"}`}>
                                                <div 
                                                    className="chic-cj-ck b1"
                                                    style={{
                                                        color: filter?.isClicked ? 
                                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor || BLACK_COLOR
                                                        :
                                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR
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

export default FilterLocationTimeEdit