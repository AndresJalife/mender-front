import { BottomNavigation as BottomNavigationComp, Text } from 'react-native-paper';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const MusicRoute = () => <Text>Music</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

const BottomNavigation = () => {

    console.log('BottomNavigation');

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'music', title: '', focusedIcon: 'home'},
        { key: 'albums', title: '', focusedIcon: 'magnify' },
        { key: 'recents', title: '', focusedIcon: 'comment' },
        { key: 'notifications', title: '', focusedIcon: 'account'},
    ]);

    const renderScene = BottomNavigationComp.SceneMap({
        music: MusicRoute,
        albums: AlbumsRoute,
        recents: RecentsRoute,
        notifications: NotificationsRoute,
    });

    return (
        <View style={styles.container}>
            <BottomNavigationComp
                style={styles.component}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },

    component: {
        width: '100%',
    }

});

export default BottomNavigation;