import { createAsyncThunk } from "@reduxjs/toolkit";
import { educationSchema } from "@/schema/sections";
import {
	createEducation,
	deleteEducation,
	editEducation,
} from "@/services/education";
import { z } from "zod";

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
		logger.info("Update data: ", data);
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
