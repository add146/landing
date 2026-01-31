import { apiClient } from './client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    token: string;
}

export const authApi = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post('/api/auth/logout');
    },
};
