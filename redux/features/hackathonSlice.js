import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { hackathonSchema } from "@/schema/sections";
import {
	createHackathon,
	editHackathon,
	deleteHackathon,
} from "@/services/hackathon";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
export const addHackathonInDatabase = createAsyncThunk(
	"hackathon/addHackathonInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = hackathonSchema.safeParse(data);
			if (validatedData.success) {
				return await createHackathon(validatedData.data);
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

export const updateHackathonnInDatabase = createAsyncThunk(
	"hackathon/updateHackathonInDatabase",
	async (data, { rejectWithValue }) => {
		console.log("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = hackathonSchema.safeParse(data);
			if (validatedData.success) {
				return await editHackathon(data.id, validatedData.data);
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

export const removeHackathonFromDatabase = createAsyncThunk(
	"hackathon/removeHackathonFromDatabase",
	async (hackathonId, { rejectWithValue }) => {
		try {
			await deleteHackathon(hackathonId);
			return { id: hackathonId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

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
		toggleHackathonVisibility(state, action) {
			const hackathon = state.items.find(
				(item) => item.id === action.payload
			);
			if (hackathon) {
				hackathon.visible = !hackathon.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Hackathon
		builder
			.addCase(addHackathonInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addHackathonInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addHackathonInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add hackathon";
			})

			// Update Hackathon
			.addCase(updateHackathonnInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateHackathonnInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateHackathonnInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to update hackathon";
			})

			// Remove Hackathon
			.addCase(removeHackathonFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeHackathonFromDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(removeHackathonFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to remove hackathon";
			});
	},
});

export const {
	setHackathons,
	addHackathon,
	updateHackathon,
	removeHackathon,
	toggleHackathonVisibility,
} = hackathonSlice.actions;

export default hackathonSlice.reducer;
