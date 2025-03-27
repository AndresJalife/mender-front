import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const SearchScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Search Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

export default SearchScreen;
