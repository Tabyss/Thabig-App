import axios from "axios";
import { useAuthStore } from "../stores/user.store";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    try {
        const storageData = localStorage.getItem("auth-storage");
        if (storageData) {
            const parsedData = JSON.parse(storageData);
            const token = parsedData?.state?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error("Gagal melakukan parsing token dari localStorage", error);
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Token expired atau tidak valid. Logout otomatis.");
            useAuthStore.getState().logout();
        }

        return Promise.reject(error);
    }
);