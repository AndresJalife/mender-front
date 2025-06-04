import { User } from '@/app/types/User';

export interface RootState {
    auth: {
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
    };
} 
export default RootState;