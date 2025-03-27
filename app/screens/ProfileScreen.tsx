import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RootState } from '../store/types';
import { store } from '../store/store';
import { logout } from '../store/auth';

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
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: '#666666',
    },
    buttonContainer: {
        padding: 20,
        gap: 12,
    },
    button: {
        backgroundColor: '#ffffff',
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
        color: '#333333',
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ffebee',
        marginTop: 8,
    },
    logoutText: {
        color: '#d32f2f',
    },
    message: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 20,
    },
}); 