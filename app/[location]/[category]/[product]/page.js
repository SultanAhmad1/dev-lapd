
// import LoaderStatus from "@/components/LoaderStatus";
import { lazy } from "react";

const DisplaySingleItem = lazy(() => import("@/components/singleItem/DisplaySingleItem"));

function productDetails({ params }) 
{
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productDetails;
