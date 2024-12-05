import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Education,
	defaultEducation,
	educationSchema,
} from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const educationSlice = createSlice({
	name: "education",
	initialState,
	reducers: {
		addEducation(state, action) {
			// Validate the new education entry with the schema
			const result = educationSchema.safeParse(action.payload);
			if (result.success) {
				state.items.push({ ...defaultEducation, ...result.data });
			} else {
				console.error("Invalid education data:", result.error);
			}
		},
		updateEducation(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = educationSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeEducation(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleVisibility(state, action) {
			const education = state.items.find(
				(item) => item.id === action.payload
			);
			if (education) {
				education.visible = !education.visible;
			}
		},
	},
});

export const {
	addEducation,
	updateEducation,
	removeEducation,
	toggleVisibility,
} = educationSlice.actions;

export default educationSlice.reducer;
