import { axiosPrivate, loginAxios, request } from "@/global/Axios"
import { useMutation, useQuery } from "@tanstack/react-query"

const autoUpdateDataFn = async (url) => {
    const response = await axiosPrivate.get(url)
    return response?.data
}

export const useGetQueryAutoUpdate = (key,keepUrl, onSuccess, onError, isEnabled) => {
  return useQuery([key], () => autoUpdateDataFn(keepUrl),{onSuccess,onError, enabled: isEnabled})
}

export const usePostMutationHook = (key,url, onSuccess, onError) => {
  return useMutation((newData) => axiosPrivate.post(url,newData), {key,onSuccess,onError,throwOnError: false,})
}

export const useLoginMutationHook = (key,url, onSuccess, onError) => {
  return useMutation((newData) => loginAxios.post(url,newData), {key,onSuccess,onError,throwOnError: false,})
}

export const useLogoutMutationHook = (key,url, onSuccess, onError) => {
  return useMutation((newData) => request({method: 'POST',url: url,data: newData}), {key,onSuccess,onError,})
}
 
export const useCheckAuthMutationHook = (key,url, onSuccess, onError) => {
  // return useMutation((newData) => axiosPrivate.post(url,newData), {key,onSuccess,onError,throwOnError: false,})
  return useMutation((newData) => request({method: 'POST',url: url,data: newData}), {key,onSuccess,onError,})
}

export const useVerifyOTP = (key,url, onSuccess, onError) => {
  return useMutation((newData) => loginAxios.post(url,newData), {key,onSuccess,onError,throwOnError: false,})
}

export const useRegisterPost = (key,url, onSuccess, onError) => {
  return useMutation((newData) => loginAxios.post(url,newData), {key,onSuccess,onError,throwOnError: false,})
}

export const usePatchMutationHook = (key,url, onSuccess, onError) => {
  return useMutation((newData) => axiosPrivate.patch(url, newData), {key,onSuccess,onError})
}

const fetchOrderHistory = async (url) => {
  const response = await request({method: "GET", url: url})
  return response?.data
}

export const useGetAfterAuthMutationHook = (key,keepUrl, id, onSuccess, onError, isEnabled) => {
  return useQuery([`${key}-${id}`], () => fetchOrderHistory(keepUrl),{onSuccess,onError, enabled: !!isEnabled})
}

export const usePostAfterAuthMutationHook = (key,url, onSuccess, onError) => {
  return useMutation((newData) => request({method: 'POST',url: url,data: newData}), {key,onSuccess,onError,})
}

export const usePatchAfterAuthMutationHook = (key,url, onSuccess, onError) => {
  return useMutation((newData) => request({method: 'PATCH',url: url,data: newData}), {key,onSuccess,onError,})
}