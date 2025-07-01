import * as React from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground} from "react-native";
import VideoPlayer from "@/app/components/carousel/VideoPlayer";
import { Post } from "@/app/types/Post";
import { Ionicons } from '@expo/vector-icons';
import { postService } from '@/app/services/postService';
import { implicitService } from '@/app/services/implicitService';
import CommentsModal from '../CommentsModal';
import { router } from 'expo-router';
import { Genre, Actor, ProductionCompany, WatchProvider } from "@/app/types/Post";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

interface Props {
    data: Post;
    activeItem?: string;
    isHomeTab: boolean;
}

const CarouselItem: React.FC<Props> = ({data, activeItem, isHomeTab}) => {
    const [showComments, setShowComments] = React.useState(false);
    const [liked, setLiked] = React.useState(data.user_post_info?.liked || false);
    const [seen, setSeen] = React.useState(data.user_post_info?.seen || false);
    const [commentCount, setCommentCount] = React.useState(data.comments || 0);
    const [commentText, setCommentText] = React.useState<string>(''); // State for comment input
    const viewStartTime = React.useRef<number>(Date.now());
    const isActive = React.useRef<boolean>(false);

    // Track when this item becomes active/inactive
    React.useEffect(() => {
        const isCurrentlyActive = data.entity?.trailer === activeItem;
        
        // If this item was active and is no longer active, send the viewing time
        if (isActive.current && !isCurrentlyActive && data.post_id && isHomeTab) {
            const timeSeen = Math.floor((Date.now() - viewStartTime.current));
            implicitService.postSeen(data.post_id, timeSeen);
        }
        
        // If this item is now active and we're in home tab, start the timer
        if (isCurrentlyActive && isHomeTab) {
            viewStartTime.current = Date.now();
        }
        
        isActive.current = isCurrentlyActive;
    }, [activeItem, data.entity?.trailer, data.post_id, isHomeTab]);

    // Handle tab switching
    React.useEffect(() => {
        // If we're leaving home tab and the item is active, send the viewing time
        if (!isHomeTab && isActive.current && data.post_id) {
            const timeSeen = Math.floor((Date.now() - viewStartTime.current));
            implicitService.postSeen(data.post_id, timeSeen);
        }
    }, [isHomeTab, data.post_id]);

    const handleLike = async () => {
        if (data.post_id) {
            try {
                await postService.likePost(data.post_id);
                setLiked(!liked);
                data.likes = (data.likes || 0) + (liked ? -1 : 1);
                data.user_post_info = {
                    ...data.user_post_info,
                    liked: !liked,
                };
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }
    };

    const handleSeen = async () => {
        if (data.post_id) {
            try {
                await postService.markAsSeen(data.post_id);
                setSeen(true);
                data.user_post_info = {
                    ...data.user_post_info,
                    seen: true,
                };
            } catch (error) {
                console.error('Error marking post as seen:', error);
            }
        }
    };

    const handleComment = async () => {
        if (data.post_id && commentText.trim()) {
            try {
                await postService.createComment(data.post_id, commentText);
                data.comments = (data.comments || 0) + 1;
                setCommentText('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleCommentAdded = () => {
        setCommentCount(prev => prev + 1);
        data.comments = (data.comments || 0) + 1;
    };

    const handleViewDetails = () => {
        if (data.post_id) {
            router.push(`/screens/ItemScreen?id=${data.post_id}`);
        }
    };

    return (
        <View style={styles.container}>
            {data.entity?.poster_key ? (
                <ImageBackground
                    source={{ uri: `https://image.tmdb.org/t/p/w500/${data.entity.poster_key}` }}
                    style={styles.fullBackground}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
                        locations={[0, 0.5, 1]}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    >
                        {/* Title and Director */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>{data.entity?.title}</Text>
                            <Text style={styles.director}>{data.entity?.director}</Text>
                        </View>

                        {/* Video Player */}
                        <VideoPlayer 
                            url={data.entity?.trailer}
                            activeItem={activeItem}
                            isHomeTab={isHomeTab}
                        />

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                                <Ionicons 
                                    name={liked ? "heart" : "heart-outline"} 
                                    size={24} 
                                    color={liked ? "#ff4d4d" : "#ffffff"} 
                                />
                                <Text style={[styles.actionButtonText, liked && styles.likedText]}>
                                    {data.likes || 0}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleSeen}>
                                <Ionicons 
                                    name={seen ? "eye" : "eye-outline"} 
                                    size={24} 
                                    color={seen ? "#4dff4d" : "#ffffff"} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.actionButton} 
                                onPress={() => setShowComments(true)}
                            >
                                <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
                                <Text style={styles.actionButtonText}>{commentCount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={handleViewDetails}
                            >
                                <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
                            </TouchableOpacity>
                        </View>

                        {/* Content Container */}
                        <View style={styles.contentContainer}>
                            {/* Rating, Year, and Genres */}
                            <View style={styles.ratingRow}>
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.rating}>☆ {data.entity?.vote_average ? data.entity.vote_average.toFixed(1) : 'N/A'}</Text>
                                    <Text style={styles.year}>{data.entity?.release_date ? data.entity.release_date.split('/')[2] : ''}</Text>
                                </View>
                                <View style={styles.genreContainer}>
                                    {data.entity?.genres?.map((genre: Genre, index: number) => (
                                        <Text key={index} style={styles.genreTag}>{genre.name}</Text>
                                    ))}
                                </View>
                            </View>

                            {/* Description */}
                            <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
                                {data.entity?.overview}
                            </Text>

                            {/* Additional Info */}
                            <View style={styles.infoContainer}>
                                {/* <Text style={styles.infoText}>Duration: {data.entity?.duration}</Text>
                                {data.entity_type === 's' && (
                                    <Text style={styles.infoText}>Seasons: {data.entity?.seasons}</Text>
                                )} */}
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            ) : (
                // Fallback when no image is available
                <View style={styles.fallbackContainer}>
                    {/* Title and Director */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{data.entity?.title}</Text>
                        <Text style={styles.director}>{data.entity?.director}</Text>
                    </View>

                    {/* Video Player */}
                    <VideoPlayer 
                        url={data.entity?.trailer}
                        activeItem={activeItem}
                        isHomeTab={isHomeTab}
                    />

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                            <Ionicons 
                                name={liked ? "heart" : "heart-outline"} 
                                size={24} 
                                color={liked ? "#ff4d4d" : "#ffffff"} 
                            />
                            <Text style={[styles.actionButtonText, liked && styles.likedText]}>
                                {data.likes || 0}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleSeen}>
                            <Ionicons 
                                name={seen ? "eye" : "eye-outline"} 
                                size={24} 
                                color={seen ? "#4dff4d" : "#ffffff"} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => setShowComments(true)}
                        >
                            <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
                            <Text style={styles.actionButtonText}>{commentCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={handleViewDetails}
                        >
                            <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {/* Content Container */}
                    <View style={styles.contentContainer}>
                        {/* Rating, Year, and Genres */}
                        <View style={styles.ratingRow}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.rating}>☆ {data.entity?.vote_average ? data.entity.vote_average.toFixed(1) : 'N/A'}</Text>
                                <Text style={styles.year}>{data.entity?.release_date ? data.entity.release_date.split('/')[2] : ''}</Text>
                            </View>
                            <View style={styles.genreContainer}>
                                {data.entity?.genres?.map((genre: Genre, index: number) => (
                                    <Text key={index} style={styles.genreTag}>{genre.name}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Description */}
                        <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
                            {data.entity?.overview}
                        </Text>

                        {/* Additional Info */}
                        <View style={styles.infoContainer}>
                            {/* <Text style={styles.infoText}>Duration: {data.entity?.duration}</Text>
                            {data.entity_type === 's' && (
                                <Text style={styles.infoText}>Seasons: {data.entity?.seasons}</Text>
                            )} */}
                        </View>
                    </View>
                </View>
            )}

            {data.post_id && (
                <CommentsModal
                    postId={data.post_id}
                    visible={showComments}
                    onClose={() => setShowComments(false)}
                    onCommentAdded={handleCommentAdded}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: colors.background,
    },
    fullBackground: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    gradient: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
    },
    fallbackContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
        backgroundColor: colors.background,
    },
    titleSection: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        maxWidth: '80%',
    },
    director: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 4,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        maxWidth: '80%',
    },
    contentContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        flex: 1,
        backdropFilter: 'blur(10px)',
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        color: '#ffffff',
        marginRight: 12,
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    year: {
        color: '#ffffff',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        flex: 1,
        marginLeft: 12,
        alignItems: 'center',
    },
    genreTag: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 6,
        marginBottom: 4,
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    description: {
        color: '#ffffff',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    infoContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: 12,
    },
    infoText: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        marginTop: 16,
        backdropFilter: 'blur(10px)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    likedText: {
        color: '#ff4d4d',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    viewDetailsText: {
        color: '#ffffff',
        fontSize: 14,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    commentInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
    },
    commentButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CarouselItem;