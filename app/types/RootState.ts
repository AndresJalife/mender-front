import { User } from '@/app/types/User';

export default interface RootState {
    auth: {
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
    };
}