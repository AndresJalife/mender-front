import * as React from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import VideoPlayer from "@/app/components/carousel/VideoPlayer";
import { Post } from "@/app/types/Post";
import { Ionicons } from '@expo/vector-icons';
import { postService } from '@/app/services/postService';
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
    const [commentText, setCommentText] = React.useState<string>(''); // State for comment input

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
                    <Text style={styles.actionButtonText}>{data.comments || 0}</Text>
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
                <Text style={styles.description}>{data.entity?.overview}</Text>

                {/* Comment Input */}
                {/*<View style={styles.commentInputContainer}>*/}
                {/*    <TextInput*/}
                {/*        style={styles.commentInput}*/}
                {/*        value={commentText}*/}
                {/*        onChangeText={setCommentText}*/}
                {/*        placeholder="Add a comment..."*/}
                {/*    />*/}
                {/*    <TouchableOpacity onPress={handleComment}>*/}
                {/*        <Text style={styles.commentButton}>Post</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}

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
});

export default CarouselItem;