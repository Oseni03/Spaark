import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createCertification,
	editCertification,
	deleteCertification,
} from "@/services/certification";
import { certificationSchema } from "@/schema/sections";
import { z } from "zod";

export const addCertificationInDatabase = createAsyncThunk(
	"certification/addCertificationInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			// Validate input before sending to service
			const validatedData = certificationSchema.safeParse(data);
			if (validatedData.success) {
				return await createCertification(validatedData.data);
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

export const updateCertificationnInDatabase = createAsyncThunk(
	"certification/updateCertificationInDatabase",
	async (data, { rejectWithValue }) => {
		logger.info("Update data: ", data);
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
			return { id: certificationId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
