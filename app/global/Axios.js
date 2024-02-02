import axios from "axios";
// const BASE_URL = 'http://127.0.0.1:8000/api'
const BASE_URL = "https://laravel-jouleskitchen.cleartwo.uk/api";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const BRAND_GUID = "28D0041C-F48D-4054-BA0E-7153D2B8642C";
export const PARTNER_ID = 2;
export const DELIVERY_ID = "79857505-DA6E-4256-B9CF-E0F41DACB086";
