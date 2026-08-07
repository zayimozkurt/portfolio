import { isAdminReducer } from '@/store/slices/is-admin.slice';
import { userReducer } from '@/store/slices/user.slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    user: userReducer,
    isAdmin: isAdminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * A fresh store per request, seeded with data the server already fetched, so the
 * first paint is complete and no client-side fetch is needed to render the page.
 */
export const makeStore = (preloadedState?: Partial<RootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
