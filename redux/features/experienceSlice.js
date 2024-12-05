import { createSlice } from "@reduxjs/toolkit";
import { experienceSchema } from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const experienceSlice = createSlice({
	name: "experience",
	initialState,
	reducers: {
		addExperience(state, action) {
			const result = experienceSchema.safeParse(action.payload);
			if (result.success) {
				state.items.push(result.data);
			} else {
				console.error("Invalid experience data:", result.error);
			}
		},
		updateExperience(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = experienceSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeExperience(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleVisibility(state, action) {
			const experience = state.items.find(
				(item) => item.id === action.payload
			);
			if (experience) {
				experience.visible = !experience.visible;
			}
		},
	},
});

export const {
	addExperience,
	updateExperience,
	removeExperience,
	toggleVisibility,
} = experienceSlice.actions;

export default experienceSlice.reducer;
