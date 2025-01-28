import axios from "axios";
import { removeLastApi, setLocalStorage } from "./Store";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const IMAGE_URL_Without_Storage = removeLastApi(BASE_URL);
export const BRAND_GUID = process.env.NEXT_PUBLIC_STORE_PUBLIC_KEYS;

export const BRAND_SIMPLE_GUID = BRAND_GUID.replace(/-/g, "");
export const STRIPE_PK_KEY=process.env.NEXT_PUBLIC_STRIPE_KEYS

export const PARTNER_ID = 2;
export const DELIVERY_ID = process.env.NEXT_PUBLIC_DELIVERY_ID;

export const brandLogoPath = "/gallery/logo.svg";
export const USER_IMAGE = "/gallery/user-image.jpeg"

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


