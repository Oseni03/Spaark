import { createSlice } from "@reduxjs/toolkit";
import { defaultSections } from "@/schema/sections";

// Initial State
const initialState = defaultSections;

// Portfolio Slice
const portfolioSlice = createSlice({
	name: "portfolio",
	initialState,
	reducers: {
		resetPortfolio(state) {
			Object.assign(state, initialState);
		},
	},
});

export const { resetPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
