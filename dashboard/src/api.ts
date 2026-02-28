import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// User API endpoints
export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (userData: { name: string; number: string; address: string }) => 
    api.post("/users", userData),
  update: (id: number, userData: { name: string; number: string; address: string; isOnline?: boolean }) => 
    api.put(`/users/${id}`, userData),
  updateStatus: (id: number, isOnline: boolean) => 
    api.patch(`/users/${id}/status`, { isOnline }),
  delete: (id: number) => api.delete(`/users/${id}`)
};
