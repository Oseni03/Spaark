import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const experienceSchema = itemSchema.extend({
	company: z.string().min(1),
	position: z.string(),
	location: z.string().optional(),
	date: z.string(),
	summary: z.string(),
	picture: z.literal("").or(z.string()),
	url: z.literal("").or(z.string().url()),
	technologies: z.array(z.string()).default([]),
});

// Defaults
export const defaultExperience = {
	...defaultItem,
	company: "",
	position: "",
	location: "",
	date: "",
	summary: "",
	picture: "",
	url: "",
	technologies: [],
};
