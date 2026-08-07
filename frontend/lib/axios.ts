import axios from 'axios';

// withCredentials: true is what makes the browser attach the HTTP-only
// JWT cookie to every request, and accept the Set-Cookie header on
// login/register responses. Without this, cookie auth silently fails
// across the frontend (3000) / backend (5000) origin boundary.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Normalize error shape so every caller can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
