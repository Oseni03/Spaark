import { z } from "zod";
import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const educationSchema = itemSchema.extend({
	institution: z.string().min(1),
	studyType: z.string(),
	date: z.string(),
	summary: z.string().optional(),
	url: z.literal("").or(z.string().url()),
});

// Defaults
export const defaultEducation = {
	...defaultItem,
	id: "",
	institution: "",
	studyType: "",
	date: "",
	summary: "",
	url: "",
};
