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
            
            // Format dates if they exist and aren't already formatted
            if (filters.min_release_date && !filters.min_release_date.includes('/')) {
                filters.min_release_date = `01/01/${filters.min_release_date}`;
            }
            if (filters.max_release_date && !filters.max_release_date.includes('/')) {
                filters.max_release_date = `01/01/${filters.max_release_date}`;
            }
            
            state.filters = filters;
        },
        clearFilters: (state) => {
            state.filters = {};
        }
    }
});

export const { setFilters, clearFilters } = filterSlice.actions;
export default filterSlice.reducer; 