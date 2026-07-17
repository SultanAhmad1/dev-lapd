
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MarketingPreferencesComponent from "@/components/MarketingPreferencesComponent";

export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Marketing Preferences - ${brand?.name || ""}`,
    description: `Marketing Preferences ${brand?.name}`,
  };
}

export default async function page() 
{
  return( 
    <MarketingPreferencesComponent/>
  )
}
