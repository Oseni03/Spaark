import { createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import { createProfile, editProfile, deleteProfile } from "@/services/profile";
import { profileSchema } from "@/schema/sections";

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
	async ({ profileId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteProfile(profileId, portfolioId);
			return { profileId, portfolioId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
