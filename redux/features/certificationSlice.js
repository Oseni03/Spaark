import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	Certification,
	defaultCertification,
	certificationSchema,
} from "@/schema/sections";
import {
	createCertification,
	editCertification,
	deleteCertification,
} from "@/services/certification";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
export const addCertificationInDatabase = createAsyncThunk(
	"certification/addCertificationInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = certificationSchema.safeParse(data);
			if (validatedData.success) {
				return await createCertification(validatedData.data);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				return rejectWithValue(error.errors[0].message);
			}
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

export const updateCertificationnInDatabase = createAsyncThunk(
	"certification/updateCertificationInDatabase",
	async (data, { rejectWithValue }) => {
		console.log("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = certificationSchema.safeParse(data);
			if (validatedData.success) {
				return await editCertification(data.id, validatedData.data);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				return rejectWithValue(error.errors[0].message);
			}
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

export const removeCertificationFromDatabase = createAsyncThunk(
	"certification/removeCertificationFromDatabase",
	async (certificationId, { rejectWithValue }) => {
		try {
			await deleteCertification(certificationId);
			return { id: certificationId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

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
		toggleCertificationVisibility(state, action) {
			const certification = state.items.find(
				(item) => item.id === action.payload
			);
			if (certification) {
				certification.visible = !certification.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Certification
		builder
			.addCase(addCertificationInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addCertificationInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addCertificationInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add certification";
			})

			// Update Certification
			.addCase(updateCertificationnInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				updateCertificationnInDatabase.fulfilled,
				(state, action) => {
					state.loading = false;
				}
			)
			.addCase(
				updateCertificationnInDatabase.rejected,
				(state, action) => {
					state.loading = false;
					state.error =
						action.payload || "Failed to update certification";
				}
			)

			// Remove Certification
			.addCase(removeCertificationFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				removeCertificationFromDatabase.fulfilled,
				(state, action) => {
					state.loading = false;
				}
			)
			.addCase(
				removeCertificationFromDatabase.rejected,
				(state, action) => {
					state.loading = false;
					state.error =
						action.payload || "Failed to remove certification";
				}
			);
	},
});

export const {
	addCertification,
	updateCertification,
	removeCertification,
	toggleCertificationVisibility,
} = certificationSlice.actions;
export default certificationSlice.reducer;
