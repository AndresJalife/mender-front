import { store } from '../store/store';

const API_BASE_URL = 'http://143.244.190.174:8443';

export const getAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
    const state = store.getState();
    const token = state.auth.token;

    if (!token) {
        throw new Error('No authentication token found');
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

    return response;
};
