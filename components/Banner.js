"use client";
import Image from "next/image";
import { BANNER_IMAGE, IMAGE_URL_Without_Storage } from "../global/Axios";

function Banner(props) {
  const { websiteModificationData } = props;

  return (
    <div className="banner">
      {
        websiteModificationData?.websiteModificationLive === null ?
        <Image
          className="banner-img"
          src={`${BANNER_IMAGE}`}
          alt="Banner"
          loading="lazy"
          width={1920}
          height={219}
        />
        :

        <Image
          className="banner-img"
          src={`${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteHeaderUrl !== null ? IMAGE_URL_Without_Storage + "" + websiteModificationData?.websiteModificationLive?.json_log?.[0]?.websiteHeaderUrl : BANNER_IMAGE}`}
          alt="Banner"
          loading="lazy"
          width={1920}
          height={219}
        />
      }
    </div>
  );
}

export default Banner;
