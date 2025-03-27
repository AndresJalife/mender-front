interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message?: string;
    token?: string;
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
            
            if (data.success && data.token) {
                // TODO: Store the token securely (e.g., in AsyncStorage or secure storage)
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}; 