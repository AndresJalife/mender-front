import { Post } from '@/app/types/Post';
import { getAuthenticatedRequest } from './apiService';
import { Filters } from '@/app/types/Post';
import { Comment } from '@/app/types/Comment';

export const postService = {
    getPosts: async (filters: Filters): Promise<Post[]> => {
        try {
            const response = await getAuthenticatedRequest('/post?k=10');
            
            if (!response?.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();
            console.log(data)
            return data as Post[];
        } catch (error) {
            console.error('Error in getPosts:', error);
            throw error;
        }
    },
    likePost: async (postId: number): Promise<void> => {
        try {
            const response = await getAuthenticatedRequest(`/post/${postId}/like`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
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
            const response = await getAuthenticatedRequest(`/post/${postId}/see`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response?.ok) {
                throw new Error('Failed to mark post as seen');
            }
        } catch (error) {
            console.error('Error in markAsSeen:', error);
            throw error;
        }
    },
    getComments: async (postId: number): Promise<Comment[]> => {
        try {
            const response = await getAuthenticatedRequest(`/post/${postId}/comments`);
            if (!response?.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            return data as Comment[];
        } catch (error) {
            console.error('Error in getComments:', error);
            throw error;
        }
    },
    createComment: async (postId: number, comment: string): Promise<Comment> => {
        try {
            const response = await getAuthenticatedRequest(`/post/${postId}/comment`, {
                method: 'POST',
                body: JSON.stringify({ comment }),
            });
            if (!response?.ok) {
                throw new Error('Failed to create comment');
            }
            const data = await response.json();
            return data as Comment;
        } catch (error) {
            console.error('Error in createComment:', error);
            throw error;
        }
    }
}; 

export default postService;