import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";
import { createProfile, editProfile, deleteProfile } from "@/services/profile";
import { profileSchema } from "@/schema/sections";
import { toast } from "sonner";

// Initial state with simplified loading and error handling
const initialState = {
	items: [],
	loading: false,
	error: null,
};

// Async Thunks with improved type safety
export const addProfileInDatabase = createAsyncThunk(
	"profile/addProfileInDatabase",
	async (profileData, { getState, rejectWithValue }) => {
		try {
			// Validate input using schema
			const validatedData = profileSchema.safeParse(profileData);
			if (!validatedData.success) {
				throw new z.ZodError(validatedData.error.errors);
			}

			const newProfile = validatedData.data;

			// Access the current state to check existing profiles
			const state = getState();
			const existingProfiles = state.profile?.items || [];

			// Get all profiles with the same network
			const matchedProfiles = existingProfiles.filter(
				(profile) => profile.network === newProfile.network
			);

			if (matchedProfiles.length > 1) {
				return rejectWithValue(
					`A profile with the network '${newProfile.network}' already exists.`
				);
			}
			// If validation passes and no conflict, create the profile
			return await createProfile(newProfile);
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

export const updateProfileInDatabase = createAsyncThunk(
	"profile/updateProfileInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = profileSchema.safeParse(data);
			if (validatedData.success) {
				return await editProfile(data.id, validatedData.data);
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

export const removeProfileFromDatabase = createAsyncThunk(
	"profile/removeProfileFromDatabase",
	async (profileId, { rejectWithValue }) => {
		try {
			await deleteProfile(profileId);
			return { id: profileId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);

// Create the slice
const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		setProfiles(state, action) {
			state.items = action.payload;
		},
		addProfile(state, action) {
			const result = profileSchema.safeParse(action.payload);
			if (result.success) {
				const newProfile = result.data;

				// Check if a profile with the same network already exists
				const existingProfile = state.items.find(
					(profile) => profile.network === newProfile.network
				);

				if (existingProfile) {
					toast.info("Profile with network already exist");
					return; // Exit without adding duplicate
				}

				// Add the new profile to the state
				state.items.push(newProfile);
			}
		},
		updateProfile(state, action) {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				const result = profileSchema.safeParse(action.payload);
				if (result.success) {
					state.items[index] = result.data;
				}
			}
		},
		removeProfile(state, action) {
			state.items = state.items.filter(
				(item) => item.id !== action.payload
			);
		},
		toggleProfileVisibility(state, action) {
			const profile = state.items.find(
				(item) => item.id === action.payload
			);
			if (profile) {
				profile.visible = !profile.visible;
			}
		},
	},
	extraReducers: (builder) => {
		// Add Profile
		builder
			.addCase(addProfileInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addProfileInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(addProfileInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add profile";
			})

			// Update Profile
			.addCase(updateProfileInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateProfileInDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateProfileInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to update profile";
			})

			// Remove Profile
			.addCase(removeProfileFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeProfileFromDatabase.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(removeProfileFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to remove profile";
			});
	},
});

export const {
	setProfiles,
	addProfile,
	updateProfile,
	removeProfile,
	toggleProfileVisibility,
} = profileSlice.actions;

export default profileSlice.reducer;
