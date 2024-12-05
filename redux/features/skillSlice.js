import { createSlice } from "@reduxjs/toolkit";
import { skillSchema } from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const skillSlice = createSlice({
	name: "skill",
	initialState,
	reducers: {
		addSkill(state, action) {
			const result = skillSchema.safeParse(action.payload);
			if (result.success) {
				console.log("Pushing result: ", result);
				state.items.push(result.data);
			} else {
				console.error("Invalid skill data:", result.error);
			}
		},
		updateSkill(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = skillSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeSkill(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleVisibility(state, action) {
			const skill = state.items.find(
				(item) => item.id === action.payload
			);
			if (skill) {
				skill.visible = !skill.visible;
			}
		},
	},
});

export const { addSkill, updateSkill, removeSkill, toggleVisibility } =
	skillSlice.actions;

export default skillSlice.reducer;
