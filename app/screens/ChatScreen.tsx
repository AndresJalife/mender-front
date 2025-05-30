import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TextStyle,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { chatService, Message } from '../services/chatService';
import { colors } from '../constants/colors';

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setIsLoading(true);
            const fetched = await chatService.getMessages();
            setMessages(fetched.slice().reverse());
        } catch (err) {
            setError('Failed to load messages');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMessage: Message = {
            message: newMessage,
            bot_made: false,
            order: messages.length + 1,
        };

        // Optimistically add user message
        setMessages(prev => [userMessage, ...prev]);
        setNewMessage('');
        setIsTyping(true);

        try {
            // Send message to service
            await chatService.sendMessage(newMessage);
            
            // Get the bot's response
            const botResponse = await chatService.getLatestMessage();
            if (botResponse) {
                setMessages(prev => [botResponse, ...prev]);
            }
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        } finally {
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageContainer,
            item.bot_made ? styles.botMessage : styles.userMessage
        ]}>
            {item.bot_made ? (
                <Markdown style={markdownStyles}>
                    {item.message}
                </Markdown>
            ) : (
                <Text style={styles.messageText}>{item.message}</Text>
            )}
        </View>
    );

    const renderTypingIndicator = () => {
        if (!isTyping) return null;
        return (
            <View style={[styles.messageContainer, styles.botMessage, styles.typingContainer]}>
                <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color={colors.textSecondary} />
                    <Text style={styles.typingText}>Bot is typing...</Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.textPrimary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>Mender Bot</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                inverted
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                maintainVisibleContentPosition={{minIndexForVisible: 0}}
                ListHeaderComponent={renderTypingIndicator}
            />
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
        paddingTop: 45,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: colors.surfaceLight,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: colors.surfaceLighter,
    },
    messageText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        backgroundColor: colors.surfaceLight,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100,
        color: colors.textPrimary,
    },
    sendButton: {
        backgroundColor: colors.surfaceLighter,
        borderRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        padding: 8,
    },
    typingContainer: {
        padding: 8,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingText: {
        marginLeft: 8,
        color: colors.textSecondary,
        fontSize: 14,
    },
});

const markdownStyles = {
    body: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    heading1: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    heading2: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heading3: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    paragraph: {
        marginBottom: 8,
    },
    list_item: {
        marginBottom: 4,
    },
    strong: {
        fontWeight: 'bold' as const,
    },
    em: {
        fontStyle: 'italic',
    },
    link: {
        color: colors.textPrimary,
    },
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: colors.border,
        paddingLeft: 8,
        marginLeft: 0,
        marginBottom: 8,
    },
    code_inline: {
        backgroundColor: colors.surfaceLight,
        padding: 2,
        borderRadius: 4,
    },
    code_block: {
        backgroundColor: colors.surfaceLight,
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
} as const;

export default ChatScreen;
