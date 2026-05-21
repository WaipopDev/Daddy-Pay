import axios from "axios";
import { handleAxiosError } from "./helpFunction";
// const baseURL = process.env.API_URL;

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`/api/auth-signin`, { username, password });
        return response;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`/api/forgot-password`, { email });
        return response;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(`/api/reset-password`, { token, newPassword });
        return response;
    } catch (error) {
        throw handleAxiosError(error);
    }
}
