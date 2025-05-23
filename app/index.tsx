// App.tsx
import React, { useState } from 'react';
import MainScreen from './screens/MainScreen';
import LoadingScreen from './screens/LoadingScreen';
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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainScreen />
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
    </GestureHandlerRootView>
  );
}
