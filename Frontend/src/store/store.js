import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import themeSlice from './themeSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user: userSlice, 
    theme: themeSlice        
})

const persistConfig = {
    key: 'perspectiveforge',
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false})
})

export const persistor = persistStore(store)
