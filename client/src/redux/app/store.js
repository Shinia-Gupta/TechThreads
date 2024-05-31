import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {userReducer} from '../reducers/userReducer'
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';
import { themeReducer } from '../reducers/themeReducer';
import { postReducer } from '../reducers/postReducer';
import { commentReducer } from '../reducers/comment.reducer';

const rootReducer=combineReducers({
  userReducer,
  themeReducer,
  postReducer,
  commentReducer
})

const persistConfig={
  key:"root",
  storage,
  version:1
}

const persistedReducer=persistReducer(persistConfig,rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export const persistor=persistStore(store);