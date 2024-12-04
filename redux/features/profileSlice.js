import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile, defaultProfile, profileSchema } from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		addProfile(state, action) {
			// Validate the new profile with the schema
			const result = profileSchema.safeParse(action.payload);
			if (result.success) {
				state.items.push({ ...defaultProfile, ...result.data });
			} else {
				console.error("Invalid profile data:", result.error);
			}
		},
		updateProfile(state, action) {
			const { id, data } = action.payload;
			const profile = state.items.find((item) => item.id === id);
			if (profile) {
				// Validate the update with the schema
				const result = profileSchema.safeParse({ ...profile, ...data });
				if (result.success) {
					Object.assign(profile, result.data);
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
			const selected = state.items.filter(
				(item) => (item.id = action.payload)
			);
			selected.visible = !selected.visible;
		},
	},
});

export const { addProfile, updateProfile, removeProfile, toggleVisibility } =
	profileSlice.actions;

export default profileSlice.reducer;
