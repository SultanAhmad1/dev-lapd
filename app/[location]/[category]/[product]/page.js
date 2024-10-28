"use client";
import DisplaySingleItem from "@/components/singleitem/DisplaySingleItem";

function productDetails({ params }) 
{
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productDetails;
