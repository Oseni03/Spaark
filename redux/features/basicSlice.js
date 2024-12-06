import { createSlice } from "@reduxjs/toolkit";
import { defaultBasics } from "@/schema/basics";

const initialState = {
	visible: true,
	...defaultBasics, // Default values from the schema
};

const basicSlice = createSlice({
	name: "basics",
	initialState,
	reducers: {
		// Update the basics data
		updateBasics: (state, action) => {
			console.log("State: ", state);
			console.log("Action: ", action);
			state = { ...state, ...action.payload };
		},

		// Reset the basics data to defaults
		resetBasics: (state) => {
			state = { ...initialState };
		},
	},
});

// Export actions
export const { updateBasics, resetBasics } = basicSlice.actions;

// Export reducer
export default basicSlice.reducer;
