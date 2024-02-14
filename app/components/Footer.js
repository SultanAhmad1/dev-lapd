import React, { Fragment, useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'
import moment from 'moment'
import Link from 'next/link';

function Footer() {
  const{
    websiteModificationData,
    brandlogo
  } = useContext(HomeContext)

  const [websiteOrigin, setWebsiteOrigin] = useState(null)
  useEffect(() => {
    setWebsiteOrigin(window.location.origin)
  }, [])
  
  return (
    <>
    {/* Footer */}
    <footer className="footer">
      <div className="footer-div">
        <div className="footer-brand-logo-partner-logo">
          <div className="footer-brand-logo">
            <img
              src={brandlogo}
              width="146"
              height="24"
              className="brand-logo"
            ></img>
            {/* <div className="footer-partner-logo">
              <a>
                <img alt="Download on the App Store" role="img" src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/783bb4a82e5be29e.svg" loading="lazy" decoding="async" height="40" width="135" className="partner-link"></img>
              </a>
              <a>
                <img alt="Get it on Google Play" src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/163bdc9b0f1e7c9e.png" loading="lazy" decoding="async" height="40" width="134" className="partner-link"></img>
              </a>
            </div> */}

            <div className="footer-partners-log">
              <div className="footer-partners-div">

                {
                  websiteModificationData?.brand?.brand_social_links?.map((links,index) =>
                  {
                    return(
                      links?.social_links !== null &&
                      <Fragment key={index}>
                        <a href={links?.social_links}  target='_blank'>
                          <span className="partner-logo">Facebook</span>
                          <span dangerouslySetInnerHTML={{ __html: links?.social_icons }} />
                        </a>
                        <div className="spacer _24"></div>
                      </Fragment>
                    )
                  })
                }
              </div>
            </div>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a className="footer-brand-conditions-btn">About Us</a>
              </li>
              <li>
                <a className="footer-brand-conditions-btn">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <Link href={`${websiteOrigin}/track-order`} className="footer-brand-conditions-btn">Track Order</Link>
              </li>
              <li>
                <a className="footer-brand-conditions-btn">Allergens</a>
              </li>
            </ul>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a className="footer-brand-conditions-btn">Terms</a>
              </li>
              <li>
                <a className="footer-brand-conditions-btn">Privacy Policy</a>
              </li>
              
            </ul>
          </div>

          <div className="footer-brand-conditions">
            <ul>
              <li>
                <a className="footer-brand-conditions-btn">{websiteModificationData?.brand?.telephone.replace(/^\d/, '+44')}</a>
                <a className="footer-brand-conditions-btn" href={parseInt(websiteModificationData?.brand?.brand_social_links.length) > parseInt(0) && websiteModificationData?.brand?.brand_social_links[0]?.social_links} target='_blank' style={{wordSpacing:" -0.1em"}}>@{websiteModificationData?.brand?.name.split(' ').join('').toLowerCase()}</a>
              </li>
            </ul>
          </div>
        </div>
        <hr></hr>
        <div className="copy-rigth">
          <div className="copy-right-hr"></div>
          <div className="copy-rigth">
            <div className="copy-right-nested-div">
              @ All Rights Reserved. {websiteModificationData?.brand?.name} {moment().format('YYYY')}. Powered by ClearTwo
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
  )
}

export default Footer