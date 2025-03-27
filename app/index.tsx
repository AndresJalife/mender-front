// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Index from './screens/MainScreen'; // or whatever your main component is

export default function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}
