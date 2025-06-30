import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import portfolioReducer from "./features/portfolioSlice";

// Persist Config
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["portfolios"], // Add the reducers you want to persist
};

// Root Reducer
const rootReducer = combineReducers({
	portfolios: portfolioReducer,
});

// Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Configuration
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

// Persistor
export const persistor = persistStore(store);
