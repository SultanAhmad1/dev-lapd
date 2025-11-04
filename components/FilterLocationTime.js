"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import moment from 'moment'
import { find_collection_matching_postcode, find_matching_postcode, setLocalStorage, setNextCookies, setSessionStorage } from '../global/Store'
import { BLACK_COLOR, BRAND_SIMPLE_GUID, DELIVERY_ID, LIGHT_BLACK_COLOR, WHITE_COLOR } from '../global/Axios'

function FilterLocationTime(props) 
{
    const {isDisplayFromModal} = props

    const {
        setLoader,
        selectedFilter,
        setSelectedFilter,
        filters,
        setFilters,
        websiteModificationData,
        setDisplayFilterModal,
        setDeliveryMatrix
    } = useContext(HomeContext)

    const handleOrderType = (id) => {
        const updateFilter = filters?.find((findFilter) => findFilter?.id === id && findFilter?.status)
        if(updateFilter)
        {
            setLoader(true)
            setSelectedFilter(updateFilter)
            setLocalStorage(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
            setNextCookies(`${BRAND_SIMPLE_GUID}filter`,updateFilter)
            document.cookie = `${BRAND_SIMPLE_GUID}filter=${updateFilter}`

            // now set the delivery matrix.

            const getDeliveryMatrix = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}address`)
            const getSelectedStore = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`)
            if(getDeliveryMatrix && getSelectedStore)
            {
                const objStore = JSON.parse(getSelectedStore)

                const objDeliveryMatrix = JSON.parse(getDeliveryMatrix)
                const getAvailableStore = objDeliveryMatrix.availableStore?.find((findStore) => findStore.location_guid.includes(objStore.display_id))

                if(getAvailableStore && getAvailableStore.deliveryMatrixes)
                {
                    // now check the order type is delivery

                    if(id.includes(DELIVERY_ID))
                    {
                        const getValidPostcode = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`)

                        if(getValidPostcode)
                        {
                            const objGetValidPostcode = JSON.parse(getValidPostcode)
                            find_matching_postcode(getAvailableStore.deliveryMatrixes.delivery_matrix_rows, objGetValidPostcode, setDeliveryMatrix);
                        }
                    }
                    else
                    {
                        // for collection
                        const getValidPostcode = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_valid_postcode`)
                        
                        
                        if(getValidPostcode)
                        {
                            const objGetValidPostcode = JSON.parse(getValidPostcode)
                            find_collection_matching_postcode(getAvailableStore.deliveryMatrixes.collection_matrix_rows, objGetValidPostcode, setDeliveryMatrix);
                        }
                    }
                    
                }

            }

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
    
    return (
        <div className="w-full py-1">
            <div className="flex gap-2 max-w-lg mx-auto">
                {filters?.map((filter, index) => {
                const isActive = filter?.id === selectedFilter?.id;

                const bgColor = isActive
                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || WHITE_COLOR;

                const textColor = isActive
                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonFontColor || WHITE_COLOR
                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor || WHITE_COLOR;

                const borderColor = isActive
                    ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.activeButtonBackgroundColor || LIGHT_BLACK_COLOR
                    : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || LIGHT_BLACK_COLOR;

                return (
                    <button
                        type="button"
                        key={index}
                        onClick={() => handleOrderType(filter?.id)}
                        className="
                            w-full
                            text-white px-2 py-1 rounded-3xl
                            flex items-center justify-center gap-2 border transition-colors duration-200
                        "
                        style={{
                            background: bgColor,
                            color: textColor,
                            borderColor: borderColor,
                        }}
                    >
                        {isActive && (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M4.89163 13.2687L9.16582 17.5427L18.7085 8"
                                stroke={textColor}
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                            </svg>
                        )}

                       
                        {filter?.name}
                        
                        </button>


                );
                })}
            </div>
        </div>
    )
}

export default FilterLocationTime