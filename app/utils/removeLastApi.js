export const removeLastApi = (url) => {
  const lastApiIndex = url.lastIndexOf("api");
  if (lastApiIndex !== -1) {
    return url.substring(0, lastApiIndex); // Remove last "api"
  }
  return url;
};