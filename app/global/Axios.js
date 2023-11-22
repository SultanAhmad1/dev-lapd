import axios from 'axios';
// const BASE_URL = 'http://127.0.0.1:8000/api'
const BASE_URL = 'https://laravel-jouleskitchen.c2dev.uk/api'

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export  const BRAND_GUID = "56A7923E-E8D5-4212-82EB-8E64775CEF10"