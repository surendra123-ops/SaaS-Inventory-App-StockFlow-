import api from "./axios.js";

export const authApi = {
  signup(payload) {
    return api.post("/auth/signup", payload);
  },
  login(payload) {
    return api.post("/auth/login", payload);
  },
  refresh() {
    return api.post("/auth/refresh");
  },
  logout() {
    return api.post("/auth/logout");
  }
};
