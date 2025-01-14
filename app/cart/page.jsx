"use client"; // This is a client component 👈🏽

import { useState } from "react";

export default function Cart() {
  const [firstName, setFirstName] = useState("Sultan Ahmad"); // I can use client hooks 👈🏽

  return(
    <h1>{firstName}</h1>
  );
}