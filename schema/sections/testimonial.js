import { z } from "zod";
import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const testimonialSchema = itemSchema.extend({
	name: z.string().min(1),
	role: z.string(),
	company: z.string().optional(),
	message: z.string(),
	avatar: z.literal("").or(z.string().url()).nullable(),
	rating: z.number().min(1).max(5).default(5),
});

// Defaults
export const defaultTestimonial = {
	...defaultItem,
	name: "",
	role: "",
	company: "",
	message: "",
	avatar: "",
	rating: 5,
};
