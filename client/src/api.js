import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:3001",
  headers: { "Content-Type": "application/json" },
});

export const getItems   = () => api.get("/items");
export const getLowStockItems   = () => api.get("/items/low_stock");
export const createItem = (payload) => api.post("/items", { item: payload });
export const updateItem = (id, payload) => api.patch(`/items/${id}`, { item: payload });
export const deleteItem = (id) => api.delete(`/items/${id}`);

export const getListItems   = () => api.get("/shoppinglist");
export const createListItem = (payload) => api.post("/shoppinglist", { item: payload });
export const updateListItem = (id, payload) => api.patch(`/shoppinglist/${id}`, { item: payload });
export const deleteListItem = (id) => api.delete(`/shoppinglist/${id}`);
