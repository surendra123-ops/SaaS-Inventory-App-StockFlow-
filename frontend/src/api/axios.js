import axios from "axios";

const normalizeApiBaseUrl = () => {
  const raw =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const withoutTrailingSlash = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }
  return `${withoutTrailingSlash}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(),
  withCredentials: true
});

let isRefreshing = false;
let queuedRequests = [];
let onUnauthorized = null;

const runQueue = (error) => {
  queuedRequests.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve();
    }
  });
  queuedRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queuedRequests.push({
          resolve: () => resolve(api(originalRequest)),
          reject
        });
      });
    }

    isRefreshing = true;
    try {
      await api.post("/auth/refresh");
      runQueue();
      return api(originalRequest);
    } catch (refreshError) {
      runQueue(refreshError);
      if (onUnauthorized) {
        onUnauthorized();
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export default api;
