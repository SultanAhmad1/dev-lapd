import Login from "@/components/auth/Login";
import AuthHeader from "@/components/authheader/AuthHeader";


export async function generateMetadata() {
  const brandId = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/brand-detail/${brandId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const brand = data?.data?.brand;
  return {
    title: `Login - ${brand?.name || ""}`,
    description: `Login ${brand?.name}`,
  };
}

export default function page() 
{
  return(
      <div className="form-container">
          <div className="login-header">
              <AuthHeader />
              <div className="others"></div>
          </div>
          <Login />
      </div>
  )
}

