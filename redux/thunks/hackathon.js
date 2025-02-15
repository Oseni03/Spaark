import { createAsyncThunk } from "@reduxjs/toolkit";
import { hackathonSchema } from "@/schema/sections";
import {
	createHackathon,
	editHackathon,
	deleteHackathon,
} from "@/services/hackathon";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addHackathonInDatabase = createAsyncThunk(
	"hackathon/addHackathonInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Adding hackathon:", data);
			const validatedData = hackathonSchema.safeParse(data);
			if (validatedData.success) {
				const response = await createHackathon(validatedData.data);
				logger.info("Hackathon added successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error adding hackathon:", error);
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
		try {
			logger.info("Updating hackathon:", data);
			const validatedData = hackathonSchema.safeParse(data);
			if (validatedData.success) {
				const response = await editHackathon(
					data.id,
					validatedData.data
				);
				logger.info("Hackathon updated successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error updating hackathon:", error);
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
			logger.info("Removing hackathon:", { hackathonId, portfolioId });
			await deleteHackathon(hackathonId, portfolioId);
			logger.info("Hackathon removed successfully:", {
				hackathonId,
				portfolioId,
			});
			return { hackathonId, portfolioId };
		} catch (error) {
			logger.error("Error removing hackathon:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
