"use client"
import CustomLayout from './CustomLayout'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();


export const CustomParentLayout = ({children}) => {
  return(
    <QueryClientProvider client={queryClient}>
      <CustomLayout>
      {children}
      </CustomLayout>
      <ReactQueryDevtools position="bottom-left"/>
    </QueryClientProvider>
  )
}
