export interface Genre {
    entity_genre_id?: number;
    name?: string;
}

export interface Actor {
    actor_id?: number;
    name?: string;
}

export interface ProductionCompany {
    entity_production_company_id?: number;
    name?: string;
}

export interface WatchProvider {
    watch_provider_id?: number;
    provider_name?: string;
}

export interface Entity {
    entity_id?: number;
    entity_type?: string;
    tmbd_id?: number;
    imdb_id?: string;
    title?: string;
    vote_average?: number;
    release_date?: string;
    revenue?: number;
    runtime?: number;
    overview?: string;
    popularity?: number;
    tagline?: string;
    trailer?: string;
    director?: string;
    genres?: Genre[];
    actors?: Actor[];
    production_companies?: ProductionCompany[];
    watch_providers?: WatchProvider[];
    rating?: number;
    original_language?: string;
}

export interface UserPostInfo {
    liked?: boolean;
    seen?: boolean;
    user_rating?: number;
}

export interface Post {
    post_id?: number;
    entity_id?: number;
    entity?: Entity;
    likes?: number;
    user_post_info?: UserPostInfo;
    comments?: number;
    created_date?: string;
}

export interface Filters {
    genre?: string;
    min_release_date?: string;
    max_release_date?: string;
    min_rating?: number;
    max_rating?: number;
}

export default Post;