import TermsConditionComponent from "@/components/TermsConditionComponent"

export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Terms and Conditions - ${brand?.name || ""}`,
    description: `Terms and Conditions ${brand?.name}`,
  };
}

export default async function page() 
{
  return <TermsConditionComponent />
}
