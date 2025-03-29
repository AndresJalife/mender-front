import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { chatService, Message } from '../services/chatService';
import { colors } from '../constants/colors';

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setIsLoading(true);
            const fetchedMessages = await chatService.getMessages();
            setMessages(fetchedMessages);
        } catch (err) {
            setError('Failed to load messages');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await chatService.sendMessage(newMessage);
            setNewMessage('');
            loadMessages(); // Reload messages to get the updated list
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageContainer,
            item.bot_made ? styles.botMessage : styles.userMessage
        ]}>
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

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
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesList}
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
                    disabled={!newMessage.trim()}
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
});

export default ChatScreen;
