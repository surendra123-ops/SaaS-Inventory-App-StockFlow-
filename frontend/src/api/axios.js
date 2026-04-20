import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
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
