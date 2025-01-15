import { createAsyncThunk } from "@reduxjs/toolkit";
import { projectSchema } from "@/schema/sections";
import { createProject, editProject, deleteProject } from "@/services/project";
import { z } from "zod";

export const addProjectInDatabase = createAsyncThunk(
	"project/addProjectInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = projectSchema.safeParse(data);
			if (validatedData.success) {
				return await createProject(validatedData.data);
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

export const updateProjectInDatabase = createAsyncThunk(
	"project/updateProjectInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = projectSchema.safeParse(data);
			if (validatedData.success) {
				return await editProject(data.id, validatedData.data);
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

export const removeProjectFromDatabase = createAsyncThunk(
	"project/removeProjectFromDatabase",
	async (projectId, { rejectWithValue }) => {
		try {
			await deleteProject(projectId);
			return { id: projectId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
