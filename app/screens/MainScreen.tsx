import {Text, View} from "react-native";
import {useSelector} from 'react-redux';
import Login from "../screens/LoginScreen";
import { RootState } from "../types/RootState";
import BottomNavigation from "../components/BottomNavigation";

export function MainScreen() {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);

    return (
        <View
            style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {!isAuthenticated ? <Login key={1} /> : <BottomNavigation key={2} />}
        </View>
    );
}


export default MainScreen;