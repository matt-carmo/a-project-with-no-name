import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization:
      typeof window !== "undefined"
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
