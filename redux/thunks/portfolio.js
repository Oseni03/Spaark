import { createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioSchema } from "@/schema/sections";
import {
	createPortfolio,
	deletePortfolio,
	editPortfolio,
} from "@/services/portfolio";

// Create Portfolio
export const addPortfolioInDatabase = createAsyncThunk(
	"portfolio/createPortfolio",
	async (data, { rejectWithValue }) => {
		try {
			const validatedData = portfolioSchema.safeParse(data);
			if (validatedData.success) {
				return await createPortfolio(validatedData.data);
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

// Update Portfolio
export const updatePortfolioInDatabase = createAsyncThunk(
	"portfolio/updatePortfolio",
	async ({ id, data }, { rejectWithValue }) => {
		try {
			const validatedData = portfolioSchema.safeParse(data);
			if (validatedData.success) {
				return await editPortfolio(id, validatedData.data);
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

// Delete Portfolio
export const removePortfolioFromDatabase = createAsyncThunk(
	"portfolio/deletePortfolio",
	async (id, { rejectWithValue }) => {
		try {
			await deletePortfolio(id);
			return { id };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
