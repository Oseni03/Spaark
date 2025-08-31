import { createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import { createSocial, editSocial, deleteSocial } from "@/services/social";
import { socialSchema } from "@/schema/sections";
import { logger } from "@/lib/utils";

export const addSocialInDatabase = createAsyncThunk(
	"social/addSocialInDatabase",
	async (socialData, { getState, rejectWithValue }) => {
		try {
			logger.info("Adding social:", socialData);
			const validatedData = socialSchema.safeParse(socialData);
			if (!validatedData.success) {
				logger.error("Social validation failed:", validatedData.error);
				return rejectWithValue({
					error: validatedData.error.errors[0].message,
				});
			}

			const state = getState();
			const portfolios = state.portfolios?.items || [];
			const portfolio = portfolios.find(
				(p) => p.id === socialData.portfolioId
			);

			if (!portfolio) {
				logger.error("Portfolio not found:", socialData.portfolioId);
				return rejectWithValue({
					error: "Portfolio not found",
				});
			}

			const matchingSocial = portfolio.socials.items.find(
				(p) => p.network === socialData.network
			);

			if (matchingSocial) {
				logger.error(
					`A social for ${socialData.network} already exists`
				);
				return rejectWithValue({
					error: `A social for ${socialData.network} already exists`,
				});
			}

			const response = await createSocial(validatedData.data);
			logger.info("Social created successfully:", response);
			return response;
		} catch (error) {
			logger.error("Error adding social:", error);
			return rejectWithValue({
				error:
					error instanceof Error
						? error.message
						: "An unknown error occurred",
			});
		}
	}
);

export const updateSocialInDatabase = createAsyncThunk(
	"social/updateSocialInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Updating social:", data);
			// Validate input before sending to service
			const validatedData = socialSchema.safeParse(data);
			if (validatedData.success) {
				const response = await editSocial(data.id, validatedData.data);
				logger.info("Social updated successfully:", response);
				return response;
			}
		} catch (error) {
			logger.error("Error updating social:", error);
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

export const removeSocialFromDatabase = createAsyncThunk(
	"social/removeSocialFromDatabase",
	async ({ socialId, portfolioId }, { rejectWithValue }) => {
		try {
			logger.info("Removing social:", {
				socialId,
				portfolioId,
			});
			await deleteSocial(socialId, portfolioId);
			logger.info("Social removed successfully:", {
				socialId,
				portfolioId,
			});
			return { socialId, portfolioId };
		} catch (error) {
			logger.error("Error removing social:", error);
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
