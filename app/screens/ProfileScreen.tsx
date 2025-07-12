import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import RootState from '../types/RootState';
import { store } from '../store/store';
import { logout, updateUser } from '../store/auth';
import { colors } from '../constants/colors';
import { Countries, UserSex } from '../types/enums';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ChangePasswordRequest {
    email: string;
    password: string;
}

export const ProfileScreen = () => {
    const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showSexPicker, setShowSexPicker] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        country: '',
        sex: UserSex.UNKNOWN,
    });

    // Initialize form data with user data from Redux
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                country: user.country || '',
                sex: user.sex || UserSex.UNKNOWN,
            });
        }
    }, [user]);

    const getCountryLabel = (value: string): string => {
        const country = Countries.find(c => c.value === value);
        return country?.label || 'Select Country';
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please log in to view your profile</Text>
            </View>
        );
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://143.244.190.174:8443/user/${user?.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    email: user?.email,
                    user_id: user?.user_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update Redux store with new user data
            const updatedUser = {
                ...user,
                ...formData,
            };
            store.dispatch(updateUser(updatedUser));

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handlePasswordChange = async () => {
        try {
            const response = await fetch('http://143.244.190.174:8443/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: user?.email,
                    password: newPassword,
                } as ChangePasswordRequest),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            setPasswordModalVisible(false);
            setNewPassword('');
            Alert.alert('Success', 'Password changed successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to change password');
        }
    };

    const handleLogout = () => {
        store.dispatch(logout());
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        placeholder="Enter your username"
                        placeholderTextColor={colors.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Country</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowCountryPicker(true)}
                    >
                        <Text style={[
                            styles.dropdownButtonText,
                            formData.country && { opacity: 1, fontWeight: '600' }
                        ]}>
                            {getCountryLabel(formData.country)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sex</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowSexPicker(true)}
                    >
                        <Text style={[
                            styles.dropdownButtonText,
                            formData.sex !== UserSex.UNKNOWN && { opacity: 1, fontWeight: '600' }
                        ]}>
                            {formData.sex}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.passwordButton}
                    onPress={() => setPasswordModalVisible(true)}
                >
                    <Text style={styles.passwordButtonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showCountryPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setShowCountryPicker(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.modalContent}
                        onPress={e => e.stopPropagation()}
                    >
                        <ScrollView>
                            {Countries.map((country) => (
                                <TouchableOpacity
                                    key={country.value}
                                    style={[
                                        styles.modalItem,
                                        formData.country === country.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        handleInputChange('country', country.value);
                                        setShowCountryPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        formData.country === country.value && styles.modalItemTextSelected
                                    ]}>
                                        {country.label}
                                    </Text>
                                    {formData.country === country.value && (
                                        <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={showSexPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSexPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setShowSexPicker(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.modalContent}
                        onPress={e => e.stopPropagation()}
                    >
                        <ScrollView>
                            {Object.values(UserSex).map((sex) => (
                                <TouchableOpacity
                                    key={sex}
                                    style={[
                                        styles.modalItem,
                                        formData.sex === sex && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        handleInputChange('sex', sex);
                                        setShowSexPicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        formData.sex === sex && styles.modalItemTextSelected
                                    ]}>
                                        {sex}
                                    </Text>
                                    {formData.sex === sex && (
                                        <Ionicons name="checkmark" size={24} color={colors.textPrimary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={isPasswordModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter new password"
                            secureTextEntry
                            placeholderTextColor={colors.textMuted}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setPasswordModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handlePasswordChange}
                            >
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: colors.surface,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    form: {
        padding: 20,
        paddingTop: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.surfaceLight,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: colors.textPrimary,
    },
    dropdownButton: {
        height: 44,
        backgroundColor: colors.surfaceLight,
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    dropdownButtonText: {
        fontSize: 15,
        color: colors.textPrimary,
        opacity: 0.5,
    },
    passwordButton: {
        backgroundColor: colors.surfaceLight,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    passwordButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: colors.surfaceLight,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        backgroundColor: colors.surfaceLight,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: colors.surfaceLighter,
        marginTop: 24,
    },
    logoutText: {
        color: colors.error,
    },
    message: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
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
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: colors.surfaceLight,
    },
    confirmButton: {
        backgroundColor: colors.surfaceLight,
    },
    modalButtonText: {
        color: colors.textPrimary,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;