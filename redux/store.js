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
import storage from "redux-persist/lib/storage";
import profileReducer from "./features/profileSlice";
import portfolioReducer from "./features/portfolioSlice";
import experienceReducer from "./features/experienceSlice";
import educationReducer from "./features/educationSlice";
import skillReducer from "./features/skillSlice";
import certificationReducer from "./features/certificationSlice";
import projectReducer from "./features/projectSlice";
import hackathonReducer from "./features/hackathonSlice";
import basicsReducer from "./features/basicSlice";
import userReducer from "./features/userSlice";

// Persist configuration
const persistConfig = {
	key: "root",
	version: 1,
	storage,
	// Optionally blacklist or whitelist specific reducers
	blacklist: [], // Add reducers you don't want to persist
};

// Combine reducers
const rootReducer = combineReducers({
	user: userReducer,
	basics: basicsReducer,
	profile: profileReducer,
	experience: experienceReducer,
	education: educationReducer,
	skill: skillReducer,
	certification: certificationReducer,
	project: projectReducer,
	hackathon: hackathonReducer,
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
