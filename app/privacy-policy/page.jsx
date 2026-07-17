import PrivacyComponent from "@/components/PrivacyComponent";


export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Privacy Policy - ${brand?.name || ""}`,
    description: `Privacy Policy ${brand?.name}`,
  };
}

export default async function page() 
{
    
  return <PrivacyComponent />
}
