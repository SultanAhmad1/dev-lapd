"use client";

import { createContext, useContext } from "react";

export const WebsiteContext = createContext(null);

export const useWebsite = () => useContext(WebsiteContext);