import axios from 'axios';

export const handleAxiosError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if(error.response?.data?.errors?.[0]){
            return error.response?.data?.errors[0]?.message;
        }else if(error.response?.data?.message){
            return error.response?.data?.message;
        }else{
            return error.message;
        }
        
    }
    if (error instanceof Error) {
        return error.message;
    }
    return error as string;
}

