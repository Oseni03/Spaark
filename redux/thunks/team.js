import { createAsyncThunk } from "@reduxjs/toolkit";
import { teamSchema } from "@/schema/sections";
import {
	createTeamMember,
	deleteTeamMember,
	editTeamMember,
} from "@/services/team";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addTeamMemberInDatabase = createAsyncThunk(
	"team/addTeamMemberInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			const validatedData = teamSchema.safeParse(data);
			if (validatedData.success) {
				const result = await createTeamMember(validatedData.data);
				return result;
			}
		} catch (error) {
			logger.error("Error adding team member:", error);
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

export const updateTeamMemberInDatabase = createAsyncThunk(
	"team/updateTeamMemberInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			const validatedData = teamSchema.safeParse(data);
			if (validatedData.success) {
				return await editTeamMember(data.id, validatedData.data);
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

export const removeTeamMemberFromDatabase = createAsyncThunk(
	"team/removeTeamMemberFromDatabase",
	async ({ teamMemberId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteTeamMember(teamMemberId, portfolioId);
			return { teamMemberId, portfolioId };
		} catch (error) {
			logger.error("Error removing team member:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "Failed to remove team member"
			);
		}
	}
);
