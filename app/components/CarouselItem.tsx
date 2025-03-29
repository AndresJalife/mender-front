import * as React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import VideoPlayer from "@/app/components/VideoPlayer";
import { Post } from "@/app/types/Post";
import { Ionicons } from '@expo/vector-icons';
import { postService } from '@/app/services/postService';
import CommentsModal from './CommentsModal';
import { router } from 'expo-router';

interface Props {
    data: Post;
    activeItem?: string;
    isHomeTab: boolean;
}

const CarouselItem: React.FC<Props> = ({data, activeItem, isHomeTab}) => {
    const [showComments, setShowComments] = React.useState(false);

    const handleLike = async () => {
        if (data.post_id) {
            try {
                await postService.likePost(data.post_id);
                // You might want to update the UI here
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }
    };

    const handleSeen = async () => {
        if (data.post_id) {
            try {
                await postService.markAsSeen(data.post_id);
                // You might want to update the UI here
            } catch (error) {
                console.error('Error marking post as seen:', error);
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
                url={data.entity?.link} 
                activeItem={activeItem}
                isHomeTab={isHomeTab}
            />
            <View style={styles.videoDivider} />
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <Ionicons 
                        name={data.liked ? "heart" : "heart-outline"} 
                        size={24} 
                        color={data.liked ? "#ff4d4d" : "#ffffff"} 
                    />
                    <Text style={[styles.actionButtonText, data.liked && styles.likedText]}>
                        {data.likes || 0}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleSeen}>
                    <Ionicons 
                        name={data.seen ? "eye" : "eye-outline"} 
                        size={24} 
                        color={data.seen ? "#4dff4d" : "#ffffff"} 
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
                        <Text style={styles.rating}>☆ {data.entity?.rating || 'N/A'}</Text>
                        <Text style={styles.year}>{data.entity?.year}</Text>
                    </View>
                    <View style={styles.genreContainer}>
                        {data.entity?.genres?.map((genre, index) => (
                            <Text key={index} style={styles.genreTag}>{genre}</Text>
                        ))}
                    </View>
                </View>
                <View style={styles.genreDivider} />

                {/* Description */}
                <Text style={styles.description}>{data.entity?.overview}</Text>

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
});

export default CarouselItem;