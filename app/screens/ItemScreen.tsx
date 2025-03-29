import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../constants/colors';
import { Post } from '../types/Post';
import { getAuthenticatedRequest } from '../services/apiService';

const ItemScreen = () => {
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getAuthenticatedRequest(`/posts/${id}`);
            if (!response) throw new Error('Failed to fetch post');
            
            const data = await response.json();
            setPost(data);
        } catch (err) {
            setError('Failed to load post');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.textPrimary} />
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || 'Post not found'}</Text>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{post.entity?.title}</Text>
                <Text style={styles.date}>{new Date(post.created_date || '').toLocaleDateString()}</Text>
            </View>

            <View style={styles.content}>
                {post.entity?.year && (
                    <InfoRow label="Year" value={post.entity.year.toString()} />
                )}
                {post.entity?.director && (
                    <InfoRow label="Director" value={post.entity.director} />
                )}
                {post.entity?.screenplay && (
                    <InfoRow label="Screenplay" value={post.entity.screenplay} />
                )}
                {post.entity?.original_language && (
                    <InfoRow label="Language" value={post.entity.original_language} />
                )}
                {post.entity?.genres && post.entity.genres.length > 0 && (
                    <View style={styles.genresContainer}>
                        <Text style={styles.label}>Genres</Text>
                        <View style={styles.genresList}>
                            {post.entity.genres.map((genre, index) => (
                                <View key={index} style={styles.genreTag}>
                                    <Text style={styles.genreText}>{genre}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                {post.entity?.overview && (
                    <View style={styles.overviewContainer}>
                        <Text style={styles.label}>Overview</Text>
                        <Text style={styles.overview}>{post.entity.overview}</Text>
                    </View>
                )}
                
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>♥ {post.likes || 0} likes</Text>
                    <Text style={styles.statsText}>💬 {post.comments || 0} comments</Text>
                </View>
            </View>
        </ScrollView>
    );
};

// Helper component for displaying info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        padding: 16,
        paddingTop: 45,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    date: {
        color: colors.textMuted,
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    infoRow: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        shadowColor: '#FFFFFF',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    label: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    genresContainer: {
        marginBottom: 16,
    },
    genresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    genreTag: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    genreText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    overviewContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        shadowColor: '#FFFFFF',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    overview: {
        color: colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginTop: 16,
    },
    statsText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.surfaceLight,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        padding: 16,
    },
});

export default ItemScreen; 