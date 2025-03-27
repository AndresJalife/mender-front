import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from "@/app/components/BottomNavigation";


const data = [
    {"text": "Item 2", "url": "lbGugemmozk"},
    {"text": "Item 1", "url": "9kqnsoY94L8"},
]

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <BottomNavigation data={data} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

export default HomeScreen;

