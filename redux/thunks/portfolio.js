import { createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioSchema, mainSchema } from "@/schema/sections";
import {
	createPortfolio,
	createPortfolioWithSections,
	deletePortfolio,
	updatePortfolio,
} from "@/services/portfolio";
import { logger } from "@/lib/utils";
import { z } from "zod";

function formatZodError(error) {
	if (!error || !error.errors || error.errors.length === 0) {
		return "Validation failed";
	}

	const firstError = error.errors[0];
	const path = firstError.path.join(".");
	return `${path ? `${path}: ` : ""}${firstError.message}`;
}

// Create Portfolio
export const addPortfolioInDatabase = createAsyncThunk(
	"portfolio/createPortfolio",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Creating portfolio:", data);
			const validatedData = portfolioSchema.safeParse(data);
			if (validatedData.success) {
				const response = await createPortfolio(validatedData.data);
				logger.info("Portfolio created successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error creating portfolio:", error);
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

export const createPortfolioWithSectionsThunks = createAsyncThunk(
	"portfolio/createPortfolioWithSections",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Creating portfolio");

			// Pre-validate data shape before sending to API
			const validationResult = mainSchema.safeParse(data);

			if (!validationResult.success) {
				const formattedError = formatZodError(validationResult.error);
				logger.warn("Portfolio validation failed:", formattedError);
				return rejectWithValue(formattedError);
			}

			const response = await createPortfolioWithSections(
				validationResult.data
			);
			logger.info("Portfolio created successfully");
			return response;
		} catch (error) {
			logger.error("Error creating portfolio:", error);
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
			logger.info("Updating portfolio:", { id, data });
			const response = await updatePortfolio(id, data);
			logger.info("Portfolio updated successfully:", response);
			return response;
		} catch (error) {
			logger.error("Error updating portfolio:", error);
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
			logger.info("Deleting portfolio:", id);
			await deletePortfolio(id);
			logger.info("Portfolio deleted successfully:", id);
			return { id };
		} catch (error) {
			logger.error("Error deleting portfolio:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
