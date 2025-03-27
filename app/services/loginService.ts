interface LoginCredentials {
    email: string;
    password: string;
}

export const loginService = {
    login: async (credentials: LoginCredentials): Promise<boolean> => {
        // TODO: Replace with actual API call
        // For now, we'll simulate an API call with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                if (credentials.email === "test" && credentials.password === "test") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000);
        });
    }
}; 