import axios from 'axios';
const API_URL = `https://board-api.duckdns.org/api`;
//const API_URL = `http://localhost:5000/api`;
const token = localStorage.getItem('token');

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  // Include credentials (cookies) with every request
  //withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
