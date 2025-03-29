import { Provider } from 'react-redux';
import { store } from './store/store';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ contentStyle: { backgroundColor: 'black' }, headerShown: false }}>
        <Stack.Screen 
          name="screens/MainScreen" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="screens/LoginScreen" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="screens/SignupScreen" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="screens/FiltersScreen" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </Provider>
  );
} 