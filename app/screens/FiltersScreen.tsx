import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/app/store/filter';
import { RootState } from '@/app/store/store';
import colors from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface LocalFilters {
    genre: string;
    yearFrom: string;
    yearTo: string;
    rating: string;
}

export default function FiltersScreen() {
    const dispatch = useDispatch();
    const currentFilters = useSelector((state: RootState) => state.filter.filters);
    const [showGenrePicker, setShowGenrePicker] = useState(false);
    const [showFromYearPicker, setShowFromYearPicker] = useState(false);
    const [showToYearPicker, setShowToYearPicker] = useState(false);
    const [showRatingPicker, setShowRatingPicker] = useState(false);

    const [localFilters, setLocalFilters] = useState<LocalFilters>({
        genre: currentFilters.genre || '',
        yearFrom: currentFilters.yearFrom?.toString() || '',
        yearTo: currentFilters.yearTo?.toString() || '',
        rating: currentFilters.rating?.toString() || '',
    });

    const genres = [
        { label: 'All', value: 'all' },
        { label: 'Action', value: 'action' },
        { label: 'Comedy', value: 'comedy' },
        { label: 'Drama', value: 'drama' },
        { label: 'Horror', value: 'horror' },
        { label: 'Romance', value: 'romance' },
        { label: 'Sci-Fi', value: 'sci-fi' },
        { label: 'Documentary', value: 'documentary' }
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
            ...localFilters,
            yearFrom: localFilters.yearFrom ? parseInt(localFilters.yearFrom) : undefined,
            yearTo: localFilters.yearTo ? parseInt(localFilters.yearTo) : undefined,
            rating: localFilters.rating ? parseFloat(localFilters.rating) : undefined
        };
        
        dispatch(setFilters(filters));
        router.back();
    };

    const handleClearFilters = () => {
        setLocalFilters({
            genre: '',
            yearFrom: '',
            yearTo: '',
            rating: '',
        });
        dispatch(setFilters({}));
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
                <Text style={styles.label}>Genre</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowGenrePicker(true)}
                >
                    <Text style={styles.dropdownButtonText}>
                        {genres.find(g => g.value === localFilters.genre)?.label || "Select Genre"}
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
                        <Text style={styles.dropdownButtonText}>
                            {localFilters.yearFrom || "From"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.dropdownButton, styles.yearButton]}
                        onPress={() => setShowToYearPicker(true)}
                    >
                        <Text style={styles.dropdownButtonText}>
                            {localFilters.yearTo || "To"}
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
                                        localFilters.genre === genre.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        setLocalFilters(prev => ({ ...prev, genre: genre.value }));
                                        setShowGenrePicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        localFilters.genre === genre.value && styles.modalItemTextSelected
                                    ]}>
                                        {genre.label}
                                    </Text>
                                    {localFilters.genre === genre.value && (
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
                                        localFilters.yearFrom === year.toString() && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        setLocalFilters(prev => ({
                                            ...prev,
                                            yearFrom: year.toString(),
                                            // Clear yearTo if it's now invalid
                                            yearTo: prev.yearTo && parseInt(prev.yearTo) < year ? '' : prev.yearTo
                                        }));
                                        setShowFromYearPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        localFilters.yearFrom === year.toString() && styles.modalItemTextSelected
                                    ]}>
                                        {year}
                                    </Text>
                                    {localFilters.yearFrom === year.toString() && (
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
                                .filter(year => !localFilters.yearFrom || parseInt(localFilters.yearFrom) <= year)
                                .map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.modalItem,
                                            localFilters.yearTo === year.toString() && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setLocalFilters(prev => ({ ...prev, yearTo: year.toString() }));
                                            setShowToYearPicker(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.modalItemText,
                                            localFilters.yearTo === year.toString() && styles.modalItemTextSelected
                                        ]}>
                                            {year}
                                        </Text>
                                        {localFilters.yearTo === year.toString() && (
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
                    onPress={() => setShowRatingPicker(true)}
                >
                    <Text style={styles.dropdownButtonText}>
                        {localFilters.rating || "Select Rating"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showRatingPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowRatingPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setShowRatingPicker(false)}
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
                                        localFilters.rating === rating.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        setLocalFilters(prev => ({ ...prev, rating: rating.value }));
                                        setShowRatingPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        localFilters.rating === rating.value && styles.modalItemTextSelected
                                    ]}>
                                        {`${rating.label} ${rating.value === '1' ? 'star' : 'stars'}`}
                                    </Text>
                                    {localFilters.rating === rating.value && (
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