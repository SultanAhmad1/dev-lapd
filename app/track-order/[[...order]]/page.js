import TrackOrderDetail from "@/components/track/TrackOrderDetail";
import postTrackOrder from "./actions";

export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

   const data = await res.json();
   const brand = data?.data?.brand;
   return {
     title: `Track Order - ${brand?.name || ""}`,
     description: `Track Order ${brand?.name}`,
   };
 }

 export default async function page({params}) 
 {
    const orderId = params?.order?.[0];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/website-track-order/${orderId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
        throw new Error("There is something went wrong. Please refresh and try again.");
    }

    const data = await res.json();
    const trackOrder = data?.data;
    
    return (
      <TrackOrderDetail {...{data: trackOrder, postTrackOrder: postTrackOrder}}/>
    )
 }