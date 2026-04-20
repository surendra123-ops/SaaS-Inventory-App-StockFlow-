import api from "./axios.js";

export const productApi = {
  list(search = "") {
    return api.get("/products", { params: search ? { search } : {} });
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
