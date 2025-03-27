import { useSelector } from 'react-redux';
import { View, Text } from 'react-native';

export const ProfileScreen = () => {
    // Access the auth state from Redux store
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return (
            <View>
                <Text>Please log in to view your profile</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome, {user.name}!</Text>
            <Text>Email: {user.email}</Text>
            {/* Add more user information as needed */}
        </View>
    );
}; 