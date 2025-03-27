import { BottomNavigation as BottomNavigationComp, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Carousel from "@/app/components/Carousel";

const AlbumsRoute = () => (
    <View style={styles.scene}>
        <Text>Albums</Text>
    </View>
);

const RecentsRoute = () => (
    <View style={styles.scene}>
        <Text>Recents</Text>
    </View>
);

const NotificationsRoute = () => (
    <View style={styles.scene}>
        <Text>Notifications</Text>
    </View>
);

interface BottomNavigationProps {
    data?: any[];
}

const BottomNavigation = ({ data }: BottomNavigationProps) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'home', title: 'Home', focusedIcon: 'home' },
        { key: 'search', title: 'Search', focusedIcon: 'magnify' },
        { key: 'chat', title: 'Chat', focusedIcon: 'comment' },
        { key: 'profile', title: 'Profile', focusedIcon: 'account' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'home':
                return (
                    <View style={styles.scene}>
                        <Carousel items={data} />
                    </View>
                );
            case 'search':
                return <AlbumsRoute />;
            case 'chat':
                return <RecentsRoute />;
            case 'profile':
                return <NotificationsRoute />;
            default:
                return <NotificationsRoute />;
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.content}>
                <BottomNavigationComp
                    navigationState={{ index, routes }}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                    barStyle={styles.navigationBar}
                />
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, // ✅ Allows BottomNavigation to be visible
        // justifyContent: 'flex-end', // ✅ Ensures BottomNavigation stays at the bottom
    },
    content: {
        flex: 1, // ✅ Makes sure content fills the screen
    },
    scene: {
        flex: 1, // ✅ Ensures full screen height
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 0, // ✅ Ensures the content is below the navigation bar
    },
    navigationBar: {
        height: 70, // ✅ Sets the height of the navigation bar
        // backgroundColor: 'black',
    },
});

export default BottomNavigation;
