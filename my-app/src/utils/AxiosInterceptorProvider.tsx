'use client';
import { useEffect } from 'react';
import axios from 'axios';

export const AxiosInterceptorProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
           async (response) => {
            // console.log('response.headers', response.headers)
                const newToken = response.headers['x-new-token'];
                const tokenRefreshed = response.headers['x-token-refreshed'];

                if (tokenRefreshed === 'true' && newToken) {
                    // Example: update cookie via JS or call API route to set cookie
                    await axios.post('/api/update-token', { token: newToken });
                    console.log('Token refreshed automatically');
                    // document.cookie = `token=${newToken}; path=/;`;
                }

                return response;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
               

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return <>{children}</>;
};