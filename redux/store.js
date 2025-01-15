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
import { CookieStorage } from "redux-persist-cookie-storage";
import Cookies from "js-cookie";
import portfolioReducer from "./features/portfolioSlice";
import userReducer from "./features/userSlice";

// Custom cookie storage configuration
const persistConfig = {
	key: "root",
	version: 1,
	storage: new CookieStorage(Cookies, {
		domain: `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, // Notice the dot prefix
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax", // Helps prevent CSRF attacks
	}),
};

// Combine reducers
const rootReducer = combineReducers({
	user: userReducer,
	portfolios: portfolioReducer,
});

// Create persisted reducer
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
					// Add any custom actions you want to ignore
				],
			},
		}),
});

export const persistor = persistStore(store);
