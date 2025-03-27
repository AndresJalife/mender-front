import {Text, View} from "react-native";
import store from '../store/store';
import {Provider, useSelector} from 'react-redux';
import Login from "../screens/LoginScreen";
import Home from "@/app/screens/HomeScreen";
import {useState} from "react";
import { loginSuccess } from "../store/auth";
import { RootState } from "../store/types";

export default function Index() {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);

    const getHomeScreen = () => {
        if (isAuthenticated) {
            return <Home></Home>
        }
    }

    const getLoginScreen = () => {
        if (!isAuthenticated) {
            return <Login></Login>
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {!isAuthenticated ? <Login /> : <Home />}
        </View>
    );
}


