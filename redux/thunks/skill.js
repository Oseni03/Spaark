import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { skillSchema } from "@/schema/sections";
import { createSkill, deleteSkill, editSkill } from "@/services/skill";
import { z } from "zod";

export const addSkillInDatabase = createAsyncThunk(
	"skill/addSkillInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = skillSchema.safeParse(data);
			if (validatedData.success) {
				return await createSkill(validatedData.data);
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

export const updateSkillnInDatabase = createAsyncThunk(
	"skill/updateSkillInDatabase",
	async (data, { rejectWithValue }) => {
		logger.info("Update data: ", data);
		try {
			// Validate input before sending to service
			const validatedData = skillSchema.safeParse(data);
			if (validatedData.success) {
				return await editSkill(data.id, validatedData.data);
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

export const removeSkillFromDatabase = createAsyncThunk(
	"skill/removeSkillFromDatabase",
	async (skillId, { rejectWithValue }) => {
		try {
			await deleteSkill(skillId);
			return { id: skillId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
