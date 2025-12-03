import { useAuthStore } from "@/store/auth-store";
import axios from "axios";


const { token } = useAuthStore.getState();
export const api = axios.create({
  baseURL: window.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

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
