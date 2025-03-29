export interface Entity {
    title?: string;
    overview?: string;
    year?: number;
    link?: string;
    director?: string;
    screenplay?: string;
    genres?: string[];
    rating?: number;
    original_language?: string;
}

export interface Post {
    post_id?: number;
    entity_id?: number;
    entity_type?: string;
    entity?: Entity;
    likes?: number;
    liked?: boolean;
    seen?: boolean;
    comments?: number;
    created_date?: string;
} 

export interface Filters {
    genre?: string;
    yearFrom?: number;
    yearTo?: number;
    rating?: number;
}

export default Post;