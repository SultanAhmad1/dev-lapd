// pages/_app.js

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function App({ Component, pageProps }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
    );
}
