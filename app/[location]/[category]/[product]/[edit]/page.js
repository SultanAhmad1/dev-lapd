"use client";

import DisplaySingleItem from "@/components/singleItem/DisplaySingleItem";

function productEdit({ params }) 
{
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productEdit;
