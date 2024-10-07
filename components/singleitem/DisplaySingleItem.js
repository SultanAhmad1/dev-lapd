import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "../Header";
import { NestedModifiers } from "../NestedModifiers";
import { useRouter } from "next/navigation";
import HomeContext from "@/contexts/HomeContext";
import moment from "moment";
import { WebsiteSingleItem } from "../WebsiteSingleItem";
import { MobileSingleItem } from "../MobileSingleItem";
import { axiosPrivate, BRAND_GUID, BRANDSIMPLEGUID, PARTNER_ID } from "@/global/Axios";
import { setLocalStorage } from "@/global/Store";

export default function DisplaySingleItem({params}) 
{
    const router = useRouter();

    const {
        setLoader,
        loader,
        storeGUID,
        setBrandlogo,
        iscartbtnclicked,
        setIscartbtnclicked,
        setCartdata,
        cartdata,
        dayOpeningClosingTime,
        setIsTimeToClosed,
        booleanObj,
    } = useContext(HomeContext);

      // const {setIsitemclicked, handleInput} = useContext(HomeContext)
    const [isitemclicked, setIsitemclicked] = useState(false);
    const [ismodifierclicked, setIsmodifierclicked] = useState(false);

    const [singleitem, setSingleitem] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [itemprice, setItemprice] = useState(0);

    const [selectedModifierId, setselectedModifierId] = useState(0);
    const [selectedModifierItemId, setSelectedModifierItemId] = useState(0);
    const [selectedModifierItemPrice, setSelectedModifierItemPrice] = useState(0);

    const [ishandlecheckinputclicked, setIshandlecheckinputclicked] = useState(false);
    const [handleCheckModifierId, setHandleCheckModifierId] = useState(0);

    const [ishandlemodalcheckinputparentmodifierID,setIshandlemodalcheckinputparentmodifierID,] = useState(0);
    const [ishandlemodalcheckinputparentitemID,setIshandlemodalcheckinputparentitemID,] = useState(0);
    const [ishandlemodalcheckiputclicked, setIshandlemodalcheckiputclicked] = useState(false);
    const [handlemodalcheckmodifierid, setHandlemodalcheckmodifierid] = useState(0);
    
    const filterItem = async () => {
        try {
            const getStoreIDFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}user_selected_store`));

            const data = {
                location: getStoreIDFromLocalStorage !== null ? getStoreIDFromLocalStorage?.display_id : storeGUID,
                brand: BRAND_GUID,
                partner: PARTNER_ID,
            };
        
            const response = await axiosPrivate.post(`/menu`, data);

            console.log("Filter Item response:", response);
            
            const convertToJSobj = response.data?.data?.menu.menu_json_log;
        
            const getSingleCategory = convertToJSobj?.categories?.find((category) => category.slug === params.category);
        
            const getItemFromCategory = getSingleCategory?.items?.find((item) => item.slug === params.product);
        
            const updateModifier = getItemFromCategory?.modifier_group?.map((modifier) => 
            {
                // if (modifier?.select_single_option === 1 && modifier?.min_permitted === 1 && modifier?.max_permitted === 1) 
                if (modifier?.min_permitted === 1 && modifier?.max_permitted === 1) 
                {
                    const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifieritem) => 
                        {
                            if (parseInt(modifieritem?.secondary_item_modifiers.length) > parseInt(0)) {
                                const updateNestedItems = modifieritem?.secondary_item_modifiers?.map((secondItemModifier) => 
                                {
                                if (secondItemModifier?.min_permitted === 1 && secondItemModifier?.max_permitted === 1) 
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
                
                                    return {
                                    ...secondItemModifier,
                                    valid_class: "default_check",
                                    is_second_item_modifier_clicked: true,
                                    is_modifier_selected: false,
                                    secondary_items_modifier_items: updateSecondaryItemModifierItem,
                                    };
                                } 
                                else 
                                // if (secondItemModifier?.select_single_option === 1 && secondItemModifier?.min_permitted === 0 && secondItemModifier?.max_permitted >= 1) 
                                if (secondItemModifier?.max_permitted >= 1) 
                                {
                                    const updateSecondaryItemModifierItem = secondItemModifier?.secondary_items_modifier_items?.map((secondItemModiItem) => 
                                    {
                                    return {
                                        ...secondItemModiItem,
                                        activeClass: "mche",
                                        // total_price: secondItemModiItem?.price_info,
                                        total_price: 0,
                                        is_item_select: false,
                                        item_select_to_sale: false,
                                    };
                                    });
                
                                    return {
                                    ...secondItemModifier,
                                    valid_class: "default_check",
                                    modifier_counter: 0,
                                    is_modifier_clickable: false,
                                    is_second_item_modifier_clicked: true,
                                    is_modifier_selected: false,
                                    secondary_items_modifier_items:
                                        updateSecondaryItemModifierItem,
                                    };
                                }
                                //  else {
                                //   const updateSecondaryItemModifierItem =
                                //     secondItemModifier?.secondary_items_modifier_items?.map(
                                //       (secondItemModiItem) => {
                                //         return {
                                //           ...secondItemModiItem,
                                //           counter: 0,
                                //           // total_price: secondItemModiItem?.price_info,
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
                                //     secondary_items_modifier_items:
                                //       updateSecondaryItemModifierItem,
                                //   };
                                // }
                                });
                
                                return {
                                ...modifieritem,
                                activeClass: "ob",
                                is_item_select: false,
                                // total_price: modifieritem?.price,
                                total_price: 0,
                                secondary_item_modifiers: updateNestedItems,
                                item_select_to_sale: false,
                                };
                            }
                            return {
                                ...modifieritem,
                                activeClass: "ob",
                                // total_price: modifieritem?.price,
                                total_price: 0,
                                is_item_select: false,
                                item_select_to_sale: false,
                            };
                        });
                        return {
                            ...modifier,
                            valid_class: "default_check",
                            is_toggle_active: true,
                            is_modifier_selected: false,
                            modifier_secondary_items: modifier_secondary_items,
                        };
                    } 
                else if (modifier?.max_permitted >= 1) 
                {
                    const modifier_secondary_items = modifier?.modifier_secondary_items?.map((modifieritem) => {if (parseInt(modifieritem?.secondary_item_modifiers.length) > parseInt(0)) 
                    {
                        const updateNestedItems = modifieritem?.secondary_item_modifiers?.map((secondItemModifier) => 
                        {
                            if (secondItemModifier?.min_permitted === 1 && secondItemModifier?.max_permitted === 1) 
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
            
                                return {
                                    ...secondItemModifier,
                                    valid_class: "default_check",
                                    is_second_item_modifier_clicked: true,
                                    is_modifier_selected: false,
                                    secondary_items_modifier_items: updateSecondaryItemModifierItem,
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
            
                                return {
                                    ...secondItemModifier,
                                    valid_class: "default_check",
                                    modifier_counter: 0,
                                    is_modifier_clickable: false,
                                    is_second_item_modifier_clicked: true,
                                    is_modifier_selected: false,
                                    secondary_items_modifier_items:
                                    updateSecondaryItemModifierItem,
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
                            //     secondary_items_modifier_items:
                            //       updateSecondaryItemModifierItem,
                            //   };
                            // }
                        });
            
                        return {
                            ...modifieritem,
                            activeClass: "mche",
                            // total_price: modifieritem?.price,
                            total_price: 0,
                            is_item_select: false,
                            secondary_item_modifiers: updateNestedItems,
                            item_select_to_sale: false,
                        };
                    }
                        return {
                        ...modifieritem,
                        activeClass: "mche",
                        // total_price: modifieritem?.price,
                        total_price: 0,
                        is_item_select: false,
                        item_select_to_sale: false,
                        };
                    });
                    return {
                        ...modifier,
                        valid_class: "default_check",
                        is_toggle_active: true,
                        modifier_counter: 0,
                        is_modifier_clickable: false,
                        is_modifier_selected: false,
                        modifier_secondary_items: modifier_secondary_items,
                    };
                } 
                // else 
                // {
                //   const modifier_secondary_items =
                //     modifier?.modifier_secondary_items?.map((modifieritem) => {
                //       if (
                //         parseInt(modifieritem?.secondary_item_modifiers.length) >
                //         parseInt(0)
                //       ) {
                //         const updateNestedItems =
                //           modifieritem?.secondary_item_modifiers?.map(
                //             (secondItemModifier) => {
                //               if (
                //                 secondItemModifier?.select_single_option === 1 &&
                //                 secondItemModifier?.min_permitted === 1 &&
                //                 secondItemModifier?.max_permitted === 1
                //               ) {
                //                 const updateSecondaryItemModifierItem =
                //                   secondItemModifier?.secondary_items_modifier_items?.map(
                //                     (secondItemModiItem) => {
                //                       return {
                //                         ...secondItemModiItem,
                //                         activeClass: "ob",
                //                         total_price: 0,
                //                         is_item_select: false,
                //                         item_select_to_sale: false,
                //                       };
                //                     }
                //                   );
        
                //                 return {
                //                   ...secondItemModifier,
                //                   valid_class: "default_check",
                //                   is_second_item_modifier_clicked: true,
                //                   is_modifier_selected: false,
                //                   secondary_items_modifier_items:
                //                     updateSecondaryItemModifierItem,
                //                 };
                //               } else if (
                //                 secondItemModifier?.select_single_option === 1 &&
                //                 secondItemModifier?.min_permitted === 0 &&
                //                 secondItemModifier?.max_permitted >= 1
                //               ) {
                //                 const updateSecondaryItemModifierItem =
                //                   secondItemModifier?.secondary_items_modifier_items?.map(
                //                     (secondItemModiItem) => {
                //                       return {
                //                         ...secondItemModiItem,
                //                         total_price: 0,
                //                         activeClass: "mche",
                //                         is_item_select: false,
                //                         item_select_to_sale: false,
                //                       };
                //                     }
                //                   );
        
                //                 return {
                //                   ...secondItemModifier,
                //                   valid_class: "default_check",
                //                   modifier_counter: 0,
                //                   is_modifier_clickable: false,
                //                   is_second_item_modifier_clicked: true,
                //                   is_modifier_selected: false,
                //                   secondary_items_modifier_items:
                //                     updateSecondaryItemModifierItem,
                //                 };
                //               } else {
                //                 const updateSecondaryItemModifierItem =
                //                   secondItemModifier?.secondary_items_modifier_items?.map(
                //                     (secondItemModiItem) => {
                //                       return {
                //                         ...secondItemModiItem,
                //                         counter: 0,
                //                         total_price: 0,
                //                         is_item_select: true,
                //                         item_select_to_sale: false,
                //                       };
                //                     }
                //                   );
        
                //                 return {
                //                   ...secondItemModifier,
                //                   valid_class: "default_check",
                //                   modifier_counter: 0,
                //                   is_modifier_clickable: false,
                //                   is_second_item_modifier_clicked: true,
                //                   is_modifier_selected: false,
                //                   secondary_items_modifier_items:
                //                     updateSecondaryItemModifierItem,
                //                 };
                //               }
                //             }
                //           );
        
                //         return {
                //           ...modifieritem,
                //           counter: 0,
                //           is_item_select: true,
                //           // total_price: modifieritem?.price,
                //           total_price: 0,
                //           secondary_item_modifiers: updateNestedItems,
                //           item_select_to_sale: false,
                //         };
                //       }
                //       return {
                //         ...modifieritem,
                //         counter: 0,
                //         // total_price: modifieritem?.price,
                //         total_price: 0,
                //         is_item_select: true,
                //         item_select_to_sale: false,
                //       };
                //     });
                //   return {
                //     ...modifier,
                //     valid_class: "default_check",
                //     is_toggle_active: true,
                //     modifier_counter: 0,
                //     is_modifier_clickable: false,
                //     is_modifier_selected: false,
                //     modifier_secondary_items: modifier_secondary_items,
                //   };
                // }
            });
    
            getItemFromCategory.modifier_group = updateModifier;
        
            setSingleitem(getItemFromCategory);
            setItemprice(parseFloat(getItemFromCategory?.price).toFixed(2));
            setTimeout(() => {
                setLoader(false);
            }, 3000);
        } catch (error) {
            console.log("Filter response error:", error);
            
            setTimeout(() => {
                setLoader(false);
            }, 3000);
        }
    };
    
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

            const getIndex = window.localStorage.getItem(`${BRANDSIMPLEGUID}set_index`);
            const getCart = window.localStorage.getItem(`${BRANDSIMPLEGUID}cart`);
        
            const parseCart = JSON.parse(getCart);
            // const getFilterItem = parseCart?.find((cart, index) => index === JSON.parse(getIndex));
            const getFilterItem = parseCart?.find(cartItem => cartItem?.slug?.includes(params?.product))
            
            console.log("Get the filter item:", getFilterItem);
            
            setIscartbtnclicked(false)
            setSingleitem(getFilterItem)
            setQuantity(getFilterItem?.quantity)
            setItemprice(getFilterItem?.total_order_amount / getFilterItem?.quantity)
            return
        }
        else
        {
            filterItem();
        }
    }, [params]);
    
    const handleMScroll = (event) => {
        let element = document.querySelector(".ctascusingle-product");
        element.style.position = event.deltaY === 100 ? "absolute" : "sticky";
    };
    
    const handleRadioInput = useCallback((modifierId, itemId, itemName, secondaryItemModifierCounter) => {

        if (parseInt(secondaryItemModifierCounter) > parseInt(0)) {
            const findModifierItemNestedModifier = singleitem?.modifier_group?.find((modifier) => modifier?.id === modifierId);
            const findModifierItemNestedModifierItem = findModifierItemNestedModifier?.modifier_secondary_items?.find((item) => item?.id === itemId);
    
            setselectedModifierId(modifierId);
            setSelectedModifierItemId(itemId);
            setSelectedModifierItemPrice(parseFloat(findModifierItemNestedModifierItem?.total_price));
            setIsmodifierclicked(!ismodifierclicked);
        }
    
        let totalAmount = itemprice;
        for (const updateItemModifier of singleitem.modifier_group) {
            if (updateItemModifier?.id === modifierId) {
                for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
                    if (updateItemModifierItem?.is_item_select === true) {
                        const newTotalMinus = parseFloat(totalAmount) - parseFloat(updateItemModifierItem?.price) - parseFloat(updateItemModifierItem?.total_price);
                        totalAmount = newTotalMinus;
                    }
                }
            }
        }
    
        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        selected_item_name: itemName,
                        is_modifier_selected: true,
                        valid_class:
                        parseInt(modifier.min_permitted) > parseInt(0) &&
                        modifier.valid_class === "error_check" ? "success_check" : "success_check",
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => 
                        {
                            if (itemId === seconditems?.id) {
                                return {
                                    ...seconditems,
                                    activeClass: "nv",
                                    is_item_select: true,
                                    item_select_to_sale: true,
                                };
                            }
                            return {
                                ...seconditems,
                                activeClass: "ob",
                                is_item_select: false,
                                total_price: 0,
                                item_select_to_sale: false,
                                secondary_item_modifiers:seconditems?.secondary_item_modifiers?.map((secondaryModifier) => {
                                    return {
                                        ...secondaryModifier,
                                        secondary_items_modifier_items: secondaryModifier?.secondary_items_modifier_items?.map((secondaryItem) => {
                                            if (secondaryModifier?.select_single_option === 1 && secondaryModifier?.min_permitted === 1 && secondaryModifier?.max_permitted === 1) 
                                            {
                                                return {
                                                    ...secondaryItem,
                                                    activeClass: "ob",
                                                    total_price: 0,
                                                    is_item_select: false,
                                                };
                                            } 
                                            else 
                                            if (secondaryModifier?.select_single_option === 1 && secondaryModifier?.min_permitted === 0 && secondaryModifier?.max_permitted >= 1) 
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
                    };
                }

                return modifier;
            }),
        };
    
        setSingleitem(updateItem);
    
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
    
        setItemprice(parseFloat(totalAmount).toFixed(2));
    },[itemprice,singleitem,ismodifierclicked,selectedModifierId,selectedModifierItemId,selectedModifierItemPrice,ismodifierclicked]);
    
    
    const handleCheckInput = useCallback((modifierId, itemId, secondaryItemModifierCounter) => {
        setHandleCheckModifierId(modifierId);
        let totalAmount = itemprice;

        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => {
                            if (itemId === seconditems?.id) {
                                return {
                                    ...seconditems,
                                    activeClass: seconditems.activeClass === "mche" || seconditems.activeClass === "mchw" ? "mch" : "mche",
                                    is_item_select: seconditems.is_item_select === true ? false : true,
                                    item_select_to_sale: seconditems.item_select_to_sale === true ? false : true,
                                };
                            }
                            return {
                                ...seconditems,
                                activeClass: seconditems.activeClass === "mche" || seconditems.activeClass === "mchw" ? "mche" : "mch",
                                is_item_select: seconditems.is_item_select === false ? false : true,
                                item_select_to_sale: seconditems.item_select_to_sale === false ? false : true,
                            };
                        }
                        ),
                    };
                }

                return modifier;
            }),
        };
          // check the max_permit and make related
          // count the number of item_selected in checkboxes.
        let countItemSelected = 0;
        for (const countSelecteitem of updateItem.modifier_group) {
            if (countSelecteitem?.select_single_option === 1 && countSelecteitem?.min_permitted === 0 && countSelecteitem?.max_permitted >= 1) {
                if (parseInt(countSelecteitem?.modifier_secondary_items.length) >parseInt(0)) 
                {
                    for (const countItem of countSelecteitem?.modifier_secondary_items) 
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

        setSingleitem(makeModifierIsSelected);

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
        setItemprice(parseFloat(totalAmount).toFixed(2));

        setIshandlecheckinputclicked(true);
    },[handleCheckModifierId, singleitem, itemprice, ishandlecheckinputclicked]);
    
    const handleIncrement = useCallback((modifierId, itemId) => {
        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        valid_class: parseInt(modifier.min_permitted) > parseInt(0) && modifier.valid_class === "error_check" ? "success_check" : "success_check",
                        modifier_counter: 1 + modifier?.modifier_counter, 
                        is_modifier_clickable: modifier?.modifier_counter < modifier.max_permitted ? false : true,
                        permitt_max: modifier.max_permitted,
                        is_modifier_selected: true,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => {
                            if (itemId === seconditems?.id) {
                                // if(modifier?.modifier_counter <= modifier?.max_permitted)
                                // {
                                return {
                                    ...seconditems,
                                    counter: 1 + seconditems.counter,
                                    is_item_select: false,
                                    item_select_to_sale: true,
                                };
                                // }
                                // else
                                // {
                                //     return{
                                //         ...seconditems,
                                //         counter: 1 + seconditems.counter,
                                //         is_item_select: false
                                //     }
                                // }
                            }
                            return {
                                ...seconditems,
                                counter: seconditems.counter > 0 ? seconditems.counter : 0,
                                is_item_select: seconditems.is_item_select === true ? true : false,
                                item_select_to_sale: seconditems.item_select_to_sale === true ? true : false,
                            };
                        }),
                    };
                }

                return modifier;
            }),
        };
    
        setSingleitem(updateItem);
    
        let totalAmount = itemprice;
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
        setItemprice(parseFloat(totalAmount).toFixed(2));
    },[singleitem, itemprice]);
    
    const handleDecrement = useCallback((modifierId, itemId) => {
        let totalAmount = itemprice;
        for (const updateItemModifier of singleitem.modifier_group) {
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

        setItemprice(parseFloat(totalAmount).toFixed(2));
    
        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_counter: modifier?.modifier_counter > 0 ? modifier?.modifier_counter - 1 : 0,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => {

                        if (itemId === seconditems?.id) {
                            let getCounter = seconditems.counter > 0 ? seconditems.counter - 1 : 0;
                            return {
                            ...seconditems,
                            counter: seconditems.counter > 0 ? seconditems.counter - 1 : 0,
                            is_item_select: seconditems.counter === 0 ? true : false,
                            item_select_to_sale: getCounter > 0 ? true : false,
                            };
                        }
                        return {
                            ...seconditems,
                            counter: seconditems.counter > 0 ? seconditems.counter : 0,
                            is_item_select: seconditems.counter === 0 ? true : false,
                            item_select_to_sale: seconditems.counter > 0 ? true : false,
                        };

                        }),
                    };
                }
        
                return modifier;
            }),
        };
    
        // is modifier selected make sure ture or false, will help to save information into dabase.
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
        setSingleitem(updateModifierItemSelected);
    },[itemprice, singleitem]);
    
    const handleModalRadioInput = useCallback((modifierId, itemId, secondaryModifierId, secondaryItemId) => {

        let totalAmount = selectedModifierItemPrice;
        for (const updateItemModifier of singleitem.modifier_group) {
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
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                return {
                    ...modifier,
                    is_modifier_selected: true,
                    modifier_secondary_items: modifier?.modifier_secondary_items?.map(
                    (item) => {
                        if (itemId === item?.id) {
                        return {
                            ...item,
                            secondary_item_modifiers:
                            item?.secondary_item_modifiers?.map(
                                (secondaryModifier) => {
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
    
        setSingleitem(updateItem);
    
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
        setSelectedModifierItemPrice(parseFloat(totalAmount).toFixed(2));
    },[singleitem, selectedModifierItemPrice]);
    
    const handleModalCheckInput = useCallback((modifierId, itemId, secondaryModifierId, secondaryItemId) => {
        setIshandlemodalcheckinputparentmodifierID(modifierId);
        setIshandlemodalcheckinputparentitemID(itemId);
        setHandlemodalcheckmodifierid(secondaryModifierId);

        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
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
                                                                activeClass: secondaryItem.activeClass === "mche" ||
                                                                secondaryItem.activeClass === "mchw" ? "mch" : "mche",
                                                                is_item_select: secondaryItem.is_item_select === true ? false : true,
                                                                item_select_to_sale: secondaryItem.item_select_to_sale === true ? true : false,
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
                                            for (const secondModfierItems of secondModifier?.secondary_items_modifier_items) {
                                                if (secondModfierItems?.is_item_select) {
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

        setSingleitem(makeModifierSelected);

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
        setSelectedModifierItemPrice(parseFloat(totalAmount).toFixed(2));
        setIshandlemodalcheckiputclicked(true);
    },[ishandlemodalcheckinputparentmodifierID,ishandlemodalcheckinputparentitemID,handlemodalcheckmodifierid,singleitem,selectedModifierItemPrice,ishandlemodalcheckiputclicked,]);
    
    const handleModalIncrement = useCallback((modifierId, itemId, secondModifierId, secondItemId) => {

        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => {
                            if (itemId === seconditems?.id) {
                                return {
                                    ...seconditems,
                                    secondary_item_modifiers:
                                    seconditems?.secondary_item_modifiers?.map((secondItemModifier) => {
                                        if (secondModifierId === secondItemModifier?.id) {
                                            return {
                                                ...secondItemModifier,
                                                modifier_counter:1 + secondItemModifier?.modifier_counter,
                                                is_modifier_clickable:parseInt(secondItemModifier?.max_permitted) ===parseInt(secondItemModifier?.modifier_counter)? true: false,
                                                permitt_max: secondItemModifier.max_permitted,
                                                is_modifier_selected: true,
                                                valid_class:parseInt(secondItemModifier.min_permitted) >parseInt(0) && secondItemModifier.valid_class ==="error_check" ? "success_check" : "success_check",
                                                secondary_items_modifier_items: secondItemModifier?.secondary_items_modifier_items?.map((secondaryItem) => {
                                                    if (secondItemId === secondaryItem?.id) {
                                                        return {
                                                            ...secondaryItem,
                                                            counter: 1 + secondaryItem.counter,
                                                            is_item_select: false,
                                                            item_select_to_sale: true,
                                                        };
                                                    }

                                                    return {
                                                        ...secondaryItem,
                                                        counter:secondaryItem.counter > 0? secondaryItem.counter: 0,
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

                            return seconditems;
                            // return{
                            //     ...seconditems,
                            //     counter: (seconditems.counter > 0) ? seconditems.counter : 0,
                            //     is_item_select: (seconditems.is_item_select === true) ? true : false
                            // }
                        }),
                    };
                }

                return modifier;
            }),
        };
        setSingleitem(updateItem);

        let totalAmount = selectedModifierItemPrice;
        for (const updateItemModifier of updateItem.modifier_group) {
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
        setSelectedModifierItemPrice(parseFloat(totalAmount).toFixed(2));
    },[singleitem, selectedModifierItemPrice]);
    
    const handleModalDecrement = useCallback((modifierId, itemId, secondModifierId, secondItemId) => {
        let totalAmount = selectedModifierItemPrice;

        for (const updateItemModifier of singleitem.modifier_group) {
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
        
        setSelectedModifierItemPrice(parseFloat(totalAmount).toFixed(2));
    
        const updateItem = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifier) => {
                if (modifierId === modifier?.id) {
                    return {
                        ...modifier,
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => {
                            if (itemId === seconditems?.id) {
                                return {
                                    ...seconditems,
                                    secondary_item_modifiers: seconditems?.secondary_item_modifiers?.map((secondItemModifier) => {
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

                            return seconditems;
                            // return{
                            //     ...seconditems,
                            //     counter: (seconditems.counter > 0) ? seconditems.counter : 0,
                            //     is_item_select: (seconditems.is_item_select === true) ? true : false
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
                        modifier_secondary_items: modifier?.modifier_secondary_items?.map((seconditems) => {
                            if (itemId === seconditems?.id) {
                                return {
                                    ...seconditems,
                                    secondary_item_modifiers: seconditems?.secondary_item_modifiers?.map((secondItemModifier) => {
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

                            return seconditems;
                        }),
                    };
                }

                return modifier;
            }),
        };
        setSingleitem(updatedModifierSelected);
    },[selectedModifierItemPrice, singleitem]);
    
    const handleQuantity = useCallback((event) => {
        setQuantity(event.target.value);
    },[quantity]);
    
    const handleSaveBtn = useCallback((modifierId, itemId) => {
        if (singleitem) {
            let countMinPermiModifier = 0;
            for (const parentModifier of singleitem.modifier_group) {
                if (modifierId === parentModifier.id) {
                    for (const selectedItem of parentModifier.modifier_secondary_items) {
                        if (itemId === selectedItem.id) {
                            for (const childModi of selectedItem.secondary_item_modifiers) {
                                if (parseInt(childModi.min_permitted) > parseInt(0) && childModi?.is_modifier_selected === false) {
                                    countMinPermiModifier += 1;
                                }
                            }
                        }
                    }
                }
            }

            if (parseInt(countMinPermiModifier) > parseInt(0)) {
                let getTheCounter = 0;
                const updateNestModifierError = {
                    ...singleitem,
                    modifier_group: singleitem?.modifier_group?.map((modifier) => {
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

                setSingleitem(updateClassError);
            } else {
                const newTotal = parseFloat(itemprice) + parseFloat(selectedModifierItemPrice);
                setItemprice(parseFloat(newTotal).toFixed(2));

                const updateSecondaryItemPriceTotal = {
                    ...singleitem,
                    modifier_group: singleitem?.modifier_group?.map((modifier) => {
                        if (modifierId === modifier?.id) {
                        return {
                            ...modifier,
                            is_modifier_selected: true,
                            valid_class: "success_check",
                            modifier_secondary_items:
                            modifier?.modifier_secondary_items?.map((seconditems) => {
                                if (itemId === seconditems?.id) {
                                return {
                                    ...seconditems,
                                    total_price: parseFloat(selectedModifierItemPrice),
                                };
                                }

                                return seconditems;
                            }),
                        };
                        }

                        return modifier;
                    }),
                };
                setSingleitem(updateSecondaryItemPriceTotal);
                setIsmodifierclicked(false);
            }
        }
    },[ismodifierclicked, singleitem, itemprice]);
    
    useEffect(() => {
        if (ishandlecheckinputclicked) {
            const filterModifier = singleitem?.modifier_group?.find((modifier) => handleCheckModifierId === modifier?.id);

            const countNumberOfCheck = filterModifier?.modifier_secondary_items?.filter((item) => item.is_item_select === true);

            const updateCheckBox = {
                ...singleitem,
                modifier_group: singleitem?.modifier_group?.map((modifier) => {
                    if (handleCheckModifierId === modifier?.id) {
                        return {
                            ...modifier,
                            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
                            (seconditems) => {
                                if (
                                parseInt(modifier?.max_permitted) ===
                                    parseInt(countNumberOfCheck?.length) &&
                                seconditems?.activeClass !== "mch"
                                ) {
                                return {
                                    ...seconditems,
                                    activeClass: "mchw",
                                    is_item_select: false,
                                };
                                }

                                return seconditems;
                            }
                            ),
                        };
                    }

                    return modifier;
                }),
            };
            setSingleitem(updateCheckBox);
            setIshandlecheckinputclicked(false);
        }
    }, [ishandlecheckinputclicked]);
    
    useEffect(() => {
        if (ishandlemodalcheckiputclicked) {
            const filterModifier = singleitem?.modifier_group?.find((modifier) => modifier?.id === ishandlemodalcheckinputparentmodifierID);

            const filterItems = filterModifier?.modifier_secondary_items?.find((item) => item?.id === ishandlemodalcheckinputparentitemID);
            const secondaryFilterModifier = filterItems?.secondary_item_modifiers?.find((secondaryModifier) =>secondaryModifier?.id === handlemodalcheckmodifierid);

            const countNumberOfCheckSecondaryItems = secondaryFilterModifier?.secondary_items_modifier_items?.filter((secondaryItem) => secondaryItem?.is_item_select === true);

            const updateSingleItems = {
                ...singleitem,
                modifier_group: singleitem?.modifier_group?.map((modifier) => {
                    if (ishandlemodalcheckinputparentmodifierID === modifier?.id) {
                        return {
                            ...modifier,
                            modifier_secondary_items: modifier?.modifier_secondary_items?.map((item) => {
                                if (ishandlemodalcheckinputparentitemID === item?.id) {
                                    return {
                                        ...item,
                                        secondary_item_modifiers:
                                        item?.secondary_item_modifiers?.map((secondaryModifier) => {
                                            if (handlemodalcheckmodifierid === secondaryModifier?.id) {
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
            setSingleitem(updateSingleItems);
            setIshandlemodalcheckiputclicked(false);
        }
    }, [ishandlemodalcheckiputclicked]);
    
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
            }, 30 * 60 * 1000); 
        
            // Clear the timeout if the component is unmounted before 20 minutes
            return () => clearTimeout(timeoutId);
        }
    });
    
    // Website Cart Button
    console.log("Cart data total:", cartdata);
    
    const handleAddtoCart = useCallback(() => {
        if (singleitem) {
            // Count the number of modifier is min_permit is greater than zero.

            let countMinPermit = 0;
            for (const minPermit of singleitem?.modifier_group) {
                if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                    countMinPermit += 1;
                }
            }

            let indexArrForScroll = [];

            if (parseInt(countMinPermit) > parseInt(0)) {
                const addErrorClassinModifier = {
                    ...singleitem,
                    modifier_group: singleitem?.modifier_group?.map((addErrorClass, index) => {
                        let addClass = addErrorClass?.valid_class;
                        if (parseInt(addErrorClass?.min_permitted) > parseInt(0) && addErrorClass.is_modifier_selected === false) {
                            addClass = "error_check";
                            indexArrForScroll.push(index);
                        }

                        return {
                            ...addErrorClass,
                            valid_class: addClass,
                        };
                    }),
                };

                setSingleitem(addErrorClassinModifier);
            } 
            else 
            {
                if(params?.edit)
                {
                    // const filterCartFirst = cartdata?.filter((cart, index) => index !== JSON.parse(removeIndex));
                    const filterCartFirst = cartdata?.filter((cart) => !cart?.slug?.includes(params?.product));
                    setCartdata(filterCartFirst);
                }

                setLoader(true);
                const addTotalAmount = {
                    ...singleitem,
                    total_order_amount: parseFloat(quantity * itemprice).toFixed(2),
                    price_total_without_quantity: parseFloat(itemprice).toFixed(2),
                    quantity: parseInt(quantity),
                    is_cart_modal_clicked: false,
                };
                setCartdata((prevData) => [...prevData, addTotalAmount]);
                router.push("/");
                setIscartbtnclicked(true);
            }

            if (indexArrForScroll.length > 0) {
                for (let indexArr = 0;indexArr < indexArrForScroll.length;indexArr++) {
                    if (indexArr === 0) {
                        let element = document.querySelector(`.section${indexArrForScroll[indexArr]}`);
                        element.scrollIntoView({ behavior: "smooth" });
                        return;
                    }
                }
            }
        }
    }, [singleitem, cartdata, iscartbtnclicked,quantity]);    

    const handleMobileAddtoCart = useCallback(() => {
        if (singleitem) {
            // Count the number of modifier is min_permit is greater than zero.

            let countMinPermit = 0;
            for (const minPermit of singleitem?.modifier_group) {
                if (parseInt(minPermit?.min_permitted) > parseInt(0) && minPermit?.is_modifier_selected === false) {
                    countMinPermit += 1;
                }
            }

            let indexArrForScroll = [];

            if (parseInt(countMinPermit) > parseInt(0)) {
                const addErrorClassinModifier = {
                    ...singleitem,
                    modifier_group: singleitem?.modifier_group?.map((addErrorClass, index) => {
                        let addClass = addErrorClass?.valid_class;
                        if (parseInt(addErrorClass?.min_permitted) > parseInt(0) &&addErrorClass.is_modifier_selected === false) 
                        {
                            addClass = "error_check";
                            indexArrForScroll.push(index);
                        }

                        return {
                            ...addErrorClass,
                            valid_class: addClass,
                        };
                    }),
                };

                setSingleitem(addErrorClassinModifier);
            } else {

                setLoader(true);

                if(params?.edit)
                {
                    const filterCartFirst = cartdata?.filter((cart) => !cart?.slug?.includes(params?.product));
                    setCartdata(filterCartFirst);
                }

                const addTotalAmount = {
                    ...singleitem,
                    total_order_amount: parseFloat(quantity * itemprice).toFixed(2),
                    price_total_without_quantity: parseFloat(itemprice).toFixed(2),
                    quantity: parseInt(quantity),
                    is_cart_modal_clicked: false,
                };
                setCartdata((prevData) => [...prevData, addTotalAmount]);
                router.push("/");
                setIscartbtnclicked(true);
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
        }
    }, [singleitem, cartdata, iscartbtnclicked,quantity]);
    
    // Mobile Decrement quantity
    const handleMobileQuantityDecrement = useCallback(() => {
        if (quantity > 0) {
            setQuantity((prevData) => prevData - 1);
        }
    }, [quantity]);
    
    const handleMobileQuantityIncrement = useCallback(() => {
        setQuantity((prevData) => prevData + 1);
    }, [quantity]);
    
    const handleMobileModifierToggle = useCallback((modifierId) => {
        const updateModifierToggle = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifierToggle) => {
              if (modifierId === modifierToggle?.id) {
                return {
                  ...modifierToggle,
                  is_toggle_active: !modifierToggle?.is_toggle_active,
                };
              }
              return modifierToggle;
            }),
        };
    
        setSingleitem(updateModifierToggle);
    },[singleitem]);
    
    const handleModalModifierToggle = useCallback((modifierId, itemId, secondModifierId) => {
        const updateSecondaryModifierToggle = {
            ...singleitem,
            modifier_group: singleitem?.modifier_group?.map((modifierToggle) => {
                if (modifierId === modifierToggle?.id) {
                    return {
                        ...modifierToggle,
                        modifier_secondary_items: modifierToggle?.modifier_secondary_items?.map((secondItem) => 
                        {
                            if (itemId === secondItem?.id) {
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
                    };
                }
                return modifierToggle;
            }),
        };
        setSingleitem(updateSecondaryModifierToggle);
    },[singleitem]);
    
    const handleBackArrow = useCallback((modifierId, itemId) => {
        if (singleitem) 
        {
            let countMinPermiModifier = 0;
            for (const parentModifier of singleitem.modifier_group) {
                if (modifierId === parentModifier.id) {
                    for (const selectedItem of parentModifier.modifier_secondary_items) {
                        if (itemId === selectedItem.id) {
                            for (const childModi of selectedItem.secondary_item_modifiers) {
                                if (parseInt(childModi.min_permitted) > parseInt(0) && childModi?.is_modifier_selected === false) {
                                    countMinPermiModifier += 1;
                                }
                            }
                        }
                    }
                }
            }

            if (parseInt(countMinPermiModifier) > parseInt(0)) {
                let getTheCounter = 0;
                const updateNestModifierError = {
                    ...singleitem,
                    modifier_group: singleitem?.modifier_group?.map((modifier) => {
                        if (modifierId === modifier?.id) {
                            return {
                                ...modifier,
                                modifier_secondary_items:
                                modifier?.modifier_secondary_items?.map((secondItem) => {
                                    if (itemId === secondItem.id) {
                                    return {
                                        ...secondItem,
                                        secondary_item_modifiers:
                                        secondItem?.secondary_item_modifiers?.map(
                                            (nestedModifier) => {
                                            let addClass = nestedModifier?.valid_class;
                                            if (
                                                parseInt(nestedModifier?.min_permitted) >
                                                parseInt(0) &&
                                                nestedModifier.is_modifier_selected === false
                                            ) {
                                                addClass = "error_check";
                                                getTheCounter += 1;
                                            }

                                            return {
                                                ...nestedModifier,
                                                valid_class: addClass,
                                            };
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

                const updateClassError = {
                    ...updateNestModifierError,
                    modifier_group: updateNestModifierError?.modifier_group?.map((updateModifierClass) => 
                    {
                        if (modifierId === updateModifierClass.id) {
                            return {
                                ...updateModifierClass,
                                valid_class: getTheCounter > 0 ? "error_check" : "success_check",
                                is_modifier_selected: getTheCounter > 0 ? false : true,
                            };
                        }
                        return updateModifierClass;
                    }),
                };

                setSingleitem(updateClassError);
            } else {
                let totalSubAmount = 0;
                if (singleitem) {
                    for (const modifier of singleitem?.modifier_group) {
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
                const newTotal = parseFloat(itemprice) + parseFloat(totalSubAmount);
                setItemprice(parseFloat(newTotal).toFixed(2));
                setIsmodifierclicked(false);
            }
        }
        setIsmodifierclicked(false);
    },[singleitem, ismodifierclicked, itemprice, ismodifierclicked]);

    console.log("Single item to update:", singleitem);
    
    return(
    <>
        <Header />

        <div className="single-product">
            <WebsiteSingleItem
                {
                    ...{
                    singleitem,
                    quantity,
                    itemprice,
                    setIsitemclicked,
                    handleRadioInput,
                    handleCheckInput,
                    handleDecrement,
                    handleIncrement,
                    handleQuantity,
                    handleAddtoCart,
                    }
                }
            />
        </div>

        {/* Mobile Responsive */}
        <div className="mobile-view">
            <MobileSingleItem
                {
                ...{
                    singleitem,
                    quantity,
                    itemprice,
                    handleRadioInput,
                    handleMScroll,
                    handleCheckInput,
                    handleMobileModifierToggle,
                    handleDecrement,
                    handleIncrement,
                    handleMobileQuantityDecrement,
                    handleMobileQuantityIncrement,
                    handleMobileAddtoCart,
                }
                }
            />
        </div>

            {/* If a modifer item has nested modifiers */}
        {
            ismodifierclicked && 
            <NestedModifiers
                selectedModifierItemPrice={selectedModifierItemPrice}
                selectedModifierId={selectedModifierId}
                selectedModifierItemId={selectedModifierItemId}
                singleitem={singleitem}
                handleBackArrow={handleBackArrow}
                handleModalModifierToggle={handleModalModifierToggle}
                handleSaveBtn={handleSaveBtn}
                handleModalIncrement={handleModalIncrement}
                handleModalDecrement={handleModalDecrement}
                handleModalCheckInput={handleModalCheckInput}
                handleModalRadioInput={handleModalRadioInput}
                setIsmodifierclicked={setIsmodifierclicked}
            />
        }
    </>)
}
