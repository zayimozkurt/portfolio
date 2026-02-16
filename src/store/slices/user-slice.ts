import { ExtendedUserModel } from '@/types/db/extended-user.model';
import { ReadUserByIdResponse } from '@/types/response/user/read-user-by-id.response';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const refresh = createAsyncThunk('user/refresh', async () => {
    const response: ReadUserByIdResponse = await (
        await fetch('/api/visitor/user/read', {
            method: 'GET',
        })
    ).json();
    return response.user;
});

const initialState: ExtendedUserModel = {
    id: '',
    email: '',
    userName: '',
    passwordHash: '',
    fullName: '',
    headline: '',
    bio: '',
    about: '',
    location: '',
    cvUrl: '',
    skills: [],
    userImages: [],
    contacts: [],
    experiences: [],
    educations: [],
    portfolioItems: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set(state, action: PayloadAction<ExtendedUserModel>) {
            return action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(refresh.fulfilled, (state, action) => {
            if (action.payload) return action.payload;
            return undefined;
        });
    },
});

export const userActions = {
    ...userSlice.actions,
    refresh,
};

export const userReducer = userSlice.reducer;
