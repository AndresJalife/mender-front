import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
    const filters = useSelector((state: RootState) => state.filter.filters);
    const hasActiveFilters = Object.entries(filters).some(([_, value]) => 
        value !== undefined && value !== '' && value !== null
    );

    const fetchPosts = useCallback(async (shouldAppend = false) => {
        try {
            if (isLoading) return;
            setIsLoading(true);
            
            // Get imdb_ids from current posts to avoid duplicates
            const avoidImdbIds = posts.map(post => post.entity?.imdb_id)
                .filter((id): id is string => id !== undefined);
            
            const response = await postService.getPosts(filters, avoidImdbIds);
            
            if (shouldAppend) {
                setPosts(prevPosts => {
                    // Keep only the last 4 items from the current list
                    const lastFourItems = prevPosts.slice(-4);
                    // Combine them with the new items
                    return [...lastFourItems, ...response];
                });
            } else {
                setPosts(response);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, posts, isLoading]);

    useEffect(() => {
        console.log("filters useffect")
        fetchPosts(false);
    }, [filters]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading) {
            fetchPosts(true);
        }
    }, [isLoading, fetchPosts]);

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
});

export default FeedScreen;

