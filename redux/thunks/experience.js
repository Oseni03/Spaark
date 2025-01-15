import { experienceSchema } from "@/schema/sections";
import {
	createExperience,
	deleteExperience,
	editExperience,
} from "@/services/experience";
import { z } from "zod";

export const addExperienceInDatabase = createAsyncThunk(
	"experience/addExperienceInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = experienceSchema.safeParse(data);
			if (validatedData.success) {
				return await createExperience(validatedData.data);
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

export const updateExperienceInDatabase = createAsyncThunk(
	"experience/updateExperienceInDatabase",
	async (data, { rejectWithValue }) => {
		logger.info("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = experienceSchema.safeParse(data);
			if (validatedData.success) {
				return await editExperience(data.id, validatedData.data);
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

export const removeExperienceFromDatabase = createAsyncThunk(
	"experience/removeExperienceFromDatabase",
	async (experienceId, { rejectWithValue }) => {
		try {
			await deleteExperience(experienceId);
			return { id: experienceId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
