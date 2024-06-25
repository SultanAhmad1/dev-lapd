import { IMAGE_URL_Without_Storage } from "../global/Axios";

function Banner(props) {
  const { websiteModificationData } = props;

  return (
    <div className="banner">
      <img
        className="banner-img"
        src={`${ websiteModificationData?.websiteModificationLive !== null && websiteModificationData?.websiteModificationLive?.json_log[0] ?.websiteHeaderUrl !== null ? IMAGE_URL_Without_Storage + "" + websiteModificationData?.websiteModificationLive?.json_log[0] ?.websiteHeaderUrl : "https://duyt4h9nfnj50.cloudfront.net/sku/07a57b3c6cf4a1643112a8fa13b82531"}`}
        alt="Banner"
      />
    </div>
  );
}

export default Banner;
