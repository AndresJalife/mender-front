import apiService from './apiService';

class ImplicitService {
    async postSeen(postId: number, timeSeen: number) {
        try {
            console.log('postSeen', postId, timeSeen);
            await apiService(`/implicit/post/${postId}/post_seen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    time_seen: timeSeen
                })
            });
        } catch (error) {
            console.error('Error sending post seen data:', error);
        }
    }
}

export const implicitService = new ImplicitService(); 