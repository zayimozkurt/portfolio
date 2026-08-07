import { SerializedUserModel } from '@/types/db/extended-user.model';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const refresh = createAsyncThunk('user/refresh', async () => {
    const response: { user?: SerializedUserModel } = await (
        await fetch('/api/visitor/user/read', {
            method: 'GET',
        })
    ).json();
    return response.user;
});

const initialState: SerializedUserModel = {
    id: '',
    email: '',
    userName: '',
    fullName: '',
    headline: '',
    bio: '',
    about: '',
    location: '',
    cvUrl: '',
    resumeMode: 'CUSTOM',
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
        set(state, action: PayloadAction<SerializedUserModel>) {
            return action.payload;
        },
        // Lets a reorder apply optimistically (and roll back) without refetching
        // the entire profile just to learn an order the client already knows.
        setPortfolioItems(state, action: PayloadAction<SerializedUserModel['portfolioItems']>) {
            state.portfolioItems = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(refresh.fulfilled, (state, action) => {
            // Keep whatever is already there if the refresh came back empty,
            // rather than blanking the whole profile out.
            if (action.payload) return action.payload;
            return state;
        });
    },
});

export const userActions = {
    ...userSlice.actions,
    refresh,
};

export const userReducer = userSlice.reducer;
