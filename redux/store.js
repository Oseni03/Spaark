import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
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
import summaryReducer from "./features/summarySlice";

// Persist Configuration
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["portfolio"],
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, portfolioReducer);

// Store Configuration
export const store = configureStore({
	reducer: {
		basics: basicsReducer,
		summary: summaryReducer,
		portfolio: persistedReducer,
		profile: profileReducer,
		experience: experienceReducer,
		education: educationReducer,
		skill: skillReducer,
		certification: certificationReducer,
		project: projectReducer,
		hackathon: hackathonReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST"],
			},
		}),
});

export const persistor = persistStore(store);
