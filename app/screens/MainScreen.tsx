import {Text, View} from "react-native";
import {useSelector} from 'react-redux';
import Login from "../screens/LoginScreen";
import RootState from "../types/RootState";
import BottomNavigation from "../components/BottomNavigation";
import LoadingScreen from "@/app/screens/LoadingScreen";
import ColdStartScreen from "@/app/screens/ColdStartScreen";
import React, {useState} from "react";

export function MainScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);

    return (
        <View
            style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {!isAuthenticated ? (
                <Login key={1} />
            ) : user?.new ? (
                <ColdStartScreen key={3} />
            ) : (
                <BottomNavigation key={2} />
            )}
            {isLoading && isAuthenticated && !user?.new && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
        </View>
    );
}

export default MainScreen;