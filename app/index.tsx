import {Text, View} from "react-native";
import store from './store/store';
import {Provider} from 'react-redux';
import Login from "./screens/LoginScreen";
import Home from "@/app/screens/HomeScreen";
import {useState} from "react";
import { loginSuccess } from "./store/auth";

export default function Index() {
    const [isLogggendIn, setIsLoggedIn] = useState(true); // Si se quiere probar el login, se debe cambiar a false  

    const getHomeScreen = () => {
        // Esto es para no estar logueado en el login
        store.dispatch(loginSuccess({
            user: {
                id: 1,
                email: "prueba@gmail.com",
                name: "Usuario de Prueba"
            },
            token: "1234567890"
        }));
        // Esto es para no estar logueado en el login

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


