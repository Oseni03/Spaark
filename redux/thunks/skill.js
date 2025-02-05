import { createAsyncThunk } from "@reduxjs/toolkit";
import { skillSchema } from "@/schema/sections";
import { createSkill, deleteSkill, editSkill } from "@/services/skill";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addSkillInDatabase = createAsyncThunk(
	"skill/addSkillInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Adding skill:", data);
			const validatedData = skillSchema.safeParse(data);
			if (validatedData.success) {
				const response = await createSkill(validatedData.data);
				logger.info("Skill added successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error adding skill:", error);
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

export const updateSkillnInDatabase = createAsyncThunk(
	"skill/updateSkillInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Updating skill:", data);
			const validatedData = skillSchema.safeParse(data);
			if (validatedData.success) {
				const response = await editSkill(data.id, validatedData.data);
				logger.info("Skill updated successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error updating skill:", error);
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

export const removeSkillFromDatabase = createAsyncThunk(
	"skill/removeSkillFromDatabase",
	async ({ skillId, portfolioId }, { rejectWithValue }) => {
		try {
			logger.info("Removing skill:", { skillId, portfolioId });
			await deleteSkill(skillId, portfolioId);
			logger.info("Skill removed successfully:", {
				skillId,
				portfolioId,
			});
			return { skillId, portfolioId };
		} catch (error) {
			logger.error("Error removing skill:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
