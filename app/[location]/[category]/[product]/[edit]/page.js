"use client";

import DisplaySingleItem from "@/components/singleitem/DisplaySingleItem";

function productEdit({ params }) 
{
  console.log("Params: ", params);
  
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productEdit;
