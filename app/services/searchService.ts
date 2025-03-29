import Post from '../types/Post';
import { getAuthenticatedRequest } from './apiService';


export const searchService = {
    search: async (query: string): Promise<Post[]> => {
        if (query.length < 3) return [];
        
        const response = await getAuthenticatedRequest(`/post/search?q=${encodeURIComponent(query)}`);
        if (!response) return [];
        
        const data = await response.json();

        return data;
    }
}; 

export default searchService;