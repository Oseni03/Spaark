import { createAsyncThunk } from "@reduxjs/toolkit";
import { experienceSchema } from "@/schema/sections";
import {
	createExperience,
	deleteExperience,
	editExperience,
} from "@/services/experience";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addExperienceInDatabase = createAsyncThunk(
	"experience/addExperienceInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Adding experience:", data);
			// Validate input before sending to service
			const validatedData = experienceSchema.safeParse(data);
			if (validatedData.success) {
				const result = await createExperience(validatedData.data);
				logger.info("Experience added successfully:", result);
				return result;
			}
		} catch (error) {
			logger.error("Error adding experience:", error);
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
		try {
			logger.info("Updating experience:", data);
			// Validate input before sending to service
			const validatedData = experienceSchema.safeParse(data);
			if (validatedData.success) {
				const result = await editExperience(
					data.id,
					validatedData.data
				);
				logger.info("Experience updated successfully:", result);
				return result;
			}
		} catch (error) {
			logger.error("Error updating experience:", error);
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
	async ({ experienceId, portfolioId }, { rejectWithValue }) => {
		try {
			logger.info("Removing experience:", { experienceId, portfolioId });
			await deleteExperience(experienceId, portfolioId);
			logger.info("Experience removed successfully:", {
				experienceId,
				portfolioId,
			});
			return { experienceId, portfolioId };
		} catch (error) {
			logger.error("Error removing experience:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
