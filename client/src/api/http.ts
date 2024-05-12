import axios from 'axios';
import { clearLoginStatus, getToken } from '@/lib/utils';

export type Result<T> = Promise<{
    code: number;
    message: string;
    data: T;
}>;

const request = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 60 * 1000,
});

request.interceptors.request.use((config) => {
    if (config.noAuth) {
        return config;
    } else {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
});

request.interceptors.response.use(
    (response) => {
        if (response.data.code === 401) {
            clearLoginStatus();
            return {};
        }
        return response.data;
    },
    (error) => {
        if (error.response) {
            const errorCode = error.response.status;
        }
        return Promise.reject(error);
    },
);

export default request;
