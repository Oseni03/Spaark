import { createAsyncThunk } from "@reduxjs/toolkit";
import { educationSchema } from "@/schema/sections";
import {
	createEducation,
	deleteEducation,
	editEducation,
} from "@/services/education";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addEducationInDatabase = createAsyncThunk(
	"education/addEducationInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Adding education:", data);
			// Validate input before sending to service
			const validatedData = educationSchema.safeParse(data);
			if (validatedData.success) {
				const result = await createEducation(validatedData.data);
				logger.info("Education added successfully:", result);
				return result;
			}
		} catch (error) {
			logger.error("Error adding education:", error);
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
	async ({ educationId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteEducation(educationId, portfolioId);
			return { educationId, portfolioId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
