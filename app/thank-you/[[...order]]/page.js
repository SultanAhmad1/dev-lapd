import ThankYouDetail from "@/components/track/ThankYouDetail";
import { redirect } from "next/navigation";


export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Thank You - ${brand?.name || ""}`,
    description: `Thank You ${brand?.name}`,
  };
}

export default async function page({params}) 
{
    // Check if order param is missing
    if (!params?.order) {
        redirect("/"); // Client-side redirect
    }

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
    const thankYouOrder = data?.data;

    return (
        <ThankYouDetail {...{orderId: params?.order, thankYouOrder}}/>
    )
}