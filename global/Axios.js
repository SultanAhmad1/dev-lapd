import axios from "axios";
import { setLocalStorage } from "./Store";
export const BASE_URL = "https://laravel-jouleskitchen.cleartwo.uk/api";
export const IMAGE_URL = "https://laravel-jouleskitchen.cleartwo.uk/storage/";
export const IMAGE_URL_Without_Storage = "https://laravel-jouleskitchen.cleartwo.uk/";

// export const BASE_URL = "https://api.jouleskitchen.co.uk/api";
// export const IMAGE_URL = "https://api.jouleskitchen.co.uk/storage/";
// export const IMAGE_URL_Without_Storage ="https://api.jouleskitchen.co.uk/";

export const BRAND_GUID = "28D0041C-F48D-4054-BA0E-7153D2B8642C";
export const BRANDSIMPLEGUID = "28D0041CF48D4054BA0E7153D2B8642C";
export const PARTNER_ID = 2;
export const DELIVERY_ID = "79857505-DA6E-4256-B9CF-E0F41DACB086";
export const BrandLogoPath = "/gallery/logo.svg";
export const USERIMAGE = "/gallery/user-image.jpeg"

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
  const token = JSON.parse(window.localStorage.getItem(`${BRANDSIMPLEGUID}websiteToken`));
  
  if(token === undefined || token === null || token?.isLoggedIn === false)
  {
    setLocalStorage(`${BRANDSIMPLEGUID}websiteToken`, null)
    return
  }

  axiosPrivate.defaults.headers.common.Authorization = `Bearer ${token?.data?.token}`;
  const onSuccess = (response) =>{return response}

  const onError = (error) => {throw error}

  return axiosPrivate(options).then(onSuccess).catch(onError)
}


