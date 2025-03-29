import { Post } from '@/app/types/Post';
import { getAuthenticatedRequest } from './apiService';
import { Filters } from '@/app/types/Post';

export const postService = {
    getPosts: async (filters: Filters): Promise<Post[]> => {
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
    },
    likePost: async (postId: number): Promise<void> => {
        try {
            const response = await getAuthenticatedRequest(`/post/${postId}/like`);
            if (!response?.ok) {
                throw new Error('Failed to like post');
            }
        } catch (error) {
            console.error('Error in likePost:', error);
            throw error;
        }
    },
    markAsSeen: async (postId: number): Promise<void> => {
        try {
            const response = await getAuthenticatedRequest(`/post/${postId}/seen`);
            if (!response?.ok) {
                throw new Error('Failed to mark post as seen');
            }
        } catch (error) {
            console.error('Error in markAsSeen:', error);
            throw error;
        }
    }
}; 

export default postService;