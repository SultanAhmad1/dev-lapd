
import SubscriptionComponent from "@/components/SubscriptionComponent";
import { redirect } from "next/navigation";
export default function page() 
{
  redirect('/');
  return <SubscriptionComponent />
}
