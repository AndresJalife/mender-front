import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const Login: React.FC = () => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        return auth().onAuthStateChanged(onAuthStateChanged);
    }, [initializing]);

    if (initializing) return null;

    if (!user) {
        return (
            <View>
                <Text>Login</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
        </View>
    );
};

export default Login;
