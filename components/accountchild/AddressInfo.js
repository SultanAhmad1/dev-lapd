"use client";
import React, { useState } from "react";
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
