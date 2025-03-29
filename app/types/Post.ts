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
    comments?: number;
    created_date?: string;
} 