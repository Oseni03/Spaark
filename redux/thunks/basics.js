import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatePortfolioBasics } from "@/services/basics";

export const updateBasicsInDatabase = createAsyncThunk(
	"basics/updateBasicsInDatabase",
	async (basicData, { rejectWithValue }) => {
		try {
			const response = await updatePortfolioBasics(basicData);
			return response;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
