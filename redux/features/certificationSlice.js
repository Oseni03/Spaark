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
			const { id, data } = action.payload;
			const certification = state.items.find((item) => item.id === id);
			if (certification) {
				// Validate the update with the schema
				const result = certificationSchema.safeParse({
					...certification,
					...data,
				});
				if (result.success) {
					Object.assign(certification, result.data);
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
		toggleVisibility(state) {
			state.visible = !state.visible;
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
