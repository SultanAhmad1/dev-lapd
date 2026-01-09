import AllergensComponent from "@/components/AllergensComponent";
import { redirect } from "next/navigation";

export default function page() {
  redirect('/');
  return <AllergensComponent />
}
