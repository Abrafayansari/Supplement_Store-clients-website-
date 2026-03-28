import axios from 'axios';
import { toast } from 'sonner';

const normalizeApiUrl = (raw?: string): string => {
  let value = (raw || '').trim();

  if (!value) {
    if (typeof window !== 'undefined') return `${window.location.origin}/api`;
    return '/api';
  }

  // Guard against accidental concatenation like: https://a.comhttps://a.com/api/
  const firstHttp = value.indexOf('http');
  if (firstHttp !== -1) {
    const secondHttp = value.indexOf('http', firstHttp + 4);
    if (secondHttp !== -1) {
      value = value.slice(secondHttp);
    }
  }

  return value.replace(/\/+$/, '');
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors and successes
api.interceptors.response.use(
  (response) => {
    // Show success message if the backend sends a 'message' field
    // Allow callers to suppress toasts by setting header 'X-Suppress-Toast'
    const suppress = response.config.headers && (response.config.headers['X-Suppress-Toast'] || response.config.headers['x-suppress-toast']);
    if (!suppress && response.data && response.data.message && response.config.method !== 'get') {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const suppress = error.config?.headers && (error.config.headers['X-Suppress-Toast'] || error.config.headers['x-suppress-toast']);
    if (suppress) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred';
    
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - could trigger a logout if needed
          // but let the individual components handle specific 401 logic if they want
          toast.error(message);
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 422:
          toast.error(message);
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
