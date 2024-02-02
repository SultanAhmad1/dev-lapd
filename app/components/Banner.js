import React, { useContext } from 'react'

function Banner(props) {
  
  const{
    websiteModificationData
  } = props

  return (
    <div className="banner">
      <img className="banner-img" src={`${websiteModificationData !== null && websiteModificationData?.json_log[0]?.websiteHeaderUrl !== null ? websiteModificationData?.json_log[0]?.websiteHeaderUrl : "https://duyt4h9nfnj50.cloudfront.net/sku/07a57b3c6cf4a1643112a8fa13b82531"}`} alt='Banner'></img>
    </div>
  )
}

export default Banner