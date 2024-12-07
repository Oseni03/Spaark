import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { defaultBasics } from "@/schema/basics";
import { updateUserBasics } from "@/services/user"; // Assume this service exists

// Async thunk for updating basics in the database
export const updateBasicsInDatabase = createAsyncThunk(
	"basics/updateBasicsInDatabase",
	async (basicData, { rejectWithValue }) => {
		try {
			const response = await updateUserBasics(basicData);
			return response;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const initialState = {
	visible: true,
	...defaultBasics,
	status: "idle", // Added to track async operation status
	error: null, // Added to store any potential error
};

const basicSlice = createSlice({
	name: "basics",
	initialState,
	reducers: {
		// Local state update reducer
		updateBasics: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		resetBasics: (state) => {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateBasicsInDatabase.pending, (state) => {
				state.status = "loading";
			})
			.addCase(updateBasicsInDatabase.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Optionally update state with server response
				state = { ...state, ...action.payload };
			})
			.addCase(updateBasicsInDatabase.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

// Example usage in a component:
// dispatch(updateBasics(newData));
// dispatch(updateBasicsInDatabase(newData));

export const { updateBasics, resetBasics } = basicSlice.actions;
export default basicSlice.reducer;
