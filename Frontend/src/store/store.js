import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import themeSlice from './themeSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { encryptTransform } from 'redux-persist-transform-encrypt';

const rootReducer = combineReducers({
    user: userSlice, 
    theme: themeSlice        
})

const encryption = encryptTransform({
    secretKey: 'pf-localStorage-enc',
    onError: function (error) {
        console.error('Encryption Error:', error);
    }
});

const persistConfig = {
    key: 'perspectiveforge',
    storage,
    version: 1,
    transforms: [encryption]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false})
})

export const persistor = persistStore(store)
