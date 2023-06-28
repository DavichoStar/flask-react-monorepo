if (!import.meta.env.VITE_API_URL)
  throw new Error("[ENV] VITE_API_URL is not defined");

export const API_URL = import.meta.env.VITE_API_URL;
