import { createAsyncThunk } from "@reduxjs/toolkit";
import { testimonialSchema } from "@/schema/sections";
import {
	createTestimonial,
	deleteTestimonial,
	editTestimonial,
} from "@/services/testimonial";
import { z } from "zod";
import { logger } from "@/lib/utils";

export const addTestimonialInDatabase = createAsyncThunk(
	"testimonial/addTestimonialInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			const validatedData = testimonialSchema.safeParse(data);
			if (validatedData.success) {
				const result = await createTestimonial(validatedData.data);
				return result;
			}
		} catch (error) {
			logger.error("Error adding testimonial:", error);
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

export const updateTestimonialInDatabase = createAsyncThunk(
	"testimonial/updateTestimonialInDatabase",
	async (data, { rejectWithValue }) => {
		try {
			const validatedData = testimonialSchema.safeParse(data);
			if (validatedData.success) {
				return await editTestimonial(data.id, validatedData.data);
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

export const removeTestimonialFromDatabase = createAsyncThunk(
	"testimonial/removeTestimonialFromDatabase",
	async ({ testimonialId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteTestimonial(testimonialId, portfolioId);
			return { testimonialId, portfolioId };
		} catch (error) {
			return rejectWithValue(
				error instanceof Error
					? error.message
					: "An unknown error occurred"
			);
		}
	}
);
