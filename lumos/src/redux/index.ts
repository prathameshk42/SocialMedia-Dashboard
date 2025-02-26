import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import UserSlice from './UserSlice';
import ChatSlice from './ChatSlice';
import TweetsSlice from './TweetsSlice';
import FbSlice from './FbSlice';

const rootReducer = combineReducers({
    user: UserSlice,
    chat: ChatSlice,
    tweet: TweetsSlice,
    fb: FbSlice
});

const persistConfig = {
    key: 'root',
    storage: storageSession
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});
const persistor = persistStore(store);

export { store, persistor };

export type ReduxState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
