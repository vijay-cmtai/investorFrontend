import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") + "/api/v1";

const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
