import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { skillSchema } from "@/schema/sections";
import { createSkill, deleteSkill, editSkill } from "@/services/skill";
import { logger } from "@/lib/utils";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
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

const skillSlice = createSlice({
	name: "skill",
	initialState,
	reducers: {
		setSkills(state, action) {
			logger.info("Skills: ", action.payload);
			state.items = action.payload;
		},
		addSkill(state, action) {
			const result = skillSchema.safeParse(action.payload);
			if (result.success) {
				logger.info("Pushing result: ", result);
				state.items.push(result.data);
			} else {
				logger.error("Invalid skill data:", result.error);
			}
		},
		updateSkill(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = skillSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				} else {
					logger.error("Invalid update data:", result.error);
				}
			}
		},
		removeSkill(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleSkillVisibility(state, action) {
			const skill = state.items.find(
				(item) => item.id === action.payload
			);
			if (skill) {
				skill.visible = !skill.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Skill
		builder
			.addCase(addSkillInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addSkillInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addSkillInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add skill";
			})

			// Update Skill
			.addCase(updateSkillnInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateSkillnInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateSkillnInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to update skill";
			})

			// Remove Skill
			.addCase(removeSkillFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeSkillFromDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(removeSkillFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to remove skill";
			});
	},
});

export const {
	setSkills,
	addSkill,
	updateSkill,
	removeSkill,
	toggleSkillVisibility,
} = skillSlice.actions;

export default skillSlice.reducer;
