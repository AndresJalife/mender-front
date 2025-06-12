import * as React from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import VideoPlayer from "@/app/components/carousel/VideoPlayer";
import { Post } from "@/app/types/Post";
import { Ionicons } from '@expo/vector-icons';
import { postService } from '@/app/services/postService';
import { implicitService } from '@/app/services/implicitService';
import CommentsModal from '../CommentsModal';
import { router } from 'expo-router';
import { Genre, Actor, ProductionCompany, WatchProvider } from "@/app/types/Post";

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
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{data.entity?.title}</Text>
                <Text style={styles.director}>{data.entity?.director}</Text>
                <View style={styles.headerDivider} />
            </View>
            <VideoPlayer 
                url={data.entity?.trailer}
                activeItem={activeItem}
                isHomeTab={isHomeTab}
            />
            <View style={styles.videoDivider} />
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
            <View style={styles.videoDivider} />
            <View style={styles.contentContainer}>
                {/* Rating, Year, and Genres */}
                <View style={styles.ratingRow}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>☆ {data.entity?.vote_average || 'N/A'}</Text>
                        <Text style={styles.year}>{data.entity?.release_date}</Text>
                    </View>
                    <View style={styles.genreContainer}>
                        {data.entity?.genres?.map((genre: Genre, index: number) => (
                            <Text key={index} style={styles.genreTag}>{genre.name}</Text>
                        ))}
                    </View>
                </View>
                <View style={styles.genreDivider} />

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
        backgroundColor: 'red',
    },
    headerContainer: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
        flexDirection: 'column',
        width: '100%',
    },
    contentContainer: {
        backgroundColor: '#1a1a1a',
        padding: 16,
        paddingTop: 16,
        paddingBottom: 0,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        flexWrap: 'wrap',
        width: '100%',
    },
    director: {
        color: '#888888',
        fontSize: 16,
        marginBottom: 4,
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
    },
    year: {
        color: '#888888',
        fontSize: 16,
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
        backgroundColor: '#333333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 6,
        marginBottom: 4,
        color: '#ffffff',
        fontSize: 16,
    },
    description: {
        color: '#ffffff',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    infoContainer: {
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 12,
    },
    infoText: {
        color: '#888888',
        fontSize: 14,
        marginBottom: 4,
    },
    headerDivider: {
        height: 1,
        backgroundColor: '#333333',
        marginTop: 12,
    },
    videoDivider: {
        height: 1,
        backgroundColor: '#333333',
    },
    genreDivider: {
        height: 1,
        backgroundColor: '#333333',
        marginBottom: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#1a1a1a',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
    },
    likedText: {
        color: '#ff4d4d',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    viewDetailsText: {
        color: '#ffffff',
        fontSize: 14,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#333333',
        borderRadius: 16,
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