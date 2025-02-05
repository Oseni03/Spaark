import { createAsyncThunk } from "@reduxjs/toolkit";
import { projectSchema } from "@/schema/sections";
import { createProject, editProject, deleteProject } from "@/services/project";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addProjectInDatabase = createAsyncThunk(
	"project/addProjectInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Adding project:", data);
			const validatedData = projectSchema.safeParse(data);
			if (validatedData.success) {
				const response = await createProject(validatedData.data);
				logger.info("Project added successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error adding project:", error);
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
			logger.info("Updating project:", data);
			const validatedData = projectSchema.safeParse(data);
			if (validatedData.success) {
				const response = await editProject(data.id, validatedData.data);
				logger.info("Project updated successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error updating project:", error);
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
	async ({ projectId, portfolioId }, { rejectWithValue }) => {
		try {
			logger.info("Removing project:", { projectId, portfolioId });
			await deleteProject(projectId, portfolioId);
			logger.info("Project removed successfully:", {
				projectId,
				portfolioId,
			});
			return { projectId, portfolioId };
		} catch (error) {
			logger.error("Error removing project:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
