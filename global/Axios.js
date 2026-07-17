import axios from "axios";
import { setLocalStorage } from "./Store";

const removeLastApi = (url) => {
    const lastApiIndex = url.lastIndexOf("api");
    if (lastApiIndex !== -1) {
      return url.substring(0, lastApiIndex); // Remove everything from the last "/api"
    }
    return url; // Return the original URL if "/api" is not found
};
// Making global mostly used keys.
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
export const BASE_URL_V2 = process.env.NEXT_PUBLIC_BASE_URL_V2

export const IMAGE_URL_Without_Storage = removeLastApi(BASE_URL);
export const BRAND_GUID = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS;

export const BRAND_SIMPLE_GUID = BRAND_GUID.replace(/-/g, "");
export const STRIPE_PK_KEY=process.env.NEXT_PUBLIC_STRIPE_KEYS
export const DEFAULT_LOCATION = process.env.NEXT_PUBLIC_DEFAULT_LOCATION

export const PARTNER_ID = 2;
export const DELIVERY_ID = process.env.NEXT_PUBLIC_DELIVERY_ID;

export const brandLogoPath = "/gallery/logo.svg";
export const footLogoPath = "/gallery/footerLogo.svg"
export const USER_IMAGE = "/gallery/user-image.jpeg"
export const BANNER_IMAGE = "/gallery/banner.png"
export const JOINUS_MODAL_IMAGE = "/join/join_us.png"
export const JOINUS_BANNER_IMAGE = "/join/Vocher.png"
export const JOINUS_VIDEO = "/join/join_video.mp4"
export const JOINUS_COMPONENT_VIDEO = "/join/join_component.mp4"

export const DESKTOP_BANNER_1 = "/deal/desktop/banner_1.png"
export const DESKTOP_BANNER_2 = "/deal/desktop/banner_2.jpg"

export const MOBILE_BANNER_1 = "/deal/mobile/banner_1.png"
export const MOBILE_BANNER_2 = "/deal/mobile/banner_2.jpg"

export const BLACK_COLOR = "#000"
export const LIGHT_BLACK_COLOR = "#444"
export const WHITE_COLOR = "#fff"
export const HOVER_COLOR = "#9d9d9d"

export default axios.create({
  baseURL: BASE_URL,
});

export const loginAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// v2 axios
export const axiosV2Private = axios.create({
  baseURL: BASE_URL_V2,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const request = ({...options}) => {
  const token = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}websiteToken`));
    
  if(token === undefined || token === null || token?.isLoggedIn === false)
  {
    setLocalStorage(`${BRAND_SIMPLE_GUID}websiteToken`, null)
    return
  }

  axiosPrivate.defaults.headers.common.Authorization = `Bearer ${token?.data?.token}`;
  const onSuccess = (response) =>{return response}
  const onError = (error) => {throw error}
  return axiosPrivate(options).then(onSuccess).catch(onError)
}


