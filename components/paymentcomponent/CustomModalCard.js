import { ContextCheckApi } from "@/app/layout";
import HomeContext from "@/contexts/HomeContext";
import { axiosPrivate, BRAND_SIMPLE_GUID, IMAGE_URL_Without_Storage } from "@/global/Axios";
import { getAmountConvertToFloatWithFixed } from "@/global/Store";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { Fragment, useContext, useEffect, useState } from "react";

export default function CustomModalCard() 
{
    const orderId = "4345C7CE-F96D-407E-B73F-02AC2A28D53B"
    const router = useRouter()
      
      const {
        setCartData,
        setIsTimeToClosed,
        totalOrderAmountValue,
        dayOpeningClosingTime,
        setTotalOrderAmountValue,
        isLocationBrandOnline,
        setIsLocationBrandOnline,
        websiteModificationData,
      } = useContext(HomeContext)
    
      const { setMetaDataToDisplay} = useContext(ContextCheckApi)
    
    useEffect(() => {
    if(websiteModificationData)
    {
        const metaHeadingData = {
        title: websiteModificationData?.brand?.name,
        contentData: websiteModificationData?.brand?.name,
        iconImage: IMAGE_URL_Without_Storage+"/"+websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFavicon,
        singleItemsDetails: {
            title: "",
            description: "",
            itemImage: "",
            keywords: "",
            url: ""
        }
        }
        setMetaDataToDisplay(metaHeadingData)
    }
    }, [websiteModificationData]);
    
    const [isHover, setIsHover] = useState(false);
    
    const [loader, setLoader] = useState(true)   
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);

    const [isGetErrorFromDatabase, setIsGetErrorFromDatabase] = useState(false)
    
    /**
     * Check the Brand is active for a location.
     */
    useEffect(() => {
    
        const forceFullyCheckBrandLocationTrue  = async() =>{
            try {
                const response = await axiosPrivate.get(`/location-brand-status/${orderId}`)
                
                const { brandExists, isExpired } = response?.data?.data
                
                setIsGetErrorFromDatabase(isExpired)
                setIsLocationBrandOnline(brandExists)
            
            } catch (error) {

                if(error.response.status === 419)
                {
                    setIsGetErrorFromDatabase(true)
                    return
                }
            }
        }

        // Fetch Order Price related to Order GUID.
        const forceFullyGetOrderPriceFromDatabase = async () =>
        {
            try 
            {
                const data = {guid: orderId,}  
                const response = await axiosPrivate.post(`/order-price-to-payable-get`, data)
                
                setIsGetErrorFromDatabase(response.data.data?.orderAmountDetails === null ? true : false)

                setTotalOrderAmountValue(response.data.data?.orderAmountDetails === null ? 0 : response.data.data?.orderAmountDetails?.order_total)

            } 
            catch (error) 
            {
            }
        }

        const dayNumber = moment().day();
        const dateTime  = moment().format('HH:mm')
        const dayName = moment().format('dddd');
        setLoader(false)

        if(dayOpeningClosingTime?.day_of_week?.toLowerCase().includes(dayName.toLowerCase()))
        {
            const timePeriods = dayOpeningClosingTime?.time_periods
            if(timePeriods)
            {
                if(timePeriods?.[0]?.start_time >=dateTime && dateTime <= timePeriods?.[0]?.end_time )
                {
                    setIsTimeToClosed(true)
                    return
                }
            }
        }

        const orderTotalFromLocalStorage = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}total_order_value_storage`))
        forceFullyCheckBrandLocationTrue()
        if(orderTotalFromLocalStorage !== null || orderTotalFromLocalStorage !== undefined)
        {
            setTotalOrderAmountValue(orderTotalFromLocalStorage === null ? 
            getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) 
            : 
            getAmountConvertToFloatWithFixed(JSON.parse(orderTotalFromLocalStorage),2))
        }
        else
        {
            forceFullyGetOrderPriceFromDatabase()
        }
    // setTimeout(() => {
    // }, 3000);
    }, [])
    
    useEffect(() => {
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
    });
    
    const hitSmsAndEmailCall = async () =>
    {
        const url = window.location.origin
        const pathname = "track-order"
        try 
        {
            const data = {
                guid: orderId,
                url: url,
                pathname: pathname
            } 

            const response = await axiosPrivate.post(`/send-sms-and-email`, data)

            setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
            setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,null)
            // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`,[])
            setLocalStorage(`${BRAND_SIMPLE_GUID}customer_information`,null)
            setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,null)
            setCartData([])
            setLoader(false)
            // if(response?.data?.status === "success")
            // {
            router.push(`/track-order/${orderId}`)
            
            // }

        } 
        catch (error) 
        {
            window.alert(error?.response?.data?.error)
            setLoader(false)
            setLocalStorage(`${BRAND_SIMPLE_GUID}cart`,[])
            setLocalStorage(`${BRAND_SIMPLE_GUID}order_amount_number`,null)
            // setLocalStorage(`${BRAND_SIMPLE_GUID}applied_coupon`,[])
            setLocalStorage(`${BRAND_SIMPLE_GUID}customer_information`,null)
            setLocalStorage(`${BRAND_SIMPLE_GUID}order_guid`,null)
            setCartData([])
            router.push(`/track-order/${orderId}`)
        }
    }
    
    // This method will hit when payment successfully done, to send sms and email to user.
    const afterPaymentSavedOrderUpdate = async (paymentIntent) =>
    {
    try 
    {
        const data = {
        guid: orderId,
        amount_paid: getAmountConvertToFloatWithFixed(paymentIntent.amount / 100,2),
        stripeid: paymentIntent.id,
        }  

        const response = await axiosPrivate.post(`/update-order-after-successfully-payment-save`, data)
        // Here need to hit sms and email call.

        if(response?.data?.status === "success")
        {
        hitSmsAndEmailCall()
        // router.push(`/track-order/${response?.data?.data?.order?.external_order_id}`)
        }
    } 
    catch (error) 
    {
    }
    }
    
    // This submit send request to Database and stripe.
    const handleSubmit = async (event) => 
    {
        event.preventDefault();
        setIsSubmitButtonCLicked(true)
        setLoader(true)
    
        if(isLocationBrandOnline === null)
        {
        return
        }
    
        if (!stripe || !elements) 
        {
        setLoader(false)
        return;
        }
        try 
        {
        const cardElement = elements.getElement(CardElement);
    
        const { token, error,type } = await stripe.createToken(cardElement);
    
        if (error) 
        {
            setPaymentError(error.message);
            setLoader(false)
            return
        } 
        
        setLoader(true)
    
        const getCustomerInformation = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}customer_information`))
    
        const city = getCustomerInformation?.street2?.split(',')[0].trim();
        const response = await axiosPrivate.post('/create-payment-intent', 
            {
            order_total: getAmountConvertToFloatWithFixed(totalOrderAmountValue,2) * 100, // replace with your desired amount
            token: token.id,
            order: orderId,
            brand: BRAND_GUID,
            }
        );
    
        const { clientSecret } = response.data;
    
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
            card: cardElement,
            billing_details: {
                name: `${getCustomerInformation?.firstName} ${getCustomerInformation?.lastName}`,
                email: getCustomerInformation?.email,
                address: {
                line1: `${getCustomerInformation?.doorHouseName} ${getCustomerInformation?.street1} ${getCustomerInformation?.street1}`,
                city: city,
                postal_code: getCustomerInformation?.postcode,
                country: 'GB',
                },
            },
            },
        });
    
        if (result.error) 
        {
            setLoader(false)
            setPaymentError(result.error.message);
            return
        } 
        else 
        {
            afterPaymentSavedOrderUpdate(result.paymentIntent)
        }
        } catch (error) {
        setLoader(false)
        console.error("Payment form error:",error);
        }
    };

    return(
        <Fragment>
            <CardElement options={{hidePostalCode: true, style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
            {paymentError && <div style={{background: "#ed5858", color: "white", padding: "12px", borderRadius: "1px", marginTop: "10px"}}>{paymentError}</div>}
        </Fragment>
    )
}
