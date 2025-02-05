import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatePortfolioBasics } from "@/services/basics";
import { logger } from "@/lib/utils";

export const updateBasicsInDatabase = createAsyncThunk(
	"basics/updateBasicsInDatabase",
	async (basicData, { rejectWithValue }) => {
		try {
			logger.info("Updating portfolio basics:", {
				portfolioId: basicData.portfolioId,
				updateFields: Object.keys(basicData),
			});

			const response = await updatePortfolioBasics(basicData);

			logger.info("Successfully updated portfolio basics:", {
				portfolioId: basicData.portfolioId,
				status: response.status,
			});

			return response;
		} catch (error) {
			logger.error("Failed to update portfolio basics:", {
				error: error.message,
				stack: error.stack,
				portfolioId: basicData.portfolioId,
			});
			return rejectWithValue(error.response.data);
		}
	}
);
