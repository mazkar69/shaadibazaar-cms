
import axios from "axios";
import useSWR from "swr";

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

// Public API instance (for login, public endpoints)
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
    }
});

// Add response interceptor to handle errors consistently
api.interceptors.response.use(
    response => response,
    error => {
        // Handle network errors or CORS issues gracefully
        if (!error.response) {
            console.error('Network Error or CORS issue:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;


// Authenticated API instance
export const authApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
    }
});


// Authenticated Multipart Form API instance
export const authMultiFormApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
});


// Request interceptor for authApi - adds Authorization header
authApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem("x4976gtylCC");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor for authApi - handles errors consistently
authApi.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            console.error('Network Error or CORS issue:', error.message);
        }
        // Handle 401 unauthorized - token might be expired
        if (error.response?.status === 401) {
            localStorage.removeItem("x4976gtylCC");
            // Optionally redirect to login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Request interceptor for authMultiFormApi
authMultiFormApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem("x4976gtylCC");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Don't set Content-Type for multipart - let browser set it with boundary
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor for authMultiFormApi
authMultiFormApi.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            console.error('Network Error or CORS issue:', error.message);
        }
        return Promise.reject(error);
    }
);


// ----------------------------------------------------------------


export const fetcher = async (url) => {
    const { data } = await api.get(url);
    return data;
}

export const authFetcher = async (url) => {
    const { data } = await authApi.get(url);
    return data;
}


export function useApi(url) {
    const { data, error, isLoading } = useSWR(url, fetcher)
    return {
        data,
        isLoading,
        isError: error
    }
}

export function useAuthApi(url) {
    const { data, error, isLoading } = useSWR(url, authFetcher)
    return {
        data,
        isLoading,
        isError: error
    }
}

// -----------------------------------------------------------

export async function getSignedUrl({ key, content_type }) {
    const response = await apiClient.post("/bucket/signed_url", {
        key,                //key = "public/" + key;
        content_type,
    });

    return response.data;
} 