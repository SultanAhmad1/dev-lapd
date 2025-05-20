"use client";

import { NextResponse } from "next/server";
import { BRAND_SIMPLE_GUID } from "./Axios";

let storeName = "LAPD"
let isUserEnteredPostcode = false
let categoryUUID = 0
let itemUUID = 0
let countryCurrencySymbol = "£"
export const country = "GB"
export const currency = "gbp"

export const passwordMessageData = "Password length must be 8 character and contain capital and small case letters,$,% etc."

export const removeLastApi = (url) => {
    const lastApiIndex = url.lastIndexOf("api");
    if (lastApiIndex !== -1) {
      return url.substring(0, lastApiIndex); // Remove everything from the last "/api"
    }
    return url; // Return the original URL if "/api" is not found
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
};

export const formatPhoneNumber = (number) => {
    // Ensure the number is treated as a string
    const numStr = number.toString();

    // Check if the first character is '0', if not, prepend '0'
    if (numStr[0] !== '0') {
      return '0' + numStr;
    }
    return numStr;
  };

export function setStoreName(useEnterStore)
{
    return storeName = useEnterStore
}

export function getStoreName()
{
    return storeName
}

export function setAtFirstLoadModalShow(isUserEnterValidPostcode)
{
    return isUserEnteredPostcode = isUserEnterValidPostcode
}

export function getatFirstLoadModalShow()
{
    return isUserEnteredPostcode
}

export function setSelectedCategoryUUID(categoryUUID)
{
    return categoryUUID = categoryUUID
}

export function getSelectedCategoryUUID()
{
    return categoryUUID
}

export function setSelectedItemUUID(itemUUID)
{
    return itemUUID = itemUUID
}

export function getSelectedItemUUID(itemUUID)
{
    return itemUUID
}


export function setLocalStorage(keyName,data)
{
    return window.localStorage.setItem(`${keyName}`,JSON.stringify(data))
}

export function find_matching_postcode(matrixArgument, postcodeArgument, setState)
{
    var postcode = postcodeArgument.toString();
    postcode = postcode.toUpperCase();
    postcode = postcode.replace(/\s/g, '');
    var matchingPostcodes = [];

    for(let x=0;x<matrixArgument.length;x++)
    {
        if(postcode.startsWith(matrixArgument[x].postcode) === true)
        {
            matchingPostcodes.push(matrixArgument[x]);
        }
    }

    var finalMatch = null;
    if(parseInt(matchingPostcodes.length) > parseInt(1))
    {
        if(parseInt(postcode.length) === parseInt(7))
        {
            finalMatch = matchingPostcodes.filter(function(pcode){
                return parseInt(pcode.postcode.length) === parseInt(4);
            })[0];
        }
        else if(parseInt(postcode.length) === parseInt(6))
        {
            finalMatch = matchingPostcodes.filter(function(pcode){
                return parseInt(pcode.postcode.length) === parseInt(3);
            })[0];
        }
    }
    else
    {
        finalMatch = matchingPostcodes[0];
    }
    
    if(finalMatch == null)
    {
        finalMatch = matrixArgument.filter(function(pcode){
            return pcode.postcode == "STANDARD";
        })[0];
    } 

    setLocalStorage(`${BRAND_SIMPLE_GUID}delivery_matrix`,finalMatch)
    setState(finalMatch)
}

export function getCountryCurrencySymbol()
{
    return countryCurrencySymbol
}

export function getAmountConvertToFloatWithFixed(amount, number)
{
    return parseFloat(amount).toFixed(number)
}


export function setNextCookies(key, value)
{
    const responseNext = NextResponse.next()
    return responseNext.cookies.set(key, value)
}

export function setSessionStorage(keyName,data)
{
    return window.localStorage.setItem(`${keyName}`, JSON.stringify(data))
}

// export function validatePhoneNumber(phoneNumber) {
//     var res = phoneNumber.charAt(0);
//     if(parseFloat(res) == 0){
//         var phoneNumberPattern = /^\(?(\d{4})\)?[- ]?(\d{3})[- ]?(\d{4})$/;  
//     }else if(res == '+'){
//         if(parseFloat(phoneNumber.charAt(1)) == 4){
//             if(parseFloat(phoneNumber.charAt(2)) == 4){
//                 var phoneNumberArr = phoneNumber.split('+44');
//                 phoneNumber = phoneNumberArr[1];
//                 var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;  
//             }else{
//                 return false; 
//             }
//         }else{
//             return false; 
//         }
//     }else{
//         return false; 
//     }
//     return phoneNumberPattern.test(phoneNumber); 
// }

export function validatePhoneNumber(phoneNumber) {
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');

    // Add '0' if the number doesn't start with it and isn't already prefixed with '+44'
    if (!phoneNumber.startsWith('0') && !phoneNumber.startsWith('+44')) {
        formattedPhone = '0' + phoneNumber;
    } else if (phoneNumber.startsWith('+44')) {
        // Convert '+44' to '0'
        formattedPhone = '0' + phoneNumber.slice(3);
    }

    // Return the formatted phone number
    return formattedPhone;
}