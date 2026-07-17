import { Inter } from "next/font/google";
import "./globals.css";
import "../public/icons/fontawesome.css"
import Script from "next/script";
import { CustomParentLayout } from "@/components/CustomParentLayout";
import { BRAND_GUID, PARTNER_ID } from "@/global/Axios";
import WebsiteProvider from "./providers/WebsiteProvider";

const inter = Inter({ subsets: ["latin"] });

// app/layout.js or app/page.js (Next.js 14+)
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  title: process.env.NEXT_META_TITLE,
  description: process.env.NEXT_META_DESCRIPTION,
  openGraph: {
    title: process.env.NEXT_META_TITLE,
    description: process.env.NEXT_META_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_BASE_URL, // your site URL
    siteName: process.env.NEXT_META_TITLE,
    images: [
      {
        url: `${process.env.NEXT_LIVE_SITE_URL}og/lapd_og_v6.png`,
        width: 1200,
        height: 630,
        alt: "LAPD FOOD",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_META_TITLE,
    description: process.env.NEXT_META_DESCRIPTION,
    images: [`${process.env.NEXT_LIVE_SITE_URL}og/lapd_og_v6.png`],
  },
};

export default async function RootLayout({ children }) 
{

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/website-modification-detail/${BRAND_GUID}/${PARTNER_ID}`,
    {
      method: "GET",
      next: {
        revalidate: 1800, // 👈 30 minutes
      },
    }
  );

  let websiteModificationData = null
  if (!res.ok) {
    throw new Error("There is something went wrong. Please refresh and try again.");
  }

  const data = await res.json();
  
  websiteModificationData = data?.data

  return (
    <html lang="en">
      <head>
          {/* Google Tag Manager */}
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WJKRRK4');
            `}
          </Script>
          {/* End Google Tag Manager */}
        {/* <meta name="robots" content="noindex, follow" /> */}
        <meta name="robots" content="nofollow, noindex"/>
        <link rel='icon' href="favicon.ico" type="image/x-icon" sizes="18x17"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </head>
      <body className="body-tag">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJKRRK4"height="0" width="0" style={{display:"none", visibility:"hidden"}}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript)*/}
        
        <WebsiteProvider value={{layoutWebsiteModification: websiteModificationData}}>
          <CustomParentLayout>
            {children}
          </CustomParentLayout>
        </WebsiteProvider>

      </body>
    </html>
  );
}
