import { Countries, UserSex } from './enums';

export interface User {
    user_id?: number;
    email?: string;
    password?: string;
    name?: string;
    username?: string;
    country?: Countries;
    new?: boolean;
    sex?: UserSex;
    created_date?: string;
    uid?: string;
} 