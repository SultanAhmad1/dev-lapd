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