import User from "./User";

export interface Comment {
    user: User;
    comment: string;
    created_date: string;
}

export default Comment; 