import api from "./axios.js";

export const dashboardApi = {
  get() {
    return api.get("/dashboard");
  }
};
