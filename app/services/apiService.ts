import { store } from '../store/store';

export const getAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const state = store.getState();
    const token = state.auth.token;

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
};

// Usage example:
// export const getUserData = async () => {
//     try {
//         const response = await getAuthenticatedRequest('http://143.244.190.174:8443/user/data');
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         throw error;
//     }
// }; 