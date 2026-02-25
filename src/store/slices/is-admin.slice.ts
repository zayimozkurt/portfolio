import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: boolean = false;

const isAdminSlice = createSlice({
    name: 'isAdmin',
    initialState,
    reducers: {
        set(state, action: PayloadAction<boolean>) {
            return action.payload;
        },
    },
});

export const isAdminActions = isAdminSlice.actions;

export const isAdminReducer = isAdminSlice.reducer;
