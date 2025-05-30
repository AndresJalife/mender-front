import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters } from '@/app/types/Post';

interface FilterState {
    filters: Filters;
}

const initialState: FilterState = {
    filters: {}
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Filters>) => {
            const filters = { ...action.payload };
            
            state.filters = filters;
        },
        clearFilters: (state) => {
            state.filters = {};
        }
    }
});

export const { setFilters, clearFilters } = filterSlice.actions;
export default filterSlice.reducer; 