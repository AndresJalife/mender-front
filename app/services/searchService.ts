import { getAuthenticatedRequest } from './apiService';

export interface SearchResult {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
}

export const searchService = {
    search: async (query: string): Promise<SearchResult[]> => {
        if (query.length < 3) return [];
        
        const response = await getAuthenticatedRequest(`/search?q=${encodeURIComponent(query)}`);
        if (!response) return [];
        
        const data = await response.json();
        return data;
    }
}; 