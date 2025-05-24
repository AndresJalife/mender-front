import React, {useEffect, useState, useCallback, useRef, startTransition} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/app/types/Post';
import { postService } from '../services/postService';
import Carousel from '../components/carousel/Carousel';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import colors from '@/app/constants/colors';

const FeedScreen = ({ currentTab }: { currentTab: string }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterLoading, setIsFilterLoading] = useState(false);
    const filters = useSelector((state: RootState) => state.filter.filters);
    const hasActiveFilters = Object.entries(filters).some(([_, value]) => 
        value !== undefined && value !== '' && value !== null
    );
    const [seenTmdbIds, setSeenTmdbIds] = useState<number[]>([]);

    const fetchPosts = async (shouldReplace = false) => {
        try {
            console.log("Fetching posts")
            if (isLoading) return;

            setIsLoading(true);
            
            const response = await postService.getPosts(filters, seenTmdbIds);

            // @ts-ignore
            setSeenTmdbIds(prevSeenIds => {
                const newSeenIds = response.map(post => post.entity?.tmbd_id);
                return [...prevSeenIds, ...newSeenIds];
            })
            console.log("Seen IDs: ", seenTmdbIds)

            if (shouldReplace) {
                startTransition(() => { setPosts(response) });
            } else {
                startTransition(() => { setPosts(prevPosts => [...prevPosts, ...response])});
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (posts.length === 0) {
            fetchPosts(false);
        }
    }, []);

    // Filter changes
    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            console.log("filters changed")
            setIsFilterLoading(true);
            setSeenTmdbIds([]);
            
            // Create a promise that resolves after 500ms
            const minLoadingTime = new Promise(resolve => setTimeout(resolve, 500));
            
            // Wait for both the fetch and the minimum loading time
            Promise.all([
                fetchPosts(true),
                minLoadingTime
            ]).finally(() => {
                setIsFilterLoading(false);
            });
        }
    }, [filters]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading) {
            console.log("handleLoadMore")
            fetchPosts(false);
        } else {
            console.log("isLoading: ", isLoading)
        }
    }, [isLoading]);

    const handleFilterPress = () => {
        router.push('/screens/FiltersScreen');
    };

    return (
        <View style={styles.container}>
            <Carousel 
                items={posts || []} 
                currentTab={currentTab} 
                onLoadMore={handleLoadMore}
            />
            <TouchableOpacity 
                style={styles.filterButton} 
                onPress={handleFilterPress}
            >
                <Ionicons name="filter" size={24} color="white" />
                {hasActiveFilters && (
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>!</Text>
                    </View>
                )}
            </TouchableOpacity>
            {isFilterLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    filterButton: {
        position: 'absolute',
        top: 55,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 12,
        zIndex: 1,
    },
    filterBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.surfaceLighter,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
});

export default FeedScreen;

