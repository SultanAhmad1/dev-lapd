"use client";

import { WebsiteContext } from "./context/WebsiteContext";

export default function WebsiteProvider({ children, value }) {
  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  );
}