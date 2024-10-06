import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import BottomNavigation from "@/app/components/BottomNavigation";
import VideoPlayer from "@/app/components/VideoPlayer";

const HomeScreen = () => {

    return (
        <View style={styles.container}>
            <VideoPlayer />
            <BottomNavigation />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;