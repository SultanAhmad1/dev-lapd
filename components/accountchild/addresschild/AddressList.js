import AvailableStore from "@/components/AvailableStore";
import { usePostAfterAuthMutationHook } from "@/components/reactquery/useQueryHook";
import HomeContext from "@/contexts/HomeContext";
import { axiosPrivate, BRAND_GUID, BRANDSIMPLEGUID } from "@/global/Axios";
import { find_matching_postcode, setLocalStorage } from "@/global/Store";
import React, { Fragment, useContext, useEffect, useState } from "react";

export default function AddressList({handleCreateAddress}) 
{
    const {setDeliverymatrix, dayname, daynumber,setPostcode, setStreet1, setStreet2} = useContext(HomeContext)

    const [listObj, setListObj] = useState({
        customer: null,
        availablestores: [],
    });

    const [postcodeerror, setPostcodeerror] = useState("");
    
    useEffect(() => {
        const customer = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}tempcustomer`))

        if(customer !== undefined || customer !== null)
        {
            setListObj((prevData) => ({...prevData, customer: customer}))
        }

    }, []);
    
    async function fetchPostcodeData(validpostcode) {
        try 
        {
          let filterPostcode = validpostcode.replace(/\s/g, "");
    
          let grabPostcodeOutWard = "";
          if (parseInt(filterPostcode.length) === parseInt(7)) 
          {
            grabPostcodeOutWard = filterPostcode.substring(0, 4);
          } 
          else if (parseInt(filterPostcode.length) === parseInt(6)) 
          {
            grabPostcodeOutWard = filterPostcode.substring(0, 3);
          } 
          else 
          {
            grabPostcodeOutWard = filterPostcode.substring(0, 2);
          }
    
          const data = {
            postcode: filterPostcode,
            brand_guid: BRAND_GUID,
            dayname: dayname,
            daynumber: daynumber,
            outwardString: grabPostcodeOutWard,
          };
    
          const response = await axiosPrivate.post(`/ukpostcode-website`, data);
          const matrix = response.data?.data?.deliveryMartix?.delivery_matrix_rows;
          find_matching_postcode(matrix, validpostcode, setDeliverymatrix);
    
          setLocalStorage(`${BRANDSIMPLEGUID}address`, response?.data?.data);
          setLocalStorage(`${BRANDSIMPLEGUID}user_valid_postcode`, validpostcode);
    
          
          setListObj((prevData) => ({...prevData, availablestores: response.data?.data?.availableStore}))

          setPostcode(validpostcode);
          
        } 
        catch (error) 
        {
          if(error?.code === "ERR_NETWORK")
          {
            setPostcodeerror("There is something went wrong!. Please try again.");
    
          }
          else
          {
            setPostcodeerror(error?.response?.data?.postcode);
          }
        }
    }

    
    const handleDefaultAddress = (id) => {
        setListObj((prevData) => ({...prevData, 
            customer: {
                ...prevData?.customer,
                addresses: prevData?.customer?.addresses?.map((address) => 
                    address?.id === id ?
                    {...address, is_default_address: 1}    
                    :
                    {...address, is_default_address: 0}
                )
            }
        }))


        const filterAddress = listObj?.customer?.addresses?.find((address) => address?.id === id)

        if(filterAddress?.is_default_address === 1)
        {
            const filterData = {
                customer: listObj?.customer?.id,
                address: filterAddress?.id,
            }
    
            addressPostMutation(filterData)
            fetchPostcodeData(filterAddress?.postcode)
        }
    }

    const onPatchError = (error) => {
    }

    const onPatchSuccess = (data) => {
        setLocalStorage(`${BRANDSIMPLEGUID}tempcustomer`, listObj?.customer)

        const filterAddress = listObj?.customer?.addresses?.find((address) => address?.is_default_address === 1)

        setPostcode(filterAddress?.postcode)
        setStreet1(filterAddress?.street1)
        setStreet2(filterAddress?.street2)
    }

    const{mutate: addressPostMutation, isSuccess, reset} = usePostAfterAuthMutationHook('address-upadte', `/create-address`, onPatchSuccess, onPatchError)
    
    if(isSuccess)
    {
        reset()
        return
    }
    return(
        <Fragment>

            {
                postcodeerror !== "" &&
                <div className="alert-message">
                    {postcodeerror}
                </div>
            }
            <div className="title-with-button">
                <h1>Address List</h1>
                <button type="button" className="register-button" onClick={handleCreateAddress}>Craete new address</button>
            </div>

            {
                
                listObj?.customer?.addresses?.map((address,index) => 
                {
                    const {id,is_default_address, address_type, house_no_name, street1, street2, postcode} = address
                    return(
                        <div key={index} className={`customer-address-list ${is_default_address && "active-customer-address"}`} onClick={() => handleDefaultAddress(id)}>
                            <div>
                                <input type="radio" name="option" value="1" checked={is_default_address ? true : false} onChange={() => handleDefaultAddress(id)}/>
                            </div>
                            <div>
                                <h5>Address Type: {address_type}</h5>
                                <p>{house_no_name} {street1}, {street2}, {postcode}</p>
                            </div>
                        </div>
                    )
                })
            }
            {
                listObj?.availablestores?.length > 0 &&
                <div className="modal-delivery-details">
                    <div className="modal-delivery-details-level-one-div">
                    <div className="modal-delivery-details-level-one-div-height"></div>
            
                    <div className="modal-delivery-details-level-one-div-dialog">
                        <div className="deliver-to-body-content">
                        
                            <AvailableStore availablestores={listObj?.availablestores}/>
                        
                        </div>
                    </div>
            
                    <div className="modal-delivery-details-level-one-div-height"></div>
                    </div>
                </div>
            }

            {/* Create Form */}
        </Fragment>
    )
}
