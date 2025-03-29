import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons if not already
import { Post } from '@/app/types/Post';
import { postService } from '../services/postService';
import Carousel from '../components/Carousel';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';


const FeedScreen = ({ currentTab }: { currentTab: string }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const filters = useSelector((state: RootState) => state.filter.filters);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postService.getPosts(filters);
                setPosts(response);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [filters]);

    const handleFilterPress = () => {
        router.push('/screens/FiltersScreen');
    };

    return (
        <View style={styles.container}>
            <Carousel items={posts || []} currentTab={currentTab} />
            <TouchableOpacity 
                style={styles.filterButton} 
                onPress={handleFilterPress}
            >
                <Ionicons name="filter" size={24} color="white" />
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
        top: 50,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 12,
        zIndex: 1,
    },
});

export default FeedScreen;

