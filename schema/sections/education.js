import { z } from "zod";
import { defaultItem, itemSchema } from "../shared/items";
import { defaultUrl, urlSchema } from "../shared/url";

// Schema
export const educationSchema = itemSchema.extend({
	institution: z.string().min(1),
	studyType: z.string(),
	date: z.string(),
	summary: z.string().optional(),
	url: urlSchema,
});

// Defaults
export const defaultEducation = {
	...defaultItem,
	id: "",
	institution: "",
	studyType: "",
	date: "",
	summary: "",
	url: defaultUrl,
};
