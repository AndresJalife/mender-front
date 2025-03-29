import React, { useEffect, useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from '@/app/types/Comment';
import { postService } from '@/app/services/postService';
import { getTimeAgo } from '@/app/utils/timeUtils';

interface Props {
    postId: number;
    visible: boolean;
    onClose: () => void;
}

const CommentsModal: React.FC<Props> = ({ postId, visible, onClose }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            loadComments();
        }
    }, [visible]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const fetchedComments = await postService.getComments(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const comment = await postService.createComment(postId, newComment.trim());
            setComments(prev => [comment, ...prev]);
            setNewComment('');
            Keyboard.dismiss(); // Dismiss the keyboard after sending
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlayTouchable}>
                        <TouchableWithoutFeedback>
                            <KeyboardAvoidingView 
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.modalContainer}
                            >
                                <View style={styles.modalContent}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}>Comments</Text>
                                    </View>
                                    
                                    {loading ? (
                                        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
                                    ) : comments.length === 0 ? (
                                        <View style={styles.emptyContainer}>
                                            <Text style={styles.emptyText}>Be the first one to comment!</Text>
                                        </View>
                                    ) : (
                                        <FlatList
                                            data={comments}
                                            keyExtractor={(item) => item.created_date}
                                            renderItem={({ item }) => (
                                                <View style={styles.commentItem}>
                                                    <View style={styles.commentHeader}>
                                                        <View style={styles.commentContent}>
                                                            <Text style={styles.username}>{item.user.username}</Text>
                                                            <Text style={styles.commentText}>{item.comment}</Text>
                                                        </View>
                                                        <Text style={styles.date}>
                                                            {getTimeAgo(item.created_date)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            contentContainerStyle={styles.commentsList}
                                        />
                                    )}

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            value={newComment}
                                            onChangeText={setNewComment}
                                            placeholder="Write a comment..."
                                            placeholderTextColor="#888888"
                                            multiline
                                            maxLength={500}
                                        />
                                        <TouchableOpacity 
                                            style={styles.sendButton}
                                            onPress={handleSubmit}
                                            disabled={!newComment.trim() || isSubmitting}
                                        >
                                            <Ionicons 
                                                name="send" 
                                                size={24} 
                                                color={newComment.trim() ? "#ffffff" : "#888888"} 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    overlayTouchable: {
        flex: 1,
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    commentsList: {
        padding: 16,
        paddingBottom: 80, // Space for input container
    },
    commentItem: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    commentContent: {
        flex: 1,
        marginRight: 8,
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: '#888888',
        marginLeft: 8,
    },
    commentText: {
        fontSize: 14,
        color: '#ffffff',
        lineHeight: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#888888',
        textAlign: 'center',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    input: {
        flex: 1,
        backgroundColor: '#333333',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        color: '#ffffff',
        maxHeight: 100,
    },
    sendButton: {
        padding: 8,
    },
});

export default CommentsModal; 