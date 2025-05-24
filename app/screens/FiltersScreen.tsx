import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/app/store/filter';
import { RootState } from '@/app/store/store';
import colors from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface LocalFilters {
    genres: string[];
    min_release_date: string;
    max_release_date: string;
    min_rating: string;
    max_rating: string;
}

export default function FiltersScreen() {
    const dispatch = useDispatch();
    const currentFilters = useSelector((state: RootState) => state.filter.filters);
    const [showGenrePicker, setShowGenrePicker] = useState(false);
    const [showFromYearPicker, setShowFromYearPicker] = useState(false);
    const [showToYearPicker, setShowToYearPicker] = useState(false);
    const [showMinRatingPicker, setShowMinRatingPicker] = useState(false);
    const [showMaxRatingPicker, setShowMaxRatingPicker] = useState(false);

    const [localFilters, setLocalFilters] = useState<LocalFilters>({
        genres: currentFilters.genres || [],
        min_release_date: currentFilters.min_release_date || '',
        max_release_date: currentFilters.max_release_date || '',
        min_rating: currentFilters.min_rating?.toString() || '',
        max_rating: currentFilters.max_rating?.toString() || '',
    });

    const genres = [
        { label: 'All', value: 'All' },
        { label: 'Action', value: 'Action' },
        { label: 'Comedy', value: 'Comedy' },
        { label: 'Drama', value: 'Drama' },
        { label: 'Horror', value: 'Horror' },
        { label: 'Romance', value: 'Romance' },
        { label: 'Sci-Fi', value: 'Sci-Fi' },
        { label: 'Documentary', value: 'Documentary' }
    ];

    // Generate years from 1900 to current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

    // Add ratings array
    const ratings = Array.from({ length: 11 }, (_, i) => ({ 
        label: i.toString(), 
        value: i.toString() 
    }));

    const handleApplyFilters = () => {
        const filters = {
            genres: localFilters.genres,
            min_release_date: localFilters.min_release_date ? `01/01/${localFilters.min_release_date}` : undefined,
            max_release_date: localFilters.max_release_date ? `01/01/${localFilters.max_release_date}` : undefined,
            min_rating: localFilters.min_rating ? parseFloat(localFilters.min_rating) : undefined,
            max_rating: localFilters.max_rating ? parseFloat(localFilters.max_rating) : undefined
        };
        
        // Remove any existing date formatting to prevent double prefixing
        if (filters.min_release_date?.includes('01/01/')) {
            filters.min_release_date = filters.min_release_date.replace('01/01/', '');
        }
        if (filters.max_release_date?.includes('01/01/')) {
            filters.max_release_date = filters.max_release_date.replace('01/01/', '');
        }
        
        dispatch(setFilters(filters));
        router.back();
    };

    const handleClearFilters = () => {
        setLocalFilters({
            genres: [],
            min_release_date: '',
            max_release_date: '',
            min_rating: '',
            max_rating: '',
        });
        dispatch(setFilters({}));
    };

    const toggleGenre = (genreValue: string) => {
        setLocalFilters(prev => {
            if (genreValue === 'All') {
                return { ...prev, genres: [] };
            }
            
            const newGenres = prev.genres.includes(genreValue)
                ? prev.genres.filter(g => g !== genreValue)
                : [...prev.genres, genreValue];
            
            return { ...prev, genres: newGenres };
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Filters</Text>
            </View>
            
            <View style={styles.filterSection}>
                <Text style={styles.label}>Genres</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowGenrePicker(true)}
                >
                    <Text style={[
                        styles.dropdownButtonText,
                        localFilters.genres.length > 0 && { opacity: 1, fontWeight: '600' }
                    ]}>
                        {localFilters.genres.length > 0 
                            ? `${localFilters.genres.length} selected`
                            : "Select Genres"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
                <Text style={styles.label}>Year</Text>
                <View style={styles.yearContainer}>
                    <TouchableOpacity
                        style={[styles.dropdownButton, styles.yearButton]}
                        onPress={() => setShowFromYearPicker(true)}
                    >
                        <Text style={[
                            styles.dropdownButtonText,
                            localFilters.min_release_date && { opacity: 1, fontWeight: '600' }
                        ]}>
                            {localFilters.min_release_date || "From"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.dropdownButton, styles.yearButton]}
                        onPress={() => setShowToYearPicker(true)}
                    >
                        <Text style={[
                            styles.dropdownButtonText,
                            localFilters.max_release_date && { opacity: 1, fontWeight: '600' }
                        ]}>
                            {localFilters.max_release_date || "To"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showGenrePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowGenrePicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setShowGenrePicker(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.modalContent}
                        onPress={e => e.stopPropagation()}
                    >
                        <ScrollView>
                            {genres.map((genre) => (
                                <TouchableOpacity
                                    key={genre.value}
                                    style={[
                                        styles.modalItem,
                                        localFilters.genres.includes(genre.value) && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        toggleGenre(genre.value);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        localFilters.genres.includes(genre.value) && styles.modalItemTextSelected
                                    ]}>
                                        {genre.label}
                                    </Text>
                                    {localFilters.genres.includes(genre.value) && (
                                        <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={showFromYearPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFromYearPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setShowFromYearPicker(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.modalContent}
                        onPress={e => e.stopPropagation()}
                    >
                        <ScrollView>
                            {years.map((year) => (
                                <TouchableOpacity
                                    key={year}
                                    style={[
                                        styles.modalItem,
                                        localFilters.min_release_date === year.toString() && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        setLocalFilters(prev => ({
                                            ...prev,
                                            min_release_date: year.toString(),
                                            // Clear max_release_date if it's now invalid
                                            max_release_date: prev.max_release_date && parseInt(prev.max_release_date) < year ? '' : prev.max_release_date
                                        }));
                                        setShowFromYearPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        localFilters.min_release_date === year.toString() && styles.modalItemTextSelected
                                    ]}>
                                        {year}
                                    </Text>
                                    {localFilters.min_release_date === year.toString() && (
                                        <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={showToYearPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowToYearPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setShowToYearPicker(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.modalContent}
                        onPress={e => e.stopPropagation()}
                    >
                        <ScrollView>
                            {years
                                .filter(year => !localFilters.min_release_date || parseInt(localFilters.min_release_date) <= year)
                                .map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.modalItem,
                                            localFilters.max_release_date === year.toString() && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setLocalFilters(prev => ({ ...prev, max_release_date: year.toString() }));
                                            setShowToYearPicker(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.modalItemText,
                                            localFilters.max_release_date === year.toString() && styles.modalItemTextSelected
                                        ]}>
                                            {year}
                                        </Text>
                                        {localFilters.max_release_date === year.toString() && (
                                            <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <View style={styles.filterSection}>
                <Text style={styles.label}>Minimum Rating</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowMinRatingPicker(true)}
                >
                    <Text style={[
                        styles.dropdownButtonText,
                        localFilters.min_rating && { opacity: 1, fontWeight: '600' }
                    ]}>
                        {localFilters.min_rating || "Select Minimum Rating"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
                <Text style={styles.label}>Maximum Rating</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowMaxRatingPicker(true)}
                >
                    <Text style={[
                        styles.dropdownButtonText,
                        localFilters.max_rating && { opacity: 1, fontWeight: '600' }
                    ]}>
                        {localFilters.max_rating || "Select Maximum Rating"}
                    </Text>
                </TouchableOpacity>
            </View>

    <Modal
        visible={showMinRatingPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMinRatingPicker(false)}
    >
        <TouchableOpacity 
            style={styles.modalContainer} 
            activeOpacity={1} 
            onPress={() => setShowMinRatingPicker(false)}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                style={styles.modalContent}
                onPress={e => e.stopPropagation()}
            >
                <ScrollView>
                    {ratings.map((rating) => (
                        <TouchableOpacity
                            key={rating.value}
                            style={[
                                styles.modalItem,
                                localFilters.min_rating === rating.value && styles.modalItemSelected
                            ]}
                            onPress={() => {
                                setLocalFilters(prev => ({ ...prev, min_rating: rating.value }));
                                setShowMinRatingPicker(false);
                            }}
                        >
                            <Text style={[
                                styles.modalItemText,
                                localFilters.min_rating === rating.value && styles.modalItemTextSelected
                            ]}>
                                {`${rating.label} ${rating.value === '1' ? 'star' : 'stars'}`}
                            </Text>
                            {localFilters.min_rating === rating.value && (
                                <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
    </Modal>

    <Modal
        visible={showMaxRatingPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMaxRatingPicker(false)}
    >
        <TouchableOpacity 
            style={styles.modalContainer} 
            activeOpacity={1} 
            onPress={() => setShowMaxRatingPicker(false)}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                style={styles.modalContent}
                onPress={e => e.stopPropagation()}
            >
                <ScrollView>
                    {ratings.map((rating) => (
                        <TouchableOpacity
                            key={rating.value}
                            style={[
                                styles.modalItem,
                                localFilters.max_rating === rating.value && styles.modalItemSelected
                            ]}
                            onPress={() => {
                                setLocalFilters(prev => ({ ...prev, max_rating: rating.value }));
                                setShowMaxRatingPicker(false);
                            }}
                        >
                            <Text style={[
                                styles.modalItemText,
                                localFilters.max_rating === rating.value && styles.modalItemTextSelected
                            ]}>
                                {`${rating.label} ${rating.value === '1' ? 'star' : 'stars'}`}
                            </Text>
                            {localFilters.max_rating === rating.value && (
                                <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
    </Modal>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.clearButton]} 
                    onPress={handleClearFilters}
                >
                    <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.applyButton]} 
                    onPress={handleApplyFilters}
                >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 16,
        color: colors.textPrimary,
    },
    filterSection: {
        marginBottom: 16,
        gap: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.textPrimary,
    },
    input: {
        height: 44,
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 16,
        color: colors.textPrimary,
        fontSize: 15,
    },
    dropdownButton: {
        height: 44,
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    dropdownButtonText: {
        fontSize: 15,
        color: colors.textPrimary,
        opacity: 0.5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        paddingBottom: 32,
        maxHeight: '50%',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    },
    modalItemSelected: {
        backgroundColor: colors.surfaceLight,
    },
    modalItemText: {
        fontSize: 15,
        color: colors.textSecondary,
    },
    modalItemTextSelected: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 'auto',
        paddingTop: 20,
    },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButton: {
        backgroundColor: colors.surfaceLight,
    },
    applyButton: {
        backgroundColor: colors.surfaceLighter,
    },
    clearButtonText: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    applyButtonText: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '500',
    },
    yearContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    yearButton: {
        flex: 1,
    },
});