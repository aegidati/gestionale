import axios from "axios";
import { storage } from "../utils/storage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = storage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
