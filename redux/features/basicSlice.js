import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	name: "Basics",
	content: "",
	visible: true,
};

const basicSlice = createSlice({
	name: "basics",
	initialState,
	reducers: {
		updateBasics(state, action) {
			Object.assign(state, action.payload);
		},
	},
});

export const { updateBasics } = basicSlice.actions;
export default basicSlice.reducer;
