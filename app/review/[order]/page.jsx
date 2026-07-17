import OrderReviewClient from "./chidlren/OrderReviewClient";
import patchReview from "./actions";

export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  
  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Review Order - ${brand?.name || ""}`,
    description: `Review Order ${brand?.name}`,
  };
}

export default async function page({params}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/review-order`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: params.order }),
      cache: "no-store",
    }
  );

  const data = await res.json();
  const order = data?.data?.orderReview ?? null;
  console.log("review-orders:", data);

  return(
    <OrderReviewClient {...{order: order, patchReview: patchReview, orderId: params.order}}/>
  )
}