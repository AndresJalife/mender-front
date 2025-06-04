import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../types/RootState';
import { colors } from '../constants/colors';
import { Countries, UserSex } from '../types/enums';

interface ChangePasswordRequest {
    email: string;
    password: string;
    newPassword: string;
}

export const EditProfileScreen = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        country: user?.country || Countries.UNKNOWN,
        sex: user?.sex || UserSex.UNKNOWN,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/user/${user?.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handlePasswordChange = async () => {
        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.email}
                        editable={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Enter your name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        placeholder="Enter your username"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.country}
                        onChangeText={(value) => handleInputChange('country', value)}
                        placeholder="Enter your country"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sex</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.sex}
                        onChangeText={(value) => handleInputChange('sex', value)}
                        placeholder="Enter your sex"
                    />
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
            </View>

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
    form: {
        padding: 20,
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
    disabledInput: {
        opacity: 0.7,
    },
    passwordButton: {
        backgroundColor: colors.surfaceLight,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    passwordButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        width: '80%',
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
        backgroundColor: colors.primary,
    },
    modalButtonText: {
        color: colors.textPrimary,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EditProfileScreen; 