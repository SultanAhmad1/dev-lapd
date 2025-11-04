"use client";
import React, {useContext} from "react";
import HomeContext from "../contexts/HomeContext";
import moment from "moment";
import { brandLogoPath, IMAGE_URL_Without_Storage } from "../global/Axios";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  const { websiteModificationData, brandLogo ,selectedStoreDetails} = useContext(HomeContext);
  
  return (
    <footer
      className="pt-8 px-4 bg-white border-t"
      style={{
        borderTop: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor,
        backgroundColor: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor,
      }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Brand & Social */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-6 text-center">
          
          {/* Brand Logo + Social */}
          <a href="/" className="block">
            {brandLogo ? (
              <Image
                src={`${IMAGE_URL_Without_Storage}${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteFLogoUrl}`}
                width={200}
                height={100}
                alt="Brand Name"
                className="w-[200px] h-[100px] object-contain mx-auto"
              />
            ) : (
              <Image
                loading="lazy"
                src={brandLogoPath}
                width={200}
                height={100}
                alt="Brand Name"
                className="w-[200px] h-[100px] object-contain mx-auto"
              />
            )}
          </a>

          {/* Link Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-6 w-full">
            {/* Column 1 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <a
                    href="/about-us"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact-us"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/subscription"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Subscription
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <a
                    href="/track-order"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="/allergens"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Allergens
                  </a>
                </li>
                <li>
                  <a
                    href="/marketingpreferences"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Marketing Preferences
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <a
                    href="/terms-conditions"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    {selectedStoreDetails?.telephone?.replace(/^\d/, '+44')}
                  </button>
                </li>

                <li>
                  <a
                    href={websiteModificationData?.brand?.brand_social_links?.[0]?.social_links}
                    target="_blank"
                    className="text-base font-medium hover:underline"
                    style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    @{websiteModificationData?.brand?.name?.split(' ').join('').toLowerCase()}
                  </a>
                </li>

                <li>
                  <div className="flex justify-center items-center gap-3">
                    {websiteModificationData?.brand?.brand_social_links?.map((link, index) =>
                      link?.social_links ? (
                        <a
                          key={index}
                          href={link.social_links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl"
                          style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: link.social_icons }} />
                        </a>
                      ) : null
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Copyright */}
        <div className="text-center text-sm sm:text-base" style={{ color: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor }}>
          <p className="py-3"> 
            © All Rights Reserved. {websiteModificationData?.brand?.name} {moment().format('YYYY')}. Powered by{' '}
            <Link href="https://cleartwo.co.uk/" target="_blank" className="underline hover:text-blue-600">
              Cleartwo
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
