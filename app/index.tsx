// App.tsx
import React from 'react';
import MainScreen from './screens/MainScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainScreen />
    </GestureHandlerRootView>
  );
}
