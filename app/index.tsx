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

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

// Esto evita errores uncaught
ErrorUtils.setGlobalHandler((error, isFatal) => {
  // Podés loguearlo si querés, o simplemente ignorar
  console.log('Error capturado:', error);
});

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainScreen />
    </GestureHandlerRootView>
  );
}
