import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserBasics } from "@/services/user";

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
