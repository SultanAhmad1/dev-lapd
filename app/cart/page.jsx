"use client"; // This is a client component 👈🏽

import { useState } from "react";

export default function Cart() {
  const [firstname, setFirstname] = useState("Sultan Ahmad"); // I can use client hooks 👈🏽

  return(
    <h1>{firstname}</h1>
  );
}