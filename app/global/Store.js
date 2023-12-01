let storeName = "LAPD"
let isUserEnteredPostcode = false
let categoryUUID = 0
let itemUUID = 0
let countryCurrencySymbol = "£"

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

export function getAtFirstLoadModalShow()
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

    setState(finalMatch)
    console.log("Here is the final match:", finalMatch);
}

export function getCountryCurrencySymbol()
{
    return countryCurrencySymbol
}

export function getAmountConvertToFloatWithFixed(amount, number)
{
    return parseFloat(amount).toFixed(number)
}