import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  handleSessionExpiry,
  isSessionExpired,
} from "@/lib/auth-utils";

/**
 * THE single axios instance for the whole app. There is intentionally only one
 * (dgtool_fe grew a second one plus a `useApiManager` hook and a raw `fetch`
 * outlier — we do not repeat that). All server calls go through a
 * `services/{domain}.ts` wrapper around this client.
 */

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL && process.env.NODE_ENV !== "production") {
  console.warn(
    "[api-client] NEXT_PUBLIC_API_BASE_URL is not set — requests will fail. " +
      "Copy .env.example to .env.local and fill it in.",
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && !isSessionExpired(token)) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error?.response?.status === 401) {
      handleSessionExpiry();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
