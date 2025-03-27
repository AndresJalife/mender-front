import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const ChatScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Chat Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

export default ChatScreen;
