import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import { loginSuccess } from '../store/auth';
import { store } from '../store/store'; // Make sure to export store instance
import { Countries, UserSex } from '../types/enums';
import User from '../types/User';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Platform-aware API configuration (same as apiService.ts)
const getApiBaseUrl = () => {
    // if (__DEV__) {
    //     return 'http://192.168.0.192:8443';
    // }
    // Production environment
    return 'http://143.244.190.174:8443';
};

const API_BASE_URL = getApiBaseUrl();

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

const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt === maxRetries) break;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
            console.log(`Retry attempt ${attempt} of ${maxRetries}`);
        }
    }
    
    throw lastError;
};

export const loginService = {
    login: async (credentials: LoginCredentials): Promise<boolean> => {
        return retryOperation(async () => {
            console.log('login');
            console.log('Using API_BASE_URL:', API_BASE_URL);
            console.log('Platform:', Platform.OS);
            console.log('Login URL:', `${API_BASE_URL}/general/login`);
            
            try {
                const response = await fetch(`${API_BASE_URL}/general/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                const data: LoginResponse = await response.json();
                console.log('Response data:', data);
                
                if (data.token) {
                    // Fetch complete user information
                    const userResponse = await fetch(`${API_BASE_URL}/user/${data.user_id}`, {
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
                console.error('Login fetch error:', error);
                throw error; // Re-throw to trigger retry
            }
        });
    },

    signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
        return retryOperation(async () => {
            const response = await fetch(`${API_BASE_URL}/general/signup`, {
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
        });
    }
}; 

export default loginService;