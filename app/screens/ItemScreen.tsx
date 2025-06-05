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
import { LinearGradient } from 'expo-linear-gradient';
import VideoPlayer from '../components/carousel/VideoPlayer';
import CommentsModal from '../components/CommentsModal';
import { getProviderIcon } from '../utils/providerIcons';

const ItemScreen = () => {
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [seen, setSeen] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [isRating, setIsRating] = useState(false);

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
            setCommentCount(data.comments || 0);
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

    const handleCommentAdded = () => {
        setCommentCount(prev => prev + 1);
    };

    const handleRating = async (rating: number) => {
        if (!post?.post_id || isRating) return;
        
        try {
            setIsRating(true);
            await postService.ratePost(post.post_id, rating);
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    user_post_info: {
                        ...prev.user_post_info,
                        user_rating: rating
                    }
                };
            });
        } catch (error) {
            console.error('Error rating post:', error);
        } finally {
            setIsRating(false);
        }
    };

    const renderStar = (index: number) => {
        const rating = post?.user_post_info?.user_rating || 0;
        const isHalfStar = rating % 1 !== 0 && Math.ceil(rating) === index;
        const isFullStar = rating >= index;
        
        return (
            <TouchableOpacity
                key={index}
                onPress={() => handleRating(index)}
                style={styles.starContainer}
            >
                <Ionicons
                    name={isHalfStar ? "star-half" : isFullStar ? "star" : "star-outline"}
                    size={32}
                    color={isFullStar || isHalfStar ? "#FFD700" : colors.textMuted}
                />
            </TouchableOpacity>
        );
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
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)', colors.background]}
                            locations={[0.3, 0.7, 1]}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
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
                                {post.entity?.director && ` - ${post.entity.director}`}
                            </Text>
                        </View>
                        {post.entity?.vote_average && (
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>
                                    {post.entity.vote_average.toFixed(1)}/10
                                </Text>
                            </View>
                        )}
                    </View>
                    {post.entity?.poster_key && (
                        <View style={styles.posterContainer}>
                            <Image 
                                source={{ uri: `https://image.tmdb.org/t/p/w500/${post.entity.poster_key}` }}
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
                        onPress={() => setShowComments(true)}
                    >
                        <Ionicons 
                            name="chatbubble-outline" 
                            size={24} 
                            color={colors.textPrimary} 
                        />
                        <Text style={styles.actionButtonText}>{commentCount}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ratingSection}>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map(renderStar)}
                    </View>
                </View>

                {post.entity?.overview && (
                    <View style={styles.overviewContainer}>
                        <Text style={styles.overview}>{post.entity.overview}</Text>
                    </View>
                )}

                {post.entity?.trailer && (
                    <View style={styles.videoContainer}>
                        <VideoPlayer 
                            url={post.entity.trailer}
                            isHomeTab={false}
                        />
                    </View>
                )}

                <View style={styles.providersContainer}>
                    <Text style={styles.providersTitle}>Available on</Text>
                    {post.entity?.watch_providers && post.entity.watch_providers.length > 0 ? (
                        <View style={styles.providersList}>
                            {post.entity.watch_providers.map((provider, index) => {
                                const iconUrl = getProviderIcon(provider.provider_name);
                                return iconUrl ? (
                                    <Image 
                                        key={index}
                                        source={{ uri: iconUrl }} 
                                        style={styles.providerIcon}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Text key={index} style={styles.providerText}>{provider.provider_name}</Text>
                                );
                            })}
                        </View>
                    ) : (
                        <Text style={styles.noProvidersText}>Not currently available in your region</Text>
                    )}
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailsColumns}>
                        <View style={styles.detailsColumn}>
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
                        </View>

                        <View style={styles.detailsColumn}>
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

                            {post.entity?.revenue && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailTitle}>Revenue</Text>
                                    <Text style={styles.detailText}>
                                        ${post.entity.revenue.toLocaleString()}
                                    </Text>
                                </View>
                            )}

                            {post.entity?.genres && post.entity.genres.length > 0 && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailTitle}>Genres</Text>
                                    <View style={styles.genresList}>
                                        {post.entity.genres.map((genre, index) => (
                                            <View key={index} style={styles.genreItem}>
                                                <Text style={styles.genreText}>{genre.name}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
            {post.post_id && (
                <CommentsModal
                    postId={post.post_id}
                    visible={showComments}
                    onClose={() => setShowComments(false)}
                    onCommentAdded={handleCommentAdded}
                />
            )}
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
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        padding: 16,
        marginTop: -50,
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 0,
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
        marginBottom: 8,
    },
    year: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    posterContainer: {
        width: 100,
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        marginTop: -30,
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
        textAlign: 'center',
    },
    providersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerItem: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    providerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    providerText: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
    detailsContainer: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 32,
    },
    detailsColumns: {
        flexDirection: 'row',
        gap: 24,
    },
    detailsColumn: {
        flex: 1,
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 0,
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
    videoContainer: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginTop: 16,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        aspectRatio: 16/9,
    },
    noProvidersText: {
        color: colors.textMuted,
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
    },
    genresContainer: {
        marginTop: 8,
    },
    genresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    genreItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    genreText: {
        color: colors.textPrimary,
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    ratingContainer: {
        marginTop: 8,
    },
    ratingText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    ratingSection: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    starContainer: {
        padding: 4,
    },
});

export default ItemScreen; 