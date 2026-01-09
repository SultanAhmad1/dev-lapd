"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "../Header";
import { NestedModifiers } from "../NestedModifiers";
import { useRouter } from "next/navigation";
import HomeContext from "@/contexts/HomeContext";
import moment from "moment-timezone";
import { WebsiteSingleItem } from "../WebsiteSingleItem";
import { MobileSingleItem } from "../MobileSingleItem";
import { axiosPrivate, BRAND_GUID, BRAND_SIMPLE_GUID, IMAGE_URL_Without_Storage, PARTNER_ID } from "@/global/Axios";
import { ContextCheckApi } from "@/app/layout";
import Footer from "../Footer";

export default function DisplaySingleItem({params}) 
{
    const router = useRouter();

    const { setMetaDataToDisplay } = useContext(ContextCheckApi)
    const {
        setLoader,
        storeGUID,
        isCartBtnClicked,
        setIsCartBtnClicked,
        setCartData,
        cartData,
        dayOpeningClosingTime,
        setIsTimeToClosed,
        booleanObj,
        websiteModificationData,
    } = useContext(HomeContext);
    
    const [displaySingleItemObject, setDisplaySingleItemObject] = useState({
        optionNumber: 1,
        isAnyModifierHasExtras: false,

        isItemClicked: false,
        isModifierClicked: false,
        singleItem: null,
        quantity: 1,
        itemPrice: 0,
        selectedModifierId: 0,
        selectedModifierItemId: 0,
        selectedModifierItemPrice: 0,
        isHandleCheckInputClicked: false,
        handleCheckModifierId: 0,
        isHandleModalCheckInputParentModifierID: 0,
        isHandleModalCheckInputParentItemID: 0,
        isHandleModalCheckInputClicked: false,
        handleModalCheckModifierId: 0,
        checkPromotionActive: false,
        getPromotionText: "",
        getPromotionBgColor: "",
        getPromotionTextColor: "",
    });

    const  {
        optionNumber,
        isAnyModifierHasExtras,
        isModifierClicked,
        singleItem,
        quantity,
        itemPrice,
        selectedModifierId,
        selectedModifierItemId,
        selectedModifierItemPrice,
        isHandleCheckInputClicked,
        handleCheckModifierId,
        isHandleModalCheckInputParentModifierID,
        isHandleModalCheckInputParentItemID,
        isHandleModalCheckInputClicked,
        handleModalCheckModifierId,
        checkPromotionActive,
        getPromotionText,
        getPromotionBgColor,
        getPromotionTextColor,
    } = displaySingleItemObject

    const handleDisplayItemStates = (key, value = null) => {
        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                [key]: value,
            }
        })
    }
    
    // const filterItem = async () => {
    //     try {
    //         setLoader(true)
    //         const getStoreIDFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}user_selected_store`));

    //         const visitorInfo = JSON.parse(window.localStorage.getItem('userInfo'));

    //         const data = {
    //             location: getStoreIDFromLocalStorage !== null ? getStoreIDFromLocalStorage?.display_id : storeGUID,
    //             brand: BRAND_GUID,
    //             partner: PARTNER_ID,
    //             visitorGUID: visitorInfo.visitorId,
    //             landingPage: true,
    //             orderPage: true,
    //         };
        
    //         // const response = await axiosPrivate.post(`/menu`, data);

    //         // const getMenus = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}menus`))

    //         // const convertToJSobj = response.data?.data?.menu.menu_json_log;
    //         const convertToJSobj = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}menus`))
        
    //         const getSingleCategory = convertToJSobj?.categories?.find((category) => category.slug === params.category);
        
    //         const getItemFromCategory = getSingleCategory?.items?.find((item) => item.slug === params.product);
            
    //         // count the modifier with isExtras checked.
    //         let isExtrasArray = []

    //         let isPromotionActive = false
    //         let promotionText = getSingleCategory.promotion_text
    //         let promotionBgColor = getSingleCategory.promotion_bg_color
    //         let promotionTextColor = getSingleCategory.promotion_text_color

    //         const dayNameAndTime = moment.tz("HH:mm", "Europe/London").format("HH:mm:ss");

    //         if(parseInt(getSingleCategory?.is_promotion) === parseInt(1))
    //         {
    //             const currentDay = moment().format("dddd")
    //             const findDay = getSingleCategory.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
    //             if(findDay)
    //             {
    //             if(dayNameAndTime >= moment(getSingleCategory.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(getSingleCategory.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
    //             {
    //                 isPromotionActive = true
    //             }
    //             }
    //         }
    //         else if(parseInt(getItemFromCategory?.is_promotion) === parseInt(1))
    //         {
    //             const currentDay = moment().format("dddd")
    //             const findDay = getItemFromCategory?.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
    //             if(findDay)
    //             {
    //                 if(dayNameAndTime >= moment(getItemFromCategory?.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(getItemFromCategory?.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
    //                 {
    //                     isPromotionActive = true
    //                     promotionText = getItemFromCategory?.promotion_text
    //                     promotionBgColor = getItemFromCategory?.promotion_bg_color
    //                     promotionTextColor = getItemFromCategory?.promotion_text_color
    //                 }
    //             }
    //         }
            
    //         const updateModifier = getItemFromCategory?.modifier_group?.map((modifier) => 
    //         {
    //             if(modifier?.isExtras)
    //             {   
    //                 isExtrasArray.push({modifier_id: modifier?.id, modifier_name: modifier?.title, isExtras: modifier?.isExtras})
    //             }

    //             if (modifier?.select_single_option === 1 && modifier?.max_permitted === 1) 
    //             {
    //                 const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifierItem) => 
    //                     { 
    //                         if (parseInt(modifierItem?.secondary_item_modifiers.length) > parseInt(0)) {
    //                             const updateNestedItems = modifierItem?.secondary_item_modifiers?.map((secondItemModifier) => 
    //                             {
    //                                 if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.min_permitted > 0 && secondItemModifier?.max_permitted === 1)
    //                                 {
    //                                     const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
    //                                     {
    //                                         return {
    //                                             ...secondItemModiItem,
    //                                             activeClass: "ob",
    //                                             total_price: 0,
    //                                             is_item_select: secondItemModiItem?.default_option ? true : false,
    //                                             item_select_to_sale: secondItemModiItem?.default_option ? true : false,
    //                                         };
    //                                     });
                                        
    //                                     // Child Modifiers.
    //                                     const selectedSoldItem = updateSecondaryItemModifierItem?.find((item) => item?.is_item_select)
    //                                     return {
    //                                         ...secondItemModifier,
    //                                         valid_class:                     selectedSoldItem?.is_item_select ? "success_check": "default_check",
    //                                         is_modifier_selected:            selectedSoldItem?.is_item_select ? true: false,
    //                                         is_second_item_modifier_clicked: true,
    //                                         secondary_items_modifier_items:  updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                                     };
    //                                 } 
    //                                 else if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted > 1) 
    //                                 {
    //                                     const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
    //                                     {
    //                                         return {
    //                                             ...secondItemModiItem,
    //                                             activeClass: "mche",
    //                                             // total_price: secondItemModiItem?.price_info,
    //                                             total_price: 0,
    //                                             is_item_select: secondItemModiItem?.default_option ? true : false,
    //                                             item_select_to_sale: secondItemModiItem?.default_option ? true : false,
    //                                         };
    //                                     });
                                        
    //                                     const selectedSoldItem = updateSecondaryItemModifierItem?.find((item) => item?.is_item_select)

    //                                     return {
    //                                         ...secondItemModifier,
    //                                         valid_class: selectedSoldItem?.is_item_select ? "success_check" : "default_check",
    //                                         modifier_counter: 0,
    //                                         is_modifier_clickable: false,
    //                                         is_second_item_modifier_clicked:  true,
    //                                         is_modifier_selected:   selectedSoldItem?.is_item_select ? true: false,
    //                                         secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                                     };
    //                                 }
    //                                 else if(secondItemModifier?.select_single_option > 1 && secondItemModifier?.max_permitted >= 1){
    //                                     const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => {
    //                                         return {
    //                                             ...secondItemModiItem,
    //                                             counter: 0,
    //                                             // total_price: secondItemModiItem?.price_info,
    //                                             total_price: 0,
    //                                             is_item_select: true,
    //                                             item_select_to_sale: false,
    //                                         };
    //                                     });
                                        
    //                                     // Child Modifiers
    //                                     // const selectedSoldItem = updateSecondaryItemModifierItem?.find((item) => item?.is_item_select)
    //                                     return {
    //                                         ...secondItemModifier,
    //                                         // valid_class:                        selectedSoldItem?.is_item_select ? "success_check" : "default_check",
    //                                         valid_class:                        "default_check",
    //                                         modifier_counter:                   0,
    //                                         is_modifier_clickable:              false,
    //                                         // is_modifier_selected:               selectedSoldItem?.is_item_select,
    //                                         is_modifier_selected:               false,
    //                                         is_second_item_modifier_clicked:    true,
    //                                         secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                                     };
    //                             }
    //                         });
                
    //                         return {
    //                             ...modifierItem,
    //                             activeClass: "ob",
    //                             is_item_select: false,
    //                             // total_price: modifierItem?.price,
    //                             total_price: 0,
    //                             secondary_item_modifiers: updateNestedItems,
    //                             item_select_to_sale: modifierItem?.default_option ? true : false,
    //                         };
    //                     }

    //                     return {
    //                         ...modifierItem,
    //                         activeClass: "ob",
    //                         // total_price: modifierItem?.price,
    //                         total_price: 0,
    //                         is_item_select: modifierItem?.default_option ? true : false,
    //                         item_select_to_sale: modifierItem?.default_option ? true : false,
    //                     };
    //                 });
                    
    //                 // Parent Modifiers.
    //                 const filterItem = modifier_secondary_items?.find((item) => item?.default_option)
    //                 return {
    //                     ...modifier,
    //                     valid_class: filterItem?.default_option ? "success_check" : "default_check",
    //                     is_toggle_active: true,
    //                     is_modifier_selected: filterItem?.default_option ? true : false,
    //                     modifier_secondary_items: modifier_secondary_items?.sort((a, b) => b?.default_option - a?.default_option),
    //                 };
    //             } 
    //             else if (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) 
    //             {
    //                 const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifierItem) => 
    //                 {
    //                     if (parseInt(modifierItem?.secondary_item_modifiers.length) > parseInt(0)) 
    //                     {
    //                         const updateNestedItems = modifierItem?.secondary_item_modifiers?.map((secondItemModifier) => 
    //                         {
    //                             if (secondItemModifier?.min_permitted > 0 && secondItemModifier?.max_permitted === 1) 
    //                             {
    //                                 const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
    //                                 {
    //                                     return {
    //                                         ...secondItemModiItem,
    //                                         activeClass: "ob",
    //                                         total_price: 0,
    //                                         is_item_select: false,
    //                                         item_select_to_sale: false,
    //                                     };
    //                                 });
                                    
    //                                 // Child Modifiers
    //                                 return {
    //                                     ...secondItemModifier,
    //                                     valid_class: "default_check",
    //                                     is_second_item_modifier_clicked: true,
    //                                     is_modifier_selected: false,
    //                                     secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                                 };
    //                             } 
    //                             else if (secondItemModifier?.max_permitted >= 1) 
    //                             {
    //                                 const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
    //                                 {
    //                                     return {
    //                                             ...secondItemModiItem,
    //                                             activeClass: "mche",
    //                                             total_price: 0,
    //                                             is_item_select: false,
    //                                             item_select_to_sale: false,
    //                                     };
    //                                 });
                                    
    //                                 // Child Modifiers
    //                                 return {
    //                                     ...secondItemModifier,
    //                                     valid_class: "default_check",
    //                                     modifier_counter: 0,
    //                                     is_modifier_clickable: false,
    //                                     is_second_item_modifier_clicked: true,
    //                                     is_modifier_selected: false,
    //                                     secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                                 };
    //                             } 
    //                             // else {
    //                             //   const updateSecondaryItemModifierItem =
    //                             //     secondItemModifier?.secondary_items_modifier_items?.map(
    //                             //       (secondItemModiItem) => {
    //                             //         return {
    //                             //           ...secondItemModiItem,
    //                             //           counter: 0,
    //                             //           total_price: 0,
    //                             //           is_item_select: true,
    //                             //           item_select_to_sale: false,
    //                             //         };
    //                             //       }
    //                             //     );
            
    //                             //   return {
    //                             //     ...secondItemModifier,
    //                             //     valid_class: "default_check",
    //                             //     modifier_counter: 0,
    //                             //     is_modifier_clickable: false,
    //                             //     is_second_item_modifier_clicked: true,
    //                             //     is_modifier_selected: false,
    //                             //     secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                             //   };
    //                             // }
    //                         });
                
    //                         return {
    //                             ...modifierItem,
    //                             activeClass: "mche",
    //                             // total_price: modifierItem?.price,
    //                             total_price: 0,
    //                             is_item_select: false,
    //                             secondary_item_modifiers: updateNestedItems,
    //                             item_select_to_sale: false,
    //                         };
    //                     }
    //                     return {
    //                         ...modifierItem,
    //                         activeClass: "mche",
    //                         // total_price: modifierItem?.price,
    //                         total_price: 0,
    //                         is_item_select: modifierItem?.default_option ? true : false,
    //                         item_select_to_sale: modifierItem?.default_option ? true : false,
    //                     };
    //                 });
                    
    //                 // Parent Modifiers.
    //                 const filterItem = modifier_secondary_items?.find((item) => item?.default_option)
    //                 return {
    //                     ...modifier,
    //                     valid_class: filterItem?.default_option ? "success_check" : "default_check",
    //                     is_toggle_active: true,
    //                     modifier_counter: 0,
    //                     is_modifier_clickable: false,
    //                     is_modifier_selected: filterItem?.default_option ? true : false,
    //                     modifier_secondary_items: modifier_secondary_items?.sort((a,b) => b?.default_option - a?.default_option),
    //                 };
    //             } 
    //             else if(modifier?.select_single_option > 1 && modifier?.max_permitted >= 1)
    //             {
    //                 const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifierItem) => 
    //                 {
    //                   if (parseInt(modifierItem?.secondary_item_modifiers.length) > parseInt(0)) {
    //                     const updateNestedItems = modifierItem?.secondary_item_modifiers?.map((secondItemModifier) => {
    //                         if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted === 1) 
    //                         {
    //                             const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
    //                             {
    //                                 return {
    //                                 ...secondItemModiItem,
    //                                 activeClass: "ob",
    //                                 total_price: 0,
    //                                 is_item_select: false,
    //                                 item_select_to_sale: false,
    //                                 };
    //                             });
                                
    //                             // Child Modifiers.
    //                             return {
    //                               ...secondItemModifier,
    //                               valid_class: "default_check",
    //                               is_second_item_modifier_clicked: true,
    //                               is_modifier_selected: false,
    //                               secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                             };

    //                         } 
    //                         else if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted > 1) 
    //                         {
    //                             const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
    //                             {
    //                                 return {
    //                                     ...secondItemModiItem,
    //                                     total_price: 0,
    //                                     activeClass: "mche",
    //                                     is_item_select: false,
    //                                     item_select_to_sale: false,
    //                                 };
    //                             });
                                
    //                             // Child Modifiers.
    //                             return {
    //                               ...secondItemModifier,
    //                               valid_class: "default_check",
    //                               modifier_counter: 0,
    //                               is_modifier_clickable: false,
    //                               is_second_item_modifier_clicked: true,
    //                               is_modifier_selected: false,
    //                               secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                             };
    //                           } 
    //                           else if (secondItemModifier?.select_single_option > 1 && secondItemModifier?.max_permitted >= 1) 
    //                           {
    //                             const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => {
    //                                 return {
    //                                 ...secondItemModiItem,
    //                                 counter: 0,
    //                                 total_price: 0,
    //                                 is_item_select: true,
    //                                 item_select_to_sale: false,
    //                                 };
    //                             });
                                
    //                             // Child modifiers.
    //                             return {
    //                               ...secondItemModifier,
    //                               valid_class: "default_check",
    //                               modifier_counter: 0,
    //                               is_modifier_clickable: false,
    //                               is_second_item_modifier_clicked: true,
    //                               is_modifier_selected: false,
    //                               secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
    //                             };
    //                           }
    //                         }
    //                       );
        
    //                     return {
    //                       ...modifierItem,
    //                       counter: 0,
    //                       is_item_select: true,
    //                       // total_price: modifierItem?.price,
    //                       total_price: 0,
    //                       secondary_item_modifiers: updateNestedItems,
    //                       item_select_to_sale: false,
    //                     };
    //                   }
    //                   return {
    //                     ...modifierItem,
    //                     counter: 0,
    //                     // total_price: modifierItem?.price,
    //                     total_price: 0,
    //                     is_item_select: modifierItem?.default_option ? true : false,
    //                     item_select_to_sale: modifierItem?.default_option ? true : false,
    //                   };
    //                 });

    //                 // Parent Modifiers.
    //                 const filterItem = modifier_secondary_items?.find((item) => item?.default_option)

    //                 return {
    //                     ...modifier,
    //                     valid_class: filterItem?.default_option ? "success_check" : "default_check",
    //                     is_toggle_active: true,
    //                     modifier_counter: 0,
    //                     is_modifier_clickable: false,
    //                     is_modifier_selected: filterItem?.default_option ? true : false,
    //                     modifier_secondary_items: modifier_secondary_items?.sort((a, b) => b.default_option - a.default_option),
    //                 };
    //             }
    //         });
            
    //         getItemFromCategory.modifier_group = updateModifier;

    //         setDisplaySingleItemObject((prevData) => {
    //             return {
    //                 ...prevData,
    //                 singleItem: getItemFromCategory,
    //                 itemPrice: parseFloat(getItemFromCategory?.price).toFixed(2),
    //                 isAnyModifierHasExtras: parseInt(isExtrasArray?.length) > parseInt(0) ? true : false,
    //                 checkPromotionActive: isPromotionActive,
    //                 getPromotionText: promotionText,
    //                 getPromotionBgColor: promotionBgColor,
    //                 getPromotionTextColor: promotionTextColor,
    //             }
    //         })

    //         setTimeout(() => {
    //             setLoader(false);
    //         }, 3000);
    //     } catch (error) {
    //         setTimeout(() => {
    //             setLoader(false);
    //         }, 3000);
    //     }
    // };

    useEffect(() => {
        const dayNumber = moment().day();
        const dateTime = moment().format("HH:mm");
        const dayName = moment().format("dddd");
    
        if (dayOpeningClosingTime?.day_of_week?.toLowerCase().includes(dayName.toLowerCase())) 
        {
          const timePeriods = dayOpeningClosingTime?.time_periods;
          if (timePeriods) {
            if (timePeriods?.[0]?.start_time >= dateTime && dateTime <= timePeriods?.[0]?.end_time) 
            {
              setIsTimeToClosed(true);
              return;
            }
          }
        }
        
        if(params?.edit)
        {
            setTimeout(() => {
                setLoader(false);
            }, 3000);

            const getIndex = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}set_index`);
            const getCart = window.localStorage.getItem(`${BRAND_SIMPLE_GUID}cart`);
        
            const parseCart = JSON.parse(getCart);
            // const getFilterItem = parseCart?.find((cart, index) => index === JSON.parse(getIndex));
            const getFilterItem = parseCart?.find(cartItem => cartItem?.slug?.includes(params?.product))
            
            const findAnyExtras = getFilterItem?.modifier_group?.filter((extras) => extras?.isExtras)
            
            setIsCartBtnClicked(false)

            setDisplaySingleItemObject((prevData) => {
                return{
                    ...prevData,
                    singleItem: getFilterItem,
                    quantity: getFilterItem?.quantity,
                    itemPrice: getFilterItem?.total_order_amount / getFilterItem?.quantity,
                    isAnyModifierHasExtras: (findAnyExtras && parseInt(findAnyExtras?.length) > parseInt(0)) ? true : false
                }
            })
            return
        }
        
        // filterItem();

        /**
         * Updated menu details
         * 
         */

          const convertToJSobj = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}menus`))
        
            const getSingleCategory = convertToJSobj?.categories?.find((category) => category.slug === params.category);
        
            const getItemFromCategory = getSingleCategory?.items?.find((item) => item.slug === params.product);
            
            // count the modifier with isExtras checked.
            let isExtrasArray = []

            let isPromotionActive = false
            let promotionText = getSingleCategory.promotion_text
            let promotionBgColor = getSingleCategory.promotion_bg_color
            let promotionTextColor = getSingleCategory.promotion_text_color

            const dayNameAndTime = moment.tz("HH:mm", "Europe/London").format("HH:mm:ss");

            if(parseInt(getSingleCategory?.is_promotion) === parseInt(1))
            {
                const currentDay = moment().format("dddd")
                const findDay = getSingleCategory.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
                if(findDay)
                {
                if(dayNameAndTime >= moment(getSingleCategory.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(getSingleCategory.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
                {
                    isPromotionActive = true
                }
                }
            }
            else if(parseInt(getItemFromCategory?.is_promotion) === parseInt(1))
            {
                const currentDay = moment().format("dddd")
                const findDay = getItemFromCategory?.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
                if(findDay)
                {
                    if(dayNameAndTime >= moment(getItemFromCategory?.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(getItemFromCategory?.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
                    {
                        isPromotionActive = true
                        promotionText = getItemFromCategory?.promotion_text
                        promotionBgColor = getItemFromCategory?.promotion_bg_color
                        promotionTextColor = getItemFromCategory?.promotion_text_color
                    }
                }
            }
            
            const updateModifier = getItemFromCategory?.modifier_group?.map((modifier) => 
            {
                if(modifier?.isExtras)
                {   
                    isExtrasArray.push({modifier_id: modifier?.id, modifier_name: modifier?.title, isExtras: modifier?.isExtras})
                }

                if (modifier?.select_single_option === 1 && modifier?.max_permitted === 1) 
                {
                    const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifierItem) => 
                        { 
                            if (parseInt(modifierItem?.secondary_item_modifiers.length) > parseInt(0)) {
                                const updateNestedItems = modifierItem?.secondary_item_modifiers?.map((secondItemModifier) => 
                                {
                                    if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.min_permitted > 0 && secondItemModifier?.max_permitted === 1)
                                    {
                                        const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                        {
                                            return {
                                                ...secondItemModiItem,
                                                activeClass: "ob",
                                                total_price: 0,
                                                is_item_select: secondItemModiItem?.default_option ? true : false,
                                                item_select_to_sale: secondItemModiItem?.default_option ? true : false,
                                            };
                                        });
                                        
                                        // Child Modifiers.
                                        const selectedSoldItem = updateSecondaryItemModifierItem?.find((item) => item?.is_item_select)
                                        return {
                                            ...secondItemModifier,
                                            valid_class:                     selectedSoldItem?.is_item_select ? "success_check": "default_check",
                                            is_modifier_selected:            selectedSoldItem?.is_item_select ? true: false,
                                            is_second_item_modifier_clicked: true,
                                            secondary_items_modifier_items:  updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                        };
                                    } 
                                    else if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted > 1) 
                                    {
                                        const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                        {
                                            return {
                                                ...secondItemModiItem,
                                                activeClass: "mche",
                                                // total_price: secondItemModiItem?.price_info,
                                                total_price: 0,
                                                is_item_select: secondItemModiItem?.default_option ? true : false,
                                                item_select_to_sale: secondItemModiItem?.default_option ? true : false,
                                            };
                                        });
                                        
                                        const selectedSoldItem = updateSecondaryItemModifierItem?.find((item) => item?.is_item_select)

                                        return {
                                            ...secondItemModifier,
                                            valid_class: selectedSoldItem?.is_item_select ? "success_check" : "default_check",
                                            modifier_counter: 0,
                                            is_modifier_clickable: false,
                                            is_second_item_modifier_clicked:  true,
                                            is_modifier_selected:   selectedSoldItem?.is_item_select ? true: false,
                                            secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                        };
                                    }
                                    else if(secondItemModifier?.select_single_option > 1 && secondItemModifier?.max_permitted >= 1){
                                        const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => {
                                            return {
                                                ...secondItemModiItem,
                                                counter: 0,
                                                // total_price: secondItemModiItem?.price_info,
                                                total_price: 0,
                                                is_item_select: true,
                                                item_select_to_sale: false,
                                            };
                                        });
                                        
                                        // Child Modifiers
                                        // const selectedSoldItem = updateSecondaryItemModifierItem?.find((item) => item?.is_item_select)
                                        return {
                                            ...secondItemModifier,
                                            // valid_class:                        selectedSoldItem?.is_item_select ? "success_check" : "default_check",
                                            valid_class:                        "default_check",
                                            modifier_counter:                   0,
                                            is_modifier_clickable:              false,
                                            // is_modifier_selected:               selectedSoldItem?.is_item_select,
                                            is_modifier_selected:               false,
                                            is_second_item_modifier_clicked:    true,
                                            secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                        };
                                }
                            });
                
                            return {
                                ...modifierItem,
                                activeClass: "ob",
                                is_item_select: false,
                                // total_price: modifierItem?.price,
                                total_price: 0,
                                secondary_item_modifiers: updateNestedItems,
                                item_select_to_sale: modifierItem?.default_option ? true : false,
                            };
                        }

                        return {
                            ...modifierItem,
                            activeClass: "ob",
                            // total_price: modifierItem?.price,
                            total_price: 0,
                            is_item_select: modifierItem?.default_option ? true : false,
                            item_select_to_sale: modifierItem?.default_option ? true : false,
                        };
                    });
                    
                    // Parent Modifiers.
                    const filterItem = modifier_secondary_items?.find((item) => item?.default_option)
                    return {
                        ...modifier,
                        valid_class: filterItem?.default_option ? "success_check" : "default_check",
                        is_toggle_active: true,
                        is_modifier_selected: filterItem?.default_option ? true : false,
                        modifier_secondary_items: modifier_secondary_items?.sort((a, b) => b?.default_option - a?.default_option),
                    };
                } 
                else if (modifier?.select_single_option === 1 && modifier?.max_permitted > 1) 
                {
                    const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifierItem) => 
                    {
                        if (parseInt(modifierItem?.secondary_item_modifiers.length) > parseInt(0)) 
                        {
                            const updateNestedItems = modifierItem?.secondary_item_modifiers?.map((secondItemModifier) => 
                            {
                                if (secondItemModifier?.min_permitted > 0 && secondItemModifier?.max_permitted === 1) 
                                {
                                    const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                    {
                                        return {
                                            ...secondItemModiItem,
                                            activeClass: "ob",
                                            total_price: 0,
                                            is_item_select: false,
                                            item_select_to_sale: false,
                                        };
                                    });
                                    
                                    // Child Modifiers
                                    return {
                                        ...secondItemModifier,
                                        valid_class: "default_check",
                                        is_second_item_modifier_clicked: true,
                                        is_modifier_selected: false,
                                        secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                    };
                                } 
                                else if (secondItemModifier?.max_permitted >= 1) 
                                {
                                    const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                    {
                                        return {
                                                ...secondItemModiItem,
                                                activeClass: "mche",
                                                total_price: 0,
                                                is_item_select: false,
                                                item_select_to_sale: false,
                                        };
                                    });
                                    
                                    // Child Modifiers
                                    return {
                                        ...secondItemModifier,
                                        valid_class: "default_check",
                                        modifier_counter: 0,
                                        is_modifier_clickable: false,
                                        is_second_item_modifier_clicked: true,
                                        is_modifier_selected: false,
                                        secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                    };
                                } 
                                // else {
                                //   const updateSecondaryItemModifierItem =
                                //     secondItemModifier?.secondary_items_modifier_items?.map(
                                //       (secondItemModiItem) => {
                                //         return {
                                //           ...secondItemModiItem,
                                //           counter: 0,
                                //           total_price: 0,
                                //           is_item_select: true,
                                //           item_select_to_sale: false,
                                //         };
                                //       }
                                //     );
            
                                //   return {
                                //     ...secondItemModifier,
                                //     valid_class: "default_check",
                                //     modifier_counter: 0,
                                //     is_modifier_clickable: false,
                                //     is_second_item_modifier_clicked: true,
                                //     is_modifier_selected: false,
                                //     secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                //   };
                                // }
                            });
                
                            return {
                                ...modifierItem,
                                activeClass: "mche",
                                // total_price: modifierItem?.price,
                                total_price: 0,
                                is_item_select: false,
                                secondary_item_modifiers: updateNestedItems,
                                item_select_to_sale: false,
                            };
                        }
                        return {
                            ...modifierItem,
                            activeClass: "mche",
                            // total_price: modifierItem?.price,
                            total_price: 0,
                            is_item_select: modifierItem?.default_option ? true : false,
                            item_select_to_sale: modifierItem?.default_option ? true : false,
                        };
                    });
                    
                    // Parent Modifiers.
                    const filterItem = modifier_secondary_items?.find((item) => item?.default_option)
                    return {
                        ...modifier,
                        valid_class: filterItem?.default_option ? "success_check" : "default_check",
                        is_toggle_active: true,
                        modifier_counter: 0,
                        is_modifier_clickable: false,
                        is_modifier_selected: filterItem?.default_option ? true : false,
                        modifier_secondary_items: modifier_secondary_items?.sort((a,b) => b?.default_option - a?.default_option),
                    };
                } 
                else if(modifier?.select_single_option > 1 && modifier?.max_permitted >= 1)
                {
                    const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifierItem) => 
                    {
                      if (parseInt(modifierItem?.secondary_item_modifiers.length) > parseInt(0)) {
                        const updateNestedItems = modifierItem?.secondary_item_modifiers?.map((secondItemModifier) => {
                            if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted === 1) 
                            {
                                const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                {
                                    return {
                                    ...secondItemModiItem,
                                    activeClass: "ob",
                                    total_price: 0,
                                    is_item_select: false,
                                    item_select_to_sale: false,
                                    };
                                });
                                
                                // Child Modifiers.
                                return {
                                  ...secondItemModifier,
                                  valid_class: "default_check",
                                  is_second_item_modifier_clicked: true,
                                  is_modifier_selected: false,
                                  secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                };

                            } 
                            else if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.max_permitted > 1) 
                            {
                                const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                {
                                    return {
                                        ...secondItemModiItem,
                                        total_price: 0,
                                        activeClass: "mche",
                                        is_item_select: false,
                                        item_select_to_sale: false,
                                    };
                                });
                                
                                // Child Modifiers.
                                return {
                                  ...secondItemModifier,
                                  valid_class: "default_check",
                                  modifier_counter: 0,
                                  is_modifier_clickable: false,
                                  is_second_item_modifier_clicked: true,
                                  is_modifier_selected: false,
                                  secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                };
                              } 
                              else if (secondItemModifier?.select_single_option > 1 && secondItemModifier?.max_permitted >= 1) 
                              {
                                const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => {
                                    return {
                                    ...secondItemModiItem,
                                    counter: 0,
                                    total_price: 0,
                                    is_item_select: true,
                                    item_select_to_sale: false,
                                    };
                                });
                                
                                // Child modifiers.
                                return {
                                  ...secondItemModifier,
                                  valid_class: "default_check",
                                  modifier_counter: 0,
                                  is_modifier_clickable: false,
                                  is_second_item_modifier_clicked: true,
                                  is_modifier_selected: false,
                                  secondary_items_modifier_items: updateSecondaryItemModifierItem?.sort((a,b) => b?.default_option - a?.default_option),
                                };
                              }
                            }
                          );
        
                        return {
                          ...modifierItem,
                          counter: 0,
                          is_item_select: true,
                          // total_price: modifierItem?.price,
                          total_price: 0,
                          secondary_item_modifiers: updateNestedItems,
                          item_select_to_sale: false,
                        };
                      }
                      return {
                        ...modifierItem,
                        counter: 0,
                        // total_price: modifierItem?.price,
                        total_price: 0,
                        is_item_select: modifierItem?.default_option ? true : false,
                        item_select_to_sale: modifierItem?.default_option ? true : false,
                      };
                    });

                    // Parent Modifiers.
                    const filterItem = modifier_secondary_items?.find((item) => item?.default_option)

                    return {
                        ...modifier,
                        valid_class: filterItem?.default_option ? "success_check" : "default_check",
                        is_toggle_active: true,
                        modifier_counter: 0,
                        is_modifier_clickable: false,
                        is_modifier_selected: filterItem?.default_option ? true : false,
                        modifier_secondary_items: modifier_secondary_items?.sort((a, b) => b.default_option - a.default_option),
                    };
                }
            });
            
            getItemFromCategory.modifier_group = updateModifier;

            setDisplaySingleItemObject((prevData) => {
                return {
                    ...prevData,
                    singleItem: getItemFromCategory,
                    itemPrice: parseFloat(getItemFromCategory?.price).toFixed(2),
                    isAnyModifierHasExtras: parseInt(isExtrasArray?.length) > parseInt(0) ? true : false,
                    checkPromotionActive: isPromotionActive,
                    getPromotionText: promotionText,
                    getPromotionBgColor: promotionBgColor,
                    getPromotionTextColor: promotionTextColor,
                }
            })

            setTimeout(() => {
                setLoader(false);
            }, 3000);
    }, [params]);
    
    useEffect(() => {
        
        if(websiteModificationData && singleItem)
        {
            const getSeoTitle = singleItem?.seo_title === null ? singleItem?.title : singleItem?.seo_title
            const getSeoDescription = singleItem?.seo_description === null ? singleItem?.description : singleItem?.seo_description
          
            setMetaDataToDisplay((prevData) => ({
                ...prevData,
                title: `${singleItem.title} - ${websiteModificationData?.brand?.name}`,
                contentData: `${singleItem.description}`,
                singleItemsDetails: {
                    title: getSeoTitle,
                    description: getSeoDescription,
                    itemImage: singleItem?.image_url,
                    keywords: getSeoDescription,
                    url: window.location.href
                    //  url: {`${storeName.toLowerCase()}/${category?.slug}/${item?.slug}`}
                }
            }))
        }
    }, [singleItem, websiteModificationData]);
    
    const handleMScroll = (event) => {
        let element = document.querySelector(".ctascusingle-product");
        element.style.position = event.deltaY === 100 ? "absolute" : "sticky";
    };
    
    const handleRadioInput = useCallback((modifierId, itemId, itemName, secondaryItemModifierCounter) => {

        if (parseInt(secondaryItemModifierCounter) > parseInt(0)) {
            const findModifierItemNestedModifier = singleItem?.modifier_group?.find((modifier) => modifier?.id === modifierId);
            const findModifierItemNestedModifierItem = findModifierItemNestedModifier?.modifier_secondary_items?.find((item) => item?.id === itemId);
    
            setDisplaySingleItemObject(((prevData) => {
                return{
                    ...prevData,
                    isModifierClicked: !prevData?.isModifierClicked,
                    selectedModifierItemPrice: parseFloat(findModifierItemNestedModifierItem?.total_price),
                    selectedModifierId: modifierId,
                    selectedModifierItemId: itemId,
                }
            }))
        }
    
        let totalAmount = itemPrice;
        for (const updateItemModifier of singleItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.is_item_select === true) {
                        const newTotalMinus = parseFloat(totalAmount) - parseFloat(updateItemModifierItem?.price) - parseFloat(updateItemModifierItem?.total_price);
                        totalAmount = newTotalMinus;
                    }
                }
            }
        }

        let defaultOption = false
        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        selected_item_name: itemName,
                        is_modifier_selected: true,
                        valid_class:
                        parseInt(modifier.min_permitted) > parseInt(0) &&
                        modifier.valid_class === "error_check" ? "success_check" : "success_check",
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => 
                        {
                            if (itemId === secondItems?.id) {
                                defaultOption = secondItems?.default_option
                                return {
                                    ...secondItems,
                                    activeClass: "nv",
                                    is_item_select: true,
                                    item_select_to_sale: true,
                                };
                            }
                            return {
                                ...secondItems,
                                activeClass: "ob",
                                is_item_select: false,
                                total_price: 0,
                                item_select_to_sale: false,
                                secondary_item_modifiers:secondItems?.secondary_item_modifiers?.map((secondaryModifier) => {
                                    return {
                                        ...secondaryModifier,
                                        secondary_items_modifier_items: secondaryModifier?.secondary_items_modifier_items?.map((secondaryItem) => {
                                            if (secondaryModifier?.select_single_option === 1 && secondaryModifier?.min_permitted > 0 && secondaryModifier?.max_permitted === 1) 
                                            {
                                                return {
                                                    ...secondaryItem,
                                                    activeClass: "ob",
                                                    total_price: 0,
                                                    is_item_select: false,
                                                };
                                            } 
                                            else 
                                            if (secondaryModifier?.select_single_option === 1 && secondaryModifier?.max_permitted >= 1) 
                                            {
                                                return {
                                                    ...secondaryItem,
                                                    activeClass: "mche",
                                                    total_price: 0,
                                                    is_item_select: false,
                                                };
                                            }
                                            else 
                                            {
                                                return {
                                                    ...secondaryItem,
                                                    counter: 0,
                                                    total_price: 0,
                                                    is_item_select: true,
                                                };
                                            }
                                        }),
                                    };
                                }),
                            };
                        }),
                        defaultOption: defaultOption,
                    };
                }

                return modifier
            }),
        };
    
        for (const updateItemModifier of updateItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        const newTotalPlus = parseFloat(totalAmount) + parseFloat(updateItemModifierItem?.price);
                        totalAmount = newTotalPlus;
                    }
                }
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                singleItem: updateItem,
                itemPrice: parseFloat(totalAmount).toFixed(2)
            }
        })
    },[itemPrice,singleItem,isModifierClicked,selectedModifierId,selectedModifierItemId,selectedModifierItemPrice,isModifierClicked]);
    
    
    const handleCheckInput = useCallback((modifierId, itemId, secondaryItemModifierCounter) => {
        let totalAmount = itemPrice;

        let defaultOption = false
        
        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => {
                            if (itemId === secondItems?.id) {
                                defaultOption = secondItems?.default_option
                                return {
                                    ...secondItems,
                                    activeClass: secondItems.activeClass === "mche" || secondItems.activeClass === "mchw" ? "mch" : "mche",
                                    is_item_select: secondItems.is_item_select === true ? false : true,
                                    item_select_to_sale: secondItems.item_select_to_sale === true ? false : true,
                                };
                            }
                            return {
                                ...secondItems,
                                activeClass: secondItems.activeClass === "mche" || secondItems.activeClass === "mchw" ? "mche" : "mch",
                                is_item_select: secondItems.is_item_select === false ? false : true,
                                item_select_to_sale: secondItems.item_select_to_sale === false ? false : true,
                            };
                        }
                        ),
                        defaultOption: defaultOption,
                    };
                }

                return modifier
            }),
        };
          // check the max_permit and make related
          // count the number of item_selected in checkboxes.
        let countItemSelected = 0;
        for (const countSelectedItem of updateItem.modifier_group) {
            if (countSelectedItem?.select_single_option === 1 && countSelectedItem?.min_permitted === 0 && countSelectedItem?.max_permitted >= 1) {
                if (parseInt(countSelectedItem?.modifier_secondary_items.length) >parseInt(0)) 
                {
                    for (const countItem of countSelectedItem?.modifier_secondary_items) 
                    {
                        if (countItem?.is_item_select){countItemSelected += 1;}
                    }
                }
            }
        }
    
        const makeModifierIsSelected = {
            ...updateItem,
            modifier_group: updateItem?.modifier_group?.map((modifier) => {
                if (modifier?.id === modifierId) {
                    let addClass = modifier.valid_class;
                    if (parseInt(countItemSelected) > parseInt(0)) {
                        if (parseInt(modifier.min_permitted) > parseInt(0) && modifier.valid_class === "error_check") {
                            addClass = "success_check";
                        }
                    }
                    return {
                        ...modifier,
                        is_modifier_selected:
                        parseInt(countItemSelected) > parseInt(0) ? true : false,
                        valid_class: addClass,
                    };
                }
                return modifier;
            }),
        };


        for (const updateItemModifier of updateItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        if (updateItemModifierItem?.activeClass === "mch") {
                            const newTotalPlus = parseFloat(totalAmount) + parseFloat(updateItemModifierItem?.price);
                            totalAmount = newTotalPlus;
                        } else {
                            const newTotalMinus = parseFloat(totalAmount) - parseFloat(updateItemModifierItem?.price);
                            totalAmount = newTotalMinus;
                        }
                    }
                }
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                singleItem: makeModifierIsSelected,
                itemPrice: parseFloat(totalAmount).toFixed(2),
                isHandleCheckInputClicked: true,
                handleCheckModifierId: modifierId,
            }
        })

    },[handleCheckModifierId, singleItem, itemPrice, isHandleCheckInputClicked]);

    const handleIncrement = useCallback((modifierId, itemId) => {

        const filterModifier = singleItem?.modifier_group?.find((modifier) => modifier?.id === modifierId)

        if(filterModifier?.select_single_option > 1 && filterModifier?.max_permitted >= 1)
        {
            const countTheItemsCounter = filterModifier?.modifier_secondary_items?.reduce((total,line) => {return total += (line?.counter || 0)}, 0)
            if(countTheItemsCounter === filterModifier?.max_permitted)
            {
                return
            }
        }
        
        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        valid_class: parseInt(modifier.min_permitted) > parseInt(0) && modifier.valid_class === "error_check" ? "success_check" : "success_check",
                        // modifier_counter: 1 + modifier?.modifier_counter, 
                        is_modifier_clickable: modifier?.modifier_counter < modifier.max_permitted ? false : true,
                        permitt_max: modifier.max_permitted,
                        is_modifier_selected: true,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => {
                            if (itemId === secondItems?.id) 
                            {  
                                return {
                                    ...secondItems,
                                    counter: (modifier?.select_single_option === secondItems?.counter) ? secondItems.counter : 1 + secondItems.counter,
                                    is_item_select: false,
                                    item_select_to_sale:true,
                                };
                            }
                            return {
                                ...secondItems,
                                counter: secondItems.counter > 0 ? secondItems.counter : 0,
                                is_item_select: secondItems.is_item_select === true ? true : false,
                                item_select_to_sale: secondItems.item_select_to_sale === true ? true : false,
                            };
                        }),
                    };
                }

                return modifier;
            }),
        };
        
        let modifierItemsCounter = 0

        if(parseInt(updateItem?.modifier_group?.length) > parseInt(0))
        {
            for(const modifier of updateItem?.modifier_group)
            {
                if(modifierId === modifier?.id)
                {
                    if(parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0))
                    {
                        for(const item of modifier?.modifier_secondary_items)
                        {
                            if(modifier.select_single_option === item.counter)
                            {
                                modifierItemsCounter += 1
                            }
                        }
                    }
                }
            }
        }
        
        /**
         * First compare modifier max_permit with selected_item_option.
         * 
         * if selected_item_option and max_permit matched.
         * then don't increment.
         */
        const findModifier = updateItem?.modifier_group?.find((modifier) => modifierId === modifier?.id)

        if(findModifier?.max_permitted === modifierItemsCounter)
        {
            const updateModifierCounter = {
                ...updateItem,
                modifier_group: updateItem?.modifier_group?.map((modifier) => {
                    if(modifierId === modifier?.id)
                    {
                        return {
                            ...modifier,
                            modifier_counter: modifierItemsCounter, 
                        }
                    }

                    return modifier
                })
            }

            handleDisplayItemStates("singleItem", updateModifierCounter)
            return 
        }

    
        let totalAmount = itemPrice;
        for (const updateItemModifier of updateItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        const newTotalPlus = parseFloat(totalAmount) + parseFloat(updateItemModifierItem?.price);
                        totalAmount = newTotalPlus;
                    }
                }
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                singleItem: updateItem,
                itemPrice: parseFloat(totalAmount).toFixed(2)
            }
        })
    },[singleItem, itemPrice]);
    
    const handleDecrement = useCallback((modifierId, itemId) => {
        let totalAmount = itemPrice;
        for (const updateItemModifier of singleItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        if (updateItemModifierItem.counter > 0) {
                            const newTotalMinus = parseFloat(totalAmount) - parseFloat(updateItemModifierItem?.price);
                            totalAmount = newTotalMinus;
                        }
                    }
                }
            }
        }

    
        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_counter: modifier?.modifier_counter > 0 ? modifier?.modifier_counter - 1 : 0,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => {

                        if (itemId === secondItems?.id) {
                            let getCounter = secondItems.counter > 0 ? secondItems.counter - 1 : 0;
                            return {
                            ...secondItems,
                            counter: secondItems.counter > 0 ? secondItems.counter - 1 : 0,
                            is_item_select: secondItems.counter === 0 ? true : false,
                            item_select_to_sale: getCounter > 0 ? true : false,
                            };
                        }
                        return {
                            ...secondItems,
                            counter: secondItems.counter > 0 ? secondItems.counter : 0,
                            is_item_select: secondItems.counter === 0 ? true : false,
                            item_select_to_sale: secondItems.counter > 0 ? true : false,
                        };

                        }),
                    };
                }
        
                return modifier;
            }),
        };
    
        // is modifier selected make sure true or false, will help to save information into database.
        const updateModifierItemSelected = {
            ...updateItem,
            modifier_group: updateItem?.modifier_group?.map((decModifierItemSelected) => {
                if (modifierId === decModifierItemSelected?.id) {
                    let addClass = decModifierItemSelected.valid_class;
                    if (decModifierItemSelected?.modifier_counter === 0) {
                        if (decModifierItemSelected.valid_class === "error_check") {
                            addClass = "success_check";
                        } else {
                            addClass = "default_check";
                        }
                    }
                    return {
                        ...decModifierItemSelected,
                        is_modifier_selected: parseInt(decModifierItemSelected?.modifier_counter) > parseInt(0) ? true : false,
                        valid_class: addClass,
                    };
                }
                return decModifierItemSelected;
                }
            ),
        };
        
        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                itemPrice: parseFloat(totalAmount).toFixed(2),
                singleItem: updateModifierItemSelected
            }
        })
    },[itemPrice, singleItem]);
    
    const handleModalRadioInput = useCallback((modifierId, itemId, secondaryModifierId, secondaryItemId) => {

        let defaultOption = false
        let totalAmount = selectedModifierItemPrice;
        for (const updateItemModifier of singleItem.modifier_group) {
        if (modifierId === updateItemModifier?.id) {
            for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
            if (itemId === updateItemModifierItem?.id) {
                for (const secondaryModifier of updateItemModifierItem?.secondary_item_modifiers) {
                if (secondaryModifierId === secondaryModifier?.id) {
                    for (const secondaryItem of secondaryModifier?.secondary_items_modifier_items) {
                    if (secondaryItem?.is_item_select === true) {
                        const newTotalMinus =
                        parseFloat(totalAmount) -
                        parseFloat(secondaryItem?.price_info);
                        totalAmount = newTotalMinus;
                    }
                    }
                }
                }
            }
            }
        }
        }
    
        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        is_modifier_selected: true,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((item) => {
                            if (itemId === item?.id) {
                                defaultOption = item?.default_option
                                return {
                                    ...item,
                                    secondary_item_modifiers: item?.secondary_item_modifiers?.map((secondaryModifier) => 
                                    {
                                        if (secondaryModifierId === secondaryModifier?.id) {
                                            return {
                                            ...secondaryModifier,
                                            valid_class:
                                                parseInt(secondaryModifier.min_permitted) >
                                                parseInt(0) &&
                                                secondaryModifier.valid_class ===
                                                "error_check"
                                                ? "success_check"
                                                : "success_check",
                                            is_modifier_selected: true,
                                            secondary_items_modifier_items:
                                                secondaryModifier?.secondary_items_modifier_items?.map(
                                                (secondaryItem) => {
                                                    if (
                                                    secondaryItemId === secondaryItem?.id
                                                    ) {
                                                    return {
                                                        ...secondaryItem,
                                                        activeClass: "nv",
                                                        is_item_select: true,
                                                        item_select_to_sale: true,
                                                    };
                                                    }

                                                    return {
                                                    ...secondaryItem,
                                                    activeClass: "ob",
                                                    is_item_select: false,
                                                    item_select_to_sale: false,
                                                    };
                                                }
                                                ),
                                            };
                                        }
                                        return secondaryModifier;
                                    }),
                                    // activeClass: "nv",
                                    // is_item_select: true
                                };
                            }
                            return item;
                            // return{
                            //     ...secondItems,
                            //     activeClass: "ob",
                            //     is_item_select: false
                            // }
                        }
                        ),
                    };
                }

                return modifier;
            }),
            defaultOption: defaultOption
        };
    
    
        for (const updateItemModifier of updateItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        for (const updateSecondaryModifier of updateItemModifierItem?.secondary_item_modifiers) {
                            if (updateSecondaryModifier?.id === secondaryModifierId) {
                                for (const updateSecondaryItem of updateSecondaryModifier?.secondary_items_modifier_items) {
                                    if (updateSecondaryItem?.id === secondaryItemId) {
                                        const newTotalPlus =parseFloat(totalAmount) + parseFloat(updateSecondaryItem?.price_info);
                                        totalAmount = newTotalPlus;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                singleItem: updateItem,
                selectedModifierItemPrice: parseFloat(totalAmount).toFixed(2),
            }
        })
    },[singleItem, selectedModifierItemPrice]);
    
    const handleModalCheckInput = useCallback((modifierId, itemId, secondaryModifierId, secondaryItemId) => {

        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((item) => {
                            if (itemId === item?.id) {
                                return {
                                    ...item,
                                    secondary_item_modifiers:
                                    item?.secondary_item_modifiers?.map((secondaryModifier) => {
                                            if (secondaryModifierId === secondaryModifier?.id) {
                                                return {
                                                    ...secondaryModifier,
                                                    secondary_items_modifier_items:secondaryModifier?.secondary_items_modifier_items?.map((secondaryItem) => {
                                                        if (secondaryItemId === secondaryItem?.id) {
                                                            return {
                                                                ...secondaryItem,
                                                                activeClass: secondaryItem.activeClass === "mche" || secondaryItem.activeClass === "mchw" ? "mch" : "mche",
                                                                is_item_select: secondaryItem.is_item_select === true ? false : true,
                                                                item_select_to_sale: secondaryItem.item_select_to_sale === true ? false : true,
                                                            };
                                                        }

                                                        return {
                                                            ...secondaryItem,
                                                            activeClass: secondaryItem.activeClass === "mche" || secondaryItem.activeClass === "mchw" ? "mche" : "mch",
                                                            is_item_select: secondaryItem.is_item_select === false ? false : true,
                                                            item_select_to_sale: secondaryItem.item_select_to_sale === false ? false : true,
                                                        };
                                                    }),
                                                };
                                            }
                                            return secondaryModifier;
                                        }
                                    ),
                                    // activeClass: "nv",
                                    // is_item_select: true
                                };
                            }
                            return item;
                            // return{
                            //     ...seconditems,
                            //     activeClass: "ob",
                            //     is_item_select: false
                            // }
                        }
                        ),
                    };
                }

                return modifier;
            }),
        };

        let countItemSelected = 0;
        for (const countModifier of updateItem.modifier_group) {
            if (modifierId === countModifier?.id) {
                if (parseInt(countModifier?.modifier_secondary_items.length) > parseInt(0)) {
                    for (const secondItem of countModifier?.modifier_secondary_items) {
                        if (itemId === secondItem?.id) {
                            if (parseInt(secondItem?.secondary_item_modifiers.length) > parseInt(0)) {
                                for (const secondModifier of secondItem?.secondary_item_modifiers) {
                                    if (secondaryModifierId === secondModifier?.id) {
                                        if (parseInt(secondModifier?.secondary_items_modifier_items.length) > parseInt(0)) {
                                            for (const secondModifierItems of secondModifier?.secondary_items_modifier_items) {
                                                if (secondModifierItems?.is_item_select) {
                                                    countItemSelected += 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const makeModifierSelected = {
            ...updateItem,
            modifier_group: updateItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItem) => {
                            if (itemId === secondItem.id) {
                                return {
                                    ...secondItem,
                                    secondary_item_modifiers:
                                    secondItem?.secondary_item_modifiers?.map((secondModifier) => {
                                        if (secondaryModifierId === secondModifier.id) {
                                            let addClass = secondModifier.valid_class;

                                            if (parseInt(countItemSelected) > parseInt(0)) {
                                                if (parseInt(secondModifier.min_permitted) > parseInt(0) && secondModifier.valid_class === "error_check") {
                                                    addClass = "success_check";
                                                }
                                            }

                                            return {
                                                ...secondModifier,
                                                is_modifier_selected:parseInt(countItemSelected) > parseInt(0) ? true : false,
                                                valid_class: addClass,
                                            };
                                        }

                                        return secondModifier;
                                        }
                                    ),
                                };
                            }
                            return secondItem;
                        }),
                    };
                }

                return modifier;
            }),
        };

        let totalAmount = selectedModifierItemPrice;
        for (const updateItemModifier of updateItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        for (const updateSecondaryModifier of updateItemModifierItem?.secondary_item_modifiers) {
                            if (updateSecondaryModifier?.id === secondaryModifierId) {
                                for (const updateSecondaryItem of updateSecondaryModifier?.secondary_items_modifier_items) {
                                    if (updateSecondaryItem?.id === secondaryItemId) {
                                        if (updateSecondaryItem?.activeClass === "mch") {
                                            const newTotalPlus = parseFloat(totalAmount) + parseFloat(updateSecondaryItem?.price_info);
                                            totalAmount = newTotalPlus;
                                        } else {
                                            const newTotalMinus = parseFloat(totalAmount) - parseFloat(updateSecondaryItem?.price_info);
                                            totalAmount = newTotalMinus;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                isHandleModalCheckInputClicked: true,
                selectedModifierItemPrice: parseFloat(totalAmount).toFixed(2),
                singleItem: makeModifierSelected,
                isHandleModalCheckInputParentModifierID: modifierId,
                isHandleModalCheckInputParentItemID: itemId,
                handleModalCheckModifierId: secondaryModifierId,
            }
        })
    // },[isHandleModalCheckInputParentModifierID,isHandleModalCheckInputParentItemID,handleModalCheckModifierId,singleItem,selectedModifierItemPrice,isHandleModalCheckInputClicked]);
    },[singleItem,selectedModifierItemPrice]);
    
    const handleModalIncrement = useCallback((modifierId, itemId, secondModifierId, secondItemId) => {

        const filterModifier = singleItem?.modifier_group?.find((modifier) => modifier?.id === modifierId)

        const filterItems = filterModifier?.modifier_secondary_items?.find((item) => item?.id === itemId)

        const filterNestedModifier = filterItems?.secondary_item_modifiers?.find((secondModifier) => secondModifier?.id === secondModifierId)

        if(filterNestedModifier?.select_single_option > 1 && filterNestedModifier?.max_permitted >= 1)
        {
            const nestedSecondItem = filterNestedModifier?.secondary_items_modifier_items?.reduce((total, secondItem) => {return (total += secondItem?.counter || 0)},0)
            if(filterNestedModifier?.max_permitted === nestedSecondItem)
            {
                return
            }
        }

        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => {
                            if (itemId === secondItems?.id) {
                                return {
                                    ...secondItems,
                                    secondary_item_modifiers: secondItems?.secondary_item_modifiers?.map((secondItemModifier) => 
                                    {
                                        if (secondModifierId === secondItemModifier?.id) 
                                        {
                                            return {
                                                ...secondItemModifier,
                                                // modifier_counter:1 + secondItemModifier?.modifier_counter,
                                                is_modifier_clickable: parseInt(secondItemModifier?.max_permitted) ===parseInt(secondItemModifier?.modifier_counter)? true: false,
                                                permitt_max: secondItemModifier.max_permitted,
                                                is_modifier_selected: true,
                                                valid_class: parseInt(secondItemModifier.min_permitted) >parseInt(0) && secondItemModifier.valid_class ==="error_check" ? "success_check" : "success_check",
                                                secondary_items_modifier_items: secondItemModifier?.secondary_items_modifier_items?.map((secondaryItem) => 
                                                {
                                                    if (secondItemId === secondaryItem?.id) {
                                                        return {
                                                            ...secondaryItem,
                                                            counter: (secondItemModifier?.select_single_option === secondaryItem.counter) ? secondaryItem.counter : 1 + secondaryItem.counter,
                                                            is_item_select: false,
                                                            item_select_to_sale: true,
                                                        };
                                                    }

                                                    return {
                                                        ...secondaryItem,
                                                        counter:secondaryItem.counter > 0 ? secondaryItem.counter: 0,
                                                        is_item_select:secondaryItem.is_item_select === true ? true: false,
                                                        item_select_to_sale:secondaryItem.item_select_to_sale ===true ? true : false,
                                                    };
                                                }),
                                            };
                                        }

                                        return secondItemModifier;
                                        }
                                    ),
                                };
                            }

                            return secondItems;
                            // return{
                            //     ...secondItems,
                            //     counter: (secondItems.counter > 0) ? secondItems.counter : 0,
                            //     is_item_select: (secondItems.is_item_select === true) ? true : false
                            // }
                        }),
                    };
                }

                return modifier;
            }),
        };

        let nestedModifierMaxPermitted = 0

        if(parseInt(updateItem?.modifier_group?.length) > parseInt(0))
        {
            for(const modifier of updateItem?.modifier_group)
            {   

                if(modifierId === modifier?.id)
                {
                    if(parseInt(modifier?.modifier_secondary_items?.length) > parseInt(0))
                    {
                        for(const item of modifier?.modifier_secondary_items)
                        {
                            if(itemId === item?.id)
                            {   
                                if(parseInt(item?.secondary_item_modifiers?.length) > parseInt(0))
                                {
                                    for(const secondModifier of item?.secondary_item_modifiers)
                                    {
                                        if(secondModifierId === secondModifier?.id)
                                        {
                                            if(parseInt(secondModifier?.secondary_items_modifier_items?.length) > parseInt(0))
                                            {
                                                for(const secondItem of secondModifier?.secondary_items_modifier_items)
                                                {
                                                    if(secondModifier.select_single_option === secondItem.counter)
                                                    {
                                                        nestedModifierMaxPermitted += 1
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const findModifier = updateItem?.modifier_group?.find((modi) => modifierId === modi?.id)

        const findProduct = findModifier?.modifier_secondary_items?.find((item) => itemId === item?.id)

        const findSecondModifier = findProduct?.secondary_item_modifiers?.find((secondModi) => secondModifierId === secondModi?.id)
        
        if(findSecondModifier?.max_permitted === nestedModifierMaxPermitted)
        {
            const updateNestedModifier = {
                ...updateItem,
                modifier_group: updateItem?.modifier_group?.map((modifier) => 
                {
                    if (modifierId === modifier?.id) 
                    {
                        return {
                            ...modifier,
                            modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => 
                            {
                                if (itemId === secondItems?.id) 
                                {
                                    return {
                                        ...secondItems,
                                        secondary_item_modifiers: secondItems?.secondary_item_modifiers?.map((secondItemModifier) => 
                                        {
                                            if (secondModifierId === secondItemModifier?.id) 
                                            {
                                                return {
                                                    ...secondItemModifier,
                                                    modifier_counter: nestedModifierMaxPermitted,
                                                };
                                            }
    
                                            return secondItemModifier;
                                        }),
                                    };
                                }
    
                                return secondItems;
                            }),
                        };
                    }
    
                    return modifier;
                }),
            };
            
            handleDisplayItemStates("singleItem", updateNestedModifier)
            return 
        }
        

        let totalAmount = selectedModifierItemPrice;
        for (const updateItemModifier of singleItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        for (const updateSecondaryModifier of updateItemModifierItem?.secondary_item_modifiers) {
                            if (updateSecondaryModifier?.id === secondModifierId) {
                                for (const updateSecondaryItem of updateSecondaryModifier?.secondary_items_modifier_items) {
                                    if (updateSecondaryItem?.id === secondItemId) {
                                        const newTotalPlus = parseFloat(totalAmount) + parseFloat(updateSecondaryItem?.price_info);
                                        totalAmount = newTotalPlus;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                selectedModifierItemPrice: parseFloat(totalAmount).toFixed(2),
                singleItem: updateItem
            }
        })

    },[singleItem, selectedModifierItemPrice]);
    
    const handleModalDecrement = useCallback((modifierId, itemId, secondModifierId, secondItemId) => {
        let totalAmount = selectedModifierItemPrice;

        for (const updateItemModifier of singleItem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.id === itemId) {
                        for (const updateSecondaryModifier of updateItemModifierItem?.secondary_item_modifiers) {
                            if (updateSecondaryModifier?.id === secondModifierId) {
                                for (const updateSecondaryItem of updateSecondaryModifier?.secondary_items_modifier_items) {
                                    if (updateSecondaryItem?.id === secondItemId) {
                                        if (updateSecondaryItem.counter > 0) {
                                            const newTotalMinus = parseFloat(totalAmount) -parseFloat(updateSecondaryItem?.price_info);
                                            totalAmount = newTotalMinus;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
    
        const updateItem = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => {
                            if (itemId === secondItems?.id) {
                                return {
                                    ...secondItems,
                                    secondary_item_modifiers: secondItems?.secondary_item_modifiers?.map((secondItemModifier) => {
                                        if (secondModifierId === secondItemModifier?.id) {
                                            return {
                                                ...secondItemModifier,
                                                modifier_counter: secondItemModifier?.modifier_counter > 0 ? secondItemModifier?.modifier_counter - 1 : 0,
                                                is_modifier_clickable: parseInt(secondItemModifier?.max_permitted) === parseInt(secondItemModifier?.modifier_counter) ? true : false,
                                                permitt_max: secondItemModifier.max_permitted,
                                                secondary_items_modifier_items: secondItemModifier?.secondary_items_modifier_items?.map((secondaryItem) => {
                                                    if (secondItemId === secondaryItem?.id) {
                                                        let getMobileDecrement = secondaryItem.counter > 0 ? secondaryItem.counter - 1 : 0;
                                                        return {
                                                            ...secondaryItem,
                                                            counter: secondaryItem.counter > 0 ? secondaryItem.counter - 1 : 0,
                                                            is_item_select: secondaryItem.counter > 0 ? false : true,
                                                            item_select_to_sale: getMobileDecrement > 0 ? true : false,
                                                        };
                                                    }

                                                    return {
                                                        ...secondaryItem,
                                                        counter: secondaryItem.counter > 0 ? secondaryItem.counter : 0,
                                                        is_item_select: secondaryItem.is_item_select === true ? true : false,
                                                        item_select_to_sale: secondaryItem.item_select_to_sale === true ? true : false,
                                                    };
                                                }),
                                            };
                                        }

                                        return secondItemModifier;
                                    }),
                                };
                            }

                            return secondItems;
                            // return{
                            //     ...secondItems,
                            //     counter: (secondItems.counter > 0) ? secondItems.counter : 0,
                            //     is_item_select: (secondItems.is_item_select === true) ? true : false
                            // }
                        }),
                    };
                }

                return modifier;
            }),
        };
    
        const updatedModifierSelected = {
            ...updateItem,
            modifier_group: updateItem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => {
                            if (itemId === secondItems?.id) {
                                return {
                                    ...secondItems,
                                    secondary_item_modifiers: secondItems?.secondary_item_modifiers?.map((secondItemModifier) => {
                                        if (secondModifierId === secondItemModifier?.id) {
                                            let addClass = secondItemModifier.valid_class;
                                            if (secondItemModifier?.modifier_counter === 0) {
                                                if (secondItemModifier.valid_class === "error_check") {
                                                    addClass = "success_check";
                                                } else {
                                                    addClass = "default_check";
                                                }
                                            }
                                            return {
                                                ...secondItemModifier,
                                                is_modifier_selected: parseInt(secondItemModifier?.modifier_counter) > parseInt(0) ? true : false,
                                                valid_class: addClass,
                                            };
                                        }

                                        return secondItemModifier;
                                    }),
                                };
                            }

                            return secondItems;
                        }),
                    };
                }

                return modifier;
            }),
        };

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                selectedModifierItemPrice: parseFloat(totalAmount).toFixed(2),
                singleItem: updatedModifierSelected
            }
        })
    },[selectedModifierItemPrice, singleItem]);
    
    const handleQuantity = useCallback((event) => {
        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                quantity: event.target.value
            }
        })
    },[quantity]);
    
    const handleSaveBtn = useCallback((modifierId, itemId) => {
        if (singleItem) {
            let countMinPermissionModifier = 0;
            for (const parentModifier of singleItem.modifier_group) {
                if (modifierId === parentModifier.id) {
                    for (const selectedItem of parentModifier.modifier_secondary_items) {
                        if (itemId === selectedItem.id) {
                            for (const childModi of selectedItem.secondary_item_modifiers) {
                                if (parseInt(childModi.min_permitted) > parseInt(0) && childModi?.is_modifier_selected === false) {
                                    countMinPermissionModifier += 1;
                                }
                            }
                        }
                    }
                }
            }

            if (parseInt(countMinPermissionModifier) > parseInt(0)) {
                let getTheCounter = 0;
                const updateNestModifierError = {
                    ...singleItem,
                    modifier_group: singleItem?.modifier_group?.map((modifier) => {
                        if (modifierId === modifier?.id) {
                            return {
                                ...modifier,
                                modifier_secondary_items:
                                modifier?.modifier_secondary_items?.map((secondItem) => {
                                    if (itemId === secondItem.id) {
                                        return {
                                            ...secondItem,
                                            secondary_item_modifiers:
                                            secondItem?.secondary_item_modifiers?.map((nestedModifier) => {
                                                let addClass = nestedModifier?.valid_class;
                                                if (parseInt(nestedModifier?.min_permitted) > parseInt(0) && nestedModifier.is_modifier_selected === false) 
                                                {
                                                    addClass = "error_check";
                                                    getTheCounter += 1;
                                                }

                                                return {
                                                    ...nestedModifier,
                                                    valid_class: addClass,
                                                };
                                            }),
                                        };
                                    }
                                    return secondItem;
                                }),
                            };
                        }
                        return modifier;
                    }),
                };

                const updateClassError = {
                    ...updateNestModifierError,
                    modifier_group: updateNestModifierError?.modifier_group?.map(
                        (updateModifierClass) => {
                        if (modifierId === updateModifierClass.id) {
                            return {
                            ...updateModifierClass,
                            valid_class:
                                getTheCounter > 0 ? "error_check" : "success_check",
                            };
                        }
                        return updateModifierClass;
                        }
                    ),
                };

                handleDisplayItemStates("singleItem" ,updateClassError)
            } else {
                const newTotal = parseFloat(itemPrice) + parseFloat(selectedModifierItemPrice);

                const updateSecondaryItemPriceTotal = {
                    ...singleItem,
                    modifier_group: singleItem?.modifier_group?.map((modifier) => {
                        if (modifierId === modifier?.id) {
                        return {
                            ...modifier,
                            is_modifier_selected: true,
                            valid_class: "success_check",
                            modifier_secondary_items:
                            modifier?.modifier_secondary_items?.map((secondItems) => {
                                if (itemId === secondItems?.id) {
                                return {
                                    ...secondItems,
                                    total_price: parseFloat(selectedModifierItemPrice),
                                };
                                }

                                return secondItems;
                            }),
                        };
                        }

                        return modifier;
                    }),
                };

                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        isModifierClicked: false,
                        singleItem: updateSecondaryItemPriceTotal,
                        itemPrice: parseFloat(newTotal).toFixed(2)
                    }
                })
            }
        }
    },[isModifierClicked, singleItem, itemPrice]);
    
    useEffect(() => {
        if (isHandleCheckInputClicked) {
            const filterModifier = singleItem?.modifier_group?.find((modifier) => handleCheckModifierId === modifier?.id);

            const countNumberOfCheck = filterModifier?.modifier_secondary_items?.filter((item) => item.is_item_select === true);

            const updateCheckBox = {
                ...singleItem,
                modifier_group: singleItem?.modifier_group?.map((modifier) => {
                    if (handleCheckModifierId === modifier?.id) {
                        return {
                            ...modifier,
                            modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItems) => 
                            {
                                if (
                                    parseInt(modifier?.max_permitted) ===
                                    parseInt(countNumberOfCheck?.length) &&
                                    secondItems?.activeClass !== "mch"
                                ) {
                                    return {
                                        ...secondItems,
                                        activeClass: "mchw",
                                        is_item_select: false,
                                    };
                                }

                                return secondItems;
                            }),
                        };
                    }

                    return modifier;
                }),
            };
          
            setDisplaySingleItemObject((prevData) => {
                return{
                    ...prevData,
                    singleItem: updateCheckBox,
                    isHandleCheckInputClicked: false
                }
            })
        }
    }, [isHandleCheckInputClicked]);
    
    useEffect(() => {
        if (isHandleModalCheckInputClicked) {
            const filterModifier = singleItem?.modifier_group?.find((modifier) => modifier?.id === isHandleModalCheckInputParentModifierID);

            const filterItems = filterModifier?.modifier_secondary_items?.find((item) => item?.id === isHandleModalCheckInputParentItemID);
            const secondaryFilterModifier = filterItems?.secondary_item_modifiers?.find((secondaryModifier) =>secondaryModifier?.id === handleModalCheckModifierId);

            const countNumberOfCheckSecondaryItems = secondaryFilterModifier?.secondary_items_modifier_items?.filter((secondaryItem) => secondaryItem?.is_item_select === true);

            const updateSingleItems = {
                ...singleItem,
                modifier_group: singleItem?.modifier_group?.map((modifier) => {
                    if (isHandleModalCheckInputParentModifierID === modifier?.id) {
                        return {
                            ...modifier,
                            modifier_secondary_items: modifier?.modifier_secondary_items?.map((item) => {
                                if (isHandleModalCheckInputParentItemID === item?.id) {
                                    return {
                                        ...item,
                                        secondary_item_modifiers:
                                        item?.secondary_item_modifiers?.map((secondaryModifier) => {
                                            if (handleModalCheckModifierId === secondaryModifier?.id) {
                                                return {
                                                ...secondaryModifier,
                                                secondary_items_modifier_items: secondaryModifier?.secondary_items_modifier_items?.map((secondaryItems) => {
                                                        if (parseInt(secondaryModifier?.max_permitted) === parseInt(countNumberOfCheckSecondaryItems.length) && secondaryItems?.activeClass !== "mch") {
                                                            return {
                                                                ...secondaryItems,
                                                                activeClass: "mchw",
                                                                is_item_select: false,
                                                            };
                                                        }
                                                        return secondaryItems;
                                                    }),
                                                };
                                            }
                                            return secondaryModifier;
                                        }),
                                    };
                                }

                                return item;
                            }
                            ),
                        };
                    }

                    return modifier;
                }),
            };

            setDisplaySingleItemObject((prevData) => {
                return{
                    ...prevData,
                    isHandleModalCheckInputClicked: false,
                    singleItem: updateSingleItems
                }
            })
        }
    }, [isHandleModalCheckInputClicked]);
    
    useEffect(() => {
        if(booleanObj?.isCustomerVerified === false) {
            // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
            const timeoutId = setTimeout(() => {
            // Clear all items in localStorage
                localStorage.clear();
                window.location.reload(true);
                window.location.href = "/"
                setTimeout(() => {
                    setLoader(false);
                }, 3000);
            }, 60 * 60 * 1000); 
        
            // Clear the timeout if the component is unmounted before 20 minutes
            return () => clearTimeout(timeoutId);
        }
    });
    
    async function storeAddToBasketClicked() {
        try {

            const visitorInfo = JSON.parse(window.localStorage.getItem("userInfo"))

            const data = {
                visitorGUID: visitorInfo.visitorId
            }

            const response = await axiosPrivate.post('/store-add-to-basket', data)
        } catch (error) {
                
        }
    }
    // Website Cart Button
    const handleAddOrNextClickedToCart = useCallback((action) => {

        if (singleItem) {
            // Count the number of modifier is min_permit is greater than zero.
            
            if(action === "addToCart")
            {
                let countMinForOption1 = 0; // optionNumber 1, 
                let countMinForOption2 = 0
                storeAddToBasketClicked()
                if(displaySingleItemObject?.optionNumber === 1)
                {
                    for (const minPermit of singleItem?.modifier_group) {
                        
                        if(minPermit?.isExtras === false)
                        {
                            if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                                countMinForOption1 += 1;
                            }
                        }
                    }
                }
                else if(displaySingleItemObject?.optionNumber === 2)
                {
                    for (const minPermit of singleItem?.modifier_group) {

                        if(minPermit?.isExtras)
                        {
                            if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                                countMinForOption2 += 1;
                            }
                        }
                    }
                }

                if (parseInt(countMinForOption1) > parseInt(0)) {
                    let indexArrForOption1 = [];
                    const addErrorClassInModifier = {
                        ...singleItem,
                        modifier_group: singleItem?.modifier_group?.map((addErrorClass, index) => {
                            let addClass = addErrorClass?.valid_class;

                            if(optionNumber === 1 && addErrorClass?.isExtras === false)
                            {
                                if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) {
                                    addClass = "error_check";
                                    indexArrForOption1.push(index)
                                }
                            }
    
                            return {
                                ...addErrorClass,
                                valid_class: addClass,
                            };
                        }),
                    };
    
                    handleDisplayItemStates("singleItem", addErrorClassInModifier)

                    if (indexArrForOption1.length > 0) {
                        for (let indexArr = 0;indexArr < indexArrForOption1.length;indexArr++) {
                            
                            if (indexArr === 0) {
                                
                                let element = document.querySelector(`.section${indexArrForOption1[indexArr]}`);
                                if(element !== null)
                                {
                                    element?.scrollIntoView({ behavior: "smooth" });
                                    return;
                                }
                            }
                        }
                    }
                }
                else if(parseInt(countMinForOption2) > parseInt(0))
                {
                    let indexArrForOption2 = [];

                    const addErrorClassInModifier = {
                        ...singleItem,
                        modifier_group: singleItem?.modifier_group?.map((addErrorClass, index) => {
                            let addClass = addErrorClass?.valid_class;
                            if(optionNumber === 2 && addErrorClass?.isExtras)
                            {
                                if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) {
                                    addClass = "error_check";
                                    indexArrForOption2.push(index)
                                }
                            }
    
                            return {
                                ...addErrorClass,
                                valid_class: addClass,
                            };
                        }),
                    };
    
                    handleDisplayItemStates("singleItem", addErrorClassInModifier)

                    if (indexArrForOption2.length > 0) {
                        for (let indexArr = 0;indexArr < indexArrForOption2.length;indexArr++) {
                            
                            if (indexArr === 0) {
                                
                                let element = document.querySelector(`.section${indexArrForOption2[indexArr]}`);
                                if(element !== null)
                                {
                                    element?.scrollIntoView({ behavior: "smooth" });
                                    return;
                                }
                            }
                        }
                    }
                }
                else
                {
                    if(params?.edit)
                    {
                        // const filterCartFirst = cartData?.filter((cart, index) => index !== JSON.parse(removeIndex));
                        const filterCartFirst = cartData?.filter((cart) => !cart?.slug?.includes(params?.product));
                        setCartData(filterCartFirst);
                    }
    
                    setLoader(true);
                    const addTotalAmount = {
                        ...singleItem,
                        total_order_amount: parseFloat(quantity * itemPrice).toFixed(2),
                        price_total_without_quantity: parseFloat(itemPrice).toFixed(2),
                        quantity: parseInt(quantity),
                        is_cart_modal_clicked: false,
                    };
    
                    setCartData((prevData) => [...prevData, addTotalAmount]);
                    // router.push("/");
                    window.location.href = "/";
                    // setIsCartBtnClicked(true);
                    setIsCartBtnClicked(false);
                }
            }
            else if(action === "next")
            {
                let countMinForIsExtrasTrue = 0; // optionNumber 1, isAnyModifierHasExtras optionNumber
                for (const minPermit of singleItem?.modifier_group) {
                    if(minPermit?.isExtras === false)
                    {
                        if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                            countMinForIsExtrasTrue += 1;
                        }
                    }
                }
    
                let indexArrForNextButton = [];
    
                if (parseInt(countMinForIsExtrasTrue) > parseInt(0)) {
                    const addErrorClassInModifier = {
                        ...singleItem,
                        modifier_group: singleItem?.modifier_group?.map((addErrorClass, index) => {
                            let addClass = addErrorClass?.valid_class;
                            if(addErrorClass?.isExtras === false)
                            {
                                if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) {
                                    addClass = "error_check";
                                    indexArrForNextButton.push(index)
                                }
                            }
    
                            return {
                                ...addErrorClass,
                                valid_class: addClass,
                            };
                        }),
                    };
    
                    handleDisplayItemStates("singleItem", addErrorClassInModifier)
                }
                
                if (indexArrForNextButton.length > 0) {
                    for (let indexArr = 0;indexArr < indexArrForNextButton.length;indexArr++) {
                        
                        if (indexArr === 0) {
                            
                            let element = document.querySelector(`.section${indexArrForNextButton[indexArr]}`);
                            if(element !== null)
                            {
                                element?.scrollIntoView({ behavior: "smooth" });
                                return;
                            }
                        }
                    }
                }
                

                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        optionNumber: 2,
                        isAnyModifierHasExtras: false,
                    }
                })
            }
            else if(action === "back")
            {
                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        optionNumber: 1,
                        isAnyModifierHasExtras: true,
                    }
                })
            }
        }
    }, [singleItem, optionNumber,cartData, isCartBtnClicked,quantity]);    
    
    const handleMobileAddToCart = useCallback((action) => {
        if (singleItem) {
            // Count the number of modifier is min_permit is greater than zero.
            if(action === "addToCart")
            {
                let countMinForCart = 0;
                let countMinForCartOption2 = 0;

                for (const minPermit of singleItem?.modifier_group) {
                    if(optionNumber === 2 && minPermit?.isExtras)
                    {
                        if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                            countMinForCartOption2 += 1;
                        }
                    }
                    else if(optionNumber === 1 && minPermit?.isExtras === false)
                    {
                        if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                            countMinForCart += 1;
                        }
                    }
                }
    
                let indexArrForScrollOption2 = [];
                let indexArrForOptionOne = []

                storeAddToBasketClicked()

                if (parseInt(countMinForCart) > parseInt(0)) {
                    const addErrorClassInModifier = {
                        ...singleItem,
                        modifier_group: singleItem?.modifier_group?.map((addErrorClass, index) => {
                            let addClass = addErrorClass?.valid_class;
                            if(optionNumber === 1 && addErrorClass?.isExtras === false )
                            {
                                if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) 
                                {
                                    addClass = "error_check";
                                    indexArrForOptionOne.push(index);
                                }
                            }
    
                            return {
                                ...addErrorClass,
                                valid_class: addClass,
                            };
                        }),
                    };
    
                    handleDisplayItemStates("singleItem", addErrorClassInModifier)
                } 
                else if(parseInt(countMinForCartOption2) > parseInt(0))
                {
                    const addErrorClassInModifier = {
                        ...singleItem,
                        modifier_group: singleItem?.modifier_group?.map((addErrorClass, index) => {
                            let addClass = addErrorClass?.valid_class;
                            if(addErrorClass?.isExtras)
                            {
                                if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) 
                                {
                                    addClass = "error_check";
                                    indexArrForScrollOption2.push(index);
                                }
                            }
    
                            return {
                                ...addErrorClass,
                                valid_class: addClass,
                            };
                        }),
                    };
    
                    handleDisplayItemStates("singleItem", addErrorClassInModifier)
                }
                else {
    
                    setLoader(true);
    
                    if(params?.edit)
                    {
                        const filterCartFirst = cartData?.filter((cart) => !cart?.slug?.includes(params?.product));
                        setCartData(filterCartFirst);
                    }
    
                    const addTotalAmount = {
                        ...singleItem,
                        total_order_amount: parseFloat(quantity * itemPrice).toFixed(2),
                        price_total_without_quantity: parseFloat(itemPrice).toFixed(2),
                        quantity: parseInt(quantity),
                        is_cart_modal_clicked: false,
                    };
                    setCartData((prevData) => [...prevData, addTotalAmount]);
                    // router.push("/");
                    window.location.href = "/";
                    // setIsCartBtnClicked(true);
                    setIsCartBtnClicked(false);
                }
                
                if(optionNumber === 2)
                {
                    if (indexArrForScrollOption2.length > 0) {
                        for (let indexArr = 0;indexArr < indexArrForScrollOption2.length;indexArr++) 
                        {
                            if (indexArr === 0) {
                                let element = document.querySelector(`.msection${indexArrForScrollOption2[indexArr]}`);
                                element.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start", // Adjust to 'center' or 'end' if needed
                                    inline: "nearest",
                                });
                                element.offsetTop;
                                let elementCross = document.querySelector(".ctascusingle-product");
        
                                elementCross.style.position = "absolute";
                                return;
                            }
                        }
                    }
                }
                else if(optionNumber === 1)
                {
                    if (indexArrForOptionOne.length > 0) {
                        for (let indexArr = 0;indexArr < indexArrForOptionOne.length;indexArr++) 
                        {
                            if (indexArr === 0) {
                                let element = document.querySelector(`.msection${indexArrForOptionOne[indexArr]}`);
                                element.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start", // Adjust to 'center' or 'end' if needed
                                    inline: "nearest",
                                });
                                element.offsetTop;
                                let elementCross = document.querySelector(".ctascusingle-product");
        
                                elementCross.style.position = "absolute";
                                return;
                            }
                        }
                    }
                }
                setIsCartBtnClicked(true)
            }
            else if(action === "next")
            {
                let countNextForExtrasFalse = 0;
                for (const minPermit of singleItem?.modifier_group) {
                    if(minPermit?.isExtras === false)
                    {
                        if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                            countNextForExtrasFalse += 1;
                        }
                    }
                }
    
                let indexArrForScroll = [];
    
                if (parseInt(countNextForExtrasFalse) > parseInt(0)) {
                    const addErrorClassInModifier = {
                        ...singleItem,
                        modifier_group: singleItem?.modifier_group?.map((addErrorClass, index) => {
                            let addClass = addErrorClass?.valid_class;
                            if(addErrorClass?.isExtras === false)
                            {
                                if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) 
                                {
                                    addClass = "error_check";
                                    indexArrForScroll.push(index);
                                }
                            }
    
                            return {
                                ...addErrorClass,
                                valid_class: addClass,
                            };
                        }),
                    };
    
                    handleDisplayItemStates("singleItem", addErrorClassInModifier)
                }
    
                if (indexArrForScroll.length > 0) {
                    for (let indexArr = 0;indexArr < indexArrForScroll.length;indexArr++) 
                    {
                        if (indexArr === 0) {
                            let element = document.querySelector(`.msection${indexArrForScroll[indexArr]}`);
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "start", // Adjust to 'center' or 'end' if needed
                                inline: "nearest",
                            });
                            element.offsetTop;
                            let elementCross = document.querySelector(".ctascusingle-product");
    
                            elementCross.style.position = "absolute";
                            return;
                        }
                    }
                }
                
                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        optionNumber: 2,
                        isAnyModifierHasExtras: false,
                    }
                })
            }else if(action === "back")
            {
                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        optionNumber: 1,
                        isAnyModifierHasExtras: true,
                    }
                })
            }
           
        }
    }, [singleItem,optionNumber, cartData, isCartBtnClicked,quantity]);
    
    // Mobile Decrement quantity
    const handleMobileQuantityDecrement = useCallback(() => {

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                quantity: (prevData.quantity) > 0 && prevData?.quantity - 1
            }
        })
    }, [quantity]);
    
    const handleMobileQuantityIncrement = useCallback(() => {
    
        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                quantity: prevData.quantity + 1
            }
        })
    }, [quantity]);
    
    const handleMobileModifierToggle = useCallback((modifierId) => {
        const updateModifierToggle = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifierToggle) => {
              if (modifierId === modifierToggle?.id) {
                return {
                  ...modifierToggle,
                  is_toggle_active: !modifierToggle?.is_toggle_active,
                };
              }
              return modifierToggle;
            }),
        };
    
        handleDisplayItemStates("singleItem", updateModifierToggle)
    },[singleItem]);
    
    const handleModalModifierToggle = useCallback((modifierId, itemId, secondModifierId) => {

        let defaultOption = false

        const updateSecondaryModifierToggle = {
            ...singleItem,
            modifier_group: singleItem?.modifier_group?.map((modifierToggle) => {
                if (modifierId === modifierToggle?.id) {
                    return {
                        ...modifierToggle,
                        modifier_secondary_items: modifierToggle?.modifier_secondary_items?.map((secondItem) => 
                        {
                            if (itemId === secondItem?.id) {
                                defaultOption = secondItem?.default_option
                                return {
                                    ...secondItem,
                                    secondary_item_modifiers: secondItem?.secondary_item_modifiers?.map((secondaryModifier) => 
                                    {
                                        if (secondModifierId === secondaryModifier?.id) {
                                            return {
                                                ...secondaryModifier,
                                                is_second_item_modifier_clicked: !secondaryModifier?.is_second_item_modifier_clicked,
                                            };
                                        }
                                        return secondaryModifier;
                                    }),
                                };
                            }
                            return secondItem;
                        }),
                        defaultOption: defaultOption,
                    };
                }
                return {
                    ...modifierToggle,
                    defaultOption: defaultOption,
                };
            }),
        };
        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                singleItem: updateSecondaryModifierToggle,
            }
        } )
    },[singleItem]);
    
    const handleBackArrow = useCallback((modifierId, itemId) => {
        if (singleItem) 
        {
            let countMinPermissionModifier = 0;
            for (const parentModifier of singleItem.modifier_group) {
                if (modifierId === parentModifier.id) {
                    for (const selectedItem of parentModifier.modifier_secondary_items) {
                        if (itemId === selectedItem.id) {
                            for (const childModi of selectedItem.secondary_item_modifiers) {
                                if (parseInt(childModi.min_permitted) > parseInt(0) && childModi?.is_modifier_selected === false) {
                                    countMinPermissionModifier += 1;
                                }
                            }
                        }
                    }
                }
            }

            if (parseInt(countMinPermissionModifier) > parseInt(0)) {
                let getTheCounter = 0;
                const updateNestModifierError = {
                    ...singleItem,
                    modifier_group: singleItem?.modifier_group?.map((modifier) => {
                        if (modifierId === modifier?.id) {
                            return {
                                ...modifier,
                                modifier_secondary_items: modifier?.modifier_secondary_items?.map((secondItem) => 
                                {
                                    if (itemId === secondItem.id) 
                                    {
                                        return {
                                            ...secondItem,
                                            secondary_item_modifiers:
                                            secondItem?.secondary_item_modifiers?.map((nestedModifier) => 
                                            {
                                                let addClass = nestedModifier?.valid_class;
                                                if (parseInt(nestedModifier?.min_permitted) > parseInt(0) && nestedModifier.is_modifier_selected === false) 
                                                {
                                                    addClass = "error_check";
                                                    getTheCounter += 1;
                                                }

                                                return {
                                                    ...nestedModifier,
                                                    valid_class: addClass,
                                                };
                                            }),
                                        };
                                    }
                                    return secondItem;
                                }),
                            };
                        }
                        return modifier;
                    }),
                };

                const updateClassError = {
                    ...updateNestModifierError,
                    modifier_group: updateNestModifierError?.modifier_group?.map((updateModifierClass) => 
                    {
                        if (modifierId === updateModifierClass.id) {
                            return {
                                ...updateModifierClass,
                                valid_class: getTheCounter > 0 ? "error_check" : "success_check",
                                is_modifier_selected: getTheCounter > 0 ? false : true,
                                modifier_secondary_items: updateModifierClass?.modifier_secondary_items?.map((item) => {
                                    if(itemId === item?.id)
                                    {
                                        return {
                                            ...item,
                                            secondary_item_modifiers: item?.secondary_item_modifiers?.map((secondModi) => {

                                                if(secondModi?.select_single_option === 1 && secondModi?.min_permitted === 1 && secondModi?.max_permitted === 1)
                                                {
                                                    return {
                                                        ...secondModi,
                                                        is_second_item_modifier_clicked: false,
                                                        is_modifier_selected: false,
                                                        secondary_items_modifier_items: secondModi?.secondary_items_modifier_items?.map((secondItem) => {
                                                            return{
                                                                ...secondItem,
                                                                activeClass: "ob",
                                                                is_item_select: false,
                                                                is_item_selected: false,
                                                                item_select_to_sale: false
                                                            }
                                                        })
                                                    }
                                                }
                                                else if(secondModi?.select_single_option === 1 && secondModi?.max_permitted > 1)
                                                {
                                                    return {
                                                        ...secondModi,
                                                        is_modifier_clickable: false,
                                                        is_modifier_selected: false,
                                                        is_second_item_modifier_clicked: true,
                                                        modifier_counter: 0,
                                                        secondary_items_modifier_items: secondModi?.secondary_items_modifier_items?.map((secondItem) => {
                                                            return{
                                                                ...secondItem,
                                                                activeClass: "mche",
                                                                is_item_select: false,
                                                                is_item_selected: false,
                                                                item_select_to_sale: false
                                                            }
                                                        })
                                                    }
                                                }
                                                else if(secondModi?.select_single_option > 1 && secondModi?.max_permitted >= 1)
                                                {
                                                    return {
                                                        ...secondModi,
                                                        is_modifier_clickable: false,
                                                        is_modifier_selected: false,
                                                        is_second_item_modifier_clicked: false,
                                                        modifier_counter: 0,
                                                        secondary_items_modifier_items: secondModi?.secondary_items_modifier_items?.map((secondItem) => {
                                                            return{
                                                                ...secondItem,
                                                                counter: 0,
                                                                is_item_select: true,
                                                                is_item_selected: false,
                                                                item_select_to_sale: false
                                                            }
                                                        })
                                                    }
                                                }
                                              
                                            })
                                        }
                                    }

                                    return item
                                })
                                
                            };
                        }
                        return updateModifierClass;
                    }),
                };

                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        singleItem: updateClassError,
                    }
                } )
            } else {
                let totalSubAmount = 0;
                if (singleItem) {
                    for (const modifier of singleItem?.modifier_group) {
                        if (modifierId === modifier.id) {
                            for (const itemTotal of modifier.modifier_secondary_items) {
                                if (itemId === itemTotal.id) 
                                {
                                    totalSubAmount = itemTotal.total_price;
                                }
                            }
                        }
                    }
                }
                const newTotal = parseFloat(itemPrice) + parseFloat(totalSubAmount);
                setDisplaySingleItemObject((prevData) => {
                    return{
                        ...prevData,
                        isModifierClicked: false,
                        itemPrice: parseFloat(newTotal).toFixed(2)
                    }
                } )
            }
        }

        setDisplaySingleItemObject((prevData) => {
            return{
                ...prevData,
                isModifierClicked: false,
            }
        } )
    },[singleItem, isModifierClicked, itemPrice]);

    return(
    <>
        <Header />

        <div className="hidden lg:block">
            <WebsiteSingleItem
                {
                    ...{
                        quantity,
                        itemPrice,
                        singleItem,
                        checkPromotionActive,
                        getPromotionText,
                        getPromotionBgColor,
                        getPromotionTextColor,
                        optionNumber,
                        isAnyModifierHasExtras,

                        handleQuantity,
                        handleDecrement,
                        handleIncrement,
                        handleRadioInput,
                        handleCheckInput,
                        websiteModificationData,
                        handleDisplayItemStates,
                        handleAddOrNextClickedToCart,
                        handleMobileQuantityDecrement,
                        handleMobileQuantityIncrement,
                    }
                }
            />
        </div>

        {/* Mobile Responsive */}
        <div className="block lg:hidden">
            <MobileSingleItem
                {
                    ...{
                        singleItem,
                        checkPromotionActive,
                        getPromotionText,
                        getPromotionBgColor,
                        getPromotionTextColor,

                        quantity,
                        itemPrice,
                        handleRadioInput,
                        handleMScroll,
                        handleCheckInput,
                        handleMobileModifierToggle,
                        handleDecrement,
                        handleIncrement,
                        handleMobileQuantityDecrement,
                        handleMobileQuantityIncrement,
                        handleMobileAddToCart,
                        websiteModificationData,
                        isAnyModifierHasExtras,
                        optionNumber,
                    }
                }
            />
        </div>

            {/* If a modifier item has nested modifiers */}
        {
            isModifierClicked && 
            <NestedModifiers
                {
                    ...{
                        singleItem,
                        selectedModifierId,
                        selectedModifierItemId,
                        selectedModifierItemPrice,

                        handleSaveBtn,
                        handleBackArrow,
                        handleModalIncrement,
                        handleModalDecrement,
                        handleModalCheckInput,
                        handleModalRadioInput,
                        websiteModificationData,
                        handleDisplayItemStates,
                        handleModalModifierToggle,
                    }   
                }
            />
        }
        <Footer />
    </>)
}
