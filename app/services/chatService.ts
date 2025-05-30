import { getAuthenticatedRequest } from './apiService';

export interface Message {
    bot_made: boolean;
    order: number;
    message: string;
}

export const chatService = {
    getMessages: async (): Promise<Message[]> => {
        try {
            const response = await getAuthenticatedRequest('/chat');

            if (!response?.ok) {
                throw new Error('Failed to fetch messages');
            }
            return await response?.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    sendMessage: async (message: string): Promise<void> => {
        try {
            const response = await getAuthenticatedRequest('/chat/message', {
                method: 'POST',
                body: JSON.stringify({ message }),
            });

            if (!response?.ok) {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    getLatestMessage: async (): Promise<Message | null> => {
        try {
            const messages = await chatService.getMessages();
            const botMessages = messages.filter(m => m.bot_made);
            return botMessages.length > 0 ? botMessages[botMessages.length - 1] : null;
        } catch (error) {
            console.error('Error getting latest message:', error);
            return null;
        }
    },
}; 

export default chatService;