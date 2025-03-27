import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

export default ProfileScreen;

