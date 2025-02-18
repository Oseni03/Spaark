import { createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import { createProfile, editProfile, deleteProfile } from "@/services/profile";
import { profileSchema } from "@/schema/sections";
import { logger } from "@/lib/utils";

export const addProfileInDatabase = createAsyncThunk(
	"profile/addProfileInDatabase",
	async (profileData, { getState, rejectWithValue }) => {
		try {
			logger.info("Adding profile:", profileData);
			const validatedData = profileSchema.safeParse(profileData);
			if (!validatedData.success) {
				logger.error("Profile validation failed:", validatedData.error);
				return rejectWithValue({
					error: validatedData.error.errors[0].message,
				});
			}

			const state = getState();
			const portfolios = state.portfolios?.items || [];
			const portfolio = portfolios.find(
				(p) => p.id === profileData.portfolioId
			);

			if (!portfolio) {
				logger.error("Portfolio not found:", profileData.portfolioId);
				return rejectWithValue({
					error: "Portfolio not found",
				});
			}

			const matchingProfile = portfolio.profiles.items.find(
				(p) => p.network === profileData.network
			);

			if (matchingProfile) {
				logger.error(
					`A profile for ${profileData.network} already exists`
				);
				return rejectWithValue({
					error: `A profile for ${profileData.network} already exists`,
				});
			}

			const response = await createProfile(validatedData.data);
			logger.info("Profile created successfully:", response);
			return response;
		} catch (error) {
			logger.error("Error adding profile:", error);
			return rejectWithValue({
				error:
					error instanceof Error
						? error.message
						: "An unknown error occurred",
			});
		}
	}
);

export const updateProfileInDatabase = createAsyncThunk(
	"profile/updateProfileInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Updating profile:", data);
			// Validate input before sending to service
			const validatedData = profileSchema.safeParse(data);
			if (validatedData.success) {
				const response = await editProfile(data.id, validatedData.data);
				logger.info("Profile updated successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error updating profile:", error);
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
			logger.info("Removing profile:", { profileId, portfolioId });
			await deleteProfile(profileId, portfolioId);
			logger.info("Profile removed successfully:", {
				profileId,
				portfolioId,
			});
			return { profileId, portfolioId };
		} catch (error) {
			logger.error("Error removing profile:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
