import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./features/portfolioSlice";

// Simple Store Configuration
export const store = configureStore({
	reducer: {
		portfolios: portfolioReducer,
	},
});
