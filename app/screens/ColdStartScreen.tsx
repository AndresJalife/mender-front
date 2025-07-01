import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Pressable,
    Image,
    ActivityIndicator,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { colors } from '../constants/colors';
import { postService } from '../services/postService';
import { Post } from '../types/Post';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateUser } from '../store/auth';

const ColdStartScreen = () => {
    const [items, setItems] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showIntro, setShowIntro] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchColdStartItems();
    }, []);

    const fetchColdStartItems = async () => {
        try {
            setIsLoading(true);
            const data = await postService.getColdStartItems();
            setItems(data);
        } catch (error) {
            console.error('Error fetching cold start items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeen = async (postId: number) => {
        try {
            await postService.markAsSeen(postId);
            setItems(prevItems => 
                prevItems.map(item => 
                    item.post_id === postId 
                        ? { ...item, user_post_info: { ...item.user_post_info, seen: true } }
                        : item
                )
            );
        } catch (error) {
            console.error('Error marking as seen:', error);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            await postService.likePost(postId);
            setItems(prevItems => 
                prevItems.map(item => 
                    item.post_id === postId 
                        ? { 
                            ...item, 
                            user_post_info: { ...item.user_post_info, liked: true },
                            likes: (item.likes || 0) + 1
                        }
                        : item
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleNext = () => {
        if (showIntro) {
            setShowIntro(false);
        } else if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Update user's new status in Redux store
            if (user) {
                dispatch(updateUser({ ...user, new: false }));
            }
            // Navigate to main screen
            router.replace('/');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.textPrimary} />
            </View>
        );
    }

    if (showIntro) {
        return (
            <View style={styles.container}>
                <View style={styles.introContainer}>
                    <Text style={styles.introTitle}>Welcome to Mender!</Text>
                    <Text style={styles.introText}>
                        To help us provide better recommendations, we'd like to know about some movies and shows you've seen.
                        For each item shown, please indicate if you've seen it and if you liked it.
                    </Text>
                    <Pressable style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Get Started</Text>
                    </Pressable>
                    <Pressable 
                        style={styles.skipButton} 
                        onPress={() => {
                            if (user) {
                                dispatch(updateUser({ ...user, new: false }));
                            }
                            router.replace('/');
                        }}
                    >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    const currentItem = items[currentIndex];

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    {currentIndex + 1} of {items.length}
                </Text>
            </View>

            <View style={styles.itemContainer}>
                {currentItem.entity?.image_key && (
                    <ImageBackground
                        source={{ uri: `https://image.tmdb.org/t/p/original/${currentItem.entity.image_key}` }}
                        style={styles.backgroundImage}
                        imageStyle={{ 
                            opacity: 0.2,
                            resizeMode: 'cover',
                            transform: [{ scale: 1.2 }]
                        }}
                    >
                        <View style={styles.contentContainer}>
                            {currentItem.entity?.poster_key && (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500/${currentItem.entity.poster_key}` }}
                                    style={styles.posterImage}
                                    resizeMode="cover"
                                />
                            )}
                            <Text style={styles.itemTitle}>{currentItem.entity?.title}</Text>
                            
                            <View style={styles.actionsContainer}>
                                <Pressable 
                                    style={[styles.actionButton, currentItem.user_post_info?.seen && styles.actionButtonActive]}
                                    onPress={() => handleSeen(currentItem.post_id!)}
                                >
                                    <Ionicons 
                                        name={currentItem.user_post_info?.seen ? "eye" : "eye-outline"} 
                                        size={24} 
                                        color="#666666" 
                                    />
                                </Pressable>

                                <Pressable 
                                    style={[styles.actionButton, currentItem.user_post_info?.liked && styles.actionButtonActive]}
                                    onPress={() => handleLike(currentItem.post_id!)}
                                >
                                    <Ionicons 
                                        name={currentItem.user_post_info?.liked ? "heart" : "heart-outline"} 
                                        size={24} 
                                        color="#666666" 
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.navigationButtons}>
                                <Pressable 
                                    style={styles.nextButton}
                                    onPress={handleNext}
                                >
                                    <Text style={styles.nextButtonText}>
                                        {currentIndex < items.length - 1 ? 'Next' : 'Finish'}
                                    </Text>
                                </Pressable>
                                <Pressable 
                                    style={styles.skipButton} 
                                    onPress={() => {
                                        if (user) {
                                            dispatch(updateUser({ ...user, new: false }));
                                        }
                                        router.replace('/');
                                    }}
                                >
                                    <Text style={styles.skipButtonText}>Skip for now</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ImageBackground>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    introContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    introTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    introText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    progressContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    progressText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    itemContainer: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between',
    },
    posterImage: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 1.05,
        borderRadius: 12,
        marginBottom: 20,
    },
    itemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 30,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
        marginBottom: 30,
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 32,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 32,
    },
    actionButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 25,
    },
    navigationButtons: {
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
        paddingBottom: 20,
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 32,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 32,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
        textAlign: 'center',
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    buttonTextSeen: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    buttonTextLike: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    buttonTextNext: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    buttonSeen: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLike: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonNext: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ColdStartScreen; 