import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createCertification,
	editCertification,
	deleteCertification,
} from "@/services/certification";
import { certificationSchema } from "@/schema/sections";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addCertificationInDatabase = createAsyncThunk(
	"certification/addCertificationInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			logger.info("Adding certification:", {
				portfolioId: data.portfolioId,
				certificationName: data.name,
			});

			const validatedData = certificationSchema.safeParse(data);
			if (validatedData.success) {
				const result = await createCertification(validatedData.data);
				logger.info("Successfully added certification:", {
					id: result.id,
					portfolioId: result.portfolioId,
				});
				return result;
			}

			logger.error("Validation failed for certification data:", {
				errors: validatedData.error.errors,
			});
			return rejectWithValue("Invalid certification data");
		} catch (error) {
			logger.error("Failed to add certification:", error);

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

export const updateCertificationnInDatabase = createAsyncThunk(
	"certification/updateCertificationInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = certificationSchema.safeParse(data);
			if (validatedData.success) {
				return await editCertification(data.id, validatedData.data);
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

export const removeCertificationFromDatabase = createAsyncThunk(
	"certification/removeCertificationFromDatabase",
	async ({ certificationId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteCertification(certificationId, portfolioId);
			return { certificationId, portfolioId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
