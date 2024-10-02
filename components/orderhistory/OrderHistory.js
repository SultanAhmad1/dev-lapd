import React, { useEffect } from "react";
import { useGetAfterAuthMutationHook } from "../reactquery/useQueryHook";
import { usePathname } from "next/navigation";
import { BRAND_GUID } from "@/global/Axios";
import OrderTab from "./OrderTab";

export default function OrderHistory() 
{
  const router = usePathname();

  const convertToStr = router?.split("/").filter(segment => segment)

  useEffect(() => {
    if(parseInt(convertToStr.length) > 1)
    {
      const customerId = convertToStr?.[1]
      refetch()
    }
  }, [router]);
  
  const onHistorySuccess = (data) => {
      
  }

  const onHistoryError = (error) => {
  }


  const {refetch, data } = useGetAfterAuthMutationHook('order-history', `/order-history/${BRAND_GUID}/${convertToStr?.[1]}`, convertToStr?.[1], onHistorySuccess, onHistoryError)

  return(
    <>
      {
        data?.data?.orders?.map((order,index) => {
          return(
            <OrderTab key={index} {...{order}} />
          )
        })
      } 
    </>
  );
}
