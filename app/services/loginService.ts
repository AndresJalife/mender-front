import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import { loginSuccess } from '../store/auth';
import { store } from '../store/store'; // Make sure to export store instance
import { Countries, UserSex } from '../types/enums';
import User from '../types/User';

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupCredentials {
    email: string;
    password: string;
    name: string;
    username: string;
    country: string;
    sex: string;
}

interface LoginResponse {
    message?: string;
    token?: string;
    user_id: number;
    email: string;
    name: string;
    username: string;
}

interface SignupResponse {
    message?: string;
    success: boolean;
}

export const loginService = {
    login: async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            console.log('login');
            const response = await fetch('http://143.244.190.174:8443/general/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data: LoginResponse = await response.json();
            
            if (data.token) {
                // Fetch complete user information
                const userResponse = await fetch(`http://143.244.190.174:8443/user/${data.user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                    },
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user details');
                }

                console.log('userResponse', userResponse);
                
                const userData: User = await userResponse.json();

                // Dispatch login success action to Redux store with complete user data
                store.dispatch(loginSuccess({
                    token: data.token,
                    user: userData
                }));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
        try {
            const response = await fetch('http://143.244.190.174:8443/general/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...credentials,
                    new: true,
                }),
            });

            const data: SignupResponse = await response.json();

            if (response.status === 201) {
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }

        } catch (error: unknown) {
            console.error('Signup error:', error);
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            return { success: false, message: 'An unknown error occurred' };
        }
    }
}; 

export default loginService;