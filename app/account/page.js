"use client";

import Account from "@/components/account/Account";
import AuthHeader from "@/components/authheader/AuthHeader";

export default function page() 
{
  
  return(
    <div className="account-container">

      <div className="account-header">
        <AuthHeader />
        <div className="rest-part"></div>
      </div>
      <Account />
    </div>
  )
}
