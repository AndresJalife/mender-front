export interface RootState {
    auth: {
        user: {
            id: number;
            email: string;
            name: string;
        } | null;
        token: string | null;
        isAuthenticated: boolean;
    };
} 
export default RootState;