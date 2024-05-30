"use client";
import Layout from "@/components/Layout";
import NothingFound from "@/components/NothingFound";
import Products from "@/components/Products";
import HomeContext from "@/contexts/HomeContext";
import { useContext } from "react";

export default function Home() {
  const { ismenuavailable } = useContext(HomeContext);
  // Fetch Menu From Database.
  /**
   * There if the nothing is available then i can show Noting found.
   */

  return <Layout>{ismenuavailable ? <Products /> : <NothingFound />}</Layout>;
}
