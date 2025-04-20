import * as React from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView} from "react-native";
import VideoPlayer from "@/app/components/carousel/VideoPlayer";
import { Post } from "@/app/types/Post";
import { Ionicons } from '@expo/vector-icons';
import { postService } from '@/app/services/postService';
import CommentsModal from '../CommentsModal';
import { router } from 'expo-router';
import { Genre, Actor, ProductionCompany, WatchProvider } from "@/app/types/Post";
import { useEffect } from "react";

interface Props {
    data: Post;
    activeItem?: string;
    isHomeTab: boolean;
    onLoadMore?: () => void;
}

const CarouselItem: React.FC<Props> = ({data, activeItem, isHomeTab, onLoadMore}) => {
    const [showComments, setShowComments] = React.useState(false);
    const [liked, setLiked] = React.useState(data.user_post_info?.liked || false);
    const [seen, setSeen] = React.useState(data.user_post_info?.seen || false);
    const [commentText, setCommentText] = React.useState<string>('');
    const [totalItems, setTotalItems] = React.useState<number>(0);
    const [currentItems, setCurrentItems] = React.useState<Post[]>([]);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);

    useEffect(() => {
        // Initialize with the data prop instead of making an API call
        setCurrentItems([data]);
    }, [data]);

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

    const handleViewDetails = () => {
        if (data.post_id) {
            router.push(`/screens/ItemScreen?id=${data.post_id}`);
        }
    };

    const handleScroll = async (event: any) => {
        if (isLoadingMore) return;

        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const currentIndex = Math.floor(contentOffset.y / layoutMeasurement.height);
        const remainingItems = currentItems.length - currentIndex;
        
        if (remainingItems <= 10) { // Load more when 10 or fewer items remain
            setIsLoadingMore(true);
            try {
                const newPosts = await postService.getPosts({});
                setCurrentItems(prevItems => [...prevItems, ...newPosts]);
                if (onLoadMore) {
                    onLoadMore();
                }
            } catch (error) {
                console.error('Error loading more items:', error);
            } finally {
                setIsLoadingMore(false);
            }
        }
    };

    return (
        <ScrollView 
            style={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            // pagingEnabled={false}
            // decelerationRate="normal"
            // snapToInterval={0}
            // showsVerticalScrollIndicator={true}
        >
            {currentItems.map((item, index) => (
                <View key={index} style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{item.entity?.title}</Text>
                        <Text style={styles.director}>{item.entity?.director}</Text>
                        <View style={styles.headerDivider} />
                    </View>
                    <VideoPlayer 
                        url={item.entity?.trailer}
                        activeItem={activeItem}
                        isHomeTab={isHomeTab}
                    />
                    <View style={styles.videoDivider} />
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike()}>
                            <Ionicons 
                                name={liked ? "heart" : "heart-outline"} 
                                size={24} 
                                color={liked ? "#ff4d4d" : "#ffffff"} 
                            />
                            <Text style={[styles.actionButtonText, liked && styles.likedText]}>
                                {item.likes || 0}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleSeen()}>
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
                            <Text style={styles.actionButtonText}>{item.comments || 0}</Text>
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
                                <Text style={styles.rating}>☆ {item.entity?.vote_average || 'N/A'}</Text>
                                <Text style={styles.year}>{item.entity?.release_date}</Text>
                            </View>
                            <View style={styles.genreContainer}>
                                {item.entity?.genres?.map((genre: Genre, index: number) => (
                                    <Text key={index} style={styles.genreTag}>{genre.name}</Text>
                                ))}
                            </View>
                        </View>
                        <View style={styles.genreDivider} />

                        {/* Description */}
                        <Text style={styles.description}>{item.entity?.overview}</Text>

                        {/* Comment Input */}
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={styles.commentInput}
                                value={commentText}
                                onChangeText={setCommentText}
                                placeholder="Add a comment..."
                            />
                            <TouchableOpacity onPress={handleComment}>
                                <Text style={styles.commentButton}>Post</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Additional Info */}
                        <View style={styles.infoContainer}>
                            {/* <Text style={styles.infoText}>Duration: {item.entity?.duration}</Text>
                            {item.entity_type === 's' && (
                                <Text style={styles.infoText}>Seasons: {item.entity?.seasons}</Text>
                            )} */}
                        </View>
                    </View>

                    {item.post_id && (
                        <CommentsModal
                            postId={item.post_id}
                            visible={showComments}
                            onClose={() => setShowComments(false)}
                        />
                    )}
                </View>
            ))}
            {isLoadingMore && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading more...</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: 'black',
    },
    headerContainer: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
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
        paddingRight: 30,
        marginRight: 15,
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
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default CarouselItem;