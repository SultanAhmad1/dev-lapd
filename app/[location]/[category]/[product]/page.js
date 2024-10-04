"use client";

import Header from "@/components/Header";
import { MobileSingleItem } from "@/components/MobileSingleItem";
import { NestedModifiers } from "@/components/NestedModifiers";
import DisplaySingleItem from "@/components/singleitem/DisplaySingleItem";
import { WebsiteSingleItem } from "@/components/WebsiteSingleItem";
import HomeContext from "@/contexts/HomeContext";
import {
  BRANDSIMPLEGUID,
  BRAND_GUID,
  PARTNER_ID,
  axiosPrivate,
} from "@/global/Axios";

import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";

function productDetails({ params }) 
{
  
  console.log("Params: ", params);
  
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productDetails;
