import AllergensComponent from "@/components/AllergensComponent";
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
    title: `Allergens - ${brand?.name || ""}`,
    description: `Allergens ${brand?.name}`,
  };
}

export default function page() {
  redirect('/');
  return <AllergensComponent />
}
