
import axios from "axios";
import useSWR from "swr";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
});
export default api;


export const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
});


export const authMultiFormApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
});


authApi.interceptors.request.use(config => {
    config.headers['authorization'] = `Bearer ${localStorage.getItem("x4976gtylCC")}`
    return config
}, error => {
    return Promise.reject(error)
})

authMultiFormApi.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem("x4976gtylCC")}`
    config.headers["content-type"] = "multipart/form-data"
    return config
}, error => {
    return Promise.reject(error)
})


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