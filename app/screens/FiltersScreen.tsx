import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/app/store/filter';
import { RootState } from '@/app/store/store';
import colors from '@/app/constants/colors';

export default function FiltersScreen() {
    const dispatch = useDispatch();
    const currentFilters = useSelector((state: RootState) => state.filter.filters);
    const [showGenrePicker, setShowGenrePicker] = useState(false);

    const [localFilters, setLocalFilters] = useState({
        genre: currentFilters.genre || '',
        year: currentFilters.year || '',
        rating: currentFilters.rating || '',
        duration: currentFilters.duration || ''
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

    const handleApplyFilters = () => {
        const filters = {
            ...localFilters,
            year: localFilters.year ? parseInt(localFilters.year) : undefined,
            rating: localFilters.rating ? parseFloat(localFilters.rating) : undefined
        };
        
        dispatch(setFilters(filters));
        router.back();
    };

    const handleClearFilters = () => {
        setLocalFilters({
            genre: '',
            year: '',
            rating: '',
            duration: ''
        });
        dispatch(setFilters({}));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filters</Text>
            
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

            <Modal
                visible={showGenrePicker}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {genres.map((genre) => (
                            <TouchableOpacity
                                key={genre.value}
                                style={styles.modalItem}
                                onPress={() => {
                                    setLocalFilters(prev => ({ ...prev, genre: genre.value }));
                                    setShowGenrePicker(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>{genre.label}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowGenrePicker(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.filterSection}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                    style={styles.input}
                    value={localFilters.year}
                    onChangeText={(value) => 
                        setLocalFilters(prev => ({ ...prev, year: value }))
                    }
                    placeholder="Enter year"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.filterSection}>
                <Text style={styles.label}>Minimum Rating</Text>
                <TextInput
                    style={styles.input}
                    value={localFilters.rating}
                    onChangeText={(value) => 
                        setLocalFilters(prev => ({ ...prev, rating: value }))
                    }
                    placeholder="Enter minimum rating (0-10)"
                    keyboardType="numeric"
                />
            </View>

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
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        color: colors.textPrimary,
    },
    filterSection: {
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
    },
    modalItem: {
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
    modalCloseButton: {
        marginTop: 16,
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    modalCloseButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
});