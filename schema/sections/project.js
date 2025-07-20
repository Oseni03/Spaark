import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const projectSchema = itemSchema.extend({
	name: z.string().min(1, "Project name cannot be empty"),
	description: z.string(),
	date: z.string(),
	technologies: z.array(z.string()).default([]),
	website: z.literal("").or(z.string().url("Invalid URL")).nullable(), // Allow empty string, valid URL, or null
	source: z.literal("").or(z.string().url("Invalid URL")).nullable(), // Allow empty string, valid URL, or null
	image: z.literal("").or(z.string()).nullable(), // Allow empty string, valid URL, or null
	video: z.literal("").or(z.string().url("Invalid URL")).nullable(), // Allow empty string, valid URL, or null
	type: z.literal("").or(z.string()).nullable(),
});

// Defaults
export const defaultProject = {
	...defaultItem,
	name: "",
	description: "",
	date: "",
	technologies: [],
	website: "",
	source: "",
	image: "",
	video: "",
	type: "",
};
