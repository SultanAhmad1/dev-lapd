import AboutComponent from "@/components/AboutComponent";
import { redirect } from "next/navigation";
export default function page() 
{
  // window.location.href = '/'; // Client-side redirect
  redirect('/');
  return <AboutComponent />
}
