// import LoaderStatus from "@/components/LoaderStatus";
import { BRAND_SIMPLE_GUID, IMAGE_URL_Without_Storage } from "@/global/Axios";
import dynamic from "next/dynamic";
const DisplaySingleItem = dynamic(() => import("@/components/singleitem/DisplaySingleItem"));
import { cookies } from "next/headers";

export async function generateMetadata({ params }) {
  // 🔹 Exit immediately if any param is missing, .well-known restricted for SSL certificate data.
  const cookieStore = cookies();
  const cookieSelectedlocationcation = cookieStore.get("cookieSelectedLocation")?.value;

  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS;
  console.log("cookieSelectedlocationcation", cookieSelectedlocationcation);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const url = cookieSelectedlocationcation ? `${baseUrl}/locational-brand-menu/${brandId}/${cookieSelectedlocationcation}`: `${baseUrl}/locational-brand-menu/${brandId}`;

  const res = await fetch(
    `${url}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  const convertToJSobj = data?.data?.menu.menu_json_log;
  
  // Example: fetch single item if needed
  // const convertToJSobj = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}menus`))
  const getSingleCategory = convertToJSobj?.categories?.find((category) => category.slug === params.category);
  const getItemFromCategory = getSingleCategory?.items?.find((item) => item.slug === params.product);

  const getSeoTitle = getItemFromCategory?.seo_title === null ? getItemFromCategory?.title : getItemFromCategory?.seo_title
  const getSeoDescription = getItemFromCategory?.seo_description === null ? getItemFromCategory?.description : getItemFromCategory?.seo_description
  return {
    title: `${getItemFromCategory?.title} - ${brand?.name || ""}`,
    description: getItemFromCategory?.description,

    openGraph: {
      title: getSeoTitle,
      description: getSeoDescription,
      images: [
        {
          url: `${IMAGE_URL_Without_Storage}${getItemFromCategory?.image_url}`,
        },
      ],
      // url: `${process.env.NEXT_LIVE_SITE_URL}/${params?.location}/${params?.category}/${params?.product}`,
      url: `${process.env.NEXT_LIVE_SITE_URL}/${params?.category}/${params?.product}`,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: getSeoTitle,
      description: getSeoDescription,
      images: [`${IMAGE_URL_Without_Storage}${getItemFromCategory?.image_url}`],
    },
  };
}

export default async function productDetails({ params }) 
{
  return (
    <>
      <DisplaySingleItem params={params}/>
    </>
  );
}