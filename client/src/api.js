import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:3001",
  headers: { "Content-Type": "application/json" },
});

export const getItems   = () => api.get("/items");
export const createItem = (payload) => api.post("/items", { item: payload });
export const updateItem = (id, payload) => api.patch(`/items/${id}`, { item: payload });
export const deleteItem = (id) => api.delete(`/items/${id}`);
