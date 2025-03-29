import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/colors';
import { searchService } from '../services/searchService';
import Post from '../types/Post';
import debounce from 'lodash/debounce';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Debounce search to avoid too many API calls
    const debouncedSearch = debounce(performSearch, 300);

    const handleQueryChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const handleResultPress = (item: Post) => {
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
            {item.thumbnail && (
                <Image 
                    source={{ uri: item.thumbnail }}
                    style={styles.thumbnail}
                />
            )}
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.entity?.title} - {item.entity?.year}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.entity?.overview}
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
        padding: 12,
        marginBottom: 8,
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
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        color: colors.textSecondary,
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
});

export default SearchScreen;
