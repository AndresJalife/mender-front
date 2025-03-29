import { configureStore } from '@reduxjs/toolkit'
import auth from './auth';
import filter from './filter';

export const store = configureStore({
    reducer: {
        auth: auth,
        filter: filter
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;