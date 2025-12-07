
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BASE_URL = (window as any).env.BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.hash = "#/auth";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export const fetcher = (url: string) =>
  api
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
