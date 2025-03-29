
import { Post } from '@/app/types/Post';
import { getAuthenticatedRequest } from './apiService';

export const postService = {
    getPosts: async (): Promise<Post[]> => {
        try {
            const response = await getAuthenticatedRequest('/post');
            
            if (!response?.ok) {
                throw new Error('Failed to fetch messages');
            }
                        
            const data = await response.json();
            return data as Post[];
        } catch (error) {
            console.error('Error in getPosts:', error);
            throw error;
        }
    }
}; 