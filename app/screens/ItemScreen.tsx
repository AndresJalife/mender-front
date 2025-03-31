import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../constants/colors';
import { Post, Genre, Actor, ProductionCompany, WatchProvider } from '../types/Post';
import { getAuthenticatedRequest } from '../services/apiService';
import postService from '../services/postService';

const ItemScreen = () => {
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState<boolean>(false);
    const [seen, setSeen] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>('');

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getAuthenticatedRequest(`/post/${id}`);
            if (!response) throw new Error('Failed to fetch post');
            
            const data = await response.json();
            setPost(data);
            setLiked(data.user_post_info?.liked || false);
            setSeen(data.user_post_info?.seen || false);
        } catch (err) {
            setError('Failed to load post');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async () => {
        if (post?.post_id) {
            try {
                await postService.likePost(post.post_id);
                setLiked(!liked);
                setPost((prevPost) => prevPost ? {
                    ...prevPost,
                    likes: (prevPost.likes || 0) + (liked ? -1 : 1),
                    user_post_info: {
                        ...prevPost.user_post_info,
                        liked: !liked,
                    },
                } : prevPost);
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }
    };

    const handleSeen = async () => {
        if (post?.post_id) {
            try {
                await postService.markAsSeen(post.post_id);
                setSeen(true);
                setPost((prevPost) => prevPost ? {
                    ...prevPost,
                    user_post_info: {
                        ...prevPost.user_post_info,
                        seen: true,
                    },
                } : prevPost);
            } catch (error) {
                console.error('Error marking post as seen:', error);
            }
        }
    };

    const handleComment = async () => {
        if (post?.post_id && commentText.trim()) {
            try {
                await postService.createComment(post.post_id, commentText);
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: (prevPost?.comments || 0) + 1,
                }));
                setCommentText('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.textPrimary} />
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || 'Post not found'}</Text>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{post.entity?.title}</Text>
                    <Text style={styles.date}>{new Date(post.created_date || '').toLocaleDateString()}</Text>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity onPress={handleLike}>
                        <Text style={styles.likeText}>{liked ? '♥' : '♡'} {post.likes || 0} likes</Text>
                    </TouchableOpacity>
                    {post.entity?.release_date && (
                        <InfoRow label="Release Date" value={post.entity.release_date} />
                    )}
                    {post.entity?.director && (
                        <InfoRow label="Director" value={post.entity.director} />
                    )}
                    {post.entity?.genres && post.entity.genres.length > 0 && (
                        <View style={styles.genresContainer}>
                            <Text style={styles.label}>Genres</Text>
                            <View style={styles.genresList}>
                                {post.entity.genres.map((genre: Genre, index: number) => (
                                    <View key={index} style={styles.genreTag}>
                                        <Text style={styles.genreText}>{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                    {post.entity?.overview && (
                        <View style={styles.overviewContainer}>
                            <Text style={styles.label}>Overview</Text>
                            <Text style={styles.overview}>{post.entity.overview}</Text>
                        </View>
                    )}
                    
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>💬 {post.comments || 0} comments</Text>
                    </View>

                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            value={commentText}
                            onChangeText={setCommentText}
                            placeholder="Add a comment..."
                            placeholderTextColor={colors.textMuted}
                        />
                        <TouchableOpacity onPress={handleComment}>
                            <Text style={styles.commentButton}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// Helper component for displaying info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        padding: 16,
        paddingTop: 45,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    date: {
        color: colors.textMuted,
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    infoRow: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        shadowColor: '#FFFFFF',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    label: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    genresContainer: {
        marginBottom: 16,
    },
    genresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    genreTag: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    genreText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    overviewContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        shadowColor: '#FFFFFF',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    overview: {
        color: colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginTop: 16,
    },
    statsText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.surfaceLight,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        padding: 16,
    },
    likeText: {
        color: colors.textPrimary,
        fontSize: 16,
        marginBottom: 16,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: '#333333',
        borderRadius: 8,
        padding: 8,
    },
    commentInput: {
        flex: 1,
        padding: 12,
        color: '#ffffff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
    },
    commentButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default ItemScreen; 