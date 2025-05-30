'use client';
import { useEffect } from 'react';
import axios from 'axios';

export const AxiosInterceptorProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
           async (response) => {
                const newToken = response.headers['X-New-Token'];
                const tokenRefreshed = response.headers['X-Token-Refreshed'];

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