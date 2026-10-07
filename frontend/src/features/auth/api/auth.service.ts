import { api } from "../../../shared/api/axios";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    [key: string]: unknown;
}

export const loginApi = async (
    credentials: LoginCredentials,
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
};
