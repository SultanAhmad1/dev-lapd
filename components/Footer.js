"use client";
import React, {useContext} from "react";
import HomeContext from "../contexts/HomeContext";
import moment from "moment";
import { footLogoPath, IMAGE_URL_Without_Storage } from "../global/Axios";
import Image from "next/image";
import { FaFacebook, FaSnapchat, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useWebsite } from "@/app/providers/context/WebsiteContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Footer() {

  const {layoutWebsiteModification} = useWebsite()
  
  const { selectedStoreDetails} = useContext(HomeContext);
  
  const pathName = usePathname()
  const segments = pathName.split("/").filter(Boolean);
  const firstSegment = segments[0];
  let isJoinUsPage = firstSegment === "join-us";

  if(isJoinUsPage)
  {
    return 
  }

  return (
    <footer
      className="pt-8 px-4 bg-white border-t"
      style={{
        borderTop: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor,
        backgroundColor: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor,
      }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Brand & Social */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-6 text-center">
          
          {/* Brand Logo + Social */}
          <Link href="/" className="block">
            {layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.websiteFLogoUrl ? (
              <Image
                src={`${IMAGE_URL_Without_Storage}${layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.websiteFLogoUrl}`}
                width={200}
                height={100}
                alt="Brand Name"
                className="w-[200px] h-[100px] object-contain mx-auto"
              />
            ) : (
              <Image
                loading="lazy"
                src={footLogoPath}
                width={200}
                height={100}
                alt="Brand Name"
                className="w-[200px] h-[100px] object-contain mx-auto"
              />
            )}
          </Link>

          {/* Link Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-6 w-full">
            {/* Column 1 */}
            {/* <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <a
                    href="/about-us"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact-us"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/subscription"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Subscription
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Column 2 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/track-order"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Track Order
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="/allergens"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Allergens
                  </a>
                </li> */}
                <li>
                  <Link
                    href="/marketingpreferences"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Marketing Preferences
                  </Link>
                </li>

                <li>
                  <Link
                    href="/join-us"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Join Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <Link
                    href={`tel:${selectedStoreDetails?.telephone}`}
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    {/* {selectedStoreDetails?.telephone?.replace(/^\d/, '+44')} */}
                    {selectedStoreDetails?.telephone}
                  </Link>
                </li>

                <li>
                  <Link
                    href={`mailto:${selectedStoreDetails?.email}`}
                    target="_blank"
                    className="text-base font-medium hover:underline"
                    style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}
                  >
                    @{layoutWebsiteModification?.brand?.name?.split(' ').join('').toLowerCase()}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <ul className="space-y-1">
                <li>
                  <div className="flex justify-center items-center gap-5">
                    {layoutWebsiteModification?.brand?.brand_social_links?.map((link, index) => {
                        return(
                          (link?.social_links !== null && link.name.includes('Facebook')) ?
                              <Link
                                key={index}
                                href={link.social_links}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[&>div>svg]:w-6 [&>div>svg]:h-6 [&>div>svg]:fill-current"
                                style={{
                                  color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor
                                }}
                              >
                                <FaFacebook style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }} className="text-blue-600 hover:scale-110 cursor-pointer" />                   
                              </Link>
                              :
                              (link?.social_links !== null && link.name.includes('Twitter')) ?
                               <Link
                                key={index}
                                href={link.social_links}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[&>div>svg]:w-6 [&>div>svg]:h-6 [&>div>svg]:fill-current"
                                style={{
                                  color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor
                                }}
                              >
                               <FaXTwitter style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }} className="text-sky-400 hover:scale-110 cursor-pointer" />
                              </Link>
                              :
                              (link?.social_links !== null && link.name.includes('instagram')) ?
                               <Link
                                key={index}
                                href={link.social_links}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[&>div>svg]:w-6 [&>div>svg]:h-6 [&>div>svg]:fill-current"
                                style={{
                                  color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor
                                }}
                              >
                                <FaInstagram style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }} className="text-pink-500 hover:scale-110 cursor-pointer" />
                               
                              </Link>
                              :
                              (link?.social_links !== null && link.name.includes('Snapchat')) ?
                               <Link
                                key={index}
                                href={link.social_links}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[&>div>svg]:w-6 [&>div>svg]:h-6 [&>div>svg]:fill-current"
                                style={{
                                  color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor
                                }}
                              >
                                <FaSnapchat style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }} className="text-white hover:scale-110 cursor-pointer" />
                               
                              </Link>
                              :
                              (link?.social_links !== null && link.name.includes('TikTok')) ?
                               <Link
                                key={index}
                                href={link.social_links}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[&>div>svg]:w-6 [&>div>svg]:h-6 [&>div>svg]:fill-current"
                                style={{
                                  color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor
                                }}
                              >
                                <FaTiktok style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }} className="text-white hover:scale-110 cursor-pointer" />
                              </Link>
                              :
                              (link?.social_links !== null && link.name.includes('Youtube')) &&
                               <Link
                                key={index}
                                href={link.social_links}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[&>div>svg]:w-6 [&>div>svg]:h-6 [&>div>svg]:fill-current"
                                style={{
                                  color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor
                                }}
                              >
                                {/* <div
                                  dangerouslySetInnerHTML={{
                                    __html: link.social_icons.replace(/^"|"$/g, "")
                                  }}
                                /> */}
                               <FaYoutube style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }} className="text-red-600 hover:scale-110 cursor-pointer" />
                              </Link>
                        )
                    }
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
        <div className="text-center text-sm sm:text-base" style={{ color: layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.buttonColor }}>
          <p className="py-3"> 
            © All Rights Reserved. {layoutWebsiteModification?.brand?.name} {moment().format('YYYY')}. Powered by{' '}
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
