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
