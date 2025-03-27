import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import { loginSuccess } from '../store/auth';
import { store } from '../store/store'; // Make sure to export store instance

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    message?: string;
    token?: string;
    user_id: number;
    email: string;
    name: string;
}

export const loginService = {
    login: async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            const response = await fetch('http://143.244.190.174:8443/general/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data: LoginResponse = await response.json();
            
            if (data.token) {
                // Dispatch login success action to Redux store
                store.dispatch(loginSuccess({
                    token: data.token,
                    user: {
                        id: data.user_id, // You might want to get these from the API
                        email: data.email,
                        name: data.name
                    }
                }));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}; 