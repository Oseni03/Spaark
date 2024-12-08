import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { experienceSchema } from "@/schema/sections";
import {
	createExperience,
	deleteExperience,
	editExperience,
} from "@/services/experience";
import { z } from "zod";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
export const addExperienceInDatabase = createAsyncThunk(
	"experience/addExperienceInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = experienceSchema.safeParse(data);
			if (validatedData.success) {
				return await createExperience(validatedData.data);
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

export const updateExperienceInDatabase = createAsyncThunk(
	"experience/updateExperienceInDatabase",
	async (data, { rejectWithValue }) => {
		console.log("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = experienceSchema.safeParse(data);
			if (validatedData.success) {
				return await editExperience(data.id, validatedData.data);
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

export const removeExperienceFromDatabase = createAsyncThunk(
	"experience/removeExperienceFromDatabase",
	async (experienceId, { rejectWithValue }) => {
		try {
			await deleteExperience(experienceId);
			return { id: experienceId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

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
		toggleExperienceVisibility(state, action) {
			const experience = state.items.find(
				(item) => item.id === action.payload
			);
			if (experience) {
				experience.visible = !experience.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Experience
		builder
			.addCase(addExperienceInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addExperienceInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addExperienceInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add experience";
			})

			// Update Experience
			.addCase(updateExperienceInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateExperienceInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateExperienceInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to update experience";
			})

			// Remove Experience
			.addCase(removeExperienceFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				removeExperienceFromDatabase.fulfilled,
				(state, action) => {
					state.loading = false;
				}
			)
			.addCase(removeExperienceFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to remove experience";
			});
	},
});

export const {
	addExperience,
	updateExperience,
	removeExperience,
	toggleExperienceVisibility,
} = experienceSlice.actions;

export default experienceSlice.reducer;
