import { BottomNavigation as BottomNavigationComp, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Carousel from "@/app/components/Carousel";
import ChatScreen from "@/app/screens/chat";
import ProfileScreen from "@/app/screens/profile";
import SearchScreen from "@/app/screens/search";

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

    // @ts-ignore
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'home':
                return <Carousel items={data} />;
            case 'search':
                return <SearchScreen />;
            case 'chat':
                return <ChatScreen />;
            case 'profile':
                return <ProfileScreen />;
            default:
                return;
        }
    };

    return (
        <View style={styles.wrapper}>
            <BottomNavigationComp
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                barStyle={styles.navigationBar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    navigationBar: {
        height: 70,
    },
});

export default BottomNavigation;
