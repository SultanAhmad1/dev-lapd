// import LoaderStatus from "@/components/LoaderStatus";
import dynamic from "next/dynamic";

const DisplaySingleItem = dynamic(() => import("@/components/singleitem/DisplaySingleItem"));

function productDetails({ params }) 
{
  
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productDetails;
