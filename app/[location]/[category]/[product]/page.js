"use client";

import Loader from "@/app/components/modals/Loader";
import HomeContext from "@/app/contexts/HomeContext";
import {
  BRANDSIMPLEGUID,
  BRAND_GUID,
  BrandLogoPath,
  IMAGE_URL_Without_Storage,
  PARTNER_ID,
  axiosPrivate,
} from "@/app/global/Axios";
import {
  getAmountConvertToFloatWithFixed,
  getCountryCurrencySymbol,
} from "@/app/global/Store";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

function productDetails({ params }) {
  const router = useRouter();
  const {
    setLoader,
    loader,
    storeGUID,
    setBrandlogo,
    setIscartbtnclicked,
    setCartdata,
    cartdata,
    dayOpeningClosingTime,
    setIsTimeToClosed,
  } = useContext(HomeContext);
  // const {setIsitemclicked, handleInput} = useContext(HomeContext)
  const [isitemclicked, setIsitemclicked] = useState(false);
  const [isaccordianclicked, setIsaccordianclicked] = useState(true);

  const [ismodifierclicked, setIsmodifierclicked] = useState(false);

  const [singleitem, setSingleitem] = useState(null);

  const [nestedmodifieritemhasmodifier, setnestedmodifieritemhasmodifier] =
    useState(null);

  const [quantity, setQuantity] = useState(1);
  const [itemprice, setItemprice] = useState(0);

  const [selectedModifierId, setselectedModifierId] = useState(0);
  const [selectedModifierItemId, setSelectedModifierItemId] = useState(0);
  const [selectedModifierItemPrice, setSelectedModifierItemPrice] = useState(0);

  const [ishandlecheckinputclicked, setIshandlecheckinputclicked] =
    useState(false);
  const [handleCheckModifierId, setHandleCheckModifierId] = useState(0);

  const [
    ishandlemodalcheckinputparentmodifierID,
    setIshandlemodalcheckinputparentmodifierID,
  ] = useState(0);
  const [
    ishandlemodalcheckinputparentitemID,
    setIshandlemodalcheckinputparentitemID,
  ] = useState(0);
  const [ishandlemodalcheckiputclicked, setIshandlemodalcheckiputclicked] =
    useState(false);
  const [handlemodalcheckmodifierid, setHandlemodalcheckmodifierid] =
    useState(0);

  const filterItem = async () => {
    try {
      const getStoreIDFromLocalStorage = JSON.parse(
        window.localStorage.getItem(`${BRANDSIMPLEGUID}user_selected_store`)
      );
      const data = {
        location:
          getStoreIDFromLocalStorage !== null
            ? getStoreIDFromLocalStorage?.display_id
            : storeGUID,
        brand: BRAND_GUID,
        partner: PARTNER_ID,
      };

      const response = await axiosPrivate.post(`/menu`, data);
      const convertToJSobj = response.data?.data?.menu.menu_json_log;

      const getSingleCategory = convertToJSobj?.categories?.find(
        (category) => category.slug === params.category
      );
      const getItemFromCategory = getSingleCategory?.items?.find(
        (item) => item.slug === params.product
      );

      const updateModifier = getItemFromCategory?.modifier_group?.map(
        (modifier) => {
          if (
            modifier?.select_single_option === 1 &&
            modifier?.min_permitted === 1 &&
            modifier?.max_permitted === 1
          ) {
            const modifier_secondary_items =
              modifier?.modifier_secondary_items?.map((modifieritem) => {
                if (
                  parseInt(modifieritem?.secondary_item_modifiers.length) >
                  parseInt(0)
                ) {
                  const updateNestedItems =
                    modifieritem?.secondary_item_modifiers?.map(
                      (secondItemModifier) => {
                        if (
                          secondItemModifier?.select_single_option === 1 &&
                          secondItemModifier?.min_permitted === 1 &&
                          secondItemModifier?.max_permitted === 1
                        ) {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  activeClass: "ob",
                                  total_price: 0,
                                  is_item_select: false,
                                  item_select_to_sale: false,
                                };
                              }
                            );

                          return {
                            ...secondItemModifier,
                            valid_class: "default_check",
                            is_second_item_modifier_clicked: true,
                            is_modifier_selected: false,
                            secondary_items_modifier_items:
                              updateSecondaryItemModifierItem,
                          };
                        } else if (
                          secondItemModifier?.select_single_option === 1 &&
                          secondItemModifier?.min_permitted === 0 &&
                          secondItemModifier?.max_permitted >= 1
                        ) {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  activeClass: "mche",
                                  // total_price: secondItemModiItem?.price_info,
                                  total_price: 0,
                                  is_item_select: false,
                                  item_select_to_sale: false,
                                };
                              }
                            );

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
                        } else {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  counter: 0,
                                  // total_price: secondItemModiItem?.price_info,
                                  total_price: 0,
                                  is_item_select: true,
                                  item_select_to_sale: false,
                                };
                              }
                            );

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
                      }
                    );

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
          } else if (
            modifier?.select_single_option === 1 &&
            modifier?.min_permitted === 0 &&
            modifier?.max_permitted >= 1
          ) {
            const modifier_secondary_items =
              modifier?.modifier_secondary_items?.map((modifieritem) => {
                if (
                  parseInt(modifieritem?.secondary_item_modifiers.length) >
                  parseInt(0)
                ) {
                  const updateNestedItems =
                    modifieritem?.secondary_item_modifiers?.map(
                      (secondItemModifier) => {
                        if (
                          secondItemModifier?.select_single_option === 1 &&
                          secondItemModifier?.min_permitted === 1 &&
                          secondItemModifier?.max_permitted === 1
                        ) {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  activeClass: "ob",
                                  total_price: 0,
                                  is_item_select: false,
                                  item_select_to_sale: false,
                                };
                              }
                            );

                          return {
                            ...secondItemModifier,
                            valid_class: "default_check",
                            is_second_item_modifier_clicked: true,
                            is_modifier_selected: false,
                            secondary_items_modifier_items:
                              updateSecondaryItemModifierItem,
                          };
                        } else if (
                          secondItemModifier?.select_single_option === 1 &&
                          secondItemModifier?.min_permitted === 0 &&
                          secondItemModifier?.max_permitted >= 1
                        ) {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  activeClass: "mche",
                                  total_price: 0,
                                  is_item_select: false,
                                  item_select_to_sale: false,
                                };
                              }
                            );

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
                        } else {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  counter: 0,
                                  total_price: 0,
                                  is_item_select: true,
                                  item_select_to_sale: false,
                                };
                              }
                            );

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
                      }
                    );

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
          } else {
            const modifier_secondary_items =
              modifier?.modifier_secondary_items?.map((modifieritem) => {
                if (
                  parseInt(modifieritem?.secondary_item_modifiers.length) >
                  parseInt(0)
                ) {
                  const updateNestedItems =
                    modifieritem?.secondary_item_modifiers?.map(
                      (secondItemModifier) => {
                        if (
                          secondItemModifier?.select_single_option === 1 &&
                          secondItemModifier?.min_permitted === 1 &&
                          secondItemModifier?.max_permitted === 1
                        ) {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  activeClass: "ob",
                                  total_price: 0,
                                  is_item_select: false,
                                  item_select_to_sale: false,
                                };
                              }
                            );

                          return {
                            ...secondItemModifier,
                            valid_class: "default_check",
                            is_second_item_modifier_clicked: true,
                            is_modifier_selected: false,
                            secondary_items_modifier_items:
                              updateSecondaryItemModifierItem,
                          };
                        } else if (
                          secondItemModifier?.select_single_option === 1 &&
                          secondItemModifier?.min_permitted === 0 &&
                          secondItemModifier?.max_permitted >= 1
                        ) {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  total_price: 0,
                                  activeClass: "mche",
                                  is_item_select: false,
                                  item_select_to_sale: false,
                                };
                              }
                            );

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
                        } else {
                          const updateSecondaryItemModifierItem =
                            secondItemModifier?.secondary_items_modifier_items?.map(
                              (secondItemModiItem) => {
                                return {
                                  ...secondItemModiItem,
                                  counter: 0,
                                  total_price: 0,
                                  is_item_select: true,
                                  item_select_to_sale: false,
                                };
                              }
                            );

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
                      }
                    );

                  return {
                    ...modifieritem,
                    counter: 0,
                    is_item_select: true,
                    // total_price: modifieritem?.price,
                    total_price: 0,
                    secondary_item_modifiers: updateNestedItems,
                    item_select_to_sale: false,
                  };
                }
                return {
                  ...modifieritem,
                  counter: 0,
                  // total_price: modifieritem?.price,
                  total_price: 0,
                  is_item_select: true,
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
        }
      );
      getItemFromCategory.modifier_group = updateModifier;

      setSingleitem(getItemFromCategory);
      setItemprice(parseFloat(getItemFromCategory?.price).toFixed(2));
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    } catch (error) {
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const dayNumber = moment().day();
    const dateTime = moment().format("HH:mm");
    const dayName = moment().format("dddd");

    if (
      dayOpeningClosingTime?.day_of_week
        ?.toLowerCase()
        .includes(dayName.toLowerCase())
    ) {
      const timePeriods = dayOpeningClosingTime?.time_periods;
      if (timePeriods) {
        if (
          timePeriods?.[0]?.start_time >= dateTime &&
          dateTime <= timePeriods?.[0]?.end_time
        ) {
          setIsTimeToClosed(true);
          return;
        }
      }
    }

    filterItem();
  }, []);

  const handleMScroll = (event) => {
    let element = document.querySelector(".ctascusingle-product");

    element.style.position = event.deltaY === 100 ? "absolute" : "sticky";
  };

  const handleRadioInput = (
    modifierId,
    itemId,
    itemName,
    secondaryItemModifierCounter
  ) => {
    if (parseInt(secondaryItemModifierCounter) > parseInt(0)) {
      const findModifierItemNestedModifier = singleitem?.modifier_group?.find(
        (modifier) => modifier?.id === modifierId
      );
      const findModifierItemNestedModifierItem =
        findModifierItemNestedModifier?.modifier_secondary_items?.find(
          (item) => item?.id === itemId
        );
      // setnestedmodifieritemhasmodifier(findModifierItemNestedModifierItem)

      setselectedModifierId(modifierId);
      setSelectedModifierItemId(itemId);
      setSelectedModifierItemPrice(
        parseFloat(findModifierItemNestedModifierItem?.total_price)
      );
      setIsmodifierclicked(!ismodifierclicked);
    }

    let totalAmount = itemprice;
    for (const updateItemModifier of singleitem.modifier_group) {
      if (updateItemModifier?.id === modifierId) {
        for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
          if (updateItemModifierItem?.is_item_select === true) {
            const newTotalMinus =
              parseFloat(totalAmount) -
              parseFloat(updateItemModifierItem?.price) -
              parseFloat(updateItemModifierItem?.total_price);
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
              modifier.valid_class === "error_check"
                ? "success_check"
                : "success_check",
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
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
                  secondary_item_modifiers:
                    seconditems?.secondary_item_modifiers?.map(
                      (secondaryModifier) => {
                        return {
                          ...secondaryModifier,
                          secondary_items_modifier_items:
                            secondaryModifier?.secondary_items_modifier_items?.map(
                              (secondaryItem) => {
                                if (
                                  secondaryModifier?.select_single_option ===
                                    1 &&
                                  secondaryModifier?.min_permitted === 1 &&
                                  secondaryModifier?.max_permitted === 1
                                ) {
                                  return {
                                    ...secondaryItem,
                                    activeClass: "ob",
                                    total_price: 0,
                                    is_item_select: false,
                                  };
                                } else if (
                                  secondaryModifier?.select_single_option ===
                                    1 &&
                                  secondaryModifier?.min_permitted === 0 &&
                                  secondaryModifier?.max_permitted >= 1
                                ) {
                                  return {
                                    ...secondaryItem,
                                    activeClass: "mche",
                                    total_price: 0,
                                    is_item_select: false,
                                  };
                                } else {
                                  return {
                                    ...secondaryItem,
                                    counter: 0,
                                    total_price: 0,
                                    is_item_select: true,
                                  };
                                }
                              }
                            ),
                        };
                      }
                    ),
                };
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
            const newTotalPlus =
              parseFloat(totalAmount) +
              parseFloat(updateItemModifierItem?.price);
            totalAmount = newTotalPlus;
          }
        }
      }
    }

    setItemprice(parseFloat(totalAmount).toFixed(2));
    // setSelectedModifierItemPrice(0)
  };

  const handleCheckInput = (
    modifierId,
    itemId,
    secondaryItemModifierCounter
  ) => {
    setHandleCheckModifierId(modifierId);
    let totalAmount = itemprice;

    const updateItem = {
      ...singleitem,
      modifier_group: singleitem?.modifier_group?.map((modifier) => {
        if (modifierId === modifier?.id) {
          return {
            ...modifier,
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
                if (itemId === seconditems?.id) {
                  return {
                    ...seconditems,
                    activeClass:
                      seconditems.activeClass === "mche" ||
                      seconditems.activeClass === "mchw"
                        ? "mch"
                        : "mche",
                    is_item_select:
                      seconditems.is_item_select === true ? false : true,
                    item_select_to_sale:
                      seconditems.item_select_to_sale === true ? false : true,
                  };
                }
                return {
                  ...seconditems,
                  activeClass:
                    seconditems.activeClass === "mche" ||
                    seconditems.activeClass === "mchw"
                      ? "mche"
                      : "mch",
                  is_item_select:
                    seconditems.is_item_select === false ? false : true,
                  item_select_to_sale:
                    seconditems.item_select_to_sale === false ? false : true,
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
      if (
        countSelecteitem?.select_single_option === 1 &&
        countSelecteitem?.min_permitted === 0 &&
        countSelecteitem?.max_permitted >= 1
      ) {
        if (
          parseInt(countSelecteitem?.modifier_secondary_items.length) >
          parseInt(0)
        ) {
          for (const countItem of countSelecteitem?.modifier_secondary_items) {
            if (countItem?.is_item_select) {
              countItemSelected += 1;
            }
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
            if (
              parseInt(modifier.min_permitted) > parseInt(0) &&
              modifier.valid_class === "error_check"
            ) {
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
              const newTotalPlus =
                parseFloat(totalAmount) +
                parseFloat(updateItemModifierItem?.price);
              totalAmount = newTotalPlus;
            } else {
              const newTotalMinus =
                parseFloat(totalAmount) -
                parseFloat(updateItemModifierItem?.price);
              totalAmount = newTotalMinus;
            }
          }
        }
      }
    }
    setItemprice(parseFloat(totalAmount).toFixed(2));

    setIshandlecheckinputclicked(true);
  };

  const handleIncrement = (modifierId, itemId) => {
    const updateItem = {
      ...singleitem,
      modifier_group: singleitem?.modifier_group?.map((modifier) => {
        if (modifierId === modifier?.id) {
          return {
            ...modifier,
            valid_class:
              parseInt(modifier.min_permitted) > parseInt(0) &&
              modifier.valid_class === "error_check"
                ? "success_check"
                : "success_check",
            modifier_counter: 1 + modifier?.modifier_counter,
            is_modifier_clickable:
              modifier?.modifier_counter < modifier.max_permitted
                ? false
                : true,
            permitt_max: modifier.max_permitted,
            is_modifier_selected: true,
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
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
                  is_item_select:
                    seconditems.is_item_select === true ? true : false,
                  item_select_to_sale:
                    seconditems.item_select_to_sale === true ? true : false,
                };
              }
            ),
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
            const newTotalPlus =
              parseFloat(totalAmount) +
              parseFloat(updateItemModifierItem?.price);
            totalAmount = newTotalPlus;
          }
        }
      }
    }
    setItemprice(parseFloat(totalAmount).toFixed(2));
  };

  const handleDecrement = (modifierId, itemId) => {
    let totalAmount = itemprice;
    for (const updateItemModifier of singleitem.modifier_group) {
      if (updateItemModifier?.id === modifierId) {
        for (const updateItemModifierItem of updateItemModifier?.modifier_secondary_items) {
          if (updateItemModifierItem?.id === itemId) {
            if (updateItemModifierItem.counter > 0) {
              const newTotalMinus =
                parseFloat(totalAmount) -
                parseFloat(updateItemModifierItem?.price);
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
            modifier_counter:
              modifier?.modifier_counter > 0
                ? modifier?.modifier_counter - 1
                : 0,
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
                if (itemId === seconditems?.id) {
                  let getCounter =
                    seconditems.counter > 0 ? seconditems.counter - 1 : 0;
                  return {
                    ...seconditems,
                    counter:
                      seconditems.counter > 0 ? seconditems.counter - 1 : 0,
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
              }
            ),
          };
        }

        return modifier;
      }),
    };

    // is modifier selected make sure ture or false, will help to save information into dabase.
    const updateModifierItemSelected = {
      ...updateItem,
      modifier_group: updateItem?.modifier_group?.map(
        (decModifierItemSelected) => {
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
              is_modifier_selected:
                parseInt(decModifierItemSelected?.modifier_counter) >
                parseInt(0)
                  ? true
                  : false,
              valid_class: addClass,
            };
          }
          return decModifierItemSelected;
        }
      ),
    };
    setSingleitem(updateModifierItemSelected);
  };

  const handleModalRadioInput = (
    modifierId,
    itemId,
    secondaryModifierId,
    secondaryItemId
  ) => {
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
                                secondaryModifier.valid_class === "error_check"
                                  ? "success_check"
                                  : "success_check",
                              is_modifier_selected: true,
                              secondary_items_modifier_items:
                                secondaryModifier?.secondary_items_modifier_items?.map(
                                  (secondaryItem) => {
                                    if (secondaryItemId === secondaryItem?.id) {
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
                    const newTotalPlus =
                      parseFloat(totalAmount) +
                      parseFloat(updateSecondaryItem?.price_info);
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
  };

  const handleModalCheckInput = (
    modifierId,
    itemId,
    secondaryModifierId,
    secondaryItemId
  ) => {
    setIshandlemodalcheckinputparentmodifierID(modifierId);
    setIshandlemodalcheckinputparentitemID(itemId);
    setHandlemodalcheckmodifierid(secondaryModifierId);

    const updateItem = {
      ...singleitem,
      modifier_group: singleitem?.modifier_group?.map((modifier) => {
        if (modifierId === modifier?.id) {
          return {
            ...modifier,
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
                              secondary_items_modifier_items:
                                secondaryModifier?.secondary_items_modifier_items?.map(
                                  (secondaryItem) => {
                                    if (secondaryItemId === secondaryItem?.id) {
                                      return {
                                        ...secondaryItem,
                                        activeClass:
                                          secondaryItem.activeClass ===
                                            "mche" ||
                                          secondaryItem.activeClass === "mchw"
                                            ? "mch"
                                            : "mche",
                                        is_item_select:
                                          secondaryItem.is_item_select === true
                                            ? false
                                            : true,
                                        item_select_to_sale:
                                          secondaryItem.item_select_to_sale ===
                                          true
                                            ? true
                                            : false,
                                      };
                                    }

                                    return {
                                      ...secondaryItem,
                                      activeClass:
                                        secondaryItem.activeClass === "mche" ||
                                        secondaryItem.activeClass === "mchw"
                                          ? "mche"
                                          : "mch",
                                      is_item_select:
                                        secondaryItem.is_item_select === false
                                          ? false
                                          : true,
                                      item_select_to_sale:
                                        secondaryItem.item_select_to_sale ===
                                        false
                                          ? false
                                          : true,
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

    let countItemSelected = 0;
    for (const countModifier of updateItem.modifier_group) {
      if (modifierId === countModifier?.id) {
        if (
          parseInt(countModifier?.modifier_secondary_items.length) > parseInt(0)
        ) {
          for (const secondItem of countModifier?.modifier_secondary_items) {
            if (itemId === secondItem?.id) {
              if (
                parseInt(secondItem?.secondary_item_modifiers.length) >
                parseInt(0)
              ) {
                for (const secondModifier of secondItem?.secondary_item_modifiers) {
                  if (secondaryModifierId === secondModifier?.id) {
                    if (
                      parseInt(
                        secondModifier?.secondary_items_modifier_items.length
                      ) > parseInt(0)
                    ) {
                      for (const secondModfierItems of secondModifier?.secondary_items_modifier_items) {
                        if (secondModfierItems?.is_item_select) {
                          countItemSelected += 1;
                        }
                      }
                    }
                  }

                  // return secondModifier
                }
              }
            }
            // return secondItem
          }
        }
      }
      //    return countModifier
    }

    const makeModifierSelected = {
      ...updateItem,
      modifier_group: updateItem?.modifier_group?.map((modifier) => {
        if (modifierId === modifier.id) {
          return {
            ...modifier,
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (secondItem) => {
                if (itemId === secondItem.id) {
                  return {
                    ...secondItem,
                    secondary_item_modifiers:
                      secondItem?.secondary_item_modifiers?.map(
                        (secondModifier) => {
                          if (secondaryModifierId === secondModifier.id) {
                            let addClass = secondModifier.valid_class;

                            if (parseInt(countItemSelected) > parseInt(0)) {
                              if (
                                parseInt(secondModifier.min_permitted) >
                                  parseInt(0) &&
                                secondModifier.valid_class === "error_check"
                              ) {
                                addClass = "success_check";
                              }
                            }

                            return {
                              ...secondModifier,
                              is_modifier_selected:
                                parseInt(countItemSelected) > parseInt(0)
                                  ? true
                                  : false,
                              valid_class: addClass,
                            };
                          }

                          return secondModifier;
                        }
                      ),
                  };
                }
                return secondItem;
              }
            ),
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
                      const newTotalPlus =
                        parseFloat(totalAmount) +
                        parseFloat(updateSecondaryItem?.price_info);
                      totalAmount = newTotalPlus;
                    } else {
                      const newTotalMinus =
                        parseFloat(totalAmount) -
                        parseFloat(updateSecondaryItem?.price_info);
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
  };

  const handleModalIncrement = (
    modifierId,
    itemId,
    secondModifierId,
    secondItemId
  ) => {
    const updateItem = {
      ...singleitem,
      modifier_group: singleitem?.modifier_group?.map((modifier) => {
        if (modifierId === modifier?.id) {
          return {
            ...modifier,
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
                if (itemId === seconditems?.id) {
                  return {
                    ...seconditems,
                    secondary_item_modifiers:
                      seconditems?.secondary_item_modifiers?.map(
                        (secondItemModifier) => {
                          if (secondModifierId === secondItemModifier?.id) {
                            return {
                              ...secondItemModifier,
                              modifier_counter:
                                1 + secondItemModifier?.modifier_counter,
                              is_modifier_clickable:
                                parseInt(secondItemModifier?.max_permitted) ===
                                parseInt(secondItemModifier?.modifier_counter)
                                  ? true
                                  : false,
                              permitt_max: secondItemModifier.max_permitted,
                              is_modifier_selected: true,
                              valid_class:
                                parseInt(secondItemModifier.min_permitted) >
                                  parseInt(0) &&
                                secondItemModifier.valid_class === "error_check"
                                  ? "success_check"
                                  : "success_check",
                              secondary_items_modifier_items:
                                secondItemModifier?.secondary_items_modifier_items?.map(
                                  (secondaryItem) => {
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
                                      counter:
                                        secondaryItem.counter > 0
                                          ? secondaryItem.counter
                                          : 0,
                                      is_item_select:
                                        secondaryItem.is_item_select === true
                                          ? true
                                          : false,
                                      item_select_to_sale:
                                        secondaryItem.item_select_to_sale ===
                                        true
                                          ? true
                                          : false,
                                    };
                                  }
                                ),
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
              }
            ),
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
                    const newTotalPlus =
                      parseFloat(totalAmount) +
                      parseFloat(updateSecondaryItem?.price_info);
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
  };

  const handleModalDecrement = (
    modifierId,
    itemId,
    secondModifierId,
    secondItemId
  ) => {
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
                      const newTotalMinus =
                        parseFloat(totalAmount) -
                        parseFloat(updateSecondaryItem?.price_info);
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
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
                if (itemId === seconditems?.id) {
                  return {
                    ...seconditems,
                    secondary_item_modifiers:
                      seconditems?.secondary_item_modifiers?.map(
                        (secondItemModifier) => {
                          if (secondModifierId === secondItemModifier?.id) {
                            return {
                              ...secondItemModifier,
                              modifier_counter:
                                secondItemModifier?.modifier_counter > 0
                                  ? secondItemModifier?.modifier_counter - 1
                                  : 0,
                              is_modifier_clickable:
                                parseInt(secondItemModifier?.max_permitted) ===
                                parseInt(secondItemModifier?.modifier_counter)
                                  ? true
                                  : false,
                              permitt_max: secondItemModifier.max_permitted,
                              secondary_items_modifier_items:
                                secondItemModifier?.secondary_items_modifier_items?.map(
                                  (secondaryItem) => {
                                    if (secondItemId === secondaryItem?.id) {
                                      let getMobileDecrement =
                                        secondaryItem.counter > 0
                                          ? secondaryItem.counter - 1
                                          : 0;
                                      return {
                                        ...secondaryItem,
                                        counter:
                                          secondaryItem.counter > 0
                                            ? secondaryItem.counter - 1
                                            : 0,
                                        is_item_select:
                                          secondaryItem.counter > 0
                                            ? false
                                            : true,
                                        item_select_to_sale:
                                          getMobileDecrement > 0 ? true : false,
                                      };
                                    }

                                    return {
                                      ...secondaryItem,
                                      counter:
                                        secondaryItem.counter > 0
                                          ? secondaryItem.counter
                                          : 0,
                                      is_item_select:
                                        secondaryItem.is_item_select === true
                                          ? true
                                          : false,
                                      item_select_to_sale:
                                        secondaryItem.item_select_to_sale ===
                                        true
                                          ? true
                                          : false,
                                    };
                                  }
                                ),
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
              }
            ),
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
            modifier_secondary_items: modifier?.modifier_secondary_items?.map(
              (seconditems) => {
                if (itemId === seconditems?.id) {
                  return {
                    ...seconditems,
                    secondary_item_modifiers:
                      seconditems?.secondary_item_modifiers?.map(
                        (secondItemModifier) => {
                          if (secondModifierId === secondItemModifier?.id) {
                            let addClass = secondItemModifier.valid_class;
                            if (secondItemModifier?.modifier_counter === 0) {
                              if (
                                secondItemModifier.valid_class === "error_check"
                              ) {
                                addClass = "success_check";
                              } else {
                                addClass = "default_check";
                              }
                            }
                            return {
                              ...secondItemModifier,
                              is_modifier_selected:
                                parseInt(secondItemModifier?.modifier_counter) >
                                parseInt(0)
                                  ? true
                                  : false,
                              valid_class: addClass,
                            };
                          }

                          return secondItemModifier;
                        }
                      ),
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
    setSingleitem(updatedModifierSelected);
  };

  const handleQuantity = (event) => {
    setQuantity(event.target.value);
  };

  const handleSaveBtn = (modifierId, itemId) => {
    if (singleitem) {
      let countMinPermiModifier = 0;
      for (const parentModifier of singleitem.modifier_group) {
        if (modifierId === parentModifier.id) {
          for (const selectedItem of parentModifier.modifier_secondary_items) {
            if (itemId === selectedItem.id) {
              for (const childModi of selectedItem.secondary_item_modifiers) {
                if (
                  parseInt(childModi.min_permitted) > parseInt(0) &&
                  childModi?.is_modifier_selected === false
                ) {
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
        const newTotal =
          parseFloat(itemprice) + parseFloat(selectedModifierItemPrice);
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
  };

  useEffect(() => {
    if (ishandlecheckinputclicked) {
      const filterModifier = singleitem?.modifier_group?.find(
        (modifier) => handleCheckModifierId === modifier?.id
      );
      const countNumberOfCheck =
        filterModifier?.modifier_secondary_items?.filter(
          (item) => item.is_item_select === true
        );
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
      const filterModifier = singleitem?.modifier_group?.find(
        (modifier) => modifier?.id === ishandlemodalcheckinputparentmodifierID
      );
      const filterItems = filterModifier?.modifier_secondary_items?.find(
        (item) => item?.id === ishandlemodalcheckinputparentitemID
      );
      const secondaryFilterModifier =
        filterItems?.secondary_item_modifiers?.find(
          (secondaryModifier) =>
            secondaryModifier?.id === handlemodalcheckmodifierid
        );
      const countNumberOfCheckSecondaryItems =
        secondaryFilterModifier?.secondary_items_modifier_items?.filter(
          (secondaryItem) => secondaryItem?.is_item_select === true
        );

      const updateSingleItems = {
        ...singleitem,
        modifier_group: singleitem?.modifier_group?.map((modifier) => {
          if (ishandlemodalcheckinputparentmodifierID === modifier?.id) {
            return {
              ...modifier,
              modifier_secondary_items: modifier?.modifier_secondary_items?.map(
                (item) => {
                  if (ishandlemodalcheckinputparentitemID === item?.id) {
                    return {
                      ...item,
                      secondary_item_modifiers:
                        item?.secondary_item_modifiers?.map(
                          (secondaryModifier) => {
                            if (
                              handlemodalcheckmodifierid ===
                              secondaryModifier?.id
                            ) {
                              return {
                                ...secondaryModifier,
                                secondary_items_modifier_items:
                                  secondaryModifier?.secondary_items_modifier_items?.map(
                                    (secondaryItems) => {
                                      if (
                                        parseInt(
                                          secondaryModifier?.max_permitted
                                        ) ===
                                          parseInt(
                                            countNumberOfCheckSecondaryItems.length
                                          ) &&
                                        secondaryItems?.activeClass !== "mch"
                                      ) {
                                        return {
                                          ...secondaryItems,
                                          activeClass: "mchw",
                                          is_item_select: false,
                                        };
                                      }
                                      return secondaryItems;
                                    }
                                  ),
                              };
                            }
                            return secondaryModifier;
                          }
                        ),
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

  // Website Cart Button
  const handleAddtoCart = () => {
    if (singleitem) {
      // Count the number of modifier is min_permit is greater than zero.

      let countMinPermit = 0;
      for (const minPermit of singleitem?.modifier_group) {
        if (
          parseInt(minPermit?.min_permitted) > parseInt(0) &&
          minPermit?.is_modifier_selected === false
        ) {
          countMinPermit += 1;
        }
      }

      let indexArrForScroll = [];

      if (parseInt(countMinPermit) > parseInt(0)) {
        const addErrorClassinModifier = {
          ...singleitem,
          modifier_group: singleitem?.modifier_group?.map(
            (addErrorClass, index) => {
              let addClass = addErrorClass?.valid_class;
              if (
                parseInt(addErrorClass?.min_permitted) > parseInt(0) &&
                addErrorClass.is_modifier_selected === false
              ) {
                addClass = "error_check";
                indexArrForScroll.push(index);
              }

              return {
                ...addErrorClass,
                valid_class: addClass,
              };
            }
          ),
        };

        setSingleitem(addErrorClassinModifier);
      } else {
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
        for (
          let indexArr = 0;
          indexArr < indexArrForScroll.length;
          indexArr++
        ) {
          if (indexArr === 0) {
            let element = document.querySelector(
              `.section${indexArrForScroll[indexArr]}`
            );
            element.scrollIntoView({ behavior: "smooth" });
            return;
          }
        }
      }
    }
  };

  const handleMobileAddtoCart = () => {
    if (singleitem) {
      // Count the number of modifier is min_permit is greater than zero.

      let countMinPermit = 0;
      for (const minPermit of singleitem?.modifier_group) {
        if (
          parseInt(minPermit?.min_permitted) > parseInt(0) &&
          minPermit?.is_modifier_selected === false
        ) {
          countMinPermit += 1;
        }
      }

      let indexArrForScroll = [];

      if (parseInt(countMinPermit) > parseInt(0)) {
        const addErrorClassinModifier = {
          ...singleitem,
          modifier_group: singleitem?.modifier_group?.map(
            (addErrorClass, index) => {
              let addClass = addErrorClass?.valid_class;
              if (
                parseInt(addErrorClass?.min_permitted) > parseInt(0) &&
                addErrorClass.is_modifier_selected === false
              ) {
                addClass = "error_check";
                indexArrForScroll.push(index);
              }

              return {
                ...addErrorClass,
                valid_class: addClass,
              };
            }
          ),
        };

        setSingleitem(addErrorClassinModifier);
      } else {
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
        for (
          let indexArr = 0;
          indexArr < indexArrForScroll.length;
          indexArr++
        ) {
          if (indexArr === 0) {
            let element = document.querySelector(
              `.msection${indexArrForScroll[indexArr]}`
            );
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
  };

  // Mobile Decrement quantity
  const handleMobileQuantityDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevData) => prevData - 1);
    }
  };

  const handleMobileQuantityIncrement = () => {
    setQuantity((prevData) => prevData + 1);
  };

  const handleMobileModifierToggle = (modifierId) => {
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
  };

  const handleModalModifierToggle = (modifierId, itemId, secondModifierId) => {
    const updateSecondaryModifierToggle = {
      ...singleitem,
      modifier_group: singleitem?.modifier_group?.map((modifierToggle) => {
        if (modifierId === modifierToggle?.id) {
          return {
            ...modifierToggle,
            modifier_secondary_items:
              modifierToggle?.modifier_secondary_items?.map((secondItem) => {
                if (itemId === secondItem?.id) {
                  return {
                    ...secondItem,
                    secondary_item_modifiers:
                      secondItem?.secondary_item_modifiers?.map(
                        (secondaryModifier) => {
                          if (secondModifierId === secondaryModifier?.id) {
                            return {
                              ...secondaryModifier,
                              is_second_item_modifier_clicked:
                                !secondaryModifier?.is_second_item_modifier_clicked,
                            };
                          }

                          return secondaryModifier;
                        }
                      ),
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
  };

  const handleBackArrow = (modifierId, itemId) => {
    if (singleitem) {
      let countMinPermiModifier = 0;
      for (const parentModifier of singleitem.modifier_group) {
        if (modifierId === parentModifier.id) {
          for (const selectedItem of parentModifier.modifier_secondary_items) {
            if (itemId === selectedItem.id) {
              for (const childModi of selectedItem.secondary_item_modifiers) {
                if (
                  parseInt(childModi.min_permitted) > parseInt(0) &&
                  childModi?.is_modifier_selected === false
                ) {
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
          modifier_group: updateNestModifierError?.modifier_group?.map(
            (updateModifierClass) => {
              if (modifierId === updateModifierClass.id) {
                return {
                  ...updateModifierClass,
                  valid_class:
                    getTheCounter > 0 ? "error_check" : "success_check",
                  is_modifier_selected: getTheCounter > 0 ? false : true,
                };
              }
              return updateModifierClass;
            }
          ),
        };

        setSingleitem(updateClassError);
      } else {
        let totalSubAmount = 0;
        if (singleitem) {
          for (const modifier of singleitem?.modifier_group) {
            if (modifierId === modifier.id) {
              for (const itemTotal of modifier.modifier_secondary_items) {
                if (itemId === itemTotal.id) {
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
  };

  return (
    <>
      <div className="single-product">
        <div className="e5 e6">
          <div className="single-product-level-one-div">
            <div className="level-one-div-nested-one">
              <Link className="back-btn" href="/">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className="back-svg"
                >
                  <path d="M22 13.5H6.3l5.5 7.5H8.3l-6.5-9 6.5-9h3.5l-5.5 7.5H22v3z"></path>
                </svg>
                <div className="spacer _8"></div>
                Back to list
              </Link>

              <button
                className="cross-btn"
                onClick={() => setIsitemclicked(false)}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  className="back-svg"
                >
                  <line
                    x1="1"
                    y1="11"
                    x2="11"
                    y2="1"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="11"
                    y2="11"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
                <span>Chocolate Strawberry Cookie Dough</span>
              </button>

              {singleitem?.image_url && (
                <div className="product-img">
                  <div className="bz">
                    <div className="product-img-div-one-div">
                      <div className="product-img-div-one-div-nested">
                        <div className="product-img-div-one-div-nested-div">
                          <div className="product-img-zoom">
                            <img
                              alt={singleitem?.title}
                              role="presentation"
                              src={singleitem?.image_url}
                              className="product-img-display"
                            />
                            <div className="img-hr"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="level-one-div-nested-two">
              <div className="product-title">
                <h2 className="product-h2"></h2>
                <h1 className="product-h1">{singleitem?.title}</h1>
                <span className="product-price-span">
                  {singleitem?.country_price_symbol}
                  {parseFloat(singleitem?.price).toFixed(2)}
                </span>
                <div className="product_h8"></div>

                <div className="product-description">
                  <div className="product-description-div">
                    {singleitem?.description}
                  </div>
                </div>

                <div className="product_h8"></div>
              </div>

              <div className="product-height"></div>

              <ul className="product-ul">
                {singleitem?.modifier_group?.map((modifier, index) => {
                  return (
                    // {/* minimum option = '1' and maximum option = 1 and single item select = 1 */}
                    modifier?.select_single_option === 1 &&
                      modifier?.min_permitted === 1 &&
                      modifier?.max_permitted === 1 ? (
                      <li key={index} className={`section${index}`}>
                        <div>
                          <div>
                            <hr className="product_hr"></hr>
                            <div className="product-list-div">
                              <div className="product-modifier-groups">
                                <div className="product-modifier-name">
                                  {modifier?.title}
                                </div>
                                <div className="product-modifier-option">
                                  <span>Choose {modifier?.max_permitted}</span>
                                </div>
                              </div>
                              <div className="product-required">
                                <div
                                  className={`product-required-div ${modifier?.valid_class}`}
                                >
                                  {" "}
                                  {parseInt(modifier?.min_permitted) >
                                  parseInt(0)
                                    ? "Required"
                                    : "Optional"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hg">
                            {modifier?.modifier_secondary_items?.map(
                              (seconditems, indexSecondItem) => {
                                return (
                                  <div key={indexSecondItem}>
                                    <hr className="product-modifier-items-hr"></hr>
                                    <div
                                      className="product-modifier-item-detail"
                                      onClick={() =>
                                        handleRadioInput(
                                          modifier?.id,
                                          seconditems?.id,
                                          seconditems?.title,
                                          parseInt(
                                            seconditems
                                              ?.secondary_item_modifiers.length
                                          )
                                        )
                                      }
                                    >
                                      {parseInt(
                                        seconditems?.secondary_item_modifiers
                                          ?.length
                                      ) > parseInt(0) && (
                                        <div className="poquickreview-modal">
                                          <div className="c8c7cuquickreview-modal">
                                            <svg
                                              style={{ cursor: "pointer" }}
                                              width="24px"
                                              height="24px"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                              aria-hidden="true"
                                              focusable="false"
                                            >
                                              <path
                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                fill="#AFAFAF"
                                                transform="rotate(90, 12, 12)"
                                              ></path>
                                            </svg>
                                          </div>
                                        </div>
                                      )}
                                      <input
                                        type="radio"
                                        className="radio-input"
                                      ></input>
                                      {/* <label className="modifier-product-item-name nv"> select radio */}
                                      <label
                                        className={`modifier-product-item-name ${seconditems?.activeClass}`}
                                      >
                                        <div className="spacer _16"></div>
                                        <div className="modifier-product-item-name-one-div">
                                          <div className="modifier-product-item-name-one-nested-div">
                                            <div className="modifier-product-item-name-one-nested-div-one">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                  {seconditems?.title}
                                                </div>
                                                <div className="spacer _8"></div>
                                                {parseInt(seconditems?.price) >
                                                  parseInt(0) && (
                                                  <div className="modifier-group-price">
                                                    {
                                                      seconditems?.country_price_symbol
                                                    }
                                                    {getAmountConvertToFloatWithFixed(
                                                      seconditems?.price,
                                                      2
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </li>
                    ) : // {/* minimum option = '0' and maximum option = 1 and single item select = 1 */}
                    modifier?.select_single_option === 1 &&
                      modifier?.min_permitted === 0 &&
                      modifier?.max_permitted >= 1 ? (
                      <li key={index} className={`section${index}`}>
                        <div>
                          <div>
                            <hr className="product_hr"></hr>

                            <div className="product-list-div">
                              <div className="product-modifier-groups">
                                <div className="product-modifier-name">
                                  {modifier?.title}
                                </div>
                                <div className="product-modifier-option">
                                  <span>
                                    Choose up to {modifier?.max_permitted}
                                  </span>
                                </div>
                              </div>
                              <div className="product-required">
                                <div
                                  className={`product-required-div ${modifier?.valid_class}`}
                                >
                                  {parseInt(modifier?.min_permitted) >
                                  parseInt(0)
                                    ? "Required"
                                    : "Optional"}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* List of all modifier group products */}
                          <div className="hg">
                            {modifier?.modifier_secondary_items?.map(
                              (seconditems, indexSecondItem) => {
                                return (
                                  <div key={indexSecondItem}>
                                    <hr className="product-modifier-items-hr"></hr>
                                    {seconditems.activeClass !== "mchw" ? (
                                      <div
                                        className="product-modifier-item-detail"
                                        onClick={() =>
                                          handleCheckInput(
                                            modifier?.id,
                                            seconditems?.id,
                                            parseInt(
                                              seconditems
                                                ?.secondary_item_modifiers
                                                .length
                                            )
                                          )
                                        }
                                      >
                                        <input
                                          type="checkbox"
                                          className="checkbox-input"
                                        ></input>
                                        <label
                                          className={`modifier-product-item-name-checkbox ${seconditems.activeClass}`}
                                        >
                                          <div className="spacer _16"></div>
                                          <div className="modifier-product-item-name-one-div">
                                            <div className="modifier-product-item-name-one-nested-div">
                                              <div className="modifier-product-item-name-one-nested-div-one">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                  <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                    {seconditems?.title}
                                                  </div>
                                                  <div className="spacer _8"></div>
                                                  {getAmountConvertToFloatWithFixed(
                                                    seconditems?.price,
                                                    2
                                                  ) >
                                                    getAmountConvertToFloatWithFixed(
                                                      0,
                                                      2
                                                    ) && (
                                                    <div className="modifier-group-price">
                                                      {
                                                        seconditems?.country_price_symbol
                                                      }
                                                      {getAmountConvertToFloatWithFixed(
                                                        seconditems?.price,
                                                        2
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    ) : (
                                      <div className="product-modifier-item-detail">
                                        <input
                                          type="checkbox"
                                          className="checkbox-input"
                                        ></input>
                                        <label
                                          className={`modifier-product-item-name-checkbox ${seconditems.activeClass}`}
                                        >
                                          <div className="spacer _16"></div>
                                          <div className="modifier-product-item-name-one-div">
                                            <div className="modifier-product-item-name-one-nested-div">
                                              <div className="modifier-product-item-name-one-nested-div-one">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                  <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                    {seconditems?.title}
                                                  </div>
                                                  <div className="spacer _8"></div>
                                                  {getAmountConvertToFloatWithFixed(
                                                    seconditems?.price,
                                                    2
                                                  ) >
                                                    getAmountConvertToFloatWithFixed(
                                                      0,
                                                      2
                                                    ) && (
                                                    <div className="modifier-group-price">
                                                      {
                                                        seconditems?.country_price_symbol
                                                      }
                                                      {parseFloat(
                                                        seconditems?.price
                                                      ).toFixed(2)}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </li>
                    ) : (
                      // (modifier?.select_single_option > 1 && (modifier?.min_permitted === 0 && modifier?.max_permitted > 1)) &&
                      // {/* minimum option = '- / 0' and maximum option = 5 and single item select = 2 */}
                      <li key={index} className={`section${index}`}>
                        <div>
                          <div>
                            <hr className="product_hr"></hr>
                            <div className="product-list-div">
                              <div className="product-modifier-groups">
                                <div className="product-modifier-name">
                                  {modifier?.title}
                                </div>
                                <div className="product-modifier-option">
                                  <span>
                                    Choose up to {modifier?.max_permitted}
                                  </span>
                                </div>
                              </div>
                              <div className="product-required">
                                <div
                                  className={`product-required-div ${modifier?.valid_class}`}
                                >
                                  {parseInt(modifier?.min_permitted) >
                                  parseInt(0)
                                    ? "Required"
                                    : "Optional"}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* List of all modifier group products */}
                          <div className="hg">
                            {modifier?.modifier_secondary_items?.map(
                              (seconditems, indexSecondItem) => {
                                return (
                                  <div key={indexSecondItem}>
                                    <hr className="product-modifier-items-hr"></hr>

                                    <div className="product-modifier-item-detail">
                                      <div className="modifier-product-item-name-inc-dec">
                                        <div className="modifier-inc-dec">
                                          <button
                                            className="modifier-btn"
                                            disabled={
                                              seconditems?.is_item_select
                                            }
                                            onClick={() =>
                                              handleDecrement(
                                                modifier?.id,
                                                seconditems?.id
                                              )
                                            }
                                          >
                                            <div className="modifier-btn-div">
                                              <div className="modifier-btn-svg">
                                                <svg
                                                  width="24px"
                                                  height="24px"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  aria-hidden="true"
                                                  focusable="false"
                                                >
                                                  <path
                                                    d="m7.33325 13v-2h9.33335v2z"
                                                    fill="#000000"
                                                  ></path>
                                                </svg>
                                              </div>
                                            </div>
                                          </button>

                                          <div className="incremented-values">
                                            {seconditems?.counter}
                                          </div>

                                          <button
                                            className="modifier-btn"
                                            disabled={
                                              parseInt(
                                                modifier?.max_permitted
                                              ) ===
                                              parseInt(
                                                modifier?.modifier_counter
                                              )
                                                ? true
                                                : false
                                            }
                                            onClick={() =>
                                              handleIncrement(
                                                modifier?.id,
                                                seconditems?.id
                                              )
                                            }
                                          >
                                            <div className="modifier-btn-div">
                                              <div className="modifier-btn-svg">
                                                <svg
                                                  width="24px"
                                                  height="24px"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  aria-hidden="true"
                                                  focusable="false"
                                                >
                                                  <path
                                                    d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z"
                                                    fill="#000000"
                                                  ></path>
                                                </svg>
                                              </div>
                                            </div>
                                          </button>
                                        </div>

                                        <div className="spacer _16"></div>
                                        <div className="modifier-product-item-name-one-div">
                                          <div className="modifier-product-item-name-one-nested-div">
                                            <div className="modifier-product-item-name-one-nested-div-one">
                                              <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                  {seconditems?.title}
                                                </div>
                                                <div className="spacer _8"></div>
                                                {getAmountConvertToFloatWithFixed(
                                                  seconditems?.price,
                                                  2
                                                ) >
                                                  getAmountConvertToFloatWithFixed(
                                                    0,
                                                    2
                                                  ) && (
                                                  <div className="modifier-group-price">
                                                    {
                                                      seconditems?.country_price_symbol
                                                    }
                                                    {getAmountConvertToFloatWithFixed(
                                                      seconditems?.price,
                                                      2
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>

              <div className="product-top-padding-2"></div>

              <div className="of">
                <hr className="ed b9 og ho"></hr>
                <div className="add-to-cart-btn-no-selection">
                  <div className="single-item-qty-div">
                    <div className="qty-selector">
                      <div className="qty-selector-div">
                        <select className="qty-select" onClick={handleQuantity}>
                          <option value="1" className="co">
                            1
                          </option>
                          <option value="2" className="co">
                            2
                          </option>
                          <option value="3" className="co">
                            3
                          </option>
                          <option value="4" className="co">
                            4
                          </option>
                          <option value="5" className="co">
                            5
                          </option>
                          <option value="6" className="co">
                            6
                          </option>
                          <option value="7" className="co">
                            7
                          </option>
                          <option value="8" className="co">
                            8
                          </option>
                          <option value="9" className="co">
                            9
                          </option>
                          <option value="10" className="co">
                            10
                          </option>
                          <option value="11" className="co">
                            11
                          </option>
                          <option value="12" className="co">
                            12
                          </option>
                          <option value="13" className="co">
                            13
                          </option>
                          <option value="14" className="co">
                            14
                          </option>
                          <option value="15" className="co">
                            15
                          </option>
                          <option value="16" className="co">
                            16
                          </option>
                          <option value="17" className="co">
                            17
                          </option>
                          <option value="18" className="co">
                            18
                          </option>
                          <option value="19" className="co">
                            19
                          </option>
                          <option value="20" className="co">
                            20
                          </option>
                          <option value="21" className="co">
                            21
                          </option>
                          <option value="22" className="co">
                            22
                          </option>
                          <option value="23" className="co">
                            23
                          </option>
                          <option value="24" className="co">
                            24
                          </option>
                          <option value="25" className="co">
                            25
                          </option>
                          <option value="26" className="co">
                            26
                          </option>
                          <option value="27" className="co">
                            27
                          </option>
                          <option value="28" className="co">
                            28
                          </option>
                          <option value="29" className="co">
                            29
                          </option>
                          <option value="30" className="co">
                            30
                          </option>
                          <option value="31" className="co">
                            31
                          </option>
                          <option value="32" className="co">
                            32
                          </option>
                          <option value="33" className="co">
                            33
                          </option>
                          <option value="34" className="co">
                            34
                          </option>
                          <option value="35" className="co">
                            35
                          </option>
                          <option value="36" className="co">
                            36
                          </option>
                          <option value="37" className="co">
                            37
                          </option>
                          <option value="38" className="co">
                            38
                          </option>
                          <option value="39" className="co">
                            39
                          </option>
                          <option value="40" className="co">
                            40
                          </option>
                          <option value="41" className="co">
                            41
                          </option>
                          <option value="42" className="co">
                            42
                          </option>
                          <option value="43" className="co">
                            43
                          </option>
                          <option value="44" className="co">
                            44
                          </option>
                          <option value="45" className="co">
                            45
                          </option>
                          <option value="46" className="co">
                            46
                          </option>
                          <option value="47" className="co">
                            47
                          </option>
                          <option value="48" className="co">
                            48
                          </option>
                          <option value="49" className="co">
                            49
                          </option>
                          <option value="50" className="co">
                            50
                          </option>
                          <option value="51" className="co">
                            51
                          </option>
                          <option value="52" className="co">
                            52
                          </option>
                          <option value="53" className="co">
                            53
                          </option>
                          <option value="54" className="co">
                            54
                          </option>
                          <option value="55" className="co">
                            55
                          </option>
                          <option value="56" className="co">
                            56
                          </option>
                          <option value="57" className="co">
                            57
                          </option>
                          <option value="58" className="co">
                            58
                          </option>
                          <option value="59" className="co">
                            59
                          </option>
                          <option value="60" className="co">
                            60
                          </option>
                          <option value="61" className="co">
                            61
                          </option>
                          <option value="62" className="co">
                            62
                          </option>
                          <option value="63" className="co">
                            63
                          </option>
                          <option value="64" className="co">
                            64
                          </option>
                          <option value="65" className="co">
                            65
                          </option>
                          <option value="66" className="co">
                            66
                          </option>
                          <option value="67" className="co">
                            67
                          </option>
                          <option value="68" className="co">
                            68
                          </option>
                          <option value="69" className="co">
                            69
                          </option>
                          <option value="70" className="co">
                            70
                          </option>
                          <option value="71" className="co">
                            71
                          </option>
                          <option value="72" className="co">
                            72
                          </option>
                          <option value="73" className="co">
                            73
                          </option>
                          <option value="74" className="co">
                            74
                          </option>
                          <option value="75" className="co">
                            75
                          </option>
                          <option value="76" className="co">
                            76
                          </option>
                          <option value="77" className="co">
                            77
                          </option>
                          <option value="78" className="co">
                            78
                          </option>
                          <option value="79" className="co">
                            79
                          </option>
                          <option value="80" className="co">
                            80
                          </option>
                          <option value="81" className="co">
                            81
                          </option>
                          <option value="82" className="co">
                            82
                          </option>
                          <option value="83" className="co">
                            83
                          </option>
                          <option value="84" className="co">
                            84
                          </option>
                          <option value="85" className="co">
                            85
                          </option>
                          <option value="86" className="co">
                            86
                          </option>
                          <option value="87" className="co">
                            87
                          </option>
                          <option value="88" className="co">
                            88
                          </option>
                          <option value="89" className="co">
                            89
                          </option>
                          <option value="90" className="co">
                            90
                          </option>
                          <option value="91" className="co">
                            91
                          </option>
                          <option value="92" className="co">
                            92
                          </option>
                          <option value="93" className="co">
                            93
                          </option>
                          <option value="94" className="co">
                            94
                          </option>
                          <option value="95" className="co">
                            95
                          </option>
                          <option value="96" className="co">
                            96
                          </option>
                          <option value="97" className="co">
                            97
                          </option>
                          <option value="98" className="co">
                            98
                          </option>
                          <option value="99" className="co">
                            99
                          </option>
                        </select>

                        <div className="svg-div">
                          <div className="svg-div-one">
                            <svg
                              width="24px"
                              height="24px"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                fill="currentColor"
                                transform="rotate(180, 12, 12)"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="da c7"></div>
                  <button
                    className="add-to-cart-btn-item"
                    onClick={handleAddtoCart}
                  >
                    Add {quantity} to order cell
                    <span className="add-cart-span">&nbsp;•&nbsp;</span>
                    {getCountryCurrencySymbol()}{" "}
                    {parseFloat(quantity * itemprice).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Items bough together */}
      </div>

      {/* Mobile Responsive */}
      <div>
        <div>
          <div className="agassingle-product" onWheel={handleMScroll}>
            <div
              style={{
                width: "1px",
                height: "0px",
                padding: "0px",
                overflow: "hidden",
                position: "fixed",
                top: "1px",
                left: "1px",
              }}
            ></div>
            <div>
              <div className="arc2single-product">
                <div className="albfsingle-product">
                  <div className="akb0cccdsingle-product">
                    <div className="ctascusingle-product">
                      <div className="agaksingle-product">
                        <div className="agasbcbksingle-product"></div>
                        <div className="akcyczbfsingle-product">
                          <div className="d5single-product">
                            <Link
                              className="d6aqbfc4single-product-cross-btn"
                              href="/"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <title>X</title>
                                <path
                                  d="m21.1 5.1-2.2-2.2-6.9 7-6.9-7-2.2 2.2 7 6.9-7 6.9 2.2 2.2 6.9-7 6.9 7 2.2-2.2-7-6.9 7-6.9Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </Link>
                          </div>
                          {/* 
                                        <div className="bre3dpsingle-product">{singleitem?.title}</div>
                                        <div className="e9single-product"></div> */}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="akbkbxc3single-product">
                        <div className="bkeaebalsingle-product">
                          <div className="ecsingle-product">
                            <div className="akedeebkefsingle-product">
                              {/* <img alt="" role="presentation" src="https://tb-static.uber.com/prod/image-proc/processed_images/3bef7aecf15103ae8c8a02cf68277fc8/859baff1d76042a45e319d1de80aec7a.jpeg" className="egbkaeeheisingle-productimg" /> */}
                              <img
                                role="presentation"
                                src={singleitem?.image_url}
                                alt={singleitem?.title}
                                className="egbkaeeheisingle-productimg"
                              />
                              <div className="agasatbdbcajsingle-product"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="eksingle-product">
                      <div className="bnelbpemeneoalbfsingle-product">
                        {singleitem?.title}
                      </div>
                      <span
                        data-testid="rich-text"
                        className="fnfofpbnfqbpfrb1single-product-price"
                      >
                        {singleitem?.country_price_symbol}
                        {parseFloat(singleitem?.price).toFixed(2)}
                      </span>
                      <div className="epeqsingle-product-div"></div>
                      <div className="er">
                        <div className="bresbtdqetbxsingle-product">
                          {singleitem?.description}
                        </div>
                      </div>
                    </div>

                    <ul className="ftsingle-productul">
                      {singleitem?.modifier_group?.map((modifier, index) => {
                        return parseInt(
                          modifier?.modifier_secondary_items?.length
                        ) > parseInt(0) &&
                          // {/* minimum option = '1' and maximum option = 1 and single item select = 1 */}
                          modifier?.select_single_option === 1 &&
                          modifier?.min_permitted === 1 &&
                          modifier?.max_permitted === 1 ? (
                          <li key={index} className={`msection${index}`}>
                            <div className="fusingle-productlidiv">
                              <hr className="efeqeofvsingle-product"></hr>

                              <div
                                className="fwsingle-product"
                                onClick={() =>
                                  handleMobileModifierToggle(modifier?.id)
                                }
                              >
                                <div className="alaqd0fxsingle-product">
                                  <div className="alamsingle-product">
                                    <div className="bnfrbpfsingle-product">
                                      {modifier?.title}
                                    </div>
                                    <div className="bresbtdqfysingle-product">
                                      <span>
                                        Choose {modifier?.max_permitted}
                                      </span>
                                      <div className="fzsingle-product">
                                        <div
                                          className={`g0afg1single-product ${modifier?.valid_class}`}
                                        >
                                          {parseInt(modifier?.min_permitted) >
                                          parseInt(0)
                                            ? "Required"
                                            : "Optional"}
                                        </div>
                                      </div>
                                    </div>
                                    {!modifier?.is_toggle_active && (
                                      <div>
                                        {parseInt(
                                          modifier?.selected_item_name?.length
                                        ) > parseInt(20)
                                          ? modifier?.selected_item_name?.substring(
                                              0,
                                              20
                                            ) + "..."
                                          : modifier?.selected_item_name}
                                      </div>
                                    )}
                                  </div>

                                  <div className="single-product-svg-div accordion">
                                    <div className="single-product-svg-div-one">
                                      {modifier?.is_toggle_active ? (
                                        <svg
                                          className="bottom-arrow-head-svg"
                                          width="30px"
                                          height="30px"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                          focusable="false"
                                        >
                                          <path
                                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                            fill="currentColor"
                                            transform="rotate(180, 12, 12)"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          className="rigth-arrow-head-svg"
                                          width="30px"
                                          height="30px"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                          focusable="false"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <path
                                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                            fill="currentColor"
                                            transform="rotate(90, 12, 12)"
                                          ></path>
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Listed Data */}
                              {
                                <div
                                  className={`g5single-product ${
                                    modifier?.is_toggle_active ? "show" : "fade"
                                  }`}
                                >
                                  {modifier?.modifier_secondary_items?.map(
                                    (mobileSecondItems, index) => {
                                      return (
                                        <>
                                          <div
                                            className="alakg6bfsingle-product"
                                            key={index}
                                            onClick={() =>
                                              handleRadioInput(
                                                modifier?.id,
                                                mobileSecondItems?.id,
                                                mobileSecondItems?.title,
                                                parseInt(
                                                  mobileSecondItems
                                                    ?.secondary_item_modifiers
                                                    .length
                                                )
                                              )
                                            }
                                          >
                                            {parseInt(
                                              mobileSecondItems
                                                ?.secondary_item_modifiers
                                                ?.length
                                            ) > parseInt(0) && (
                                              <div className="poquickreview-modal">
                                                <div className="c8c7cuquickreview-modal">
                                                  <svg
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    width="30px"
                                                    height="30px"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    focusable="false"
                                                  >
                                                    <path
                                                      d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                      fill="#AFAFAF"
                                                      transform="rotate(90, 12, 12)"
                                                    ></path>
                                                  </svg>
                                                </div>
                                              </div>
                                            )}
                                            <input
                                              type="radio"
                                              className="radio-input"
                                            ></input>

                                            <label
                                              className={`brbsdpdqbkalbfafg6single-productlable ${mobileSecondItems?.activeClass}`}
                                            >
                                              <div className="spacer _16"></div>
                                              <div className="e4ald0gisingle-product">
                                                <div className="ale4amc4gjgkglsingle-product">
                                                  <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                      <div className="bresdpg4gosingle-product">
                                                        {
                                                          mobileSecondItems?.title
                                                        }
                                                      </div>
                                                      <div className="spacer _8"></div>
                                                      {getAmountConvertToFloatWithFixed(
                                                        mobileSecondItems?.price,
                                                        2
                                                      ) >
                                                        getAmountConvertToFloatWithFixed(
                                                          0,
                                                          2
                                                        ) && (
                                                        <div className="bresbtdqb1bzsingle-productincdecprice">
                                                          {getCountryCurrencySymbol()}
                                                          {getAmountConvertToFloatWithFixed(
                                                            mobileSecondItems?.price,
                                                            2
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </label>
                                          </div>

                                          <hr className="efbvgpgq"></hr>
                                        </>
                                      );
                                    }
                                  )}
                                </div>
                              }
                            </div>
                          </li>
                        ) : // {/* minimum option = '0' and maximum option = 1 and single item select = 1 */}
                        modifier?.select_single_option === 1 &&
                          modifier?.min_permitted === 0 &&
                          modifier?.max_permitted >= 1 ? (
                          <li key={index} className={`msection${index}`}>
                            <div className="fusingle-productlidiv">
                              <hr className="efeqeofvsingle-product"></hr>

                              <div
                                className="fwsingle-product"
                                onClick={() =>
                                  handleMobileModifierToggle(modifier?.id)
                                }
                              >
                                <div className="alaqd0fxsingle-product">
                                  <div className="alamsingle-product">
                                    <div className="bnfrbpfsingle-product">
                                      {modifier?.title}
                                    </div>
                                    <div className="bresbtdqfysingle-product">
                                      <span>
                                        Choose {modifier?.max_permitted}
                                      </span>
                                      <div className="fzsingle-product">
                                        <div
                                          className={`g0afg1single-product ${modifier?.valid_class}`}
                                        >
                                          {parseInt(modifier?.min_permitted) >
                                          parseInt(0)
                                            ? "Required"
                                            : "Optional"}
                                        </div>
                                      </div>
                                    </div>
                                    {!modifier?.is_toggle_active &&
                                      modifier?.modifier_secondary_items?.map(
                                        (displaySelectedItems, index) => {
                                          return (
                                            displaySelectedItems?.is_item_select && (
                                              <div key={index}>
                                                {parseInt(
                                                  displaySelectedItems?.title
                                                    ?.length
                                                ) > parseInt(20)
                                                  ? displaySelectedItems?.title?.substring(
                                                      0,
                                                      20
                                                    ) + "..."
                                                  : displaySelectedItems?.title}
                                              </div>
                                            )
                                          );
                                        }
                                      )}
                                  </div>
                                  <div
                                    className="single-product-svg-div accordion"
                                    onClick={() => setIsaccordianclicked(true)}
                                  >
                                    <div className="single-product-svg-div-one">
                                      {modifier?.is_toggle_active ? (
                                        <svg
                                          className="bottom-arrow-head-svg"
                                          width="30px"
                                          height="30px"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                          focusable="false"
                                        >
                                          <path
                                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                            fill="currentColor"
                                            transform="rotate(180, 12, 12)"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          className="rigth-arrow-head-svg"
                                          width="30px"
                                          height="30px"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                          focusable="false"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <path
                                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                            fill="currentColor"
                                            transform="rotate(90, 12, 12)"
                                          ></path>
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Listed Data */}
                              {
                                <div
                                  className={`g5single-product ${
                                    modifier?.is_toggle_active ? "show" : "fade"
                                  }`}
                                >
                                  {modifier?.modifier_secondary_items?.map(
                                    (mobileSecondItems, index) => {
                                      return mobileSecondItems.activeClass !==
                                        "mchw" ? (
                                        <div
                                          key={index}
                                          onClick={() =>
                                            handleCheckInput(
                                              modifier?.id,
                                              mobileSecondItems?.id,
                                              parseInt(
                                                mobileSecondItems
                                                  ?.secondary_item_modifiers
                                                  .length
                                              )
                                            )
                                          }
                                        >
                                          <div className="alakg6bfsingle-product">
                                            <input
                                              type="checkbox"
                                              className="checkbox-input"
                                            />

                                            <label
                                              className={`brbsdpdqbkalbfafg6single-productlablecheck ${mobileSecondItems?.activeClass}`}
                                            >
                                              <div className="spacer _16"></div>
                                              <div className="e4ald0gisingle-product">
                                                <div className="ale4amc4gjgkglsingle-product">
                                                  <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                      <div className="bresdpg4gosingle-product">
                                                        {
                                                          mobileSecondItems?.title
                                                        }
                                                      </div>
                                                      <div className="spacer _8"></div>
                                                      {getAmountConvertToFloatWithFixed(
                                                        mobileSecondItems?.price,
                                                        2
                                                      ) >
                                                        getAmountConvertToFloatWithFixed(
                                                          0,
                                                          2
                                                        ) && (
                                                        <div className="bresbtdqb1bzsingle-productincdecprice">
                                                          {
                                                            mobileSecondItems?.country_price_symbol
                                                          }
                                                          {getAmountConvertToFloatWithFixed(
                                                            mobileSecondItems?.price,
                                                            2
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </label>
                                          </div>
                                          <hr className="efbvgpgq"></hr>
                                        </div>
                                      ) : (
                                        <div key={index}>
                                          <div className="alakg6bfsingle-product">
                                            <input
                                              type="checkbox"
                                              className="checkbox-input"
                                            />

                                            <label
                                              className={`brbsdpdqbkalbfafg6single-productlablecheck ${mobileSecondItems?.activeClass}`}
                                            >
                                              <div className="spacer _16"></div>
                                              <div className="e4ald0gisingle-product">
                                                <div className="ale4amc4gjgkglsingle-product">
                                                  <div className="alaqsingle-product">
                                                    <div className="alamgmgnsingle-product">
                                                      <div className="bresdpg4gosingle-product">
                                                        {
                                                          mobileSecondItems?.title
                                                        }
                                                      </div>
                                                      <div className="spacer _8"></div>
                                                      {getAmountConvertToFloatWithFixed(
                                                        mobileSecondItems?.price,
                                                        2
                                                      ) >
                                                        getAmountConvertToFloatWithFixed(
                                                          0,
                                                          2
                                                        ) && (
                                                        <div className="bresbtdqb1bzsingle-productincdecprice">
                                                          {
                                                            mobileSecondItems?.country_price_symbol
                                                          }
                                                          {getAmountConvertToFloatWithFixed(
                                                            mobileSecondItems?.price,
                                                            2
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </label>
                                          </div>
                                          <hr className="efbvgpgq"></hr>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              }
                            </div>
                          </li>
                        ) : (
                          // (modifier?.select_single_option > 1 && (modifier?.min_permitted === 0 && modifier?.max_permitted > 1)) &&
                          // {/* minimum option = '- / 0' and maximum option = 5 and single item select = 2 */}
                          <li key={index} className={`msection${index}`}>
                            <div className="fusingle-productlidiv">
                              <hr className="efeqeofvsingle-product"></hr>

                              <div
                                className="fwsingle-product"
                                onClick={() =>
                                  handleMobileModifierToggle(modifier?.id)
                                }
                              >
                                <div className="alaqd0fxsingle-product">
                                  <div className="alamsingle-product">
                                    <div className="bnfrbpfsingle-product">
                                      {modifier?.title}
                                    </div>
                                    <div className="bresbtdqfysingle-product">
                                      <span>
                                        Choose {modifier?.max_permitted}
                                      </span>
                                      <div className="fzsingle-product">
                                        <div
                                          className={`g0afg1single-product ${modifier?.valid_class}`}
                                        >
                                          {parseInt(modifier?.min_permitted) >
                                          parseInt(0)
                                            ? "Required"
                                            : "Optional"}
                                        </div>
                                      </div>
                                    </div>
                                    {!modifier?.is_toggle_active &&
                                      modifier?.modifier_secondary_items?.map(
                                        (displaySelectedItems, index) => {
                                          return (
                                            parseInt(
                                              displaySelectedItems?.counter
                                            ) > parseInt(0) && (
                                              <div key={index}>
                                                {parseInt(
                                                  displaySelectedItems?.title
                                                    ?.length
                                                ) > parseInt(20)
                                                  ? displaySelectedItems?.title?.substring(
                                                      0,
                                                      20
                                                    ) + "..."
                                                  : displaySelectedItems?.title}
                                              </div>
                                            )
                                          );
                                        }
                                      )}
                                  </div>
                                  <div className="single-product-svg-div accordion">
                                    <div className="single-product-svg-div-one">
                                      {modifier?.is_toggle_active ? (
                                        <svg
                                          className="bottom-arrow-head-svg"
                                          width="30px"
                                          height="30px"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                          focusable="false"
                                        >
                                          <path
                                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                            fill="currentColor"
                                            transform="rotate(180, 12, 12)"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          className="rigth-arrow-head-svg"
                                          width="30px"
                                          height="30px"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                          focusable="false"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <path
                                            d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                            fill="currentColor"
                                            transform="rotate(90, 12, 12)"
                                          ></path>
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Listed Data */}
                              {
                                <div
                                  className={`g5single-product ${
                                    modifier?.is_toggle_active ? "show" : "fade"
                                  }`}
                                >
                                  {modifier?.modifier_secondary_items?.map(
                                    (mobileSecondItems, index) => {
                                      return (
                                        <div key={index}>
                                          <div className="alg5bfsingle-product">
                                            <div className="alaqbfsingle-product">
                                              <button
                                                className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn"
                                                disabled={
                                                  mobileSecondItems?.is_item_select
                                                }
                                                onClick={() =>
                                                  handleDecrement(
                                                    modifier?.id,
                                                    mobileSecondItems?.id
                                                  )
                                                }
                                              >
                                                <div className="ezfj">
                                                  <div className="fjezh1">
                                                    <svg
                                                      width="24px"
                                                      height="24px"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      aria-hidden="true"
                                                      focusable="false"
                                                    >
                                                      <path
                                                        d="m7.33325 13v-2h9.33335v2z"
                                                        fill="#000000"
                                                      ></path>
                                                    </svg>
                                                  </div>
                                                </div>
                                              </button>

                                              <div className="bresbtdqiqsingle-product">
                                                {parseInt(
                                                  mobileSecondItems?.counter
                                                )}
                                              </div>

                                              <button
                                                className="b9bmalambfc4b1gtgugvgwgxgygzh0single-product-incdec-btn"
                                                disabled={
                                                  parseInt(
                                                    modifier?.max_permitted
                                                  ) ===
                                                  parseInt(
                                                    modifier?.modifier_counter
                                                  )
                                                    ? true
                                                    : false
                                                }
                                                onClick={() =>
                                                  handleIncrement(
                                                    modifier?.id,
                                                    mobileSecondItems?.id
                                                  )
                                                }
                                              >
                                                <div className="ez fj">
                                                  <div className="fj ez h1">
                                                    <svg
                                                      width="24px"
                                                      height="24px"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      aria-hidden="true"
                                                      focusable="false"
                                                    >
                                                      <path
                                                        d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z"
                                                        fill="#000000"
                                                      ></path>
                                                    </svg>
                                                  </div>
                                                </div>
                                              </button>
                                            </div>

                                            <div className="spacer _16"></div>
                                            <div className="e4ald0ghsingle-productincdec">
                                              <div className="ale4amc4gigjgksingle-productincdec">
                                                <div className="alaqsingle-product">
                                                  <div className="alamglgmsingle-productincdec">
                                                    <div className="bresdpg3gnsingle-productincdecheading">
                                                      {mobileSecondItems?.title}
                                                    </div>
                                                    <div className="spacer _8"></div>
                                                    {getAmountConvertToFloatWithFixed(
                                                      mobileSecondItems?.price,
                                                      2
                                                    ) >
                                                      getAmountConvertToFloatWithFixed(
                                                        0,
                                                        2
                                                      ) && (
                                                      <div className="bresbtdqb1bzsingle-productincdecprice">
                                                        {
                                                          mobileSecondItems?.country_price_symbol
                                                        }
                                                        {getAmountConvertToFloatWithFixed(
                                                          mobileSecondItems?.price,
                                                          2
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <hr className="efbvgogpsingle-producthr"></hr>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              }
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="h2single-product"></div>
                    <div>
                      <div className="albfglh3single-product">
                        <div className="akh4gzh5h6bxgtb1h7single-product">
                          <div className="agbdh8h4albfsingle-product">
                            <button
                              className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-dec-product"
                              disabled={quantity > 1 ? false : true}
                              onClick={handleMobileQuantityDecrement}
                            >
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                viewBox="0 0 20 20"
                                className="hfg0ebhgsingle-product-svg"
                              >
                                <path d="M15.833 8.75H4.167v2.5h11.666v-2.5z"></path>
                              </svg>
                            </button>

                            <div style={{ width: "48px" }}></div>

                            <button
                              className="e3bubrdpb9h9h0albfc4affoh6hagzf1hbhcdohdhesingle-inc-product"
                              onClick={handleMobileQuantityIncrement}
                            >
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                viewBox="0 0 20 20"
                                className="hfg0ebhgsingle-product-svg"
                              >
                                <path d="M15.833 8.75H11.25V4.167h-2.5V8.75H4.167v2.5H8.75v4.583h2.5V11.25h4.583v-2.5z"></path>
                              </svg>
                            </button>
                          </div>

                          <div className="aghhhibre3dpbualc4bfbzbmsingle-product">
                            <div>{parseInt(quantity)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="epezsingle-product"></div>
                      <hr className="efeqhjg2single-producthr"></hr>
                    </div>

                    <div className="iosignle-product"></div>
                    <div className="i7single-product"></div>
                    <div className="iaibicblidieifigcsctbcsingle-product">
                      <button
                        className="e3bubrdpb9ihbkalbfc4afh2iibbijikilgwgxsingle-product"
                        onClick={handleMobileAddtoCart}
                      >
                        Add {quantity} to order
                        <span className="bre3dpbud6imbfsingle-product-span">
                          &nbsp;•&nbsp;
                        </span>
                        {getCountryCurrencySymbol()}{" "}
                        {getAmountConvertToFloatWithFixed(
                          quantity * itemprice,
                          2
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "1px",
                height: "0px",
                padding: "0px",
                overflow: "hidden",
                position: "fixed",
                top: "1px",
                left: "1px",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* If a modifer item has nested modifiers */}
      {ismodifierclicked &&
        singleitem?.modifier_group.map((modalmodifier, index) => {
          return (
            modalmodifier?.id === selectedModifierId &&
            modalmodifier?.modifier_secondary_items?.map(
              (secondaryItem, index) => {
                return (
                  secondaryItem?.id === selectedModifierItemId && (
                    <div key={index}>
                      <div>
                        <div className="agasatdsjbmodifier-modal">
                          <div
                            data-focus-guard="true"
                            tabIndex="0"
                            style={{
                              width: "1px",
                              height: "0px",
                              padding: "0px",
                              overflow: "hidden",
                              position: "fixed",
                              top: "1px",
                              left: "1px",
                            }}
                          ></div>
                          <div>
                            <div className="arjcd5dvasatenmodifier-modal">
                              <div className="alc5dtbzjdfmenmodifier-modal">
                                <div className="akb0jjjkjljmmodifier-modal">
                                  <div>
                                    <div className="s2akc0modifier-modal">
                                      <div className="fqs3alaqc5s4ass5c0modifier-modal">
                                        {/* <button aria-label="Go back" className="almodifier-back-btn" onClick={() => setIsmodifierclicked(false)}> */}

                                        <button
                                          aria-label="Go back"
                                          className="almodifier-back-btn"
                                          onClick={() =>
                                            handleBackArrow(
                                              selectedModifierId,
                                              selectedModifierItemId
                                            )
                                          }
                                        >
                                          <div className="c8c7cumodifier-back-btn-div">
                                            <svg
                                              width="24px"
                                              height="24px"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                              aria-hidden="true"
                                              focusable="false"
                                            >
                                              <path
                                                d="M20.3333 13.25H7.25L11.8333 19.5H8.91667L3.5 12L8.91667 4.5H11.8333L7.25 10.75H20.3333V13.25Z"
                                                fill="currentColor"
                                              ></path>
                                            </svg>
                                          </div>
                                        </button>
                                        <div className="spacer _16"></div>

                                        <div className="e6kae8kbmodifier-modal-name">
                                          {secondaryItem?.title}
                                        </div>
                                      </div>

                                      <ul className="g0s6modifier-modal">
                                        {secondaryItem?.secondary_item_modifiers?.map(
                                          (secondItemModifier, index) => {
                                            return secondItemModifier?.select_single_option ===
                                              1 &&
                                              secondItemModifier?.min_permitted ===
                                                1 &&
                                              secondItemModifier?.max_permitted ===
                                                1 ? (
                                              <li key={index} className="mb-10">
                                                <div className="k5modifier-modal-item">
                                                  <div>
                                                    <hr className="edipiqgdmodifier-hr"></hr>

                                                    <div
                                                      className="alaqg5fxmodifier-modal-div"
                                                      onClick={() =>
                                                        handleModalModifierToggle(
                                                          selectedModifierId,
                                                          selectedModifierItemId,
                                                          secondItemModifier?.id
                                                        )
                                                      }
                                                    >
                                                      <div className="alammodifier-modal">
                                                        <div className="product-modifier-name">
                                                          {
                                                            secondItemModifier?.title
                                                          }
                                                        </div>
                                                        <div className="chcicwd3czmodifier-choose">
                                                          <span>
                                                            Choose{" "}
                                                            {
                                                              secondItemModifier?.max_permitted
                                                            }
                                                          </span>
                                                          <div className="irmodifier-modal">
                                                            <div
                                                              className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}
                                                            >
                                                              {parseInt(
                                                                secondItemModifier?.min_permitted
                                                              ) > parseInt(0)
                                                                ? "Required"
                                                                : "Optional"}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        {!secondItemModifier?.is_second_item_modifier_clicked &&
                                                          secondItemModifier?.secondary_items_modifier_items?.map(
                                                            (
                                                              displaySelectedItem,
                                                              index
                                                            ) => {
                                                              return (
                                                                displaySelectedItem?.is_item_select && (
                                                                  <div
                                                                    key={index}
                                                                  >
                                                                    {parseInt(
                                                                      displaySelectedItem
                                                                        ?.title
                                                                        ?.length
                                                                    ) >
                                                                    parseInt(20)
                                                                      ? displaySelectedItem?.title?.substring(
                                                                          0,
                                                                          20
                                                                        ) +
                                                                        "..."
                                                                      : displaySelectedItem?.title}
                                                                  </div>
                                                                )
                                                              );
                                                            }
                                                          )}
                                                      </div>

                                                      <div className="single-product-svg-div accordion">
                                                        <div className="single-product-svg-div-one">
                                                          {secondItemModifier?.is_second_item_modifier_clicked ? (
                                                            <svg
                                                              className="bottom-arrow-head-svg"
                                                              width="30px"
                                                              height="30px"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              aria-hidden="true"
                                                              focusable="false"
                                                            >
                                                              <path
                                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                                fill="currentColor"
                                                                transform="rotate(180, 12, 12)"
                                                              ></path>
                                                            </svg>
                                                          ) : (
                                                            <svg
                                                              className="rigth-arrow-head-svg"
                                                              width="30px"
                                                              height="30px"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              aria-hidden="true"
                                                              focusable="false"
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            >
                                                              <path
                                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                                fill="currentColor"
                                                                transform="rotate(90, 12, 12)"
                                                              ></path>
                                                            </svg>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {
                                                    <div
                                                      className={`iwmodifier-data ${
                                                        secondItemModifier?.is_second_item_modifier_clicked
                                                          ? "show"
                                                          : "fade"
                                                      }`}
                                                    >
                                                      {secondItemModifier?.secondary_items_modifier_items?.map(
                                                        (item, index) => {
                                                          return (
                                                            <div
                                                              key={index}
                                                              onClick={() =>
                                                                handleModalRadioInput(
                                                                  selectedModifierId,
                                                                  selectedModifierItemId,
                                                                  secondItemModifier?.id,
                                                                  item?.id
                                                                )
                                                              }
                                                            >
                                                              <hr className="edb9jegdmodifier-hr"></hr>
                                                              <div className="alakixc5modifier-data">
                                                                <input
                                                                  type="radio"
                                                                  className="agaxgqdfiymodifier-input"
                                                                  defaultValue={
                                                                    item?.id
                                                                  }
                                                                />

                                                                <label
                                                                  className={`chd2cjmodifier-modal-label ${item?.activeClass}`}
                                                                >
                                                                  <div className="spacer _16"></div>
                                                                  <div className="d1alg5j9modifier-modal">
                                                                    <div className="ald1ame6jajbjcmodifier-modal">
                                                                      <div className="alaqmodifier-modal">
                                                                        <div className="alamdxdvmodifier-modal">
                                                                          <div className="chcicjckjdmodifier-modal">
                                                                            {
                                                                              item?.title
                                                                            }
                                                                          </div>
                                                                          <div className="spacer _8"></div>
                                                                          {getAmountConvertToFloatWithFixed(
                                                                            item?.price_info,
                                                                            2
                                                                          ) >
                                                                            getAmountConvertToFloatWithFixed(
                                                                              0,
                                                                              2
                                                                            ) && (
                                                                            <div className="modifier-group-price">
                                                                              {
                                                                                item?.country_price_symbol
                                                                              }
                                                                              {parseFloat(
                                                                                item?.price_info
                                                                              ).toFixed(
                                                                                2
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </label>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  }
                                                </div>
                                              </li>
                                            ) : secondItemModifier?.select_single_option ===
                                                1 &&
                                              secondItemModifier?.min_permitted ===
                                                0 &&
                                              secondItemModifier?.max_permitted >=
                                                1 ? (
                                              <li key={index} className="mb-10">
                                                <div className="k5modifier-modal-item">
                                                  <div>
                                                    <hr className="edipiqgdmodifier-hr"></hr>

                                                    <div
                                                      className="alaqg5fxmodifier-modal-div"
                                                      onClick={() =>
                                                        handleModalModifierToggle(
                                                          selectedModifierId,
                                                          selectedModifierItemId,
                                                          secondItemModifier?.id
                                                        )
                                                      }
                                                    >
                                                      <div className="alammodifier-modal">
                                                        <div className="product-modifier-name">
                                                          {
                                                            secondItemModifier?.title
                                                          }
                                                        </div>
                                                        <div className="chcicwd3czmodifier-choose">
                                                          <span>
                                                            Choose{" "}
                                                            {
                                                              secondItemModifier?.max_permitted
                                                            }
                                                          </span>
                                                          <div className="irmodifier-modal">
                                                            <div
                                                              className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}
                                                            >
                                                              {parseInt(
                                                                secondItemModifier?.min_permitted
                                                              ) > parseInt(0)
                                                                ? "Required"
                                                                : "Optional"}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        {!secondItemModifier?.is_second_item_modifier_clicked &&
                                                          secondItemModifier?.secondary_items_modifier_items?.map(
                                                            (
                                                              dispayItemCounter,
                                                              index
                                                            ) => {
                                                              return (
                                                                dispayItemCounter?.is_item_select && (
                                                                  <div
                                                                    key={index}
                                                                  >
                                                                    {parseInt(
                                                                      dispayItemCounter
                                                                        ?.title
                                                                        ?.length
                                                                    ) >
                                                                    parseInt(20)
                                                                      ? dispayItemCounter?.title?.substring(
                                                                          0,
                                                                          20
                                                                        ) +
                                                                        "..."
                                                                      : dispayItemCounter?.title}
                                                                  </div>
                                                                )
                                                              );
                                                            }
                                                          )}
                                                      </div>

                                                      <div className="single-product-svg-div accordion">
                                                        <div className="single-product-svg-div-one">
                                                          {secondItemModifier?.is_second_item_modifier_clicked ? (
                                                            <svg
                                                              className="bottom-arrow-head-svg"
                                                              width="30px"
                                                              height="30px"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              aria-hidden="true"
                                                              focusable="false"
                                                            >
                                                              <path
                                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                                fill="currentColor"
                                                                transform="rotate(180, 12, 12)"
                                                              ></path>
                                                            </svg>
                                                          ) : (
                                                            <svg
                                                              className="rigth-arrow-head-svg"
                                                              width="30px"
                                                              height="30px"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              aria-hidden="true"
                                                              focusable="false"
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            >
                                                              <path
                                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                                fill="currentColor"
                                                                transform="rotate(90, 12, 12)"
                                                              ></path>
                                                            </svg>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {
                                                    <div
                                                      className={`iwmodifier-data ${
                                                        secondItemModifier?.is_second_item_modifier_clicked
                                                          ? "show"
                                                          : "fade"
                                                      }`}
                                                    >
                                                      {secondItemModifier?.secondary_items_modifier_items?.map(
                                                        (item, index) => {
                                                          return (
                                                            <div key={index}>
                                                              <hr className="edb9jegdmodifier-hr"></hr>
                                                              {item?.activeClass !==
                                                              "mchw" ? (
                                                                <div
                                                                  className="alakixc5modifier-data"
                                                                  onClick={() =>
                                                                    handleModalCheckInput(
                                                                      selectedModifierId,
                                                                      selectedModifierItemId,
                                                                      secondItemModifier?.id,
                                                                      item?.id
                                                                    )
                                                                  }
                                                                >
                                                                  <input
                                                                    type="checkbox"
                                                                    className="checkbox-input"
                                                                  />

                                                                  <label
                                                                    className={`modifier-product-item-name-checkbox ${item?.activeClass}`}
                                                                  >
                                                                    <div className="spacer _16"></div>
                                                                    <div className="d1alg5j9modifier-modal">
                                                                      <div className="ald1ame6jajbjcmodifier-modal">
                                                                        <div className="alaqmodifier-modal">
                                                                          <div className="alamdxdvmodifier-modal">
                                                                            <div className="chcicjckjdmodifier-modal">
                                                                              {
                                                                                item?.title
                                                                              }
                                                                            </div>
                                                                            <div className="spacer _8"></div>
                                                                            {getAmountConvertToFloatWithFixed(
                                                                              item?.price_info,
                                                                              2
                                                                            ) >
                                                                              getAmountConvertToFloatWithFixed(
                                                                                0,
                                                                                2
                                                                              ) && (
                                                                              <div className="modifier-group-price">
                                                                                {
                                                                                  item?.country_price_symbol
                                                                                }
                                                                                {parseFloat(
                                                                                  item?.price_info
                                                                                ).toFixed(
                                                                                  2
                                                                                )}
                                                                              </div>
                                                                            )}
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </label>
                                                                </div>
                                                              ) : (
                                                                <div className="alakixc5modifier-data">
                                                                  <input
                                                                    type="checkbox"
                                                                    className="checkbox-input"
                                                                  />

                                                                  <label
                                                                    className={`modifier-product-item-name-checkbox ${item?.activeClass}`}
                                                                  >
                                                                    <div className="spacer _16"></div>
                                                                    <div className="d1alg5j9modifier-modal">
                                                                      <div className="ald1ame6jajbjcmodifier-modal">
                                                                        <div className="alaqmodifier-modal">
                                                                          <div className="alamdxdvmodifier-modal">
                                                                            <div className="chcicjckjdmodifier-modal">
                                                                              {
                                                                                item?.title
                                                                              }
                                                                            </div>
                                                                            <div className="spacer _8"></div>
                                                                            {getAmountConvertToFloatWithFixed(
                                                                              item?.price_info,
                                                                              2
                                                                            ) >
                                                                              getAmountConvertToFloatWithFixed(
                                                                                0,
                                                                                2
                                                                              ) && (
                                                                              <div className="modifier-group-price">
                                                                                {
                                                                                  item?.country_price_symbol
                                                                                }
                                                                                {parseFloat(
                                                                                  item?.price_info
                                                                                ).toFixed(
                                                                                  2
                                                                                )}
                                                                              </div>
                                                                            )}
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </label>
                                                                </div>
                                                              )}
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  }
                                                </div>
                                              </li>
                                            ) : (
                                              <li key={index} className="mb-10">
                                                <div>
                                                  <div>
                                                    <hr className="product_hr"></hr>
                                                    <div
                                                      className="product-list-div"
                                                      onClick={() =>
                                                        handleModalModifierToggle(
                                                          selectedModifierId,
                                                          selectedModifierItemId,
                                                          secondItemModifier?.id
                                                        )
                                                      }
                                                    >
                                                      <div className="product-modifier-groups">
                                                        <div className="product-modifier-name">
                                                          Add:
                                                          {
                                                            secondItemModifier?.title
                                                          }
                                                        </div>
                                                        <div className="product-modifier-option">
                                                          <span>
                                                            Choose up to{" "}
                                                            {
                                                              secondItemModifier?.max_permitted
                                                            }
                                                          </span>
                                                          <div className="irmodifier-modal">
                                                            <div
                                                              className={`isafcbitiuivcymodifier-modal ${secondItemModifier?.valid_class}`}
                                                            >
                                                              {parseInt(
                                                                secondItemModifier?.min_permitted
                                                              ) > parseInt(0)
                                                                ? "Required"
                                                                : "Optional"}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        {!secondItemModifier?.is_second_item_modifier_clicked &&
                                                          secondItemModifier?.secondary_items_modifier_items?.map(
                                                            (
                                                              dispayItemCounter,
                                                              index
                                                            ) => {
                                                              return (
                                                                getAmountConvertToFloatWithFixed(
                                                                  dispayItemCounter?.counter,
                                                                  2
                                                                ) >
                                                                  getAmountConvertToFloatWithFixed(
                                                                    0,
                                                                    2
                                                                  ) && (
                                                                  <div
                                                                    key={index}
                                                                  >
                                                                    {parseInt(
                                                                      dispayItemCounter
                                                                        ?.title
                                                                        ?.length
                                                                    ) >
                                                                    parseInt(20)
                                                                      ? dispayItemCounter?.title?.substring(
                                                                          0,
                                                                          20
                                                                        ) +
                                                                        "..."
                                                                      : dispayItemCounter?.title}
                                                                  </div>
                                                                )
                                                              );
                                                            }
                                                          )}
                                                      </div>

                                                      <div className="single-product-svg-div accordion">
                                                        <div className="single-product-svg-div-one">
                                                          {secondItemModifier?.is_second_item_modifier_clicked ? (
                                                            <svg
                                                              className="bottom-arrow-head-svg"
                                                              width="30px"
                                                              height="30px"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              aria-hidden="true"
                                                              focusable="false"
                                                            >
                                                              <path
                                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                                fill="currentColor"
                                                                transform="rotate(180, 12, 12)"
                                                              ></path>
                                                            </svg>
                                                          ) : (
                                                            <svg
                                                              className="rigth-arrow-head-svg"
                                                              width="30px"
                                                              height="30px"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              aria-hidden="true"
                                                              focusable="false"
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            >
                                                              <path
                                                                d="M17 11.7494V14.916L12 11.0827L7 14.916V11.7494L12 7.91602L17 11.7494Z"
                                                                fill="currentColor"
                                                                transform="rotate(90, 12, 12)"
                                                              ></path>
                                                            </svg>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {
                                                    <div
                                                      className={`iwmodifier-data ${
                                                        secondItemModifier?.is_second_item_modifier_clicked
                                                          ? "show"
                                                          : "fade"
                                                      }`}
                                                    >
                                                      {secondItemModifier?.secondary_items_modifier_items?.map(
                                                        (item, index) => {
                                                          return (
                                                            <div key={index}>
                                                              <hr className="product-modifier-items-hr"></hr>
                                                              <div className="product-modifier-item-detail">
                                                                <div className="modifier-product-item-name-inc-dec">
                                                                  <div className="modifier-inc-dec">
                                                                    <button
                                                                      className="modifier-btn"
                                                                      disabled={
                                                                        item?.is_item_select
                                                                      }
                                                                      onClick={() =>
                                                                        handleModalDecrement(
                                                                          selectedModifierId,
                                                                          selectedModifierItemId,
                                                                          secondItemModifier?.id,
                                                                          item?.id
                                                                        )
                                                                      }
                                                                    >
                                                                      <div className="modifier-btn-div">
                                                                        <div className="modifier-btn-svg">
                                                                          <svg
                                                                            width="24px"
                                                                            height="24px"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            aria-hidden="true"
                                                                            focusable="false"
                                                                          >
                                                                            <path
                                                                              d="m7.33325 13v-2h9.33335v2z"
                                                                              fill="#000000"
                                                                            ></path>
                                                                          </svg>
                                                                        </div>
                                                                      </div>
                                                                    </button>

                                                                    <div className="incremented-values">
                                                                      {
                                                                        item?.counter
                                                                      }
                                                                    </div>

                                                                    <button
                                                                      className="modifier-btn"
                                                                      disabled={
                                                                        parseInt(
                                                                          secondItemModifier?.max_permitted
                                                                        ) ===
                                                                        parseInt(
                                                                          secondItemModifier?.modifier_counter
                                                                        )
                                                                          ? true
                                                                          : false
                                                                      }
                                                                      onClick={() =>
                                                                        handleModalIncrement(
                                                                          selectedModifierId,
                                                                          selectedModifierItemId,
                                                                          secondItemModifier?.id,
                                                                          item?.id
                                                                        )
                                                                      }
                                                                    >
                                                                      <div className="modifier-btn-div">
                                                                        <div className="modifier-btn-svg">
                                                                          <svg
                                                                            width="24px"
                                                                            height="24px"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            aria-hidden="true"
                                                                            focusable="false"
                                                                          >
                                                                            <path
                                                                              d="m16.6666 11.0007h-3.6667v-3.66672h-2v3.66672h-3.66665v2h3.66665v3.6666h2v-3.6666h3.6667z"
                                                                              fill="#000000"
                                                                            ></path>
                                                                          </svg>
                                                                        </div>
                                                                      </div>
                                                                    </button>
                                                                  </div>

                                                                  <div className="spacer _16"></div>
                                                                  <div className="modifier-product-item-name-one-div">
                                                                    <div className="modifier-product-item-name-one-nested-div">
                                                                      <div className="modifier-product-item-name-one-nested-div-one">
                                                                        <div className="modifier-product-item-name-one-nested-div-one-nested">
                                                                          <div className="modifier-product-item-name-one-nested-div-one-nested-div">
                                                                            {
                                                                              item?.title
                                                                            }
                                                                          </div>
                                                                          <div className="spacer _8"></div>
                                                                          {getAmountConvertToFloatWithFixed(
                                                                            item?.price_info,
                                                                            2
                                                                          ) >
                                                                            getAmountConvertToFloatWithFixed(
                                                                              0,
                                                                              2
                                                                            ) && (
                                                                            <div className="modifier-group-price">
                                                                              {
                                                                                item?.country_price_symbol
                                                                              }
                                                                              {parseFloat(
                                                                                item?.price_info
                                                                              ).toFixed(
                                                                                2
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  }
                                                </div>
                                              </li>
                                            );
                                          }
                                        )}
                                      </ul>

                                      <hr className="e0b9duiomodifier-modal"></hr>

                                      <div className="fqdvb5afprmodifier-modal">
                                        <button
                                          className="gacxchcjc9modifier-modal-save-btn"
                                          onClick={() =>
                                            handleSaveBtn(
                                              selectedModifierId,
                                              selectedModifierItemId
                                            )
                                          }
                                        >
                                          Update
                                          <span className="chgacjcxcypwc5modifier-modal-save-span">
                                            &nbsp;•&nbsp;
                                          </span>
                                          {getCountryCurrencySymbol()}
                                          {getAmountConvertToFloatWithFixed(
                                            selectedModifierItemPrice,
                                            2
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    aria-label="Close"
                                    className="lblcldlelflgb1modifier_close_btn"
                                    onClick={() => setIsmodifierclicked(false)}
                                  >
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 10 10"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{ stroke: "currentcolor" }}
                                    >
                                      <path
                                        d="M9 1L5 5M1 9L5 5M5 5L1 1M5 5L9 9"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      ></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            data-focus-guard="true"
                            tabIndex="0"
                            style={{
                              width: "1px",
                              height: "0px",
                              padding: "0px",
                              overflow: "hidden",
                              position: "fixed",
                              top: "1px",
                              left: "1px",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                );
              }
            )
          );
        })}
    </>
  );
}

export default productDetails;
