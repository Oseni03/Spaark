import { createSlice } from "@reduxjs/toolkit";
import { projectSchema, skillSchema } from "@/schema/sections";

const initialState = {
	items: [],
	visible: true,
};

const projectSlice = createSlice({
	name: "project",
	initialState,
	reducers: {
		setProjects(state, action) {
			console.log("Projects: ", action.payload);
			state.items = action.payload;
		},
		addProject(state, action) {
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
		toggleVisibility(state, action) {
			const project = state.items.find(
				(item) => item.id === action.payload
			);
			if (project) {
				project.visible = !project.visible;
			}
		},
	},
});

export const {
	setProjects,
	addProject,
	updateProject,
	removeProject,
	toggleVisibility,
} = projectSlice.actions;

export default projectSlice.reducer;
