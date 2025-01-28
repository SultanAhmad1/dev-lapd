import dynamic from "next/dynamic";

const DisplaySingleItem = dynamic(() => import("@/components/singleitem/DisplaySingleItem"));

function productEdit({ params }) 
{
  return (
    <DisplaySingleItem params={params}/>
  );
}

export default productEdit;
