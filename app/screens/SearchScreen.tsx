import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/colors';
import { searchService } from '../services/searchService';
import Post from '../types/Post';
import debounce from 'lodash/debounce';
import { postService } from '../services/postService';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const [recommendations, setRecommendations] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setIsLoadingRecommendations(true);
            const response = await postService.getPosts({}, []);
            setRecommendations(response.slice(0, 12));
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
        } finally {
            setIsLoadingRecommendations(false);
        }
    };

    const performSearch = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const searchResults = await searchService.search(searchQuery);
            setResults(searchResults);
        } catch (err) {
            setError('Failed to perform search');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoize the debounced search function
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            performSearch(searchQuery);
        }, 600),
        [] // Empty dependency array since performSearch is stable
    );

    const handleQueryChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const handleResultPress = (item: Post) => {
        console.log('Navigating to item:', item.entity?.poster_key);
        router.push(`/screens/ItemScreen?id=${item.post_id}`);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
    };

    const renderItem = ({ item }: { item: Post }) => (
        <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
        >
            <View style={styles.imageContainer}>
                {item.entity?.poster_key && (
                    <Image 
                        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.entity.poster_key}` }}
                        style={styles.resultImage}
                        resizeMode="cover"
                    />
                )}
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.entity?.title}</Text>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemYear}>
                        {item.entity?.release_date ? item.entity.release_date.split('/')[2] : ''}
                    </Text>
                    {item.entity?.director && (
                        <Text style={styles.itemDirector}>
                            <Text style={styles.directorLabel}>Directed by </Text>
                            <Text style={styles.directorName}>{item.entity.director}</Text>
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderRecommendationItem = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={styles.recommendationItem}
            onPress={() => handleResultPress(item)}
        >
            {item.entity?.poster_key && (
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500/${item.entity.poster_key}` }}
                    style={styles.recommendationImage}
                />
            )}
            <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle} numberOfLines={2}>
                    {item.entity?.title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={handleQueryChange}
                        placeholder="Search Movies or TV Shows..."
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="none"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={handleClear}
                        >
                            <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {query.length === 0 ? (
                <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>Some recommendations...</Text>
                    {isLoadingRecommendations ? (
                        <ActivityIndicator style={styles.loader} color={colors.textPrimary} />
                    ) : (
                        <FlatList
                            data={recommendations}
                            renderItem={renderRecommendationItem}
                            keyExtractor={(item) => item.post_id?.toString() || ''}
                            numColumns={3}
                            contentContainerStyle={styles.recommendationsGrid}
                        />
                    )}
                </View>
            ) : (
                <>
                    {isLoading && (
                        <ActivityIndicator 
                            style={styles.loader}
                            color={colors.textPrimary}
                        />
                    )}

                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    <FlatList
                        data={results}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.post_id?.toString() || ''} 
                        contentContainerStyle={styles.resultsList}
                        ListEmptyComponent={
                            !isLoading && query.length >= 3 ? (
                                <Text style={styles.noResults}>No results found</Text>
                            ) : query.length > 0 && query.length < 3 ? (
                                <Text style={styles.hint}>Type at least 3 characters to search</Text>
                            ) : null
                        }
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        padding: 16,
        paddingTop: 45,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        backgroundColor: colors.surfaceLight,
        borderRadius: 20,
        padding: 12,
        paddingRight: 40,
        color: colors.textPrimary,
        fontSize: 16,
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
    clearButton: {
        position: 'absolute',
        right: 12,
        padding: 4,
    },
    clearButtonText: {
        color: colors.textMuted,
        fontSize: 16,
    },
    resultsList: {
        padding: 16,
    },
    resultItem: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginBottom: 6,
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
    imageContainer: {
        width: 60,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
    },
    resultImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemYear: {
        fontSize: 14,
        color: colors.textMuted,
        marginRight: 8,
    },
    itemDirector: {
        fontSize: 14,
        color: colors.textMuted,
    },
    directorLabel: {
        color: colors.textMuted,
    },
    directorName: {
        fontWeight: '600',
        color: colors.textMuted,
    },
    loader: {
        padding: 20,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        padding: 16,
    },
    noResults: {
        color: colors.textSecondary,
        textAlign: 'center',
        padding: 16,
    },
    hint: {
        color: colors.textMuted,
        textAlign: 'center',
        padding: 16,
    },
    recommendationsContainer: {
        flex: 1,
        padding: 16,
    },
    recommendationsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    recommendationsGrid: {
        paddingBottom: 16,
    },
    recommendationItem: {
        flex: 1,
        margin: 4,
        aspectRatio: 2/3,
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
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
    recommendationImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    recommendationContent: {
        flex: 1,
        padding: 8,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    recommendationTitle: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default SearchScreen;
