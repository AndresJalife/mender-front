import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../constants/colors';
import { Post } from '../types/Post';
import postService from '../services/postService';
import { Ionicons } from '@expo/vector-icons';

const ItemScreen = () => {
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await postService.getPost(Number(id));
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
        if (!post?.post_id) return;
        
        try {
            await postService.likePost(post.post_id);
            setLiked(!liked);
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    likes: (prev.likes || 0) + (liked ? -1 : 1),
                    user_post_info: {
                        ...prev.user_post_info,
                        liked: !liked,
                    }
                };
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleSeen = async () => {
        if (!post?.post_id) return;
        
        try {
            await postService.markAsSeen(post.post_id);
            setSeen(!seen);
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    user_post_info: {
                        ...prev.user_post_info,
                        seen: !seen,
                    }
                };
            });
        } catch (error) {
            console.error('Error marking post as seen:', error);
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
                {post.entity?.image_key && (
                    <ImageBackground
                        source={{ uri: `https://image.tmdb.org/t/p/w500/${post.entity.image_key}` }}
                        style={styles.trailerBackground}
                    >
                        <View style={styles.overlay} />
                    </ImageBackground>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <View style={styles.titleContent}>
                        <Text style={styles.title}>{post.entity?.title}</Text>
                        <View style={styles.details}>
                            <Text style={styles.year}>
                                {post.entity?.release_date ? post.entity.release_date.split('/')[2] : ''}
                            </Text>
                            {post.entity?.director && (
                                <Text style={styles.director}>
                                    <Text style={styles.directorLabel}>Directed by </Text>
                                    <Text style={styles.directorName}>{post.entity.director}</Text>
                                </Text>
                            )}
                        </View>
                    </View>
                    {post.entity?.image_key && (
                        <View style={styles.posterContainer}>
                            <Image 
                                source={{ uri: `https://image.tmdb.org/t/p/w500/${post.entity.image_key}` }}
                                style={styles.poster}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={handleLike}
                    >
                        <Ionicons 
                            name={liked ? "heart" : "heart-outline"} 
                            size={24} 
                            color={liked ? "#ff4d4d" : colors.textPrimary} 
                        />
                        <Text style={[styles.actionButtonText, liked && styles.likedText]}>
                            {post.likes || 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={handleSeen}
                    >
                        <Ionicons 
                            name={seen ? "eye" : "eye-outline"} 
                            size={24} 
                            color={seen ? "#4dff4d" : colors.textPrimary} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {/* TODO: Implement playlist functionality */}}
                    >
                        <Ionicons 
                            name="add-circle-outline" 
                            size={24} 
                            color={colors.textPrimary} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {/* TODO: Implement comment functionality */}}
                    >
                        <Ionicons 
                            name="chatbubble-outline" 
                            size={24} 
                            color={colors.textPrimary} 
                        />
                        <Text style={styles.actionButtonText}>{post.comments || 0}</Text>
                    </TouchableOpacity>
                </View>

                {post.entity?.overview && (
                    <View style={styles.overviewContainer}>
                        <Text style={styles.overview}>{post.entity.overview}</Text>
                    </View>
                )}

                {post.entity?.watch_providers && post.entity.watch_providers.length > 0 && (
                    <View style={styles.providersContainer}>
                        <Text style={styles.providersTitle}>Available on</Text>
                        <View style={styles.providersList}>
                            {post.entity.watch_providers.map((provider, index) => (
                                <View key={index} style={styles.providerItem}>
                                    <Text style={styles.providerText}>{provider.provider_name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.detailsContainer}>
                    {post.entity?.genres && post.entity.genres.length > 0 && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailTitle}>Genres</Text>
                            <View style={styles.detailContent}>
                                {post.entity.genres.map((genre, index) => (
                                    <View key={index} style={styles.genreItem}>
                                        <Text style={styles.genreText}>{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {post.entity?.production_companies && post.entity.production_companies.length > 0 && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailTitle}>Production Companies</Text>
                            <View style={styles.detailContent}>
                                {post.entity.production_companies.map((company, index) => (
                                    <Text key={index} style={styles.detailText}>{company.name}</Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {post.entity?.runtime && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailTitle}>Runtime</Text>
                            <Text style={styles.detailText}>{post.entity.runtime} minutes</Text>
                        </View>
                    )}

                    {post.entity?.budget && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailTitle}>Budget</Text>
                            <Text style={styles.detailText}>
                                ${post.entity.budget.toLocaleString()}
                            </Text>
                        </View>
                    )}

                    {post.entity?.revenue && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailTitle}>Revenue</Text>
                            <Text style={styles.detailText}>
                                ${post.entity.revenue.toLocaleString()}
                            </Text>
                        </View>
                    )}

                    {post.entity?.vote_average && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailTitle}>Rating</Text>
                            <Text style={styles.detailText}>
                                {post.entity.vote_average.toFixed(1)}/10
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        position: 'absolute',
        top: 45,
        left: 16,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    heroSection: {
        height: 300,
        width: '100%',
    },
    trailerBackground: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
        padding: 16,
        marginTop: -50,
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    titleContent: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    year: {
        fontSize: 16,
        color: colors.textMuted,
        marginRight: 12,
    },
    director: {
        fontSize: 16,
        color: colors.textMuted,
    },
    directorLabel: {
        color: colors.textMuted,
    },
    directorName: {
        fontWeight: '600',
        color: colors.textMuted,
    },
    posterContainer: {
        width: 100,
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    overviewContainer: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    overview: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.textSecondary,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        padding: 16,
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
    providersContainer: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    providersTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    providersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    providerItem: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    providerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    detailsContainer: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 32,
    },
    detailSection: {
        marginBottom: 16,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    detailContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    detailText: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    genreItem: {
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionButtonText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    likedText: {
        color: '#ff4d4d',
    },
});

export default ItemScreen; 