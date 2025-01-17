import { createAsyncThunk } from "@reduxjs/toolkit";
import { hackathonSchema } from "@/schema/sections";
import {
	createHackathon,
	editHackathon,
	deleteHackathon,
} from "@/services/hackathon";
import { logger } from "@/lib/utils";
import { z } from "zod";

export const addHackathonInDatabase = createAsyncThunk(
	"hackathon/addHackathonInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = hackathonSchema.safeParse(data);
			if (validatedData.success) {
				return await createHackathon(validatedData.data);
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

export const updateHackathonInDatabase = createAsyncThunk(
	"hackathon/updateHackathonInDatabase",
	async (data, { rejectWithValue }) => {
		logger.info("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = hackathonSchema.safeParse(data);
			if (validatedData.success) {
				return await editHackathon(data.id, validatedData.data);
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

export const removeHackathonFromDatabase = createAsyncThunk(
	"hackathon/removeHackathonFromDatabase",
	async ({ hackathonId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteHackathon(hackathonId, portfolioId);
			return { id: hackathonId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
