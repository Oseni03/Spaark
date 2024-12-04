import { defaultSections, Sections } from "@/schema/sections";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Initial State
const initialState = defaultSections;

// Portfolio Slice
const portfolioSlice = createSlice({
	name: "portfolio",
	initialState,
	reducers: {
		updateSection(state, action) {
			const { id, data } = action.payload;
			if (state[id]) {
				Object.assign(state[id], data);
			}
		},
		addItem(state, action) {
			const { section, item } = action.payload;
			const targetSection = state[section];
			if (Array.isArray(targetSection.items)) {
				targetSection.items.push(item);
			}
		},
		updateItem(state, action) {
			const { section, itemId, data } = action.payload;
			const targetSection = state[section];
			if (Array.isArray(targetSection.items)) {
				const item = targetSection.items.find((i) => i.id === itemId);
				if (item) {
					Object.assign(item, data);
				}
			}
		},
		deleteItem(state, action) {
			const { section, itemId } = action.payload;
			const targetSection = state[section];
			if (Array.isArray(targetSection.items)) {
				targetSection.items = targetSection.items.filter(
					(item) => item.id !== itemId
				);
			}
		},

		toggleItemVisibility(state, action) {
			const { section, id } = action.payload;
			const items = state[section];
			const item = items.find((item) => item.id === id);
			if (item) {
				item.visible = !item.visible;
			}
		},

		resetPortfolio(state) {
			Object.assign(state, initialState);
		},
	},
});

// Persist Configuration
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["portfolio"],
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, portfolioSlice.reducer);

// Store Configuration
export const store = configureStore({
	reducer: {
		portfolio: persistedReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST"],
			},
		}),
});

// Typed hooks and selectors
export const { addItem, updateItem, toggleItemVisibility, resetPortfolio } =
	portfolioSlice.actions;

export const persistor = persistStore(store);
