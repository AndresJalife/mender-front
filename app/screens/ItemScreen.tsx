import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../constants/colors';
import { Post } from '../types/Post';
import postService from '../services/postService';

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
            const data = await postService.getPost(Number(id));
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
            </View>

            <View style={styles.heroSection}>
                {post.entity?.image_key && (
                    <ImageBackground
                        source={{ uri: `https://image.tmdb.org/t/p/w500/${post.entity.image_key}` }}
                        style={styles.trailerBackground}
                    >
                        <View style={styles.overlay} />
                    </ImageBackground>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <View style={styles.titleContent}>
                        <Text style={styles.title}>{post.entity?.title}</Text>
                        <View style={styles.details}>
                            <Text style={styles.year}>
                                {post.entity?.release_date ? post.entity.release_date.split('/')[2] : ''}
                            </Text>
                            {post.entity?.director && (
                                <Text style={styles.director}>
                                    <Text style={styles.directorLabel}>Directed by </Text>
                                    <Text style={styles.directorName}>{post.entity.director}</Text>
                                </Text>
                            )}
                        </View>
                    </View>
                    {post.entity?.image_key && (
                        <View style={styles.posterContainer}>
                            <Image 
                                source={{ uri: `https://image.tmdb.org/t/p/w500/${post.entity.image_key}` }}
                                style={styles.poster}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                </View>

                {post.entity?.overview && (
                    <View style={styles.overviewContainer}>
                        <Text style={styles.overview}>{post.entity.overview}</Text>
                    </View>
                )}

                {post.entity?.watch_providers && post.entity.watch_providers.length > 0 && (
                    <View style={styles.providersContainer}>
                        <Text style={styles.providersTitle}>Available on</Text>
                        <View style={styles.providersList}>
                            {post.entity.watch_providers.map((provider, index) => (
                                <View key={index} style={styles.providerItem}>
                                    <Text style={styles.providerText}>{provider.provider_name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        position: 'absolute',
        top: 45,
        left: 16,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    heroSection: {
        height: 300,
        width: '100%',
    },
    trailerBackground: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
        padding: 16,
        marginTop: -50,
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    titleContent: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    year: {
        fontSize: 16,
        color: colors.textMuted,
        marginRight: 12,
    },
    director: {
        fontSize: 16,
        color: colors.textMuted,
    },
    directorLabel: {
        color: colors.textMuted,
    },
    directorName: {
        fontWeight: '600',
        color: colors.textMuted,
    },
    posterContainer: {
        width: 100,
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    overviewContainer: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    overview: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.textSecondary,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        padding: 16,
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
    providersContainer: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    providersTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    providersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    providerItem: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    providerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});

export default ItemScreen; 