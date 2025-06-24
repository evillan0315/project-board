// src/services/api.ts
import axios from 'axios';

// FIX: Use the correct environment variable name BASE_URL_API
export const API_URL = `${import.meta.env.BASE_URL_API}/api`;
let getToken: () => string | null = () => localStorage.getItem('token');

export function configureTokenGetter(fn: () => string | null) {
  getToken = fn;
}
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
