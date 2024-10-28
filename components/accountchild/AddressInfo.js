"use client";
import React, { useEffect, useState } from "react";
import { usePatchMutationHook } from "../reactquery/useQueryHook";
import { BRANDSIMPLEGUID, USERIMAGE } from "@/global/Axios";
import Image from "next/image";
import AddressList from "./addresschild/AddressList";
import AddressCreate from "./addresschild/AddressCreate";

export default function AddressInfo() 
{
    const [isCreateClicked, setIsCreateClicked] = useState(false);
    
    const handleCreateAddress = () => {
        
        setIsCreateClicked(!isCreateClicked)
    }
    
    return(
        <div className="account-component">

            {/* Display all the Customer's Addresses */}
            {
                ! isCreateClicked ?
                <AddressList {...{handleCreateAddress}}/>
                :

                <AddressCreate {...{handleCreateAddress}}/>
               
            }
        </div>
    )

}
