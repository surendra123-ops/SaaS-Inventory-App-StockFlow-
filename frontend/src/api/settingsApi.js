import api from "./axios.js";

export const settingsApi = {
  get() {
    return api.get("/settings");
  },
  update(payload) {
    return api.put("/settings", payload);
  }
};
