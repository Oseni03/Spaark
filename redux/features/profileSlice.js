import { createSlice } from "@reduxjs/toolkit";
import { defaultProfile, profileSchema } from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		addProfile(state, action) {
			const result = profileSchema.safeParse(action.payload);
			if (result.success) {
				console.log("Pushing result: ", result);
				state.items.push(result.data);
			} else {
				console.error("Invalid profile data:", result.error);
			}
		},
		updateProfile(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = profileSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeProfile(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleVisibility(state, action) {
			const profile = state.items.find(
				(item) => item.id === action.payload
			);
			if (profile) {
				profile.visible = !profile.visible;
			}
		},
	},
});

export const { addProfile, updateProfile, removeProfile, toggleVisibility } =
	profileSlice.actions;

export default profileSlice.reducer;
