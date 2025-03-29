import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Post } from '@/app/types/Post';
import { postService } from '../services/postService';
import Carousel from '../components/Carousel';


const FeedScreen = ({ currentTab }: { currentTab: string }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postService.getPosts();
                setPosts(response);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <View style={styles.container}>
            <Carousel items={posts || []} currentTab={currentTab} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

export default FeedScreen;

