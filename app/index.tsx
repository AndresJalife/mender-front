import {Text, View} from "react-native";
import store from './store/store';
import {Provider} from 'react-redux';
import Login from "./screens/login";
import Home from "@/app/screens/home";
import {useState} from "react";

export default function Index() {
    const [isLogggendIn, setIsLoggedIn] = useState(true);

    const getHomeScreen = () => {
        if (isLogggendIn) {
            return <Home></Home>
        }
    }

    const getLoginScreen = () => {
        if (!isLogggendIn) {
            return <Login setLoggedIn={setIsLoggedIn}></Login>
        }
    }

    return (
        <Provider store={store}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {getLoginScreen()}
                {getHomeScreen()}
            </View>
        </Provider>
    );
}
