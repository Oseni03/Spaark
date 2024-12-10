import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectSchema } from "@/schema/sections";
import { createProject, editProject, deleteProject } from "@/services/project";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
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

export const updateProjectnInDatabase = createAsyncThunk(
	"project/updateProjectInDatabase",
	async (data, { rejectWithValue }) => {
		console.log("Update data: ", data);
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

const projectSlice = createSlice({
	name: "project",
	initialState,
	reducers: {
		setProjects(state, action) {
			state.items = action.payload;
		},
		addProject(state, action) {
			console.log("Project: ", action.payload);
			const result = projectSchema.safeParse(action.payload);
			if (result.success) {
				console.log("Pushing result: ", result);
				state.items.push(result.data);
			} else {
				console.error("Invalid project data:", result.error);
			}
		},
		updateProject(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = projectSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					console.error("Invalid update data:", result.error);
				}
			}
		},
		removeProject(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleProjectVisibility(state, action) {
			const project = state.items.find(
				(item) => item.id === action.payload
			);
			if (project) {
				project.visible = !project.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Project
		builder
			.addCase(addProjectInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addProjectInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addProjectInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add project";
			})

			// Update Project
			.addCase(updateProjectnInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateProjectnInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateProjectnInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to update project";
			})

			// Remove Project
			.addCase(removeProjectFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeProjectFromDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(removeProjectFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to remove project";
			});
	},
});

export const {
	setProjects,
	addProject,
	updateProject,
	removeProject,
	toggleProjectVisibility,
} = projectSlice.actions;

export default projectSlice.reducer;
