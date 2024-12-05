import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Certification,
	defaultCertification,
	certificationSchema,
} from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const certificationSlice = createSlice({
	name: "certification",
	initialState,
	reducers: {
		addCertification(state, action) {
			// Validate the new certification with the schema
			const result = certificationSchema.safeParse(action.payload);
			if (result.success) {
				state.items.push({ ...defaultCertification, ...result.data });
			} else {
				console.error("Invalid certification data:", result.error);
			}
		},
		updateCertification(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = certificationSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeCertification(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleVisibility(state, action) {
			const certification = state.items.find(
				(item) => item.id === action.payload
			);
			if (certification) {
				certification.visible = !certification.visible;
			}
		},
	},
});

export const {
	addCertification,
	updateCertification,
	removeCertification,
	toggleVisibility,
} = certificationSlice.actions;
export default certificationSlice.reducer;
