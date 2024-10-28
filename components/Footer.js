"use client";
import React, { Fragment, useContext} from "react";
import HomeContext from "../contexts/HomeContext";
import moment from "moment";
import { BrandLogoPath, IMAGE_URL_Without_Storage } from "../global/Axios";

function Footer() {
  const { websiteModificationData, brandlogo } = useContext(HomeContext);

  const myColor = "#000000"

  console.log("Website modification color:", websiteModificationData);
  
  return (
    <footer className="footer" style={{'--before-border-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,'--before-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}}>
      <div className="footer-div">
        <div className="footer-brand-logo-partner-logo">
          <div className="footer-brand-logo">
            <a href="/">
            {
              brandlogo !== null ?
                <img loading="lazy" src={IMAGE_URL_Without_Storage+''+brandlogo} width={146} height={24} className="brand-logo" alt='Brand Name' loading='lazy'/>
              :
                <img loading="lazy" src={BrandLogoPath} width={146} height={24} className="brand-logo" alt='Brand Name' loading='lazy'/>
            }
            </a>
            <div className="footer-partners-log" style={{margin: "10px 0px 0px 0px"}}>
              <div className="footer-partners-div">
                {
                  websiteModificationData?.brand?.brand_social_links?.map((links, index) => {
                    return (
                      links?.social_links !== null && (
                        <Fragment key={index}>
                          <a href={links?.social_links} target="_blank">
                            <span className="partner-logo">Facebook</span>
                            {/* <div style={{ color: websiteModificationData ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : myColor}} dangerouslySetInnerHTML={{__html: links?.social_icons,}}/> */}
                            <div style={{ color: websiteModificationData ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor : myColor}} dangerouslySetInnerHTML={{__html: links?.social_icons,}}/>
                          </a>
                          <div className="spacer _24"></div>
                        </Fragment>
                      )
                    );
                  })
                }
              </div>
            </div>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}} href="/about-us">About Us</a>
              </li>
              <li>
                <a className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}} href="/contact-us">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a href="/track-order" className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>Track Order</a>
              </li>
              <li>
                <a className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>Allergens</a>
              </li>
            </ul>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}} href="/terms-conditions">Terms</a>
              </li>
              <li>
                <a className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}} href="/privacy-policy">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <button type="button" className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
                  {websiteModificationData?.brand?.telephone.replace(/^\d/,"+44")}
                </button>
                <a className="footer-brand-conditions-btn" style={{wordSpacing: " -0.1em",'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}} href={websiteModificationData?.brand?.brand_social_links?.[0]?.social_links} target="_blank">
                  @{websiteModificationData?.brand?.name.split(" ").join("").toLowerCase()}
                </a>
              </li>
            </ul>
          </div>

          
          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a className="footer-brand-conditions-btn" style={{'--condition-btn-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}} href="/subscription">Subscription</a>
              </li>
            </ul>
          </div>
        </div>
        <hr style={{margin: "20px"}}/>
        <div className="copy-rigth">
          <div className="copy-right-hr"></div>
          <div className="copy-rigth">
            <div className="copy-right-nested-div" style={{'--copy-color': websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor}}>
              @ All Rights Reserved. {websiteModificationData?.brand?.name} {moment().format("YYYY")}. Powered by ClearTwo
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
