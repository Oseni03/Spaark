import { createSlice } from "@reduxjs/toolkit";
import { hackathonSchema } from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const hackathonSlice = createSlice({
	name: "hackathon",
	initialState,
	reducers: {
		setHackathons(state, action) {
			console.log("Hackathons: ", action.payload);
			state.items = action.payload;
		},
		addHackathon(state, action) {
			const result = hackathonSchema.safeParse(action.payload);
			if (result.success) {
				state.items.push(result.data);
			} else {
				console.error("Invalid hackathon data:", result.error);
			}
		},
		updateHackathon(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = hackathonSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeHackathon(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleVisibility(state, action) {
			const hackathon = state.items.find(
				(item) => item.id === action.payload
			);
			if (hackathon) {
				hackathon.visible = !hackathon.visible;
			}
		},
	},
});

export const {
	setHackathons,
	addHackathon,
	updateHackathon,
	removeHackathon,
	toggleVisibility,
} = hackathonSlice.actions;

export default hackathonSlice.reducer;
