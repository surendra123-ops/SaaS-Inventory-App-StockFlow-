import api from "./axios.js";

export const productApi = {
  list({ search = "", page = 1, limit = 10 } = {}) {
    const params = { page, limit };
    if (search) params.search = search;
    return api.get("/products", { params });
  },
  create(payload) {
    return api.post("/products", payload);
  },
  update(id, payload) {
    return api.put(`/products/${id}`, payload);
  },
  remove(id) {
    return api.delete(`/products/${id}`);
  }
};
