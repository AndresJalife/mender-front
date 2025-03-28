import {Text, View} from "react-native";
import {useSelector} from 'react-redux';
import Login from "../screens/LoginScreen";
import Home from "@/app/screens/HomeScreen";
import { RootState } from "../store/types";

export default function MainScreen() {
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


