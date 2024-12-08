import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	Education,
	defaultEducation,
	educationSchema,
} from "@/schema/sections";
import {
	createEducation,
	deleteEducation,
	editEducation,
} from "@/services/education";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
export const addEducationInDatabase = createAsyncThunk(
	"education/addEducationInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = educationSchema.safeParse(data);
			if (validatedData.success) {
				return await createEducation(validatedData.data);
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

export const updateEducationInDatabase = createAsyncThunk(
	"education/updateEducationInDatabase",
	async (data, { rejectWithValue }) => {
		console.log("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = educationSchema.safeParse(data);
			if (validatedData.success) {
				return await editEducation(data.id, validatedData.data);
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

export const removeEducationFromDatabase = createAsyncThunk(
	"education/removeEducationFromDatabase",
	async (educationId, { rejectWithValue }) => {
		try {
			await deleteEducation(educationId);
			return { id: educationId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

const educationSlice = createSlice({
	name: "education",
	initialState,
	reducers: {
		setEducations(state, action) {
			console.log("Educations: ", action.payload);
			state.items = action.payload;
		},
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
		toggleEducationVisibility(state, action) {
			const education = state.items.find(
				(item) => item.id === action.payload
			);
			if (education) {
				education.visible = !education.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Education
		builder
			.addCase(addEducationInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addEducationInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addEducationInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add education";
			})

			// Update Experience
			.addCase(updateEducationInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateEducationInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateEducationInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to update education";
			})

			// Remove Education
			.addCase(removeEducationFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeEducationFromDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(removeEducationFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to remove education";
			});
	},
});

export const {
	setEducations,
	addEducation,
	updateEducation,
	removeEducation,
	toggleEducationVisibility,
} = educationSlice.actions;

export default educationSlice.reducer;
