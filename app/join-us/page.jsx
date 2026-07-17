
import JoinComponent from "@/components/join/JoinComponent"

export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Join Us - ${brand?.name || ""}`,
    description: `Join Us ${brand?.name}`,
  };
}


export default function JoinUs()
{
    return <JoinComponent />
}