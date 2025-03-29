import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RootState } from '../types/RootState';
import { store } from '../store/store';
import { logout } from '../store/auth';
import { colors } from '../constants/colors';

export const ProfileScreen = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please log in to view your profile</Text>
            </View>
        );
    }

    const handleLogout = () => {
        store.dispatch(logout());
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => console.log('Edit Profile pressed')}
                >
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => console.log('Settings pressed')}
                >
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
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
    buttonContainer: {
        padding: 20,
        gap: 12,
    },
    button: {
        backgroundColor: colors.surfaceLight,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: colors.surfaceLighter,
        marginTop: 8,
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
}); 

export default ProfileScreen;