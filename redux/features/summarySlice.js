import { createSlice } from "@reduxjs/toolkit";

// Initial state based on the schema
const initialState = {
	content: "", // Default value from the schema
};

// Create a slice for the summary state
const summarySlice = createSlice({
	name: "summary",
	initialState,
	reducers: {
		// Action to update the content
		updateSummary(state, action) {
			state.content = action.payload;
		},
		// Action to reset to default
		resetSummary(state) {
			state.content = initialState.content;
		},
	},
});

// Export actions
export const { updateSummary, resetSummary } = summarySlice.actions;

// Export reducer to include in the Redux store
export default summarySlice.reducer;
