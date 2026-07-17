import { cookies } from "next/headers";
    
export function handleLocationChange(newLocation) {
  // Update the URL without reloading the page
  const cookieStore = cookies();
  cookieStore.set("cookieSelectedlocation", newLocation);
}

export async function getMenu(store,brand) 
{
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/menu/${store}/${brand}`,
        {
            cache: "no-store",// always fresh or use revalidate
        }
    )

    if(! response.ok) 
    {
        throw new Error("There is something went wrong, please refresh and try again.")
    }

    return response.json()
}