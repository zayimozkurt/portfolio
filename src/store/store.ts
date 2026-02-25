import { isAdminReducer } from '@/store/slices/is-admin.slice';
import { userReducer } from '@/store/slices/user.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        user: userReducer,
        isAdmin: isAdminReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
