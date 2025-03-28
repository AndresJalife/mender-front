import { store } from '../store/store';
import { loginService } from './loginService';
const API_BASE_URL = 'http://143.244.190.174:8443';

export const getAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
    const state = store.getState();
    const token = state.auth.token;

    const login = async () => {
        const success = await loginService.login({ 
            email: state.auth.user?.email || '', 
            password: state.auth.user?.password || ''
        });
        return success;
    }

    if (!token) {
        // login 
        const success = await login();
        if (!success) {
            // go to login screen
            return;
        }
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // login again
        const success = await login();
        if (!success) {
            // go to login screen
            return;
        }

        // try again
        return await getAuthenticatedRequest(endpoint, options);
    }


    return response;
};
